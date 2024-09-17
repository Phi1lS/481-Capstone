import { React, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';

export default function SecurityScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const [switchStates, setSwitchStates] = useState([false, false]);

  const toggleSwitch = (index) => {
    setSwitchStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  /*
    To implement:
    - Edit buttons lead to an independent edit screen for the specific function.
        - Username Edit button only edits username, saves to backend database

    - Clicking on a specific device brings up that devices' login history.
        - iPhone 15 Pro Max => Known : Unknown => Login history
          - Ability to sign out any device / remove cookies

  */

  return (
    <SafeAreaView style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
              
      <Card style={isDarkMode ? styles.darkCard : styles.card}>
        <Card.Title
                title="Username" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
                />
            <View style={styles.editText}>
                <Text style={isDarkMode ? styles.darkEdit : styles.edit}>Edit</Text>
            </View>

            <Card.Title
                title="Password" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
                />
            <View style={styles.editText}>
                <Text style={isDarkMode ? styles.darkEdit : styles.edit}>Edit</Text>
            </View>
        </Card>

      <Card style={isDarkMode ? styles.darkCard : styles.card}>
      <Card.Title
                title="Devices" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
                />
            <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6  }} />

            <View style={styles.detailsContainer}>
                <Text style={isDarkMode ? styles.darkText : styles.text}>iPhone 15 Pro Max</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={isDarkMode ? styles.darkText : styles.text}>Macbook Pro</Text>
            </View>

        </Card>

      <Card style={isDarkMode ? styles.darkCard : styles.card}>
        <Card.Title
                title="Security Preferences" titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
                />
            <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6  }} />
            
      <View style={styles.switchContainer}>
      <Text style={isDarkMode ? styles.darkText : styles.text}>Two-Factor Authentication</Text>
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
        <Text style={isDarkMode ? styles.darkText : styles.text}>Track Account Activity</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#00796B' }}
            thumbColor={switchStates[1] ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch(1)}
            value={switchStates[1]}
            style={styles.switch}
          />
        </View>

      <View style={styles.switchContainer}>
        <Text style={isDarkMode ? styles.darkText : styles.text}>Security 3</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#00796B' }}
            thumbColor={switchStates[2] ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch(2)}
            value={switchStates[2]}
            style={styles.switch}
          />
        </View>
          </Card>

      <Card style={isDarkMode ? styles.darkCard : styles.card}>
            <View style={styles.exitContainer}>
              <Text style={styles.exitText}>Lock Account</Text>
            </View>
            <View style={styles.exitContainer}>
              <Text style={styles.exitText}>Close Account</Text>
            </View>
        </Card>

        {/* Add other UI elements for security, notifications, preferences, etc. */}
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
  text: {
    fontSize: 16,
    color: '#555',
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
  // Dark mode styles
  darkSafeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
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
  darkText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },  
  darkCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editText: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 15,
    bottom: 39,
    marginBottom: -17
  },
  edit: {
    color: '#00796B',
    marginTop: 5
  },
  darkEdit: {
    color: '#4CAF50',
    marginTop: 5
  },
  detailsContainer: {
    padding: 15
  },
  exitContainer: {
    flex: 1,
    alignItems: 'flex-end',
    color: '#FF0000',
    padding: 20,
  },
  exitText: {
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 10,
  },
});
