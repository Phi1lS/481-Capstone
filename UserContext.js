import React, { createContext, useState, useEffect } from 'react';
import { auth, db, storage } from './firebaseConfig'; // Firebase config
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore'; 
import { ref, getDownloadURL } from 'firebase/storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarPath: '',
    incomes: [],
  });
  const [avatarUri, setAvatarUri] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserProfile(user.uid);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Fetch user profile and avatar
  const fetchUserProfile = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        avatarPath: userData.avatarPath || '',
      }));

      try {
        const avatarRef = userData.avatarPath
          ? ref(storage, userData.avatarPath)
          : ref(storage, 'default/avatar.png');
        const url = await getDownloadURL(avatarRef);
        setAvatarUri(url);
      } catch (error) {
        const fallbackUrl = await getDownloadURL(ref(storage, 'default/avatar.png'));
        setAvatarUri(fallbackUrl);
      }
    }
  };

  // Listen for income updates
  useEffect(() => {
    const user = auth.currentUser;
    let unsubscribe; // Store the unsubscribe function
    if (user) {
      const incomeRef = collection(db, 'incomes');
      unsubscribe = onSnapshot(incomeRef, (snapshot) => {
        const incomes = snapshot.docs
          .filter((doc) => doc.data().userId === user.uid)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          incomes,
        }));
      });
    }
    
    // Cleanup listener when user logs out or component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, avatarUri, setAvatarUri }}>
      {children}
    </UserContext.Provider>
  );
};