import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, useColorScheme, TouchableOpacity } from 'react-native';
import { Title, Card, Avatar, ProgressBar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import marketData from '../../backend/MarketData.json';


export default function MarketPredictionsScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const closeData = marketData?.map(item => item.close) || [];
  const labels = marketData?.map(item => new Date(item.date).toLocaleString('en-US', { month: 'short' })) || [];

  const [showTextBox, setShowTextBox] = useState(false);
  const [marketSymbol, setMarketSymbol] = useState('');

  const [monthlyChanges, setMonthlyChanges] = useState([]);
  const [volatility, setVolatility] = useState(null);
  const [riskLevel, setRiskLevel] = useState('');
  const [error, setError] = useState(null);

  const data = {
    labels: labels,
    datasets: [
      {
        data: closeData,
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

    useEffect(() => {
      const loadMarketSymbol = async () => {
        try {
          const storedSymbol = await AsyncStorage.getItem('marketSymbol');
          if (storedSymbol) {
            setMarketSymbol(storedSymbol);
          }
        } catch (error) {
          console.error('Failed to load market symbol:', error);
        }
      };

      loadMarketSymbol();
      // fetchMarketData(true, true, true);
    }, []);

      const handleSymbolChange = async (newSymbol) => {
        try {
          setMarketSymbol(newSymbol);
          await AsyncStorage.setItem('marketSymbol', newSymbol); 
            } catch (error) {
          console.error('Failed to save market symbol:', error);
        }
      };
      
      const toggleTextBox = () => {
        setShowTextBox(!showTextBox);
      };

  {/* Handle Submit Function - Button */}
  {/* This function manages market symbols. */}
    const handleSubmit = async () => {
      if (!marketSymbol) {
        alert('Please enter a market symbol.');
        return;
      }
    
      try {
        const response = await fetch('http://192.168.1.236:3000/send-market-symbol', {
          method: 'POST',
          headers: {
            'Accept':'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ marketSymbol }), // Send the marketSymbol
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json(); // Parse the JSON response
        alert(data.message); // Show the success message
      } catch (error) {
        console.error('Error occurred:', error);
        alert('Failed to submit market symbol. Please check the backend or network connection.');
      }
    };

     
  const fetchMarketData = async (includeMonthly, includeVolatility, includeRiskLevel) => {
    try {
      const queryParams = new URLSearchParams({
        includeMonthly: includeMonthly ? 'true' : 'false',
        includeVolatility: includeVolatility ? 'true' : 'false',
        includeRiskLevel: includeRiskLevel ? 'true' : 'false'
      }).toString();

      const response = await fetch(`http://192.168.1.236:3000/get-market-data?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      const data = await response.json();
      setMonthlyChanges(data.monthlyPercentChanges || []);
      setVolatility(data.volatility || null);
      setRiskLevel(data.riskLevel || '');
    } catch (error) {
      setError(error.message);
    }
  };
   
  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Market Predictions</Title>

        { /* Market Overview + Graph */ }
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Market Overview"
            left={(props) => <Avatar.Icon {...props} icon="trending-up" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <Text style={isDarkMode ? styles.darkStockSymbol : styles.stockSymbol}>
            {marketSymbol ? `Viewing: ${marketSymbol}` : 'No symbol selected'}
          </Text>
        <TouchableOpacity onPress={toggleTextBox}>
          <View style={styles.chartContainer}>
            <LineChart
              data={data}
              width={320}
              height={240}
              chartConfig={chartConfig}
              style={{ marginVertical: 30 }}
              bezier
            />
          </View>
        </TouchableOpacity>

          {showTextBox && (
            <View style={styles.textBoxContainer} pointerEvents="auto">
              <TextInput
                style={styles.text}
                placeholder="Enter custom market symbol"
                value={marketSymbol}
                onChangeText={handleSymbolChange}
              />
              <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.submitButton}>Submit</Text>
        </TouchableOpacity>
      </View>
            )}
        </Card>

          { /* Market Predictions */ }
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <View>
            <Text style={isDarkMode ? styles.darkMarketText : styles.marketText}>The market appears to be net increasing.</Text>
          </View>
        </Card>

        {/* Monthly Changes */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Monthly Changes"
            left={(props) => <Avatar.Icon {...props} icon="calendar-today" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Stock Market: +5% in the next quarter</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Real Estate: Steady growth expected</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Bonds: Lower returns predicted</Text>
          </View>
        </Card>

          {/* Risk Analysis */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Risk Analysis"
            left={(props) => <Avatar.Icon {...props} icon="alert-circle" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.detailsContainer}>
            <View style={styles.progressBarContainer}>
              <Text style={isDarkMode ? styles.darkText : styles.text}>Risk Level: Moderate</Text>
              <ProgressBar progress={0.5} color={isDarkMode ? '#76FF03' : '#00796B'} style={styles.progressBar} />
            </View>
            <View style={styles.progressBarContainer}>
              <Text style={isDarkMode ? styles.darkText : styles.text}>Market Volatility: High</Text>
              <ProgressBar progress={0.8} color={isDarkMode ? '#FF3D00' : '#D32F2F'} style={styles.progressBar} />
            </View>
          </View>
        </Card>

        {/* <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Investment Opportunities"
            left={(props) => <Avatar.Icon {...props} icon="finance" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
            titleNumberOfLines={2} // Allow the title to wrap to a second line if necessary
          />
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              Explore emerging sectors and trends that may offer significant growth potential:
            </Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              • Technology: AI and machine learning companies are seeing rapid growth.
            </Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              • Renewable Energy: Increased investments in solar and wind energy.
            </Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              • Healthcare: Biotech firms are at the forefront of innovation.
            </Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              • International Markets: Emerging markets are providing high return opportunities.
            </Text>
          </View>
        </Card> */}

        {/* <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Market Sentiment"
            left={(props) => <Avatar.Icon {...props} icon="emoticon-happy-outline" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.detailsContainer}>
            <View style={styles.progressBarContainer}>
              <Text style={isDarkMode ? styles.darkText : styles.text}>Sentiment: Optimistic</Text>
              <ProgressBar progress={0.8} color={isDarkMode ? '#FFD600' : '#FFC107'} style={styles.progressBar} />
            </View>
          </View>
        </Card> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: '#f7f9fc',
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
    padding: 25,
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
    padding: 25,
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
  submitButton: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
      },
  darkStockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: -5,
    textAlign: 'center'
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  marketText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  darkMarketText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center'
  }
});
