import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Modal, TextInput, Button } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { UserContext } from '../../UserContext';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';
    const { setUserProfile } = useContext(UserContext);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const usersCollection = collection(db, 'users');
          const snapshot = await getDocs(usersCollection);
          const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      fetchUsers();
    }, []);
  
    const handleEditUser = (user) => {
      setSelectedUser({ ...user }); // Clone user object to avoid direct mutation
      setModalVisible(true);
    };
  
    const handleSaveChanges = async () => {
      if (selectedUser) {
        try {
          const userRef = doc(db, 'users', selectedUser.id);
          await updateDoc(userRef, {
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            email: selectedUser.email,
            isAdmin: selectedUser.isAdmin,
          });
  
          // Update UserContext if the edited user is the logged-in user
          setUserProfile((prevProfile) => {
            if (prevProfile.id === selectedUser.id) {
              return { ...prevProfile, ...selectedUser };
            }
            return prevProfile;
          });
  
          // Update the local state
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === selectedUser.id ? selectedUser : user))
          );
  
          setModalVisible(false);
          alert('User updated successfully!');
        } catch (error) {
          console.error('Error updating user:', error);
          alert('Failed to update user. Please try again.');
        }
      }
    };
  
    return (
      <View style={isDarkMode ? styles.darkContainer : styles.container}>
        <Text style={isDarkMode ? styles.darkTitle : styles.title}>Admin Dashboard</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {users.length > 0 ? (
            users.map((user) => (
              <View key={user.id} style={isDarkMode ? styles.darkCard : styles.card}>
                <Text style={isDarkMode ? styles.darkCardText : styles.cardText}>
                  <Text style={styles.bold}>Name:</Text> {user.firstName} {user.lastName}
                </Text>
                <Text style={isDarkMode ? styles.darkCardText : styles.cardText}>
                  <Text style={styles.bold}>Email:</Text> {user.email}
                </Text>
                <Text style={isDarkMode ? styles.darkCardText : styles.cardText}>
                  <Text style={styles.bold}>Role:</Text> {user.isAdmin ? 'Admin' : 'User'}
                </Text>
                <TouchableOpacity
                  onPress={() => handleEditUser(user)}
                  style={isDarkMode ? styles.darkButton : styles.button}
                >
                  <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>Edit User</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={isDarkMode ? styles.darkNoUsersText : styles.noUsersText}>
              No users found.
            </Text>
          )}
        </ScrollView>
  
        {/* Modal for editing user */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={isDarkMode ? styles.darkModal : styles.modal}>
              <Text style={isDarkMode ? styles.darkModalTitle : styles.modalTitle}>Edit User</Text>
              <TextInput
                style={isDarkMode ? styles.darkInput : styles.input}
                placeholder="First Name"
                value={selectedUser?.firstName || ''}
                onChangeText={(text) => setSelectedUser((prev) => ({ ...prev, firstName: text }))}
              />
              <TextInput
                style={isDarkMode ? styles.darkInput : styles.input}
                placeholder="Last Name"
                value={selectedUser?.lastName || ''}
                onChangeText={(text) => setSelectedUser((prev) => ({ ...prev, lastName: text }))}
              />
              <TextInput
                style={isDarkMode ? styles.darkInput : styles.input}
                placeholder="Email"
                value={selectedUser?.email || ''}
                onChangeText={(text) => setSelectedUser((prev) => ({ ...prev, email: text }))}
              />
              <TouchableOpacity
                onPress={() =>
                  setSelectedUser((prev) => ({ ...prev, isAdmin: !prev.isAdmin }))
                }
                style={isDarkMode ? styles.darkToggle : styles.toggle}
              >
                <Text style={isDarkMode ? styles.darkToggleText : styles.toggleText}>
                  {selectedUser?.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                </Text>
              </TouchableOpacity>
              <View style={styles.modalButtons}>
                <Button title="Save" onPress={handleSaveChanges} />
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color={isDarkMode ? '#FF5722' : '#FF5722'}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f7f9fc',
    },
    darkContainer: {
      flex: 1,
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
    scrollContainer: {
      flexGrow: 1,
    },
    card: {
      backgroundColor: '#ffffff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
    },
    darkCard: {
      backgroundColor: '#1E1E1E',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
    },
    cardText: {
      fontSize: 16,
      color: '#555',
      marginBottom: 8,
    },
    darkCardText: {
      fontSize: 16,
      color: '#AAAAAA',
      marginBottom: 8,
    },
    bold: {
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#00796B',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    darkButton: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    darkButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    noUsersText: {
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
      marginTop: 20,
    },
    darkNoUsersText: {
      fontSize: 16,
      color: '#AAAAAA',
      textAlign: 'center',
      marginTop: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    darkModal: {
      width: '80%',
      backgroundColor: '#1E1E1E',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    },
    darkModalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      backgroundColor: '#f1f1f1',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      color: '#333',
    },
    darkInput: {
      width: '100%',
      backgroundColor: '#2c2c2c',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      color: '#FFFFFF',
    },
    toggle: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#00796B',
      borderRadius: 5,
      alignItems: 'center',
    },
    darkToggle: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#4CAF50',
      borderRadius: 5,
      alignItems: 'center',
    },
    toggleText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    darkToggleText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 20,
    },
  });