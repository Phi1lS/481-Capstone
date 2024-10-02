import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Switch, TouchableOpacity } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { auth } from '../../firebaseConfig';
import { ThemeContext } from '../../ThemeContext'; // Import ThemeContext

export default function Preferences() {
  const { themeMode, setThemeMode } = useContext(ThemeContext); // Access theme context
  const scheme = useColorScheme(); // Detect system color scheme
  const isDarkMode = scheme === 'dark' || themeMode === 'dark'; // Determine if dark mode is active

  const [sliderValue, setSliderValue] = useState(
    themeMode === 'dark' ? 0 : themeMode === 'light' ? 100 : 50
  ); // Default to the current theme mode
  const [temporaryValue, setTemporaryValue] = useState(sliderValue); // For fluid slider movement

  // Slider movement to adjust theme mode
  const sliderHold = (value) => {
    setTemporaryValue(value);
  };

  const sliderDrop = (value) => {
    // Snap slider on drop
    const snappedValue = Math.round(value / 50) * 50;
    setSliderValue(snappedValue);
    setTemporaryValue(snappedValue);

    if (snappedValue === 0) {
      setThemeMode('dark'); // Switch to dark mode
    } else if (snappedValue === 50) {
      setThemeMode('automatic'); // Switch to system mode
    } else if (snappedValue === 100) {
      setThemeMode('light'); // Switch to light mode
    }
  };

  const [switchStates, setSwitchStates] = useState([false, false]);

  const toggleSwitch = (index) => {
    setSwitchStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  // Logout function using Firebase Auth
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        console.log('User signed out successfully');
      })
      .catch((error) => {
        console.error('Error during sign out:', error);
      });
  };

  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        {/* Theme Display */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Theme Display"
            left={(props) => <Avatar.Icon {...props} icon="theme-light-dark" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabelContainer}>
              <Text style={sliderValue === 0 ? styles.highlighted : styles.unhighlighted}>Dark Mode</Text>
              <Text style={sliderValue === 50 ? styles.highlighted : styles.unhighlighted}>Automatic</Text>
              <Text style={sliderValue === 100 ? styles.highlighted : styles.unhighlighted}>Light Mode</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={temporaryValue}
              onValueChange={sliderHold}
              onSlidingComplete={sliderDrop}
              minimumTrackTintColor="#00796B"
              maximumTrackTintColor="#000000"
              thumbTintColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* User Preferences */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="User Preferences"
            left={(props) => <Avatar.Icon {...props} icon="clipboard-account" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6 }} />

          <Card.Title title="Language" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
          <View style={styles.textContainerRight}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>English</Text>
          </View>

          <Card.Title title="Currency" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
          <View style={styles.textContainerRight}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>USD</Text>
          </View>

          <Card.Title title="Time Zone" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle} />
          <View style={styles.textContainerRight}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>EST (UTC-05:00)</Text>
          </View>
        </Card>

        {/* Privacy Settings */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Privacy"
            left={(props) => <Avatar.Icon {...props} icon="shield-account" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6 }} />

          <View style={styles.switchContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Enable Cookies</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#00796B' }}
              thumbColor={switchStates[0] ? '#ffffff' : '#ffffff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleSwitch(0)}
              value={switchStates[0]}
              style={styles.switch}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Save Data</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#00796B' }}
              thumbColor={switchStates[1] ? '#ffffff' : '#ffffff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleSwitch(1)}
              value={switchStates[1]}
              style={styles.switch}
            />
          </View>
        </Card>

        {/* Log Out Section */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <TouchableOpacity onPress={handleLogout}>
            <View style={styles.exitContainer}>
              <Text style={styles.exitText}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  darkContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
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
  sliderContainer: {
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabelContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  highlighted: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  unhighlighted: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  textContainerRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 4,
    paddingLeft: 12,
  },
  exitContainer: {
    flex: 1,
    alignItems: 'flex-end',
    color: '#FF0000',
    padding: 20,
  },
  exitText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 10,
  },
  icon: {
    backgroundColor: '#E8F5E9',
  },
});
