import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Icon } from 'react-native-paper';
import { addDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { UserContext } from '../../UserContext';
import { parse } from 'date-fns';

export default function NewTenant({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('addYourOwn');
  const [tenantName, setTenantName] = useState("");
  const [leaseStartDate, setLeaseStartDate] = useState("");
  const [leaseEndDate, setLeaseEndDate] = useState("");
  const [building, setBuilding] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const { userProfile, setUserProfile, sendNotification } = useContext(UserContext); 
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';


  // Format number with commas
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    return parseFloat(value.toString().replace(/,/g, '')).toLocaleString('en-US');
  };

  // Parse date
  const parseDate = (stringValue) => {
    if (!stringValue) return 0;
    return parse(stringValue, "MM/dd/yyyy", new Date());
  };

  const handleAddTenant = async () => {
    try {
      const user = auth.currentUser;
  
      if (!user) {
        console.error('User not logged in');
        return;
      }
  
      // Validate fields
      if (!tenantName || !leaseStartDate || !leaseEndDate || !building || !apartmentNumber || !rentAmount) {
        Alert.alert('Error', 'Please fill out all fields before submitting.');
        return;
      }
  
      // Add tenant to Firestore with a timestamp
      const newTenant = {
        userId: user.uid,
        name: tenantName,
        leaseStartDate: parseDate(leaseStartDate), 
        leaseEndDate: parseDate(leaseEndDate), 
        building: building,
        apartmentNumber: apartmentNumber,
        rentAmount: parseFloat(rentAmount.replace(/,/g, '')), // Remove commas
        timestamp: serverTimestamp(),
      };
  
      const docRef = await addDoc(collection(db, 'tenants'), newTenant);
      Alert.alert('Tenant added successfully.');
  
      // Use sendNotification from UserContext
      await sendNotification(
        user.uid,
        `Tenant "${tenantName}" was added successfully.`,
        'tenant'
      );
  
      // Go back
      navigation.goBack();
    } catch (error) {
      console.error('Error adding tenant:', error);
      Alert.alert('Error', 'Failed to add tenant. Please try again.');
    }
  };

  return (
    <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <Text style={isDarkMode ? styles.darkHeader : styles.header}>Add Tenant</Text>


      {selectedTab === 'addYourOwn' ? (
        <View style={isDarkMode ? styles.darkContainer : styles.container}>
          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <TextInput
              placeholder="Tenant Name"
              value={tenantName}
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
              onChangeText={setTenantName}
              selectionColor={isDarkMode ? '#4CAF50' : '#00796B'}
            />
          </View>

          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <TextInput
              placeholder="Lease Start Date"
              value={leaseStartDate}
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
              onChangeText={setLeaseStartDate}
              selectionColor={isDarkMode ? '#4CAF50' : '#00796B'}
            />
          </View>
          
          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <TextInput
              placeholder="Lease End Date"
              value={leaseEndDate}
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
              onChangeText={setLeaseEndDate}
              selectionColor={isDarkMode ? '#4CAF50' : '#00796B'}
            />
          </View>
          
          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <TextInput
              placeholder="Building"
              value={building}
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
              onChangeText={setBuilding}
              selectionColor={isDarkMode ? '#4CAF50' : '#00796B'}
            />
          </View>

          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <TextInput
              placeholder="Apartment Number"
              value={apartmentNumber}
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
              onChangeText={setApartmentNumber}
              selectionColor={isDarkMode ? '#4CAF50' : '#00796B'}
            />
          </View>

          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <TextInput
              placeholder="Rent Amount Per Month"
              value={rentAmount}
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
              onChangeText={setRentAmount}
              selectionColor={isDarkMode ? '#4CAF50' : '#00796B'}
            />
          </View>

          <TouchableOpacity style={isDarkMode ? styles.darkButton : styles.button} onPress={handleAddTenant}>
            <Text style={styles.buttonText}>Add Tenant</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={isDarkMode ? styles.darkPlaceholder : styles.placeholder}>
          <Text style={isDarkMode ? styles.darkText : styles.text}>Plaid API Integration Placeholder</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  activeTab: {
    backgroundColor: '#00796B',
  },
  curvedTab: {
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 15,
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
  },
  inputCard: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 10,
    padding: 10,
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00796B',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  // Dark mode styles
  darkSafeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  darkHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
    padding: 20,
  },
  darkContainer: {
    padding: 20,
  },
  darkTab: {
    backgroundColor: '#333333',
  },
  darkActiveTab: {
    backgroundColor: '#4CAF50',
  },
  darkTabText: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  darkActiveTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  darkInputCard: {
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 10,
    padding: 10,
  },
  darkInput: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#FFFFFF',
  },
  darkButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  darkPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkText: {
    fontSize: 16,
    color: '#AAAAAA',
  },
});