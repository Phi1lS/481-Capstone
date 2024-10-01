import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Dimensions, TextInput } from 'react-native';
import { Title, Card, Avatar, Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

export default function InvestmentAnalyticsScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  // Get screen width to make the chart fit the screen properly
  const screenWidth = Dimensions.get('window').width;

  //income values
 const [totalSavings, setTotalSavings] = useState(5000);
 const [retirementGoal, setRetirementGoal] = useState(10000);
 const [futureValue, setFutureValue] = useState(7500);

 //values for calculator
  const [age, setAge] = useState('')
  const [retirementaAge, setRetirementaAge] = useState('')
  const [rateOfReturn, setRateOfReturn] = useState('')
  const [annualContributions, setAnnualContributions] = useState('')

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
  const numbericInput = input.replace(/[^0-9]/g, '');
  setFunction(input);
 }

  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Retirement Savings</Title>

       {/* Card for total amount*/} 
       <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Total Savings"
            titleStyle={[isDarkMode ? styles.darkCardTitle : styles.cardTitle, {textAlign: 'center'}]}
            left={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
            right={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
          />

      {/* total amount text */}
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkMoneyValue : styles.moneyValue}>$ {totalSavings.toLocaleString()}</Text>
          </View>

      {/* Goal Progress Bar */}
          <View style={styles.detailsContainer}>
          <Text style={[isDarkMode ? styles.darkText : styles.text, {textAlign: 'center', fontSize: 30, paddingBottom: 10}]}>Goal Progress</Text>
          </View>
          <View style = {[styles.detailsContainer, {position: 'relative', marginTop: 5, justifyContent: 'center', alignItems: 'center'}]}>
            <Progress.Bar progress={totalSavings / retirementGoal} width = {375} height = {45} color = {isDarkMode ? '#4CAF50' : '#00796B'} backgroundColor = {isDarkMode ? '#333333' : '#333'}/>
            <Text style={[isDarkMode ? styles.darkTitle : styles.title, {color: '#FFFFFF', position: 'absolute'}]}>  Goal: ${retirementGoal.toLocaleString()}</Text>
          </View>
          
          
        </Card>

         {/* retirement account card */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Retirement Accounts"
            titleStyle={[isDarkMode ? styles.darkCardTitle : styles.cardTitle, {fontSize: 20}]}
            left={(props) => <Avatar.Icon {...props} icon="format-list-text" style={styles.icon} />}
          />

           {/* retirement accounts*/}
          <View style={[styles.detailsContainer, {flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, {textAlign: 'left', fontSize: 30}]}>IRA</Text>
            <Text style={[isDarkMode ? styles.darkMoneyValue : styles.moneyValue, {textAlign: 'center', fontSize: 30}]}>$ XXX,XXX</Text>
          </View>
          <View style={[styles.detailsContainer, {flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, {textAlign: 'left', fontSize: 30}]}>Roth IRA</Text>
            <Text style={[isDarkMode ? styles.darkMoneyValue : styles.moneyValue, {textAlign: 'center', fontSize: 30}]}>$ XXX,XXX</Text>
          </View>
          <View style={[styles.detailsContainer, {flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, {textAlign: 'left', fontSize: 30}]}>401(k)</Text>
            <Text style={[isDarkMode ? styles.darkMoneyValue : styles.moneyValue, {textAlign: 'center', fontSize: 30}]}>$ XXX,XXX</Text>
          </View>
          {/* savings growth graph */}
          <View style={isDarkMode ? styles.darkPlaceholderGraph : styles.placeholderGraph}>
              <Text style={isDarkMode ? styles.darkPlaceholderText : styles.placeholderText}>Graph Placeholder</Text>
            </View>
          
           {/* projected future value */}
           <View style={styles.detailsContainer}>
            <Text style={[isDarkMode ? styles.darkCardTitle : styles.cardTitle, {textAlign: 'center'}]}>Projected Future Value</Text>
            <Text style={isDarkMode ? styles.darkMoneyValue : styles.moneyValue}>$ {futureValue.toLocaleString()}</Text>
          </View>
          {/* Add more sliders for other asset classes */}
        </Card>

 {/* retirement calculator*/}
 <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Retirement Calculator"
            titleStyle={[isDarkMode ? styles.darkCardTitle : styles.cardTitle, {fontSize: 20}]}
            left={(props) => <Avatar.Icon {...props} icon="calculator" style={styles.icon} />}
          />

           {/* retirement accounts*/}
           <View style={[styles.detailsContainer, {flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, {textAlign: 'left', fontSize: 25}]}>Age</Text>
            <TextInput 
              style={[isDarkMode ? styles.darkCard : styles.card, {width: 150, height: 50, color: isDarkMode ? '#FFFFFF' : '#333'}]}
              keyboardType ="numeric"
              value = {age}
              onChangeText = {(input) => handleInput(input, setAge)}
          
              placeholder = "Enter number"
              placeholderTextColor = {isDarkMode ? '#FFFFFF' : '#333'}
            />
          </View>
          <View style={[styles.detailsContainer, {flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, {textAlign: 'left', fontSize: 25}]}>Retirement Age</Text>
            <TextInput 
              style={[isDarkMode ? styles.darkCard : styles.card, {width: 150, height: 50, color: isDarkMode ? '#FFFFFF' : '#333'}]}
              keyboardType ="numeric"
              value = {retirementaAge}
              onChangeText = {(input) => handleInput(input, setRetirementaAge)}
              placeholder = "Enter number"
              placeholderTextColor = {isDarkMode ? '#FFFFFF' : '#333'}
            />
          </View>
          <View style={[styles.detailsContainer, {flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, {textAlign: 'left', fontSize: 25}]}>Rate of Return (%)</Text>
            <TextInput 
              style={[isDarkMode ? styles.darkCard : styles.card, {width: 150, height: 50, color: isDarkMode ? '#FFFFFF' : '#333'}]}
              keyboardType ="numeric"
              value = {rateOfReturn}
              onChangeText = {(input) => handleInput(input, setRateOfReturn)}
              placeholder = "Enter number"
              placeholderTextColor = {isDarkMode ? '#FFFFFF' : '#333'}
            />
          </View>
          <View style={[styles.detailsContainer, {flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, {textAlign: 'left', fontSize: 18}]}>Annual Contributions ($)</Text>
            <TextInput 
              style={[isDarkMode ? styles.darkCard : styles.card, {width: 150, height: 50, color: isDarkMode ? '#FFFFFF' : '#333'}]}
              keyboardType ="numeric"
              value = {annualContributions}
              onChangeText = {(input) => handleInput(input, setAnnualContributions)}
              placeholder = "Enter number"
              placeholderTextColor = {isDarkMode ? '#FFFFFF' : '#333'}
            />
          </View>
          <Button
              mode="contained"
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => console.log('Calculating')}
              style={[
                isDarkMode ? styles.darkCalculateButton : styles.calculateButton,
                isPressed && styles.calculateButtonPressed,
              ]}
              labelStyle={styles.buttonLabel}
            >
              CALCULATE
            </Button>
          
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
