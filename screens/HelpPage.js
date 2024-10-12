import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Image, Text, useColorScheme, Platform } from 'react-native';
import { Avatar } from 'react-native-paper';
import { UserContext } from '../UserContext';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebaseConfig';

export default function HomeScreen() {
  const { userProfile, avatarUri, setAvatarUri } = useContext(UserContext); 
  const [logoUrl, setLogoUrl] = useState('');  
  const scheme = useColorScheme();  
  const isDarkMode = scheme === 'dark';  

  // Fetch logo once
  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const logoRef = ref(storage, 'logo.png');  
        const url = await getDownloadURL(logoRef);
        setLogoUrl(url);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogoUrl();
  }, []);

  // Fetch avatar URL if not cached
  useEffect(() => {
    const fetchAvatarUrl = async () => {
      try {
        if (!avatarUri && userProfile.avatarPath) {  // Fetch only if no avatarUri in context
          const avatarRef = ref(storage, userProfile.avatarPath);
          const url = await getDownloadURL(avatarRef);
          await Image.prefetch(url); // Prefetch for caching
          setAvatarUri(url);
        }
      } catch (error) {
        const fallbackUrl = await getDownloadURL(ref(storage, 'default/avatar.png'));
        await Image.prefetch(fallbackUrl);
        setAvatarUri(fallbackUrl);
      }
    };

    fetchAvatarUrl();
  }, [userProfile.avatarPath, avatarUri, setAvatarUri]);

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? "#121212" : "#F5F5F5"} 
      />

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
            <Text style={styles.greeting}>Help</Text>
            <Text style={styles.subGreeting}>Helpful Information on features</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={isDarkMode ? styles.darkSectionTitle : styles.sectionTitle}>Your Dashboard</Text>

        <View style={styles.dashboard}>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  headerBackground: {
    backgroundColor: '#004D40',
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 150,
    height: 50,
    alignSelf: 'center',
    marginVertical: 10,
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
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 20,
    color: '#333333',
  },
  dashboard: {
    paddingHorizontal: 10,
  },
  dashboardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  summaryValue: {
    fontSize: 18,
    color: '#00796B',
    marginTop: 5,
  },
  placeholderGraph: {
    height: 100,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  placeholderText: {
    color: '#004D40',
  },
  // Dark mode styles
  darkContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  darkHeaderBackground: {
    backgroundColor: '#00251A',
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  darkSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 20,
    color: '#FFFFFF',
  },
  darkDashboardItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  darkSummaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkSummaryValue: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 5,
  },
  darkPlaceholderGraph: {
    height: 100,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  darkPlaceholderText: {
    color: '#4CAF50',
  },
});
