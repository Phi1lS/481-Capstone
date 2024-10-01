import { React, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Switch, TouchableOpacity } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { auth } from '../../firebaseConfig'

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const [sliderValue, setSliderValue] = useState(50); // Default to automatic mode
  const [temporaryValue, setTemporaryValue] = useState(sliderValue); // fluid movement

  /* Slider hold on temp allows for fluid movement in the slider. 
  on release, it snaps to the appropriate value */

  const sliderHold = (value) => {
    setTemporaryValue(value);
  };

  const sliderDrop = (value) => {
    // Snap slider on drop
    const snappedValue = Math.round(value / 50) * 50;
    setSliderValue(snappedValue);
    setTemporaryValue(snappedValue);

    if (snappedValue === 0) {
      scheme === 'dark'; // Still need to implement switching of color themes without dynamic switch
    } else if (snappedValue === 100) {
      // auto
    } else {
      // light 
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
        // Optionally navigate to a login screen after logout
      })
      .catch((error) => {
        console.error('Error during sign out:', error);
      });
    }

  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
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

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="User Preferences"
            left={(props) => <Avatar.Icon {...props} icon="clipboard-account" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6}} />

          {/* temporarily assign each box to default values.
              In the future, I want to implement a dropdown box for
              each value (Language pref, Currency, etc.)

              I would use an api to switch language, currency, etc, but that would be
              too complicated for the meanwhile

              Instead just assign default variables to language translations
              currencies can be determined by a formula (eg. usd => jpy)
              time zone can be variable based
          */}
            <Card.Title
                title="Language"
                titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
              />
              <View style={styles.textContainerRight}>
                <Text style={isDarkMode ? styles.darkText : styles.text}>English</Text>
            </View>

            <Card.Title
                title="Currency"
                titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
              />
            <View style={styles.textContainerRight}>
                <Text style={isDarkMode ? styles.darkText : styles.text}>USD</Text>
            </View>

            <Card.Title
                title="Time Zone"
                titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
                />
            <View style={styles.textContainerRight}>
                <Text style={isDarkMode ? styles.darkText : styles.text}>EST (UTC-05:00)</Text>
            </View>
          </Card>

          <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Privacy"
            left={(props) => <Avatar.Icon {...props} icon="shield-account" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6}} />

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
  sliderLabelContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  textContainerRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 15,
    bottom: 38,
    marginBottom: -28
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
  highlighted: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  unhighlighted: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 10,
  },
  darkPicker: {
    color: '#fff',
  },
  picker: {
    color: '#000',
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
});
