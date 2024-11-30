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
    <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
      <View>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Retirement Overview</Title>
        <Text variant = "bodyMedium" style = {styles.generalText}> 
            The Retiremnt page allows you to rebalance your portfolio and set goals for your retirement.
        </Text>
      
      {/* Adding Income information Section */}
        <View>        
          <Text variant = "titleLarge" style = {[styles.generalText, {paddingLeft : 0, fontWeight: 'bold'}]}> 
            Rebalancing Your Portfolio
          </Text>

          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            The 'Portfolio Rebalancing' page will allow you to adjust your portfolio to achieve your optimal retirement.
          </Text>

        </View>  

      {/* Linking Bank Account Section */}
        <View>        
          <Text variant = "titleLarge" style = {[styles.generalText, {paddingLeft : 0, fontWeight: 'bold'}]}> 
            Updating retirement goal
          </Text>

          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            The 'Retirement Savings' section of Retirement allows you to set up a retirement goal you would like to reach.
          </Text>
          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            Pressing the 'Update Goal' text will bring up a prompt where you can put the amount you would like to set for your goal.
          </Text>

          <Card style={[isDarkMode ? styles.darkCard : styles.card]}>
          
          <Text variant = "labelLarge" 
          style = {[styles.generalText, {paddingBottom: 5, color: isDarkMode ? '#E0E0E0' : 'gray'}]}
          > 
          
            Adding progress to your retirement goal requires you to set the type of income added (On Income Tracking in Real Estate Page) from 'Income' to 'Savings'.
          </Text>
        </Card>

          <Text variant = "titleMedium" style = {[styles.generalText, {paddingLeft : 0, fontWeight: 'bold'}]}> 
            Using Savings Calculator
          </Text>
          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            The savings calculator allows you to experiment with different values to see different amounts of saving goals to
            further help you choose the right amount for you.
          </Text>

          <List.Section>
              <List.Item
                title = "Age"
                titleStyle = {{fontWeight: 'bold'}}
                description="Planned age of retirement"
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
              <List.Item
                title = "Life Expectancy"
                titleStyle = {{fontWeight: 'bold'}}
                description="Estimated Lifespan"
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
              <List.Item
                title = "Annual Contributions"
                titleStyle = {{fontWeight: 'bold'}}
                description="The amount of income earned a year"
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
               <List.Item
                title = "Rate of Return"
                titleStyle = {{fontWeight: 'bold'}}
                description="Annual return rate expected on retirement investments (Usually between 4-7%)"
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
              <List.Item
                title = "Replacement Rate"
                titleStyle = {{fontWeight: 'bold'}}
                description="Percentage of your current income you'll need in retirement (Usually around 70-80%)"
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
          </List.Section>
          <Card style={[isDarkMode ? styles.darkCard : styles.card]}>
          
          <Text variant = "labelLarge" 
          style = {[styles.generalText, {paddingBottom: 5, color: isDarkMode ? '#E0E0E0' : 'gray'}]}
          > 
          
           Savings Calculator uses an under the hood forumla that involves inflation rate which is set to 2.4% for US inflation rate.
          </Text>
        </Card>
         
        </View>
      </View>
    </ScrollView>
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
