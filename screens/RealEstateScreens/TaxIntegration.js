import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, Button, useColorScheme } from 'react-native';
import { Title, Card, Avatar } from 'react-native-paper';
import axios from 'axios';

export default function TaxIntegrationScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const [income, setIncome] = useState('');
  const [tax, setTax] = useState(null);
  const [error, setError] = useState('');

  const fetchIncomeTax = async () => {
    setError('');
    setTax(null); // Reset tax before fetching
    try {
      const response = await axios.post('https://api.taxee.io/v2/calculate', {
        income: parseFloat(income),
        filing_status: 'single', // Change to 'married' or other options as needed
        year: 2024,
      }, {
        headers: {
          Authorization: `ed08a73cb6msh10b40dcc37782e4p15ac3djsnc47aab70f0dd`, // Replace with your Taxee API key
        },
      });
      setTax(response.data.total_tax); // Update state with total tax
    } catch (err) {
      console.error(err);
      setError('Failed to calculate income tax. Please check the income entered.');
    }
  };

  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Income Tax Calculator</Title>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Enter Total Income"
            left={(props) => <Avatar.Icon {...props} icon="cash" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholder="Enter Total Income"
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#555'}
              keyboardType="numeric"
              value={income}
              onChangeText={(text) => setIncome(text)}
            />
            <Button title="Calculate Tax" onPress={fetchIncomeTax} />
          </View>

          {tax && (
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              Estimated Tax: ${tax.toFixed(2)}
            </Text>
          )}
          {error && (
            <Text style={isDarkMode ? [styles.darkText, styles.error] : [styles.text, styles.error]}>
              {error}
            </Text>
          )}
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
    padding: 15,
  },
  icon: {
    backgroundColor: '#E8F5E9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sliderContainer: {
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
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
    padding: 15,
  },
  darkCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
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
  error: {
    color: 'red',
    marginTop: 10,
  },
});
