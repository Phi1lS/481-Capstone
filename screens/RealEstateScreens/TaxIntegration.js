import React from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Card, Avatar } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import Slider from '@react-native-community/slider';

export default function TaxIntegrationScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const data = [
    { name: 'Stocks', population: 60, color: '#00796B', legendFontColor: '#00796B', legendFontSize: 15 },
    { name: 'Bonds', population: 20, color: '#004D40', legendFontColor: '#004D40', legendFontSize: 15 },
    { name: 'Real Estate', population: 10, color: '#B2DFDB', legendFontColor: '#B2DFDB', legendFontSize: 15 },
    { name: 'Cash', population: 10, color: '#4CAF50', legendFontColor: '#4CAF50', legendFontSize: 15 },
  ];

  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Tax Integration</Title>
        {/*<Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Current Allocation"
            left={(props) => <Avatar.Icon {...props} icon="chart-pie" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <PieChart
            data={data}
            width={300}
            height={220}
            chartConfig={{
              backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: isDarkMode ? '#FFFFFF' : '#333',
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card>*/}
        
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Income"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
         <Text style={isDarkMode ? styles.darkText : styles.text}>$XXX,XXX</Text>
            </View> 

            </Card>
            <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Notifications"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
         <Text style={isDarkMode ? styles.darkText : styles.text}>XXXXXX</Text>
            </View> 
            </Card>

    
          
            <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Expence"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
         <Text style={isDarkMode ? styles.darkText : styles.text}>$XXX,XXX</Text>
            </View> 
            </Card>


         
            <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Lease Tracking"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
         <Text style={isDarkMode ? styles.darkText : styles.text}>XXXXXX</Text>
            </View> 
            </Card>

          
            <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Connect to tax software"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
         <Text style={isDarkMode ? styles.darkText : styles.text}>XXXXXX</Text>
            </View> 
            </Card>
          {/*<View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Stocks: 60%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={60}
              minimumTrackTintColor="#00796B"
              maximumTrackTintColor="#000000"
            />
          </View>
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Bonds: 20%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={20}
              minimumTrackTintColor="#004D40"
              maximumTrackTintColor="#000000"
            />
          </View> */}
          {/* Add more sliders for other asset classes */}
        
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
});
