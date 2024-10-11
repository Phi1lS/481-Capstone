import React from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme } from 'react-native';
import { Title, Card, Avatar } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CombinedDarkTheme, CombinedDefaultTheme } from '../../themes';



export default function IncomeTrackingScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const navigation = useNavigation();

  const data = [
    { name: 'Stocks', population: 60, color: '#00796B', legendFontColor: '#00796B', legendFontSize: 15 },
    { name: 'Bonds', population: 20, color: '#004D40', legendFontColor: '#004D40', legendFontSize: 15 },
    { name: 'Real Estate', population: 10, color: '#B2DFDB', legendFontColor: '#B2DFDB', legendFontSize: 15 },
    { name: 'Cash', population: 10, color: '#4CAF50', legendFontColor: '#4CAF50', legendFontSize: 15 },
  ];

  return (
    <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Income Tracking</Title>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Income for Month"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>$XXX,XXX</Text>
          </View>
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Change From Last Month"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>XXXXXX</Text>
          </View>
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Income Sources for Month"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>$XXX,XXX</Text>
          </View>
        </Card>
      </ScrollView>
      <FAB
        icon="plus"
        color="rgba(255, 255, 255, 0.9)"
        style={isDarkMode ? styles.darkFab : styles.fab}
        onPress={() => navigation.navigate("AddIncome")}
      />
    </View>
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(0, 121, 107, 0.6)', // 60% opacity
  },
  darkFab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.6)', // 60% opacity
  },
});
