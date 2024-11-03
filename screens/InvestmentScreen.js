import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, StatusBar, Text, useColorScheme, Platform } from 'react-native';
import { Title, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebaseConfig';

export default function InvestmentScreen() {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const { avatarUri } = useContext(UserContext); // Accessing cached avatarUri from UserContext

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
            <Text style={styles.greeting}>Investment Accounts</Text>
            <Text style={styles.subGreeting}>Manage and optimize your investments</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={isDarkMode ? styles.darkScrollContainer : styles.scrollContainer}>
        <Title style={isDarkMode ? styles.darkSectionTitle : styles.sectionTitle}>Investment Tools</Title>

        {/* Cards for each feature of the Investment screen */}
        {renderCard('Asset Allocation', 'Distribute assets across various investments', 'chart-pie', 'AssetAllocation')}
        {renderCard('Market Predictions', 'Analyze and predict market trends', 'trending-up', 'MarketPredictions')}
        {renderCard('Rebalancing', 'Adjust your portfolio to maintain desired allocation', 'swap-horizontal-bold', 'Rebalancing')}
        {renderCard('Investment Analytics', 'Review detailed analytics and performance', 'chart-bar', 'InvestmentAnalytics')}
      
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(new Animated.Value(1))}
          onPressOut={() => handlePressOut(new Animated.Value(1))}
          onPress={() => navigation.navigate('InvestmentHelp')}
        >
          <Text style={isDarkMode ? styles.darkNeedHelpText : styles.needHelpText}>Need Help?</Text>
        </TouchableOpacity>
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
    padding: 20,
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
  needHelpText:{
    fontSize: 16,
    color: '#00796B',
    textAlign: 'right',
    bottom: 552,
  },
  darkNeedHelpText:{
    fontSize: 25,
    color: '#4CAF50',
    textAlign: 'right',
    bottom: 552,
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
    padding: 20,
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
