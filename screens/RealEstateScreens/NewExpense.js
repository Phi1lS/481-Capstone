import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Icon } from 'react-native-paper';
import { addDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { UserContext } from '../../UserContext';

export default function NewExpense({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('addYourOwn');
  const [expenseName, setExpenseName] = useState("");
  const [category, setCategory] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState("");
  const { userProfile, setUserProfile } = useContext(UserContext); 
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  // Format number with commas
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    return parseFloat(value.toString().replace(/,/g, '')).toLocaleString('en-US');
  };

  const handleAddExpense = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.error('User not logged in');
        return;
      }

      // Validate fields
      if (!expenseName || !category || !expenseAmount) {
        Alert.alert('Error', 'Please fill out all fields before submitting.');
        return;
      }

      // Add expense to Firestore with a timestamp
      const newExpense = {
        userId: user.uid,
        name: expenseName,
        category: category,
        expenseAmount: parseFloat(expenseAmount.replace(/,/g, '')), // Remove commas before submission
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'expenses'), newExpense);
      console.log('Expense added to Firestore:', docRef.id);
      Alert.alert('Expense added successfully.');

      // Fetch the newly added expense to get the actual server timestamp
      const addedExpenseSnapshot = await getDoc(docRef);
      const addedExpense = { id: docRef.id, ...addedExpenseSnapshot.data() };

      // Update UserContext to reflect changes dynamically with accurate timestamp
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        expenses: [...(prevProfile.expenses || []), addedExpense],
      }));

      setExpenseName('');
      setCategory(null);
      setExpenseAmount('');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <Text style={isDarkMode ? styles.darkHeader : styles.header}>Add Expense</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'addYourOwn' && (isDarkMode ? styles.darkActiveTab : styles.activeTab),
            styles.curvedTab,
          ]}
          onPress={() => setSelectedTab('addYourOwn')}
        >
          <Text
            style={
              selectedTab === 'addYourOwn'
                ? isDarkMode
                  ? styles.darkActiveTabText
                  : styles.activeTabText
                : isDarkMode
                ? styles.darkTabText
                : styles.tabText
            }
          >
            Add Your Own
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'addFromBank' && (isDarkMode ? styles.darkActiveTab : styles.activeTab),
            styles.curvedTab,
          ]}
          onPress={() => setSelectedTab('addFromBank')}
        >
          <Text
            style={
              selectedTab === 'addFromBank'
                ? isDarkMode
                  ? styles.darkActiveTabText
                  : styles.activeTabText
                : isDarkMode
                ? styles.darkTabText
                : styles.tabText
            }
          >
            Add From Bank
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'addYourOwn' ? (
        <View style={isDarkMode ? styles.darkContainer : styles.container}>
          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <TextInput
              placeholder="Expense Name"
              value={expenseName}
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
              onChangeText={setExpenseName}
              selectionColor={isDarkMode ? '#4CAF50' : '#00796B'}
            />
          </View>

          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <RNPickerSelect
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: "Category", value: null }}
              onValueChange={setCategory}
              Icon={() => <Icon source="menu-down" style={styles.icon} size={24} />}
              style={{
                inputAndroid: isDarkMode ? styles.darkInput : styles.input,
                inputIOS: isDarkMode ? styles.darkInput : styles.input,
              }}
              items={[
                { label: "Investment", value: "investment" },
                { label: "Real Estate", value: "realEstate" },
                { label: "Retirement", value: "retirement" }
              ]}
            />
          </View>

          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <TextInput
              placeholder="Expense Amount"
              value={expenseAmount.length > 0 ? `$${formatNumberWithCommas(expenseAmount)}` : expenseAmount}
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
              onChangeText={(text) => setExpenseAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              selectionColor={isDarkMode ? '#4CAF50' : '#00796B'}
            />
          </View>

          <TouchableOpacity style={isDarkMode ? styles.darkButton : styles.button} onPress={handleAddExpense}>
            <Text style={styles.buttonText}>Add Expense</Text>
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