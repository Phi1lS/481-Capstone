import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Paragraph, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function RealEstateScreen() {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Completely hides the header
    });
  }, [navigation]);

  // Animates the card when pressed down
  const handlePressIn = (animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // Restores the card's original scale when the press is released
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
            <Title style={styles.greeting}>Real Estate Management</Title>
            <Paragraph style={styles.subGreeting}>Manage your properties and finances</Paragraph>
          </View>
        </View>

        <Title style={styles.sectionTitle}>Property Tools</Title>

        {/* Cards for each feature of the Real Estate screen */}
        {renderCard('Income Tracking', 'Track income from your properties', 'cash-multiple', 'IncomeTracking')}
        {renderCard('Expense Tracking', 'Monitor and manage expenses', 'bank', 'ExpenseTracking')}
        {renderCard('Lease Management', 'Manage and track lease agreements', 'file-document-edit-outline', 'LeaseManagement')}
        {renderCard('Tax Integration', 'Integrate with tax software', 'file-cabinet', 'TaxIntegration')}
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
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    paddingHorizontal: 15,
    zIndex: 1,
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
