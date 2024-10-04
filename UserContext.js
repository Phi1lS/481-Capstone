import React, { createContext, useState, useEffect } from 'react';
import { auth, db, storage } from './firebaseConfig'; // Ensure firebaseConfig is imported
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { ref, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarPath: '',
  });

  const [avatarUri, setAvatarUri] = useState(null); // New state for avatar URI

  // Fetch the user's profile from Firestore and update the state
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserProfile({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            avatarPath: userData.avatarPath || '',
          });

          // Fetch avatar URL from Firebase Storage or use default
          try {
            const avatarRef = userData.avatarPath
              ? ref(storage, userData.avatarPath)
              : ref(storage, 'default/avatar.png');
            const url = await getDownloadURL(avatarRef);
            setAvatarUri(`${url}?t=${new Date().getTime()}`); // Add timestamp to bust cache
          } catch (error) {
            // console.error('Error fetching avatar:', error);
            const fallbackUrl = await getDownloadURL(ref(storage, 'default/avatar.png'));
            setAvatarUri(`${fallbackUrl}?t=${new Date().getTime()}`); // Ensure fallback busts cache too
          }
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, avatarUri, setAvatarUri }}>
      {children}
    </UserContext.Provider>
  );
};
