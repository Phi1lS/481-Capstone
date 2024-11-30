import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme, Alert, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Icon } from 'react-native-paper';
import { addDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { UserContext } from '../../UserContext';
import { parse, add, format } from 'date-fns';
import { ScrollView } from 'react-native-gesture-handler';

export default function NewTenant({ navigation }) {
  const [tenantName, setTenantName] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState(new Date());
  const [building, setBuilding] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const { sendNotification } = useContext(UserContext);
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const handleAddTenant = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.error('User not logged in');
        return;
      }

      if (!tenantName || !leaseStartDate || !building || !apartmentNumber || !rentAmount) {
        Alert.alert('Error', 'Please fill out all fields before submitting.');
        return;
      }

      const newTenant = {
        userId: user.uid,
        name: tenantName,
        leaseStartDate,
        building,
        apartmentNumber,
        rentAmount: parseFloat(rentAmount.replace(/,/g, '')),
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'tenants'), newTenant);
      Alert.alert('Tenant added successfully.');

      await sendNotification(
        user.uid,
        `Tenant "${tenantName}" was added successfully.`,
        'tenant'
      );

      navigation.goBack();
    } catch (error) {
      console.error('Error adding tenant:', error);
      Alert.alert('Error', 'Failed to add tenant. Please try again.');
    }
  };

  return (
    <ScrollView style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <Text style={isDarkMode ? styles.darkHeader : styles.header}>Add Tenant</Text>
      <View style={isDarkMode ? styles.darkContainer : styles.container}>
        {/* Tenant Name */}
        <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
          <TextInput
            placeholder="Tenant Name"
            value={tenantName}
            style={isDarkMode ? styles.darkInput : styles.input}
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
            onChangeText={setTenantName}
          />
        </View>

        {/* Lease Start Date */}
        {Platform.OS === 'web' ? (
          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <input
              type="date"
              value={leaseStartDate.toISOString().split('T')[0]} // Format for input[type="date"]
              onChange={(e) => setLeaseStartDate(new Date(e.target.value))}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                fontSize: 16,
                padding: 10,
                color: isDarkMode ? '#FFFFFF' : '#000000',
                backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              }}
            />
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={isDarkMode ? styles.darkInputCard : styles.inputCard}
              onPress={() => setShowPicker(true)}
            >
              <Text style={[isDarkMode ? styles.darkInput : styles.input, styles.centeredText]}>
                {leaseStartDate ? format(leaseStartDate, 'MM/dd/yyyy') : 'Select Lease Start Date'}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={leaseStartDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event, date) => {
                  setShowPicker(false);
                  if (date) setLeaseStartDate(date);
                }}
                style={[Platform.OS === 'ios' && styles.iosPicker]}
              />
            )}
          </>
        )}

        {/* Add spacing below the picker for iOS */}
        {Platform.OS === 'ios' && <View style={styles.extraSpace} />}

        {/* Building */}
        <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
          <TextInput
            placeholder="Building"
            value={building}
            style={isDarkMode ? styles.darkInput : styles.input}
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
            onChangeText={setBuilding}
          />
        </View>

        {/* Apartment Number */}
        <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
          <TextInput
            placeholder="Apartment Number"
            value={apartmentNumber}
            style={isDarkMode ? styles.darkInput : styles.input}
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
            onChangeText={setApartmentNumber}
          />
        </View>

        {/* Rent Amount */}
        <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
          <TextInput
            placeholder="Rent Amount Per Month"
            value={rentAmount}
            style={isDarkMode ? styles.darkInput : styles.input}
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
            onChangeText={setRentAmount}
            keyboardType="numeric"
          />
        </View>

        {/* Add Tenant Button */}
        <TouchableOpacity style={isDarkMode ? styles.darkButton : styles.button} onPress={handleAddTenant}>
          <Text style={styles.buttonText}>Add Tenant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  centeredText: {
    textAlign: 'left',
    paddingTop: 13,
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
  iosPicker: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    borderRadius: 10,
  },
  extraSpace: {
    height: 20, // Add extra spacing for iOS
  },
  // Web-specific styles
  webDateContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  webDatePicker: {
    width: '100%',
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});