import React, { createContext, useState, useEffect } from 'react';
import { auth, db, storage } from './firebaseConfig';
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
  const [cachedAvatar, setCachedAvatar] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    let unsubscribeIncomeListener;  // Declare listener unsubscribe handler

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserProfile(user.uid);

        // Listen for income updates only if the user is authenticated
        const incomeRef = collection(db, 'incomes');
        unsubscribeIncomeListener = onSnapshot(incomeRef, (snapshot) => {
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
      } else {
        // If the user logs out, reset user profile and avatar
        setUserProfile({
          firstName: '',
          lastName: '',
          email: '',
          avatarPath: '',
          incomes: [],
        });
        setAvatarUri(null);

        // Unsubscribe from income listener when user logs out
        if (unsubscribeIncomeListener) {
          unsubscribeIncomeListener();
        }
      }
    });

    return () => {
      unsubscribeAuth();  // Unsubscribe from auth listener
      if (unsubscribeIncomeListener) {
        unsubscribeIncomeListener();  // Unsubscribe from Firestore listener
      }
    };
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

      // Cache the avatar URL to avoid re-fetching
      if (!cachedAvatar) {
        try {
          const avatarRef = userData.avatarPath
            ? ref(storage, userData.avatarPath)
            : ref(storage, 'default/avatar.png');
          const url = await getDownloadURL(avatarRef);
          setCachedAvatar(url);
          setAvatarUri(url);
        } catch (error) {
          const fallbackUrl = await getDownloadURL(ref(storage, 'default/avatar.png'));
          setCachedAvatar(fallbackUrl);
          setAvatarUri(fallbackUrl);
        }
      }
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, avatarUri, setAvatarUri, cachedAvatar }}>
      {children}
    </UserContext.Provider>
  );
};