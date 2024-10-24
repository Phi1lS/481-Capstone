import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Dimensions } from 'react-native';
import { Title, Card, Avatar, Button, Pressable } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import Slider from '@react-native-community/slider';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function InvestmentAnalyticsScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  // Get screen width to make the chart fit the screen properly
  const screenWidth = Dimensions.get('window').width;

  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };
  const buttonPressed = () => {
    setStockValue(stockValueChange);
    setBondValue(bondValueChange);
    setCashValue(cashValueChange);
    setRealEstateValue(realEstateValueChange);

    console.log('Rebalance Action')
  }

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

  //information for allocation (used by piechart and sliders)
  const [stockValue, setStockValue] = useState(25);
  const [bondValue, setBondValue] = useState(25);
  const [realEstateValue, setRealEstateValue] = useState(25);
  const [cashValue, setCashValue] = useState(25);

  const [stockValueChange, setStockValueChange] = useState(25);
  const [bondValueChange, setBondValueChange] = useState(25);
  const [realEstateValueChange, setRealEstateValueChange] = useState(25);
  const [cashValueChange, setCashValueChange] = useState(25);

  const sliderTotal = stockValueChange + bondValueChange + realEstateValueChange + cashValueChange;

  //used to calcuate remaining percentage left to allocate
  const remainingPerent = (sliderValue) => {
    const remainingPercent = 100 - (sliderTotal - sliderValue);
    return Math.max(0, remainingPercent);
  }

  //information for the piechart
  const pieChartData = [
    { name: '% Stocks', population: stockValue, color: '#00796B', legendFontColor: '#00796B', legendFontSize: 15 },
    { name: '% Bonds', population: bondValue, color: '#004D40', legendFontColor: '#004D40', legendFontSize: 15 },
    { name: '% Real Estate', population: realEstateValue, color: '#B2DFDB', legendFontColor: '#B2DFDB', legendFontSize: 15 },
    { name: '% Cash', population: cashValue, color: '#4CAF50', legendFontColor: '#4CAF50', legendFontSize: 15 },
  ];
  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Portfolio Rebalancing</Title>

        {/* Card for piechart*/}     
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Portfolio Overview"
            left={(props) => <Avatar.Icon {...props} icon="chart-pie" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <PieChart
            data={pieChartData}
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
        </Card>

        {/* Card for sliders*/} 
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Adjust Allocation"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Stocks: {Math.floor(stockValueChange)}%</Text>
            <Slider
              style={styles.slider}
             
              value={stockValueChange} 
              onValueChange={(value) => setStockValueChange(value)} 
              minimumValue={0}
              maximumValue={remainingPerent(stockValue)}
              step={1}
              minimumTrackTintColor="#00796B"
              maximumTrackTintColor="#000000"
            />
          </View>
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Bonds: {Math.floor(bondValueChange)}%</Text>
            <Slider
              style={styles.slider}
              
              value={bondValueChange} 
              onValueChange={(value) => setBondValueChange(value)} 
              minimumValue={0}
              maximumValue={remainingPerent(bondValueChange)}
              step={1}
              
              minimumTrackTintColor="#004D40"
              maximumTrackTintColor="#000000"
            />
          </View>
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Real Estate: {Math.floor(realEstateValueChange)}%</Text>
            <Slider
              style={styles.slider}

              value={realEstateValueChange} 
              onValueChange={(value) => setRealEstateValueChange(value)} 
              minimumValue={0}
              maximumValue={remainingPerent(realEstateValueChange)}
              step={1}
              
              minimumTrackTintColor="#004D40"
              maximumTrackTintColor="#000000"
            />
          </View>
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Cash: {Math.floor(cashValueChange)}%</Text>
            <Slider
              style={styles.slider}
             
              value={cashValueChange} 
              onValueChange={(value) => setCashValueChange(value)} 
              minimumValue={0}
              maximumValue={remainingPerent(cashValueChange)}
              step={1}
             
              minimumTrackTintColor="#004D40"
              maximumTrackTintColor="#000000"
            />
          </View>

          {/* Button for rebalancing */}
          <Button
              mode="contained"
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => buttonPressed()}
              style={[
                styles.rebalanceButton,
                isPressed && styles.rebalanceButtonPressed,
              ]}
              labelStyle={styles.buttonLabel}
            >
              Rebalance Now
            </Button>
          {/* Add more sliders for other asset classes */}
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
  rebalanceButton: {
    backgroundColor: '#00796B',
    padding: 14,
    borderRadius: 8,
    marginTop: 25,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
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
