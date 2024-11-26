import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, StatusBar, Text, useColorScheme, Platform } from 'react-native';
import { Title, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function UserAccountsScreen() {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const { avatarUri, userProfile } = useContext(UserContext); // Accessing avatarUri and userProfile from UserContext
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    //console.log('userProfile.id:', userProfile.id); // Check if ID is set
    if (userProfile.id) {
      const notificationsRef = collection(db, 'users', userProfile.id, 'notifications');
      //console.log('Notifications collection path:', `users/${userProfile.id}/notifications`);
      const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
        //console.log('Snapshot received:', snapshot.docs); // Log snapshot data
        const unreadExists = snapshot.docs.some((doc) => doc.data().status === 'unread');
        setHasUnreadNotifications(unreadExists);
      });
  
      return () => unsubscribe();
    }
  }, [userProfile.id]);

  const handlePressIn = (animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const renderCard = (title, subtitle, icon, navigationTarget) => {
    const scaleValue = new Animated.Value(1);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={() => handlePressIn(scaleValue)}
        onPressOut={() => handlePressOut(scaleValue)}
        onPress={() => navigation.navigate(navigationTarget)}
      >
        <Animated.View style={[isDarkMode ? styles.darkCard : styles.card, { transform: [{ scale: scaleValue }] }]}>
          <Card.Title
            title={title}
            subtitle={subtitle}
            left={(props) => <Avatar.Icon {...props} icon={icon} style={styles.icon} />}
            titleNumberOfLines={2}
            subtitleNumberOfLines={2}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
            subtitleStyle={isDarkMode ? styles.darkCardSubtitle : styles.cardSubtitle}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#00251A" : "#004D40"} />

      {/* Header Section */}
      <View style={isDarkMode ? styles.darkHeaderBackground : styles.headerBackground}>
        <View style={styles.header}>
          {/* Display user avatar if available, else show a placeholder avatar */}
          {avatarUri ? (
            <Avatar.Image size={50} source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Avatar.Icon size={50} icon="account" style={styles.avatar} />
          )}
          <View style={styles.headerText}>
            <Text style={styles.greeting}>User Account</Text>
            <Text style={styles.subGreeting}>Manage your account settings</Text>
          </View>
          {/* Notification Bell */}
          <View style={styles.notificationBellContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('NotificationsPage')}>
              <Avatar.Icon size={40} icon="bell-outline" style={styles.bellIcon} />
            </TouchableOpacity>
            {hasUnreadNotifications && <View style={styles.redDot} />}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={isDarkMode ? styles.darkScrollContainer : styles.scrollContainer}>
        <Title style={isDarkMode ? styles.darkSectionTitle : styles.sectionTitle}>Account Management</Title>

        {/* Cards for each account management feature */}
        {renderCard('Profile', 'View and edit your profile information', 'account-outline', 'Profile')}
        {renderCard('Security', 'Manage your security settings', 'lock-outline', 'Security')}
        {/*
          {renderCard('Notifications', 'Configure your notifications', 'bell-outline', 'Notifications')}
        */}
        {renderCard('Preferences', 'Customize your app preferences', 'cog-outline', 'Preferences')}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'ios' ? 60 : 0, // 60 margin for iOS
  },
  headerBackground: {
    backgroundColor: '#004D40',
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    backgroundColor: '#00796B',
  },
  headerText: {
    marginLeft: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subGreeting: {
    fontSize: 16,
    color: '#B2DFDB',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
  icon: {
    backgroundColor: '#E8F5E9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexWrap: 'wrap',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    flexWrap: 'wrap',
  },
  // Dark mode styles
  darkContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'ios' ? 60 : 0, // 60 margin for iOS
  },
  darkHeaderBackground: {
    backgroundColor: '#00251A',
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  darkScrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  darkSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
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
    flexWrap: 'wrap',
  },
  darkCardSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    flexWrap: 'wrap',
  },
  notificationBellContainer: {
    marginLeft: 'auto',
    justifyContent: 'center',
  },
  bellIcon: {
    backgroundColor: '#E8F5E9',
  },
  redDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});
