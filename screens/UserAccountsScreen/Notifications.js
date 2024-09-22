import { React, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar } from 'react-native-paper';

export default function NotificationsScreen() {
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

  return (
    <SafeAreaView style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Notifications"
            left={(props) => <Avatar.Icon {...props} icon="bell" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />

<View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6  }} />

      <View style={styles.switchContainer}>
      <Text style={isDarkMode ? styles.darkText : styles.text}>Email Notifications</Text>
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
      <Text style={isDarkMode ? styles.darkText : styles.text}>SMS Notifications</Text>
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
      <Text style={isDarkMode ? styles.darkText : styles.text}>Push Notifications</Text>
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
          <Card.Title
            title="Alerts"
            left={(props) => <Avatar.Icon {...props} icon="alert-circle" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6  }} />

      <View style={styles.switchContainer}>
      <Text style={isDarkMode ? styles.darkText : styles.text}>Transaction Alerts</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#00796B' }}
            thumbColor={switchStates[3] ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch(3)}
            value={switchStates[3]}
            style={styles.switch}
          />
        </View>
      <View style={styles.switchContainer}>
      <Text style={isDarkMode ? styles.darkText : styles.text}>Investment Insights</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#00796B' }}
            thumbColor={switchStates[4] ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch(4)}
            value={switchStates[4]}
            style={styles.switch}
          />
        </View>

        <View style={styles.detailsContainer}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, styles.details]}>
              You will receive market trends and investment opportunities tailored to your interests.</Text>
        </View>

        </Card>
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
  icon: {
    backgroundColor: '#E8F5E9',
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
    padding: 15,
    paddingTop: 0
  },
  details: {
    fontSize: 13,
    color: '#AAAAAA'
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
