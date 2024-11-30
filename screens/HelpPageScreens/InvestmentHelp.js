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
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Investment Overview</Title>
        <Text variant = "bodyMedium" style = {styles.generalText}> 
            The Investment page allows you to predict and analyze current market trends, Rebalance your portfolio to maintain the desired allocation,
            and distribute your assets across various investments.
        </Text>
      
      {/* Adding Income information Section */}
        <View>        
          <Text variant = "titleLarge" style = {[styles.generalText, {paddingLeft : 0, fontWeight: 'bold'}]}> 
            Adding Assets
          </Text>

          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            Pressing the green cog button on the 'Asset Allocation' page allows you to add an asset to your account.
            There are two ways to add an asset:
          </Text>
          <List.Section>
              <List.Item
                title="Manually, Via 'Add Your Own' option"
                left={props => <List.Icon icon = "chart-donut"/>}
              />
              <List.Item
                title="Adding from Incomes previously added in Real Estate's 'Income Tracking' page"
                left={props => <List.Icon icon = "chart-donut"/>}
              />
          </List.Section>
          <Text variant = "titleMedium" style = {[styles.generalText, {paddingLeft : 0, fontWeight: 'bold'}]}> 
            Adding Asset Manully
          </Text>
          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            Once on the 'Add Your Own' option, you must fill out these fields before adding your asset:
          </Text>
          <List.Section>
              <List.Item
                title = "Asset Name"
                titleStyle = {{fontWeight: 'bold'}}
                description="Your desired name for the asset."
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
              <List.Item
                title = "Asset Type"
                titleStyle = {{fontWeight: 'bold'}}
                description="The type the asset is categorized as."
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
              <List.Item
                title = "Value"
                titleStyle = {{fontWeight: 'bold'}}
                description="The amount of money the asset is worth."
                descriptionStyle = {{color: isDarkMode ? 'white' : 'black'}}
                left={props => <List.Icon icon = "chart-donut"/>}
              />
               
          </List.Section>

          <Text variant = "titleMedium" style = {[styles.generalText, {paddingLeft : 0, fontWeight: 'bold'}]}> 
            Adding from Income Tracking
          </Text>
          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            Once on the 'Add From Income' option, a list of incomes added from Real Estate's 'Income Tracking' page are shown.
          </Text>
          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            Clicking 'Select Asset Type' under an income will allow you to categorized that income for use as an asset.
            Clicking 'Modify Asset Type' will confirm and add that income as an asset.
          </Text>
        </View>  

      {/* Linking Bank Account Section */}
        <View>        
          <Text variant = "titleLarge" style = {[styles.generalText, {paddingLeft : 0, fontWeight: 'bold'}]}> 
            Rebalancing
          </Text>

          <Text variant = "bodyMedium" style = {[styles.generalText, {paddingBottom: 5}]}> 
            Rebalancing will allow you to adjust your portfolio to maintain the desired allocation.
          </Text>
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
