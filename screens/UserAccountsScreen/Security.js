import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, Alert, useColorScheme, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { auth } from '../../firebaseConfig';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export default function SecurityScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const [switchStates, setSwitchStates] = useState([false, false]);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // Added state for password confirmation

  const toggleSwitch = (index) => {
    setSwitchStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    try {
      // Re-authenticate the user
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
      await reauthenticateWithCredential(user, credential); // Re-authentication
  
      // If re-authentication succeeds, update the password
      await updatePassword(user, newPassword);
  
      // Reset state and give feedback
      Alert.alert('Success', 'Password updated successfully');
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword(''); // Clear confirmation field
    } catch (error) {
      Alert.alert('Error', error.message); // Handle errors (e.g., incorrect current password)
    }
  };

  const handleCancelPassword = () => {
    setIsEditingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword(''); // Clear confirmation field
  };

  return (
    <SafeAreaView style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        {/* Password Section */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Password"
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          {isEditingPassword ? (
            <>
              <TextInput
                style={isDarkMode ? styles.darkTextInput : styles.textInput}
                placeholder="Current Password"
                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TextInput
                style={isDarkMode ? styles.darkTextInput : styles.textInput}
                placeholder="New Password"
                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={isDarkMode ? styles.darkTextInput : styles.textInput}
                placeholder="Confirm New Password" // New field for confirmation
                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
                secureTextEntry
                value={confirmNewPassword} // Bind state to confirmation input
                onChangeText={setConfirmNewPassword}
              />
              <View style={styles.editContainer}>
                <TouchableOpacity onPress={handleSavePassword}>
                  <Text style={isDarkMode ? styles.darkSave : styles.save}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelPassword}>
                  <Text style={isDarkMode ? styles.darkCancel : styles.cancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.editContainer}>
              <TouchableOpacity onPress={handleEditPassword}>
                <Text style={isDarkMode ? styles.darkEdit : styles.edit}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Devices Section */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Devices"
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6 }} />

          <View style={styles.deviceRow}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>iPhone 15 Pro Max</Text>
          </View>
          <View style={styles.deviceRow}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Macbook Pro</Text>
          </View>
        </Card>

        {/* Security Preferences Section */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Security Preferences"
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6 }} />

          <View style={styles.switchContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Two-Factor Authentication</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#00796B' }}
              thumbColor={switchStates[0] ? '#ffffff' : '#ffffff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleSwitch(0)}
              value={switchStates[0]}
              style={styles.switch}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Track Account Activity</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#00796B' }}
              thumbColor={switchStates[1] ? '#ffffff' : '#ffffff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleSwitch(1)}
              value={switchStates[1]}
              style={styles.switch}
            />
          </View>
        </Card>

        {/* Lock and Close Account Section */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <View style={styles.exitContainer}>
            <Text style={styles.exitText}>Lock Account</Text>
          </View>
          <View style={styles.exitContainer}>
            <Text style={styles.exitText}>Close Account</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  textInput: {
    height: 40,
    width: '90%', // Increased width
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  darkTextInput: {
    height: 40,
    width: '90%', // Increased width
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#fff',
    alignSelf: 'center',
  },
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  save: {
    color: '#FF5722',
    fontSize: 16,
    marginRight: 10,
  },
  cancel: {
    color: '#00796B',
    fontSize: 16,
  },
  edit: {
    color: '#00796B',
    marginTop: 5,
    fontSize: 16,
  },
  darkEdit: {
    color: '#4CAF50',
    marginTop: 5,
    fontSize: 16,
  },
  darkSave: {
    color: '#FF5722',
    fontSize: 16,
    marginRight: 10,  // Added more spacing between Save and Cancel
  },
  darkCancel: {
    color: '#4CAF50',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 4,
    paddingLeft: 12,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  exitContainer: {
    flex: 1,
    alignItems: 'flex-end',
    color: '#FF0000',
    padding: 20,
  },
  exitText: {
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 10,
  },
  // Dark mode styles
  darkSafeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  darkContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  darkText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
  },
});
