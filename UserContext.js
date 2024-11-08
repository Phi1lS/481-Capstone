import React, { createContext, useState, useEffect } from 'react';
import { auth, db, storage } from './firebaseConfig';
import { doc, getDoc, collection, onSnapshot, and } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarPath: '',
    incomes: [],
    assets: [], // Added assets to the profile
  });

  const [avatarUri, setAvatarUri] = useState(null);
  const [cachedAvatar, setCachedAvatar] = useState(null);

  useEffect(() => {
    let unsubscribeIncomeListener;  // Declare listener unsubscribe handler
    let unsubscribeAssetListener;  // Declare listener for assets
    let unsubscribeSavingsListener;  // Declare listener for Savings

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
            isSavings: doc.data().isSavings || false, // Ensure isSavings is included
          }));
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            incomes,
          }));
        });

        // Listen for savings updates
        const incomeRefForSavings = collection(db, 'incomes');
        unsubscribeSavingsListener = onSnapshot(incomeRefForSavings, (snapshot) => {
          const incomeSavings = snapshot.docs
          .filter((doc) => doc.data().userId === user.uid)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isSavings: doc.data().isSavings || false, // Ensure isSavings is included
          }));

          //grab only savings incomes
         const allSavings = incomeSavings.filter((income) => {
          return income.isSavings === true;
        });
        //total up all savings
         const totalSavings = allSavings?.reduce((total, income) => total + income.incomePerMonth, 0);
      
                 
         setUserProfile((prevProfile) => ({
           ...prevProfile,
           totalSavings,
          }));
        });


        // Listen for asset updates
        const assetRef = collection(db, 'assets');
        unsubscribeAssetListener = onSnapshot(assetRef, (snapshot) => {
          const assets = snapshot.docs
            .filter((doc) => doc.data().userId === user.uid)
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
              isSavings: doc.data().isSavings || false, // Ensure isSavings is included
            }));
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            assets,
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
          assets: [], // Reset assets on logout
          totalSavings: 0,
        });
        setAvatarUri(null);

        // Unsubscribe from listeners when user logs out
        if (unsubscribeIncomeListener) {
          unsubscribeIncomeListener();
        }
        if (unsubscribeAssetListener) {
          unsubscribeAssetListener();
        }
        if (unsubscribeSavingsListener) {
          unsubscribeSavingsListener();
        }
      }
    });

    return () => {
      unsubscribeAuth();  // Unsubscribe from auth listener
      if (unsubscribeIncomeListener) {
        unsubscribeIncomeListener();  // Unsubscribe from income listener
      }
      if (unsubscribeAssetListener) {
        unsubscribeAssetListener();  // Unsubscribe from asset listener
      }
    };
  }, []);

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