import React, { createContext, useState, useEffect } from 'react';
import { auth, db, storage } from './firebaseConfig'; // Firebase config
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore'; // Firestore functions
import { ref, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarPath: '',
    incomes: [], // New incomes field
  });

  const [avatarUri, setAvatarUri] = useState(null); // State for avatar URI

  // Fetch the user's profile from Firestore and listen for income updates
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
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

          // Fetch avatar URL from Firebase Storage or use default
          try {
            const avatarRef = userData.avatarPath
              ? ref(storage, userData.avatarPath)
              : ref(storage, 'default/avatar.png');
            const url = await getDownloadURL(avatarRef);
            setAvatarUri(`${url}?t=${new Date().getTime()}`); // Add timestamp to bust cache
          } catch (error) {
            const fallbackUrl = await getDownloadURL(ref(storage, 'default/avatar.png'));
            setAvatarUri(`${fallbackUrl}?t=${new Date().getTime()}`); // Ensure fallback cache bust
          }
        }
      }
    };

    fetchUserProfile();
  }, []);

  // Listen for income updates dynamically and update the context
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const incomeRef = collection(db, 'incomes');
      const unsubscribe = onSnapshot(incomeRef, (snapshot) => {
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
      return () => unsubscribe();
    }
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, avatarUri, setAvatarUri }}>
      {children}
    </UserContext.Provider>
  );
};