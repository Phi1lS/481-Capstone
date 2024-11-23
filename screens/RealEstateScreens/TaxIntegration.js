import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Title, Card, Avatar } from 'react-native-paper';
import axios from 'axios';

const BASE_URL = "https://api.taxapi.net/income" //base url for the tax API

export default function TaxIntegrationScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const { userProfile, setUserProfile } = useContext(UserContext);

  //function for inital updating values from database
  useEffect(() => {
    const calculateIncome = () => {
      const totalIncome = userProfile?.incomes.reduce((total, income) => total + income.incomePerMonth, 0);
      setIncome(totalIncome || 0);
    };
    if (userProfile.incomes.length > 0) {
      calculateIncome();
    }
    

  }, [userProfile]);

  const [income, setIncome] = useState('0');
  const [maritalStatus, setMaritalStatus] = useState('single'); // Default to 'single'
  const [dependents, setDependents] = useState(0);
  const [stateTax, setStateTax] = useState(null);
  const [federalTax, setFederalTax] = useState(null);
  const [totalTax, setTotalTax] = useState(null);
  const [error, setError] = useState('');
  const [maritalStatusModalVisible, setMaritalStatusModalVisible] = useState(false);
  const [dependentsModalVisible, setDependentsModalVisible] = useState(false);
  const [tempDependents, setTempDependents] = useState(dependents);

  const calculateTax = async () => {
    try {
      const url = `${BASE_URL}/${maritalStatus}/${income}/`;
      const response = await axios.get(url);
  
      const dependentsValue = parseInt(dependents);
      const dependentDeduction = dependentsValue * 2000;

      setTotalTax(response.data - dependentDeduction);
      return response.data; // Returns the estimated tax data
      
    } catch (error) {
      console.error("Error fetching tax data:", error.message);
      throw error;
    }
  }
  /*
  const calculateTax = () => {
    setError('');
    setStateTax(null);
    setFederalTax(null);
    setTotalTax(null);

    const incomeValue = parseFloat(income);
    const dependentsValue = parseInt(dependents);

    if (isNaN(incomeValue) || incomeValue <= 0 || isNaN(dependentsValue) || dependentsValue < 0) {
      setError('Please enter valid income and dependents.');
      return;
    }

    // Michigan state tax: Flat 4.25%
    const stateTaxAmount = incomeValue * 0.0425;

    // Federal tax brackets for 2024
    const federalBrackets = maritalStatus === 'single'
      ? [
          { threshold: 10275, rate: 0.10 },
          { threshold: 41775, rate: 0.12 },
          { threshold: 89075, rate: 0.22 },
          { threshold: 170050, rate: 0.24 },
          { threshold: 215950, rate: 0.32 },
          { threshold: 539900, rate: 0.35 },
          { threshold: Infinity, rate: 0.37 },
        ]
      : [
          { threshold: 20550, rate: 0.10 },
          { threshold: 83550, rate: 0.12 },
          { threshold: 178150, rate: 0.22 },
          { threshold: 340100, rate: 0.24 },
          { threshold: 431900, rate: 0.32 },
          { threshold: 647850, rate: 0.35 },
          { threshold: Infinity, rate: 0.37 },
        ];

    // Calculate federal tax after accounting for dependents ($2,000 deduction per dependent)
    const dependentDeduction = dependentsValue * 2000;
    const taxableIncome = Math.max(incomeValue - dependentDeduction, 0);

    let federalTaxAmount = 0;
    let remainingIncome = taxableIncome;

    for (let i = 0; i < federalBrackets.length; i++) {
      const { threshold, rate } = federalBrackets[i];
      const previousThreshold = i > 0 ? federalBrackets[i - 1].threshold : 0;

      if (remainingIncome > threshold - previousThreshold) {
        federalTaxAmount += (threshold - previousThreshold) * rate;
        remainingIncome -= threshold - previousThreshold;
      } else {
        federalTaxAmount += remainingIncome * rate;
        break;
      }
    }

    // Total tax
    const totalTaxAmount = stateTaxAmount + federalTaxAmount;

    // Update state
    setStateTax(stateTaxAmount);
    setFederalTax(federalTaxAmount);
    setTotalTax(totalTaxAmount);
  };
*/
  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Income Tax Calculator (Michigan)</Title>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Enter Your Details"
            left={(props) => <Avatar.Icon {...props} icon="account" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.inputContainer}>
            {/* Income Input
            <TextInput
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholder="Enter Total Income"
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#555'}
              keyboardType="numeric"
              value={income}
              onChangeText={(text) => setIncome(text)}
            />
             */}
            {/* Marital Status Button */}
            <TouchableOpacity style={isDarkMode ? styles.darkButton : styles.button} onPress={() => setMaritalStatusModalVisible(true)}>
              <Text style={styles.buttonText}>Marital Status: {maritalStatus}</Text>
            </TouchableOpacity>
            {/* Dependents Button */}
            <TouchableOpacity
              style={isDarkMode ? styles.darkButton : styles.button}
              onPress={() => {
                setTempDependents(dependents.toString());
                setDependentsModalVisible(true);
              }}
            >
              <Text style={styles.buttonText}>Dependents: {dependents}</Text>
            </TouchableOpacity>
            
            <Button color={isDarkMode ? '#00796B' : '#4CAF50'} title="Calculate Tax" onPress={calculateTax} />
          </View>

          {stateTax !== null && (
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              Michigan State Tax: ${stateTax.toFixed(2)}
            </Text>
          )}
          {federalTax !== null && (
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              Federal Tax: ${federalTax.toFixed(2)}
            </Text>
          )}
          {totalTax !== null && (
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              Total Tax: ${totalTax.toFixed(2)}
            </Text>
          )}
          {error && (
            <Text style={isDarkMode ? [styles.darkText, styles.error] : [styles.text, styles.error]}>
              {error}
            </Text>
          )}
        </Card>

        {/* Marital Status Modal */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={maritalStatusModalVisible}
          onRequestClose={() => setMaritalStatusModalVisible(false)}
        >
          <View style={styles.modalContainer}>
          <View style={isDarkMode ? styles.darkModalContent : styles.modalContent}>
              <Text style={isDarkMode ? styles.darkModalTitle : styles.modalTitle}>Select Marital Status</Text>
              <TouchableOpacity
                style={isDarkMode ? styles.darkModalButton : styles.modalButton}
                onPress={() => {
                  setMaritalStatus('single');
                  setMaritalStatusModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Single</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={isDarkMode ? styles.darkModalButton : styles.modalButton}
                onPress={() => {
                  setMaritalStatus('married');
                  setMaritalStatusModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Married</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={isDarkMode ? styles.darkModalButton : styles.modalButton}
                onPress={() => {
                  setMaritalStatus('hoh');
                  setMaritalStatusModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Head of HouseHold</Text>
              </TouchableOpacity>
              <Button color={isDarkMode ? '#00796B' : '#4CAF50'} title="Close" onPress={() => setMaritalStatusModalVisible(false)} />
            </View>
          </View>
        </Modal>

        {/* Dependents Modal */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={dependentsModalVisible}
          onRequestClose={() => setDependentsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={isDarkMode ? styles.darkModalContent : styles.modalContent}>
              <Text style={isDarkMode ? styles.darkModalTitle : styles.modalTitle}>How many dependents are you claiming?</Text>
              <TextInput
                style={isDarkMode ? styles.darkInput : styles.input}
                placeholder="Enter number of dependents"
                placeholderTextColor={isDarkMode ? '#FFFFFF' : '#333'}
                keyboardType="numeric"
                value={tempDependents}
                onChangeText={(text) => setTempDependents(text)}
              />
              <Button
                title="Save"
                color={isDarkMode ? '#00796B' : '#4CAF50'}
                onPress={() => {
                  const parsedDependents = parseInt(tempDependents);
                  if (isNaN(parsedDependents) || parsedDependents < 0) {
                    setError('Please enter a valid number of dependents.');
                  } else {
                    setDependents(parsedDependents);
                    setError('');
                    setDependentsModalVisible(false);
                  }
                }}
              />
              <Button color={isDarkMode ? '#00796B' : '#4CAF50'}  title="Cancel" onPress={() => setDependentsModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  darkContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  darkTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  card: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
  },
  darkCard: {
    marginBottom: 25,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 15,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#333',
  },
  darkInput: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#00796B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  darkButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  darkButtonText:{
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  text:{
    fontWeight: 'bold',
    color: '#333',
  },
  darkText:{
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  darkModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#121212',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  darkModalTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
     color: '#FFFFFF'
  },
  modalButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#00796B',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  darkModalButton:{
    width: '100%',
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
//4CAF50