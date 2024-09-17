import React from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar } from 'react-native-paper';

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

                /* 
                Features:
                - Tap to show / Hide
                    - Show all / Hide all (top cardbar)
                vvvvv
                - Feature to add slider to hide / show full data.
                    - Unhide: last 4 digits
                    - Slide left: reveal full number

                - more imme
                - Add + | Edit
                    - Can have multiple phone numbers
                - Link external accounts (Paypal, fidelity, etc.)

                9/6/24

                Run edit page through another nav (for the whole box temp)
                then change it to edit tab only

            */

  return (
    <SafeAreaView style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Jane Doe"
            left={(props) => <Avatar.Icon {...props} icon="account" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
            <View style={styles.editText}>
              <Text style={isDarkMode ? styles.darkEdit : styles.edit}>Edit</Text>
            </View>
        </Card>

          <Card style={isDarkMode ? styles.darkCard : styles.card}>

            <Card.Title
                title="Contact Details"
                titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
              />
            <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6  }} />

            <Card.Title
                title="Phone"
                titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
              />
              <View style={styles.textContainerRight}>
                <Text style={isDarkMode ? styles.darkText : styles.text}>+1 212-123-4567</Text>
            </View>

            <Card.Title
                title="Email"
                titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
              />
            <View style={styles.textContainerRight}>
                <Text style={isDarkMode ? styles.darkText : styles.text}>janedoe@gmail.com</Text>
            </View>

            <Card.Title
                title="Address"
                titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
                />
            <View style={styles.textContainerRight}>
                <Text style={isDarkMode ? styles.darkText : styles.text}>18 Wall Street, NY</Text>
            </View>
          </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="External Accounts"
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
            <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>As an InvestAlign user, you are able to</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>transfer funds between accounts.</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Get started today.</Text>
          </View>
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Account Type"
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
            <View style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#ddd', margin: 10, marginTop: 6  }} />
            <View style={styles.detailsContainer}>
              <Text style={isDarkMode ? styles.darkText : styles.text}>Business Checking</Text>
            </View>
        </Card>
        
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Employment & Income"
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
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
  textContainerRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
    bottom: 38,
    marginBottom: -28
  },  
  detailsContainer: {
    padding: 10
  },
  editText: {
    flex: 1,
    position: 'abolute',
    alignItems: 'flex-end',
    paddingRight: 10,
    bottom: 52,
    marginBottom: -29
  },
  edit: {
    color: '#00796B',
    marginTop: 5
  },
  darkEdit: {
    color: '#4CAF50',
    marginTop: 5
  }

});
