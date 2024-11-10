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
    assets: [],
    expenses: [],  // Added expenses to the profile
    totalSavings: 0,
  });

  const [avatarUri, setAvatarUri] = useState(null);
  const [cachedAvatar, setCachedAvatar] = useState(null);

  useEffect(() => {
    let unsubscribeIncomeListener;
    let unsubscribeAssetListener;
    let unsubscribeSavingsListener;
    let unsubscribeExpenseListener;  // Declare listener for expenses

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserProfile(user.uid);

        // Listen for income updates
        const incomeRef = collection(db, 'incomes');
        unsubscribeIncomeListener = onSnapshot(incomeRef, (snapshot) => {
          const incomes = snapshot.docs
            .filter((doc) => doc.data().userId === user.uid)
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
              isSavings: doc.data().isSavings || false,
            }));
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            incomes,
          }));
        });

        // Listen for savings updates
        unsubscribeSavingsListener = onSnapshot(incomeRef, (snapshot) => {
          const incomeSavings = snapshot.docs
            .filter((doc) => doc.data().userId === user.uid && doc.data().isSavings)
            .map((doc) => doc.data());

          const totalSavings = incomeSavings.reduce((total, income) => total + income.incomePerMonth, 0);

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
            }));
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            assets,
          }));
        });

        // Listen for expense updates
        const expenseRef = collection(db, 'expenses');
        unsubscribeExpenseListener = onSnapshot(expenseRef, (snapshot) => {
          const expenses = snapshot.docs
            .filter((doc) => doc.data().userId === user.uid)
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            expenses,
          }));
        });
      } else {
        // Reset user profile and avatar on logout
        setUserProfile({
          firstName: '',
          lastName: '',
          email: '',
          avatarPath: '',
          incomes: [],
          assets: [],
          expenses: [],
          totalSavings: 0,
        });
        setAvatarUri(null);

        // Unsubscribe from all listeners
        if (unsubscribeIncomeListener) unsubscribeIncomeListener();
        if (unsubscribeAssetListener) unsubscribeAssetListener();
        if (unsubscribeSavingsListener) unsubscribeSavingsListener();
        if (unsubscribeExpenseListener) unsubscribeExpenseListener();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeIncomeListener) unsubscribeIncomeListener();
      if (unsubscribeAssetListener) unsubscribeAssetListener();
      if (unsubscribeSavingsListener) unsubscribeSavingsListener();
      if (unsubscribeExpenseListener) unsubscribeExpenseListener();
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

      // Cache avatar URL to avoid re-fetching
      if (!cachedAvatar) {
        try {
          const avatarRef = userData.avatarPath ? ref(storage, userData.avatarPath) : ref(storage, 'default/avatar.png');
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