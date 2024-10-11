import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext'; 
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, Keyboard } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { auth, db, storage } from '../../firebaseConfig'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { userProfile, setUserProfile, avatarUri, setAvatarUri } = useContext(UserContext); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedFullName, setEditedFullName] = useState(`${userProfile.firstName} ${userProfile.lastName}`);
  const [newAvatarUri, setNewAvatarUri] = useState(null);
  const [isContactEditing, setIsContactEditing] = useState(false);
  const [editedPhone, setEditedPhone] = useState(userProfile.phone || '');
  const [editedAddress, setEditedAddress] = useState(userProfile.address || '');
  const [accountType, setAccountType] = useState(userProfile.accountType || 'Checking');
  const [isAccountEditing, setIsAccountEditing] = useState(false);

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
            phone: userData.phone || '',
            address: userData.address || '',
            accountType: userData.accountType || 'Checking', 
            avatarPath: userData.avatarPath || null,
          });          
          setEditedFullName(`${userData.firstName} ${userData.lastName}`);
          setEditedPhone(userData.phone || '');
          setEditedAddress(userData.address || '');
    
          // Load avatar
          try {
            const avatarRef = userData.avatarPath ? ref(storage, userData.avatarPath) : ref(storage, 'default/avatar.png');
            const url = await getDownloadURL(avatarRef);
            setAvatarUri(url);
          } catch (error) {
            const fallbackUrl = await getDownloadURL(ref(storage, 'default/avatar.png'));
            setAvatarUri(fallbackUrl);
          }
        }
      }
    };    
    fetchUserProfile();
  }, [user, setUserProfile, setAvatarUri]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (user.uid === 'L8EH4N1JP5NX9C6AjRT9a6gOjd03') {
      // Prevent demo user from changing name or password
      if (editedFullName !== `${userProfile.firstName} ${userProfile.lastName}`) {
        alert("You can't change the name in the demo account.");
        return;
      }
    }

    const [firstName, ...lastName] = editedFullName.split(' ');
    const lastNameJoined = lastName.join(' ');

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      firstName: firstName || '',
      lastName: lastNameJoined || '',
      accountType: accountType,
    });

    // If a new avatar was selected, save it and update Firestore
    if (newAvatarUri && newAvatarUri !== avatarUri) {
      await uploadImage(newAvatarUri);
      setNewAvatarUri(null); // Reset avatar URI after upload
    }

    setUserProfile({
      ...userProfile,
      firstName: firstName || '',
      lastName: lastNameJoined || '',
      accountType: accountType,
    });

    setIsAccountEditing(false);
    setIsEditing(false);
  };

  const handleContactSave = async () => {
    if (editedPhone && editedPhone.length !== 14) {
      alert('Phone number must be 10 digits long.');
      return;
    }
  
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      phone: editedPhone || '',  // Ensure phone is either fully formatted or empty
      address: editedAddress || '',
    });
  
    setUserProfile({
      ...userProfile,
      phone: editedPhone || '',
      address: editedAddress || '',
    });
  
    setIsContactEditing(false);
  };
  

  const handleCancel = () => {
    setEditedFullName(`${userProfile.firstName} ${userProfile.lastName}`);
    setNewAvatarUri(null); // Reset new avatar state if canceled
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const handleContactCancel = () => {
    setEditedPhone(userProfile.phone || '');
    setEditedAddress(userProfile.address || '');
    setIsContactEditing(false);
  };
  
  const handlePhoneChange = (text) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D+/g, '');
  
    if (cleaned.length === 0) {
      setEditedPhone('');  // Allow clearing the phone number
      return;
    }
  
    // Format the number as (XXX) XXX-XXXX
    let formattedPhone = '';
    if (cleaned.length <= 3) {
      formattedPhone = `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      formattedPhone = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      formattedPhone = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  
    setEditedPhone(formattedPhone);
  };
  

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setNewAvatarUri(result.assets[0].uri);
      } else {
        console.log('Image selection was cancelled or no URI provided.');
      }
    } catch (error) {
      // console.error('Error picking image:', error);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const avatarRef = ref(storage, `user_avatars/${user.uid}.jpg`);
      const uploadTask = uploadBytesResumable(avatarRef, blob);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log(`Upload progress: ${snapshot.bytesTransferred}/${snapshot.totalBytes}`);
        },
        (error) => {
          alert('Failed to upload image. Please try again.');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const avatarURLWithTimestamp = `${downloadURL}?t=${new Date().getTime()}`;
          await updateDoc(doc(db, 'users', user.uid), { avatarPath: `user_avatars/${user.uid}.jpg` });
  
          // Update the avatar in the UserContext for consistency
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            avatarPath: avatarURLWithTimestamp,
          }));
          setAvatarUri(avatarURLWithTimestamp); // Update the local state too
        }
      );
    } catch (error) {
      alert('Failed to upload image. Please try again.');
    }
  };  

  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {newAvatarUri ? (
                <Avatar.Image size={50} source={{ uri: newAvatarUri }} style={styles.icon} />
              ) : avatarUri ? (
                <Avatar.Image size={50} source={{ uri: avatarUri }} style={styles.icon} />
              ) : (
                <Avatar.Icon size={50} icon="account" style={styles.icon} />
              )}
              
              {isEditing && (
                <TouchableOpacity onPress={pickImage} style={styles.cameraIconOverlay}>
                  <Avatar.Icon size={50} icon="camera" style={styles.cameraIcon} />
                </TouchableOpacity>
              )}
            </View>
            
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
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={isDarkMode ? styles.darkEdit : styles.edit}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* Contact Details Card */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title title="Contact Details" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
          <View style={styles.divider} />
          <View style={styles.contactRow}>
            <Text style={isDarkMode ? styles.darkCardTitle : styles.cardTitle}>Phone</Text>
            <View style={styles.inputContainer}>
              {isContactEditing ? (
                <TextInput
                  style={isDarkMode ? styles.darkTextInput : styles.text}
                  value={editedPhone}
                  onChangeText={handlePhoneChange}
                  placeholder="Phone Number"
                  keyboardType="numeric"
                  maxLength={14}
                  placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
                  selectionColor="#4CAF50"
                />
              ) : (
                <Text style={isDarkMode ? styles.darkText : styles.text}>
                  {userProfile.phone || 'Add a Phone Number'}
                </Text>
              )}
          </View>
        </View>

          <View style={styles.contactRow}>
            <Text style={isDarkMode ? styles.darkCardTitle : styles.cardTitle}>Email</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>{userProfile.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={isDarkMode ? styles.darkCardTitle : styles.cardTitle}>Address</Text>
            <View style={styles.inputContainer}>
              {isContactEditing ? (
                <TextInput
                  style={isDarkMode ? styles.darkTextInput : styles.text}
                  value={editedAddress}
                  onChangeText={setEditedAddress}
                  placeholder="Address"
                  placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}
                  selectionColor="#4CAF50"
                  maxLength={30}
                />
              ) : (
                <Text style={isDarkMode ? styles.darkText : styles.text}>
                  {userProfile.address || 'Add an Address'}
                </Text>
              )}
          </View>
        </View>
          <View style={styles.editContainer}>
            {isContactEditing ? (
              <View style={styles.editButtons}>
                <TouchableOpacity onPress={handleContactSave}>
                  <Text style={isDarkMode ? styles.darkSave : styles.save}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleContactCancel}>
                  <Text style={isDarkMode ? styles.darkCancel : styles.cancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsContactEditing(true)}>
                <Text style={isDarkMode ? styles.darkEdit : styles.edit}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
        <View style={styles.cardHeader}>
          <Card.Title title="External Accounts" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
          <View style={styles.editContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('AddExternalAccountsScreen')}>
              <Text style={isDarkMode ? styles.darkEdit : styles.edit}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <Text style={isDarkMode ? styles.darkText : styles.text}>
            As an InvestAlign user, you can transfer funds between accounts.
          </Text>
        </View>
      </Card>


        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <View style={styles.cardHeader}>
            <Card.Title title="Account Type" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
            <View style={styles.editContainer}>
              {isAccountEditing ? (
                <View style={styles.editButtons}>
                  <TouchableOpacity onPress={handleSave}>
                    <Text style={isDarkMode ? styles.darkSave : styles.save}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsAccountEditing(false)}>
                    <Text style={isDarkMode ? styles.darkCancel : styles.cancel}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setIsAccountEditing(true)}>
                  <Text style={isDarkMode ? styles.darkEdit : styles.edit}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.detailsContainer}>
          {isAccountEditing ? (
            <View>
              <TouchableOpacity onPress={() => setAccountType('Business')}>
                <Text style={accountType === 'Business' 
                  ? (isDarkMode ? styles.darkSelected : styles.selected) 
                  : (isDarkMode ? styles.darkText : styles.text)}
                >
                  Business
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAccountType('Checking')}>
                <Text style={accountType === 'Checking' 
                  ? (isDarkMode ? styles.darkSelected : styles.selected) 
                  : (isDarkMode ? styles.darkText : styles.text)}
                >
                  Checking
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              {accountType || 'Select Account Type'}
            </Text>
          )}
        </View>
        </Card>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    backgroundColor: '#E8F5E9',
  },
  cameraIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
  },
  cameraIcon: {
    backgroundColor: 'transparent',
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
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
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
  // New styles added for the camera icon overlay on the avatar image
  avatarContainer: {
    position: 'relative',
  },
  selected: {
    color: '#00796B', // Green color for selected item
    fontWeight: 'bold', // Optional, to make the selection stand out
    fontSize: 16,
    marginBottom: 10,
  },
  darkSelected: {
    color: '#4CAF50', // Green color for selected item
    fontWeight: 'bold', // Optional, to make the selection stand out
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
  
});