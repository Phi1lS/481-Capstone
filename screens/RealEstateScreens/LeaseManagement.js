import React from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme } from 'react-native';
import { Title, Card, Avatar, Button } from 'react-native-paper';
import Slider from '@react-native-community/slider';

export default function LeaseManagementScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Lease Management</Title>

        {/* Lease Information Card */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Lease Information"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Lease start date: MM/DD/YYYY</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Lease end date: MM/DD/YYYY</Text>
          </View>
          <Card.Actions>
            <Button textColor={isDarkMode ? styles.darkText.color : styles.text.color}>Renew</Button>
            <Button mode="outlined" textColor={isDarkMode ? styles.darkText.color : styles.text.color}>
              Terminate Lease
            </Button>
          </Card.Actions>
        </Card>

        {/* Notifications Card */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Notifications"
            left={(props) => <Avatar.Icon {...props} icon="bell" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>You have no new notifications</Text>
          </View>
        </Card>

        {/* Expense Card */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Expenses"
            left={(props) => <Avatar.Icon {...props} icon="currency-usd" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>$XXX,XXX</Text>
          </View>
        </Card>

        {/* Lease Tracking Card */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Lease Tracking"
            left={(props) => <Avatar.Icon {...props} icon="map-marker" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Lease tracking details</Text>
          </View>
        </Card>

        {/* Tax Software Connection Card */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Connect to Tax Software"
            left={(props) => <Avatar.Icon {...props} icon="account-cash" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Connect your account</Text>
          </View>
        </Card>

        {/* Asset Allocation Sliders */}
        <View style={styles.sliderContainer}>
          <Text style={isDarkMode ? styles.darkText : styles.text}>Stocks: 60%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={60}
            minimumTrackTintColor="#00796B"
            maximumTrackTintColor="#000000"
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={isDarkMode ? styles.darkText : styles.text}>Bonds: 20%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={20}
            minimumTrackTintColor="#004D40"
            maximumTrackTintColor="#000000"
          />
        </View>

        {/* Add more sliders for other asset classes as needed */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
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
  },
  sliderContainer: {
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  // Dark mode styles
  darkContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  darkTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
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
  },
  darkText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
  },
});
