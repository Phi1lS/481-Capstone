import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Paragraph, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function RetirementScreen() {
  const navigation = useNavigation();

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
      <View style={styles.headerBackground} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Integrated Header section */}
        <View style={styles.header}>
          <Avatar.Image size={60} source={require('../assets/avatar.png')} style={styles.avatar} />
          <View style={styles.headerText}>
            <Title style={styles.greeting}>Retirement Accounts</Title>
            <Paragraph style={styles.subGreeting}>Plan and secure your future</Paragraph>
          </View>
        </View>

        <Title style={styles.sectionTitle}>Retirement Tools</Title>

        {/* Cards for each feature of the Retirement screen */}
        {renderCard('Portfolio Rebalancing', 'Adjust your portfolio for optimal retirement', 'scale-balance', 'PortfolioRebalancing')}
        {renderCard('Retirement Savings', 'Manage and grow your retirement savings', 'currency-usd', 'RetirementSavings')}
        {renderCard('Retirement Planning', 'Plan your retirement to ensure financial security', 'calendar-clock', 'RetirementPlanning')}
        {renderCard('Pension Management', 'Manage and optimize your pension funds', 'account-cash', 'PensionManagement')}
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
    height: 200, // This should cover the entire header area
    backgroundColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    paddingHorizontal: 15,
    zIndex: 1, // Ensure the header content stays above the background
  },
  avatar: {
    backgroundColor: '#4CAF50',
  },
  headerText: {
    marginLeft: 15,
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
    backgroundGradient: 'linear-gradient(45deg, #f0f4f7, #ffffff)',
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
});
