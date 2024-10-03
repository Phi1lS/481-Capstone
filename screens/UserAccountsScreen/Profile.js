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
            avatarPath: userData.avatarPath || null,
          });
          setEditedFullName(`${userData.firstName} ${userData.lastName}`);

          try {
            const avatarRef = userData.avatarPath
              ? ref(storage, userData.avatarPath)
              : ref(storage, 'default/avatar.png');
            const url = await getDownloadURL(avatarRef);
            setAvatarUri(url);
          } catch (error) {
            const fallbackUrl = await getDownloadURL(ref(storage, 'default/avatar.png'));
            setAvatarUri(fallbackUrl); // Fallback to default avatar
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
    const [firstName, ...lastName] = editedFullName.split(' ');
    const lastNameJoined = lastName.join(' ');

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      firstName: firstName || '',
      lastName: lastNameJoined || '',
    });

    // If a new avatar was selected, save it and update Firestore
    if (newAvatarUri) {
      await uploadImage(newAvatarUri);
    }

    setUserProfile({
      ...userProfile,
      firstName: firstName || '',
      lastName: lastNameJoined || '',
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedFullName(`${userProfile.firstName} ${userProfile.lastName}`);
    setNewAvatarUri(null); // Reset new avatar state if canceled
    setIsEditing(false);
    Keyboard.dismiss();
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
          // console.error('Upload failed:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, 'users', user.uid), { avatarPath: `user_avatars/${user.uid}.jpg` });
          setAvatarUri(downloadURL);
        }
      );
    } catch (error) {
      // console.error('Failed to upload image:', error);
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

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title title="External Accounts" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              As an InvestAlign user, you can transfer funds between accounts.
            </Text>
          </View>
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title title="Account Type" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
          <View style={styles.divider} />
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Business Checking</Text>
          </View>
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title title="Employment & Income" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
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
  // New styles added for the camera icon overlay on the avatar image
  avatarContainer: {
    position: 'relative',
  },
});
