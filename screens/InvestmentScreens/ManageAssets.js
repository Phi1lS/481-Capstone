import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Icon } from 'react-native-paper';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { UserContext } from '../../UserContext';

export default function ManageAssets() {
  const [selectedTab, setSelectedTab] = useState('addYourOwn');
  const [assetName, setAssetName] = useState("");
  const [category, setCategory] = useState(null);
  const [value, setValue] = useState("");
  const { userProfile } = useContext(UserContext); 
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const handleAddAsset = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.error('User not logged in');
        return;
      }

      const newAsset = {
        userId: user.uid,
        assetName: assetName,
        category: category,
        value: parseFloat(value.replace('$', '')), // Remove dollar sign before submitting
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'assets'), newAsset);
      console.log('Asset added to Firestore');

      // Clear inputs
      setAssetName('');
      setCategory(null);
      setValue('');
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  return (
    <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <Text style={isDarkMode ? styles.darkHeader : styles.header}>Manage Assets</Text>

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
            selectedTab === 'addFromIncome' && (isDarkMode ? styles.darkActiveTab : styles.activeTab),
            styles.curvedTab,
          ]}
          onPress={() => setSelectedTab('addFromIncome')}
        >
          <Text
            style={
              selectedTab === 'addFromIncome'
                ? isDarkMode
                  ? styles.darkActiveTabText
                  : styles.activeTabText
                : isDarkMode
                ? styles.darkTabText
                : styles.tabText
            }
          >
            Add From Income
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'addYourOwn' ? (
        <View style={isDarkMode ? styles.darkContainer : styles.container}>
          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <TextInput
              placeholder="Asset Name"
              value={assetName}
              onChangeText={setAssetName}
              style={isDarkMode ? styles.darkInput : styles.input}
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
              selectionColor={isDarkMode ? '#4CAF50' : '#00796B'} // Green caret
            />
          </View>

          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            placeholder={{ label: "Asset Category", value: null }}
            onValueChange={setCategory}
            Icon={() => <Icon source="menu-down" style={styles.icon} size={24} />}
            style={{
                inputAndroid: {
                ...isDarkMode ? styles.darkInput : styles.input,
                color: isDarkMode ? '#FFFFFF' : '#333', // Set the text color for the picker
                },
                inputIOS: {
                ...isDarkMode ? styles.darkInput : styles.input,
                color: isDarkMode ? '#FFFFFF' : '#333', // Set the text color for the picker
                },
            }}
            items={[
                { label: "Stock", value: "stock" },
                { label: "Bond", value: "bond" },
                { label: "Real Estate", value: "realEstate" },
                { label: "Cash", value: "cash" },
            ]}
            />
          </View>

          <View style={isDarkMode ? styles.darkInputCard : styles.inputCard}>
            <TextInput
              placeholder="Value"
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              style={isDarkMode ? styles.darkInput : styles.input}
              selectionColor={isDarkMode ? '#4CAF50' : '#00796B'} // Green caret
            />
          </View>

          <TouchableOpacity style={isDarkMode ? styles.darkButton : styles.button} onPress={handleAddAsset}>
            <Text style={styles.buttonText}>Add Asset</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={isDarkMode ? styles.darkPlaceholder : styles.placeholder}>
          <Text style={isDarkMode ? styles.darkText : styles.text}>Add Asset From Income Placeholder</Text>
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