import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Paragraph, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  // Set custom navigation options to hide the header
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

  // Renders a card with a title, subtitle, and icon that scales on press
  const renderCard = (title, subtitle, icon, navigationTarget) => {
    const scaleValue = new Animated.Value(1);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={() => handlePressIn(scaleValue)}
        onPressOut={() => handlePressOut(scaleValue)}
        onPress={() => navigation.navigate(navigationTarget)}
      >
        <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
          <Card.Title
            title={title}
            subtitle={subtitle}
            left={(props) => <Avatar.Icon {...props} icon={icon} style={styles.icon} />}
            titleNumberOfLines={2}
            subtitleNumberOfLines={2}
            titleStyle={styles.cardTitle}
            subtitleStyle={styles.cardSubtitle}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#e0e0e0" />

      {/* Background view for the header section */}
      <View style={styles.headerBackground} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Company logo centered above the greeting */}
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* User greeting section with avatar */}
        <View style={styles.header}>
          <Avatar.Image size={50} source={require('../assets/avatar.png')} style={styles.avatar} />
          <View style={styles.headerText}>
            <Title style={styles.greeting}>Hello, User</Title>
            <Paragraph style={styles.subGreeting}>Welcome back to InvestAlign</Paragraph>
          </View>
        </View>

        {/* Section title */}
        <Title style={styles.sectionTitle}>Manage Your Wealth</Title>

        {/* Cards for different app features */}
        {renderCard('Real Estate Management', 'Track income, expenses, leases, and more', 'home-city-outline', 'RealEstateTab')}
        {renderCard('Investment Accounts', 'Asset allocation, market predictions', 'chart-line', 'InvestmentTab')}
        {renderCard('Retirement Accounts', 'Plan and manage retirement funds', 'account-clock-outline', 'RetirementTab')}
        {renderCard('User and Admin Accounts', 'Manage user profiles and admin settings', 'account-settings-outline', 'AccountTab')}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200, // Covers the entire header area
    backgroundColor: '#e0e0e0',
  },
  logo: {
    width: 200, // Logo width
    height: 70,  // Logo height
    alignSelf: 'center',
    marginBottom: 0, // Reduced margin below the logo
    paddingVertical: 0, // Removed vertical padding around the logo
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Margin below the header
    paddingVertical: 10, // Vertical padding in the header
    paddingHorizontal: 10, // Horizontal padding in the header
    zIndex: 1, // Ensures the header content stays above the background
  },
  avatar: {
    backgroundColor: '#4CAF50', // Avatar background color
  },
  headerText: {
    marginLeft: 10, // Space between the avatar and the text
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  subGreeting: {
    color: '#777',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10, // Margin below the section title
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
    backgroundGradient: 'linear-gradient(45deg, #f0f4f7, #ffffff)',
  },
  icon: {
    backgroundColor: '#E8F5E9', // Icon background color
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
});
