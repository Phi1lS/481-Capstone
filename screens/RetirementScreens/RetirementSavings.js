import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { Alert, View, StyleSheet, ScrollView, Text, useColorScheme, Dimensions, TextInput, TouchableOpacity, Animated, Modal } from 'react-native';
import { Title, Card, Avatar, Button, FAB } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { Timestamp, doc, deleteDoc, collection, getDocs, getDoc, updateDoc, and } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig'

export default function InvestmentAnalyticsScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  // Get screen width to make the chart fit the screen properly
  const screenWidth = Dimensions.get('window').width;

  const { userProfile, setUserProfile } = useContext(UserContext);

  //income values
  const [totalSavings, setTotalSavings] = useState(5000);
  const [retirementGoal, setRetirementGoal] = useState(10000);
  const [futureValue, setFutureValue] = useState(7500);

  //values for calculator //has set values but use can change all but inflation rate 
  const [lifeExpectancy, setLifeExpectancy] = useState('75');
  const [retirementaAge, setRetirementaAge] = useState('');
  const[replacementRate, setReplacementRate] = useState('70');
  const [rateOfReturn, setRateOfReturn] = useState('5');
  const [annualContributions, setAnnualContributions] = useState('5');
  const [inflationRate, setInflationRate] = useState('3');
  const [savingsNeeded, setSavingsNeeded]= useState(0);

  //variables for goal update modal
  const [modalVisible, setModalVisible] = useState(false);
  const [calcModalVisible, setCalcModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Function to handle confirmation
  const handleConfirm = () => {
    const numberValue = parseFloat(inputValue); // Convert input to a number
    if (!isNaN(numberValue)) {
      handleRetirementChange(numberValue);// Update the variable with the input value
    }
    setModalVisible(false); // Close the modal
    setInputValue(''); // Reset input field
  };
  const handleCancel = () => {
    setModalVisible(false); // Close the modal
    setCalcModalVisible(false);
    setInputValue(''); // Reset input field
  };


  //varialbe and functions for button
  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = () => {
    setIsPressed(true);
  };
  const handlePressOut = () => {
    setIsPressed(false);
  };

  //function for inputtext
  const handleInput = (input, setFunction) => {
    const numbericInput = input.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    setFunction(numbericInput);
  }

  const buttonPressIn = (animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const buttonPressOut = (animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const showNewGoalPrompt = () => {
    setModalVisible(true);
  };

  //function for inital updating values from database
  useEffect(() => {
    const calculateSavings = () => {
      const incomeSavings = userProfile?.incomes?.filter((income) => {
        return income.isSavings === true;
      });

      const totalSavingsIncome = incomeSavings?.reduce((total, income) => total + income.incomePerMonth, 0);
      setTotalSavings(totalSavingsIncome || 0);
      
    };
    const updateRetirementGoal= async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(db, 'users', user.uid);
        const incomeSnapshot = await getDoc(userRef);
        const userData = incomeSnapshot.data();
    
        if(userData){ 
          setRetirementGoal(userData.retirementGoal || 0);
          setRetirementaAge(userData.retirementAge || 0);

        }
       
      } catch (error) {
        console.error('Error changing retirement goal:', error);
      }
    };

    calculateSavings();
    updateRetirementGoal();
  }, [userProfile]);

//function for updating retirement goal in database
  const handleRetirementChange= async (newRetirementGoal) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const incomeSnapshot = await getDoc(userRef);
      const userData = incomeSnapshot.data();
  
      if(userData){
        await updateDoc(userRef, {retirementGoal: newRetirementGoal});

        setRetirementGoal(newRetirementGoal);

        console.log('Retirement Goal updated successfully')
        Alert.alert('Retirement Goal updated successfully.')
      }
  
      
    } catch (error) {
      console.error('Error updating retirement goal:', error);
    }
  };

  //function for calculating saving needed
  const calculateAndShowSavingsNeeded = () => {
    try {
      const yearsInRetirement = lifeExpectancy - retirementaAge;

    const incomeNum = parseFloat(annualContributions);
    const replacementRateNum = parseFloat(replacementRate) / 100;
    const yearsInRetirementNum = parseFloat(yearsInRetirement);
    const annualReturnNum = parseFloat(rateOfReturn) / 100;
    const inflationRateNum = parseFloat(inflationRate) / 100;

    const requiredIncome = incomeNum * replacementRateNum;
    const savingNeededAmount = requiredIncome * (1 - (1 / (1 + annualReturnNum) ** yearsInRetirementNum)) / (annualReturnNum - inflationRateNum);

    setSavingsNeeded(savingNeededAmount);
    setCalcModalVisible(true);
    } catch (error) {
      Alert.alert('Error calculating savings needed', error)
    }
    
  }
  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Retirement Savings</Title>
        {/*Modal for changing goal*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={[{}]}
        >
          <View style={[styles.detailsContainer, {flex: 1,justifyContent: 'center'}]}>
          <Card style={[isDarkMode ? styles.darkCard : styles.card, {borderStyle: 'solid', borderWidth: 2}]}>
            <Card.Title
              title="Goal Change"
              titleStyle={[isDarkMode ? styles.darkCardTitle : styles.cardTitle, { textAlign: 'center' }]}
              left={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
              right={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
            />

            {/* total amount text */}
            <Text style={[isDarkMode ? styles.darkText : styles.text, { textAlign: 'center' }]}>Enter a Number:</Text>
            <TextInput
              keyboardType="numeric"
              value={inputValue}
              onChangeText={(input) => handleInput(input, setInputValue)}
              placeholder="00"
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#555'}
              style={[isDarkMode ? styles.darkText : styles.text,{ textAlign: 'center' }]}
            />

            <View style={[styles.detailsContainer, { flexDirection: 'row', justifyContent: 'space-evenly' }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => buttonPressIn(new Animated.Value(1))}
                onPressOut={() => buttonPressOut(new Animated.Value(1))}
                onPress={() => handleConfirm()}
              >
                <Text style={[isDarkMode ? styles.darkNeedHelpText : styles.needHelpText, { textAlign: 'left', paddingRight: 10, fontSize: 20, color: '#4CAF50' }]}>Update Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => buttonPressIn(new Animated.Value(1))}
                onPressOut={() => buttonPressOut(new Animated.Value(1))}
                onPress={() => handleCancel(false)}
              >
                <Text style={[isDarkMode ? styles.darkNeedHelpText : styles.needHelpText, { textAlign: 'right', paddingRight: 10, fontSize: 20, color: 'red' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </Card>
        </View>
        </Modal>

        {/* Card for total amount*/}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Total Savings"
            titleStyle={[isDarkMode ? styles.darkCardTitle : styles.cardTitle, { textAlign: 'center' }]}
            left={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
            right={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
          />

          {/* total amount text */}
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkMoneyValue : styles.moneyValue}>$ {totalSavings.toLocaleString()}</Text>
          </View>

          {/* Goal Progress Bar */}
          <View style={styles.detailsContainer}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, { textAlign: 'center', fontSize: 30, paddingBottom: 10 }]}>Goal Progress</Text>
          </View>
          <View style={[styles.detailsContainer, { position: 'relative', marginTop: 5, justifyContent: 'center', alignItems: 'center' }]}>
            <Progress.Bar progress={totalSavings / retirementGoal} width={375} height={45} color={isDarkMode ? '#4CAF50' : '#00796B'} backgroundColor={isDarkMode ? '#333333' : '#333'} />
            <Text style={[isDarkMode ? styles.darkTitle : styles.title, { color: '#FFFFFF', position: 'absolute' }]}>  Goal: ${retirementGoal.toLocaleString()}</Text>

          </View>
          {/* Update Goal Text*/}
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={() => buttonPressIn(new Animated.Value(1))}
            onPressOut={() => buttonPressOut(new Animated.Value(1))}
            onPress={() => showNewGoalPrompt()}
          >
            <Text style={[isDarkMode ? styles.darkNeedHelpText : styles.needHelpText, { textAlign: 'right', paddingRight: 10, fontSize: 20, color: '#4CAF50' }]}>Update Goal</Text>
          </TouchableOpacity>

        </Card>




        {/* retirement calculator*/}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Retirement Calculator"
            titleStyle={[isDarkMode ? styles.darkCardTitle : styles.cardTitle, { fontSize: 20 }]}
            left={(props) => <Avatar.Icon {...props} icon="calculator" style={styles.icon} />}
          />

          <View style={[styles.detailsContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, { textAlign: 'left', fontSize: 25 }]}>Retirement Age</Text>
            <TextInput
              style={[isDarkMode ? styles.darkCard : styles.card, { width: 150, height: 50, color: isDarkMode ? '#FFFFFF' : '#333' }]}
              keyboardType="numeric"
              value={retirementaAge}
              onChangeText={(input) => handleInput(input, setRetirementaAge)}
              placeholder="Enter number"
              placeholderTextColor={isDarkMode ? '#FFFFFF' : '#333'}
            />
          </View>
          <View style={[styles.detailsContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, { textAlign: 'left', fontSize: 25 }]}>Life Expectancy</Text>
            <TextInput
              style={[isDarkMode ? styles.darkCard : styles.card, { width: 150, height: 50, color: isDarkMode ? '#FFFFFF' : '#333' }]}
              keyboardType="numeric"
              value={lifeExpectancy}
              onChangeText={(input) => handleInput(input, setLifeExpectancy)}

              placeholder="Enter number"
              placeholderTextColor={isDarkMode ? '#FFFFFF' : '#333'}
            />
          </View>
          <View style={[styles.detailsContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, { textAlign: 'left', fontSize: 18 }]}>Annual Contributions ($)</Text>
            <TextInput
              style={[isDarkMode ? styles.darkCard : styles.card, { width: 150, height: 50, color: isDarkMode ? '#FFFFFF' : '#333' }]}
              keyboardType="numeric"
              value={annualContributions}
              onChangeText={(input) => handleInput(input, setAnnualContributions)}
              placeholder="Enter number"
              placeholderTextColor={isDarkMode ? '#FFFFFF' : '#333'}
            />
          </View>
          <View style={[styles.detailsContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, { textAlign: 'left', fontSize: 25 }]}>Rate of Return (%)</Text>
            <TextInput
              style={[isDarkMode ? styles.darkCard : styles.card, { width: 150, height: 50, color: isDarkMode ? '#FFFFFF' : '#333' }]}
              keyboardType="numeric"
              value={rateOfReturn}
              onChangeText={(input) => handleInput(input, setRateOfReturn)}
              placeholder="Enter number"
              placeholderTextColor={isDarkMode ? '#FFFFFF' : '#333'}
            />
          </View>
          
          <View style={[styles.detailsContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, { textAlign: 'left', fontSize: 18 }]}>Replacement Rate (%)</Text>
            <TextInput
              style={[isDarkMode ? styles.darkCard : styles.card, { width: 150, height: 50, color: isDarkMode ? '#FFFFFF' : '#333' }]}
              keyboardType="numeric"
              value={replacementRate}
              onChangeText={(input) => handleInput(input, setReplacementRate)}
              placeholder="Enter number"
              placeholderTextColor={isDarkMode ? '#FFFFFF' : '#333'}
            />
          </View>
          <Button
            mode="contained"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => calculateAndShowSavingsNeeded()}
            style={[
              isDarkMode ? styles.darkCalculateButton : styles.calculateButton,
              isPressed && styles.calculateButtonPressed,
            ]}
            labelStyle={styles.buttonLabel}
          >
            CALCULATE
          </Button>

          {/*Modal for calculator results*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={calcModalVisible}
          onRequestClose={() => setCalcModalVisible(false)}
          style={[{}]}
        >
          <View style={[styles.detailsContainer, {flex: 1,justifyContent: 'center'}]}>
          <Card style={[isDarkMode ? styles.darkCard : styles.card, {borderStyle: 'solid', borderWidth: 2}]}>
            <Card.Title
              title="Savings Needed"
              titleStyle={[isDarkMode ? styles.darkCardTitle : styles.cardTitle, { textAlign: 'center' }]}
              left={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
              right={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
            />

            {/* total amount text */}
            <Text style={isDarkMode ? styles.darkMoneyValue : styles.moneyValue}>$ {savingsNeeded.toLocaleString()}</Text>


            <View style={[styles.detailsContainer, { flexDirection: 'row', justifyContent: 'space-evenly' }]}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => buttonPressIn(new Animated.Value(1))}
                onPressOut={() => buttonPressOut(new Animated.Value(1))}
                onPress={() => {handleRetirementChange(savingsNeeded); handleCancel();} }
              >
                <Text style={[isDarkMode ? styles.darkNeedHelpText : styles.needHelpText, { textAlign: 'left', paddingRight: 10, fontSize: 20, color: '#4CAF50' }]}>Update Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => buttonPressIn(new Animated.Value(1))}
                onPressOut={() => buttonPressOut(new Animated.Value(1))}
                onPress={() => handleCancel()}
              >
                <Text style={[isDarkMode ? styles.darkNeedHelpText : styles.needHelpText, { textAlign: 'right', paddingRight: 10, fontSize: 20, color: 'red' }]}>Close</Text>
              </TouchableOpacity>
            </View>

          </Card>
        </View>
        </Modal>

        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 10,
    padding: 5,
  },
  icon: {
    backgroundColor: '#E8F5E9',
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginLeft: 10,
  },
  placeholderGraph: {
    height: 100,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  textInput: {

  },
  buttonLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: '#00796B',
    padding: 14,
    borderRadius: 8,
    marginTop: 25,
  },
  calculateButtonPressed: {
    backgroundColor: '#005D4F',
  },
  // Dark mode styles
  darkContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  darkTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  darkCard: {
    marginBottom: 25,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 10,
    padding: 10,
  },
  darkCardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkText: {
    fontSize: 18,
    color: '#AAAAAA',
    marginLeft: 10,
  },
  moneyValue: {
    fontSize: 50,
    color: '#00796B',
    textAlign: 'center'
  },
  darkMoneyValue: {
    fontSize: 50,
    color: '#4CAF50',
    marginTop: 0,
    textAlign: 'center'
  },
  darkPlaceholderGraph: {
    height: 100,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  darkBar: {
    color: '#4CAF50'
  },
  darkCalculateButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    marginTop: 25,
  },
});
