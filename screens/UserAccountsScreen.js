import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, StatusBar, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function UserAccountsScreen() {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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
    <SafeAreaView style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#00251A" : "#004D40"} />

      {/* Header Section */}
      <View style={isDarkMode ? styles.darkHeaderBackground : styles.headerBackground}>
        <View style={styles.header}>
          <Avatar.Image size={50} source={require('../assets/avatar.png')} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>User Account</Text>
            <Text style={styles.subGreeting}>Manage your account settings</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkSectionTitle : styles.sectionTitle}>Account Management</Title>

        {/* Cards for each account management feature */}
        {renderCard('Profile', 'View and edit your profile information', 'account-outline', 'Profile')}
        {renderCard('Security', 'Manage your security settings', 'lock-outline', 'Security')}
        {renderCard('Notifications', 'Configure your notifications', 'bell-outline', 'Notifications')}
        {renderCard('Preferences', 'Customize your app preferences', 'cog-outline', 'Preferences')}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  container: {
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
  darkSafeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  darkHeaderBackground: {
    backgroundColor: '#00251A',
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  darkContainer: {
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
});
