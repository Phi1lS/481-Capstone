import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Card, Avatar, Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

export default function InvestmentAnalyticsScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  // Get screen width to make the chart fit the screen properly
  const screenWidth = Dimensions.get('window').width;

  //income values
 const [totalSavings, setTotalSavings] = useState(5000);
 const [retirementGoal, setRetirementGoal] = useState(10000);
 const [retirementAge, setRetirementAge] = useState(70);

 const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  datasets: [
    {
      data: [0, 40, 35, 70, totalSavings, 90, 95, retirementGoal],
      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};
const chartConfig = {
  backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => (isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(51, 51, 51, ${opacity})`),
  style: {
    borderRadius: 16,
  },
};
  return (
    <SafeAreaView style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Retirement Planning</Title>

       {/* Card for total amount*/} 
       <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Current Goal"
            titleStyle={[isDarkMode ? styles.darkCardTitle : styles.cardTitle, {textAlign: 'center'}]}
            left={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
            right={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
          />

      {/* retirement goal text */}
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkMoneyValue : styles.moneyValue}>$ {retirementGoal.toLocaleString()}</Text>
          </View>

      {/* Goal Progress Bar */}
          <View style={styles.detailsContainer}>
          <Text style={[isDarkMode ? styles.darkText : styles.text, {textAlign: 'center', fontSize: 30, paddingBottom: 10}]}>Goal Progress</Text>
          </View>
          <View style = {[styles.detailsContainer, {position: 'relative', marginTop: 5, justifyContent: 'center', alignItems: 'center'}]}>
            <Progress.Bar progress={totalSavings / retirementGoal} width = {375} height = {45} color = {isDarkMode ? '#4CAF50' : '#00796B'} backgroundColor = {isDarkMode ? '#333333' : '#333'}/>
            <Text style={[isDarkMode ? styles.darkTitle : styles.title, {color: '#FFFFFF', position: 'absolute'}]}>  Current Amount: ${totalSavings.toLocaleString()}</Text>
          </View>
          
          
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Retirement Age"
            titleStyle={[isDarkMode ? styles.darkCardTitle : styles.cardTitle, {textAlign: 'center'}]}
            left={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
            right={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={styles.icon} />}
          />

      {/* retirement goal text */}
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkMoneyValue : styles.moneyValue}> {retirementAge.toLocaleString()}</Text>
          </View>
                
        </Card>
        
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Monthly Progress"
            left={(props) => <Avatar.Icon {...props} icon="trending-up" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <LineChart
            data={data}
            width={320}
            height={240}
            chartConfig={chartConfig}
            style={{ marginVertical: 30 }}
            bezier
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
    padding: 5,
  },
  icon: {
    backgroundColor: '#E8F5E9',
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginLeft: 10,
  },
  placeholderGraph: {
    height: 100,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  textInput: {

  },
  buttonLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: '#00796B',
    padding: 14,
    borderRadius: 8,
    marginTop: 25,
  },
  calculateButtonPressed: {
    backgroundColor: '#005D4F',
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
    padding: 10,
  },
  darkCardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkText: {
    fontSize: 18,
    color: '#AAAAAA',
    marginLeft: 10,
  },
  moneyValue: {
    fontSize: 50,
    color: '#00796B',
     textAlign: 'center'
  },
  darkMoneyValue: {
    fontSize: 50,
    color: '#4CAF50',
    marginTop: 0,
    textAlign: 'center'
  },
  darkPlaceholderGraph: {
    height: 100,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  darkBar: {
    color: '#4CAF50'
  },
  darkCalculateButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    marginTop: 25,
  },
});
