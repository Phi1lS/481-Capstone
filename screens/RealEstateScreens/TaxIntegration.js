import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, Modal, useColorScheme } from 'react-native';
import { Title, Card, Avatar, Button } from 'react-native-paper';
import axios from 'axios';

const BASE_URL = "https://api.taxapi.net/income";

// Mapping marital status values to display labels
const MARITAL_STATUS_LABELS = {
  single: 'Single',
  married: 'Married',
  hoh: 'Head of Household',
};

export default function TaxIntegrationScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const { userProfile } = useContext(UserContext);

  const [income, setIncome] = useState('0');
  const [maritalStatus, setMaritalStatus] = useState('single');
  const [dependents, setDependents] = useState(0);
  const [totalTax, setTotalTax] = useState(null);
  const [error, setError] = useState('');
  const [maritalStatusModalVisible, setMaritalStatusModalVisible] = useState(false);
  const [dependentsModalVisible, setDependentsModalVisible] = useState(false);
  const [tempDependents, setTempDependents] = useState(dependents);

  useEffect(() => {
    const calculateIncome = () => {
      const totalIncome = userProfile?.incomes.reduce((total, income) => total + income.incomePerMonth, 0);
      setIncome(totalIncome || 0);
    };
    if (userProfile?.incomes?.length > 0) {
      calculateIncome();
    }
  }, [userProfile]);

  const calculateTax = async () => {
    setError(''); // Clear the error when starting a new calculation
    try {
      const incomeValue = parseFloat(income);
      const dependentsValue = parseInt(dependents);

      if (isNaN(incomeValue) || incomeValue <= 0 || isNaN(dependentsValue) || dependentsValue < 0) {
        setError('Please enter valid income and dependents.');
        return;
      }

      const deductionPerDependent = 2000;
      const adjustedIncome = Math.max(incomeValue - dependentsValue * deductionPerDependent, 0);

      const url = `${BASE_URL}/${maritalStatus}/${adjustedIncome}`;
      const response = await axios.get(url);

      setTotalTax(response.data);
    } catch (error) {
      console.error("Error fetching tax data:", error.message);
      setError('Failed to fetch tax data. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
      <Title style={isDarkMode ? styles.darkTitle : styles.title}>Income Tax Calculator</Title>

      <Card style={isDarkMode ? styles.darkCard : styles.card}>
        <Card.Title
          title="Enter Your Details"
          left={(props) => <Avatar.Icon {...props} icon="account" style={styles.icon} />}
          titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={isDarkMode ? styles.darkButton : styles.button}
            onPress={() => setMaritalStatusModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              Marital Status: {MARITAL_STATUS_LABELS[maritalStatus]}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={isDarkMode ? styles.darkButton : styles.button}
            onPress={() => {
              setTempDependents(dependents.toString());
              setDependentsModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Dependents: {dependents}</Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={calculateTax}
            style={styles.calculateButton}
            labelStyle={styles.buttonLabel}
          >
            Calculate Tax
          </Button>
        </View>

        {totalTax !== null && (
          <>
            <Text style={isDarkMode ? styles.darkResult : styles.result}>
              Full Income Earnings: ${parseFloat(income).toLocaleString()}
            </Text>
            <Text style={isDarkMode ? styles.darkResult : styles.result}>
              Estimated Total Tax: ${totalTax.toLocaleString()}
            </Text>
          </>
        )}
        {error && (
          <Text style={isDarkMode ? styles.darkError : styles.error}>{error}</Text>
        )}
      </Card>

      {/* Marital Status Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={maritalStatusModalVisible}
        onRequestClose={() => setMaritalStatusModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={isDarkMode ? styles.darkModalContent : styles.modalContent}>
            <Text style={isDarkMode ? styles.darkModalTitle : styles.modalTitle}>Select Marital Status</Text>
            {Object.entries(MARITAL_STATUS_LABELS).map(([value, label]) => (
              <TouchableOpacity
                key={value}
                style={isDarkMode ? styles.darkModalButton : styles.modalButton}
                onPress={() => {
                  setMaritalStatus(value);
                  setMaritalStatusModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>{label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={isDarkMode ? styles.darkButton : styles.button}
              onPress={() => setMaritalStatusModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Dependents Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={dependentsModalVisible}
        onRequestClose={() => setDependentsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={isDarkMode ? styles.darkModalContent : styles.modalContent}>
            <Text style={isDarkMode ? styles.darkModalTitle : styles.modalTitle}>
              How many dependents are you claiming?
            </Text>
            <TextInput
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholder="Enter number of dependents"
              placeholderTextColor={isDarkMode ? '#FFFFFF' : '#333'}
              keyboardType="numeric"
              value={tempDependents}
              onChangeText={setTempDependents}
            />
            <Button
              mode="contained"
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
              style={styles.saveButton}
              labelStyle={styles.buttonLabelWhite}
            >
              Save
            </Button>
            <Button
              mode="contained"
              onPress={() => setDependentsModalVisible(false)}
              style={styles.closeButton}
              labelStyle={styles.buttonLabelWhite}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  darkTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  card: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  darkCard: {
    marginBottom: 25,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  darkCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
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
    marginBottom: 15,
    color: '#333',
  },
  darkInput: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#00796B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  darkButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calculateButton: {
    marginTop: 15,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkResult: {
    marginTop: 20,
    fontSize: 18,
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
    color: '#333',
  },
  darkModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  modalButton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#00796B',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  darkModalButton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#00796B',
    borderRadius: 8,
    marginTop: 15,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 15,
    fontWeight: 'bold',
  },
  darkError: {
    color: 'red',
    marginTop: 15,
    fontWeight: 'bold',
  },
  buttonLabelWhite: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});