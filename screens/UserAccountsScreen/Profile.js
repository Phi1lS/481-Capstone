import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext'; // Import the context
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar } from 'react-native-paper';
import { auth, db } from '../../firebaseConfig'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { userProfile, setUserProfile } = useContext(UserContext); // Accessing user profile and updater
  const [isEditing, setIsEditing] = useState(false);
  const [editedFullName, setEditedFullName] = useState(`${userProfile.firstName} ${userProfile.lastName}`);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserProfile({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
          });
          setEditedFullName(`${userData.firstName} ${userData.lastName}`);
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const [firstName, ...lastName] = editedFullName.split(' ');
    const lastNameJoined = lastName.join(' ');

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      firstName: firstName || '',
      lastName: lastNameJoined || '',
    });

    // Update the global state
    setUserProfile({
      ...userProfile,
      firstName: firstName || '',
      lastName: lastNameJoined || '',
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedFullName(`${userProfile.firstName} ${userProfile.lastName}`);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <View style={styles.profileHeader}>
            <Avatar.Icon size={50} icon="account" style={styles.icon} />
            <View style={styles.nameContainer}>
              {isEditing ? (
                <TextInput
                  style={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
                  value={editedFullName}
                  onChangeText={setEditedFullName}
                  placeholder="Full Name"
                  placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
                  selectionColor={isDarkMode ? '#4CAF50' : '#00796B'}
                  autoFocus
                />
              ) : (
                <Text style={isDarkMode ? styles.darkCardTitle : styles.cardTitle}>
                  {userProfile.firstName} {userProfile.lastName}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.editContainer}>
            {isEditing ? (
              <View style={styles.editButtons}>
                <TouchableOpacity onPress={handleSave}>
                  <Text style={isDarkMode ? styles.darkSave : styles.save}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={isDarkMode ? styles.darkCancel : styles.cancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={toggleEdit}>
                <Text style={isDarkMode ? styles.darkEdit : styles.edit}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* Contact Details Section */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title title="Contact Details" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
          <View style={styles.divider} />
          <View style={styles.contactRow}>
            <Text style={isDarkMode ? styles.darkCardTitle : styles.cardTitle}>Phone</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>+1 212-123-4567</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={isDarkMode ? styles.darkCardTitle : styles.cardTitle}>Email</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>{userProfile.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={isDarkMode ? styles.darkCardTitle : styles.cardTitle}>Address</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>18 Wall Street, NY</Text>
          </View>
        </Card>

        {/* External Accounts Section */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title title="External Accounts" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              As an InvestAlign user, you can transfer funds between accounts.
            </Text>
          </View>
        </Card>

        {/* Account Type Section */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title title="Account Type" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
          <View style={styles.divider} />
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Business Checking</Text>
          </View>
        </Card>

        {/* Employment & Income Section */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title title="Employment & Income" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    backgroundColor: '#E8F5E9',
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
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
  textInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 5,
    borderColor: '#00796B',
    borderWidth: 1,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  editContainer: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  editButtons: {
    flexDirection: 'row',
  },
  edit: {
    color: '#00796B',
    fontSize: 16,
  },
  save: {
    color: '#FF5722',
    fontSize: 16,
  },
  cancel: {
    color: '#00796B',
    fontSize: 16,
    marginLeft: 10,
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
  darkCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkTextInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#1E1E1E',
    padding: 5,
    borderRadius: 5,
    borderColor: '#4CAF50',
    borderWidth: 1,
    marginBottom: 5,
  },
  darkText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  darkEdit: {
    color: '#4CAF50',
    fontSize: 16,
  },
  darkSave: {
    color: '#FF5722',
    fontSize: 16,
  },
  darkCancel: {
    color: '#4CAF50',
    fontSize: 16,
    marginLeft: 10,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  detailsContainer: {
    padding: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    margin: 10,
    marginTop: 6,
  },
});

