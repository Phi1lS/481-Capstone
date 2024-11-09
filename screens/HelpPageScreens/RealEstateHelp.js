import React from 'react';
import { View, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { Title, Card, Avatar, ProgressBar, Paragraph, Text, List} from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

export default function MarketPredictionsScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        data: [30, 40, 35, 70, 85, 90, 95, 100],
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
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Real Estate Overview</Title>
        <Text variant = "bodyMedium" style = {styles.generalText}> 
            The Real Estate page allows you to manage your properties and finances with features that let you
            monitor and manage incomes and expenses, view and track your current lease agreements and tax integration.
        </Text>
      
      {/* Adding Income information Section */}
        <View>        
          <Text variant = "titleLarge" style = {[styles.generalText, {paddingLeft : 0, fontWeight: 'bold'}]}> 
            Adding Incomes/Expenses
          </Text>

          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            Pressing the green plus button on the income/expense page allows you to add an income/expense to your account.
            There are two ways to add an income or expense:
          </Text>
          <List.Section>
              <List.Item
                title="Manually, Via 'Add Your Own' option"
                left={props => <List.Icon icon = "chart-donut"/>}
              />
              <List.Item
                title="Automatically through your indicated bank"
                left={props => <List.Icon icon = "chart-donut"/>}
              />
          </List.Section>
          <Text variant = "titleMedium" style = {[styles.generalText, {paddingLeft : 0, fontWeight: 'bold'}]}> 
            Adding Income/Expense Manually
          </Text>
          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            Once on the 'Add Your Own' option, you must fill out these fields before adding your income/expense:
          </Text>
          <List.Section>
              <List.Item
                title = "Name"
                titleStyle = {{fontWeight: 'bold'}}
                description="Your desired name for the income/expense."
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
              <List.Item
                title = "Category"
                titleStyle = {{fontWeight: 'bold'}}
                description="The type of income/expense being added."
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
              <List.Item
                title = "Income Per Month (For Income)"
                titleStyle = {{fontWeight: 'bold', color: '#4CAF50'}}
                description="The amount of money the income is per month."
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
               <List.Item
                title = "Amount (For Expense)"
                titleStyle = {{fontWeight: 'bold', color: 'red'}}
                description="The amount of money the expense is."
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
          </List.Section>

          <Card style={[isDarkMode ? styles.darkCard : styles.card]}>
          
          <Text variant = "labelLarge" 
          style = {[styles.generalText, {paddingBottom: 5, color: isDarkMode ? '#E0E0E0' : 'gray'}]}
          > 
          
            Income and Expense transactions are categorized by their <Text style={{fontWeight: 'bold', color: isDarkMode ? '#E0E0E0' : 'gray'}}>'Category'</Text> option.
            Once added, the tranaction will be Automatically categorized. The transaction can 
            be recategorized at any time and all transactions of the same name will be recategorized.
          </Text>
        </Card>
        </View>  

      {/* Linking Bank Account Section */}
        <View>        
          <Text variant = "titleLarge" style = {[styles.generalText, {paddingLeft : 0, fontWeight: 'bold'}]}> 
            Linking Bank Account
          </Text>

          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            Random Text... Will be filled with information on how to link bank account later on.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  generalText:{
    padding: 10,
    marginBottom: 5,
    //backgroundColor: '#f7f9fc',
  },
  container: {
    flexGrow: 1,
    padding: 25,
    //backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
  },
  card: {
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderRadius: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginTop: 20,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginBottom: 15,
  },
  progressBar: {
    height: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  // Dark mode styles
  darkContainer: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: '#121212',
  },
  darkTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 25,
  },
  darkCard: {
    marginBottom: 30,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 10,
    padding: 5,
  },
  darkCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkText: {
    fontSize: 18,
    color: '#AAAAAA',
    marginBottom: 15,
  },
  progressBar: {
    height: 12,
    borderRadius: 5,
    marginTop: 10,
  },
});
