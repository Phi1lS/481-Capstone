import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, useColorScheme, TouchableOpacity } from 'react-native';
import { Title, Card, Avatar, ProgressBar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import marketData from '../../backend/MarketData.json';


export default function MarketPredictionsScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  // Validate and sanitize market data
  const closeData = Array.isArray(marketData)
    ? marketData.map((item) => (isNaN(parseFloat(item.close)) ? 0 : parseFloat(item.close)))
    : [0];
  const labels = Array.isArray(marketData)
    ? marketData.map((item) => (item.date ? new Date(item.date).toLocaleString('en-US', { month: 'short' }) : ''))
    : ['No Data'];

  const [showTextBox, setShowTextBox] = useState(false);
  const [marketSymbol, setMarketSymbol] = useState('');
  const [marketFunctions, setMarketFunctions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSymbolValid, setIsSymbolValid] = useState(false);


  // Construct data object for LineChart
  const data = {
    labels: isSymbolValid ? labels : ['No Data'],
    datasets: [
      {
        data: isSymbolValid ? closeData : [0],
        color: (opacity = 1) => (isSymbolValid ? `rgba(76, 175, 80, ${opacity})` : `rgba(255, 0, 0, ${opacity})`),
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) =>
      isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(51, 51, 51, ${opacity})`,
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

      const loadMarketData = async () => {
        try {
          const storedMarketData = await AsyncStorage.getItem('marketData');
          if (storedMarketData) {
            setMarketFunctions(JSON.parse(storedMarketData));
          }
        } catch (error) {
          console.error('Failed to load market data:', error);
        }
      };
    
      loadMarketData();
      loadMarketSymbol();
    }, []);

      const handleSymbolChange = async (newSymbol) => {
        try {
          const uppercasedSymbol = newSymbol.toUpperCase();
          setMarketSymbol(uppercasedSymbol);
          await AsyncStorage.setItem('marketSymbol', uppercasedSymbol); 
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
      setIsSymbolValid(false);
      return;
    }
  
    setLoading(true);
  
    try {
      // submit the market symbol to the backend
      const response = await fetch('http://10.0.0.176:3000/send-market-symbol', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ marketSymbol }),
      });
  
      if (!response.ok) {
        throw new Error();
      }
  
      const data = await response.json();
      alert(data.message);
  
      // fetch updated market data after submission
      const marketAlgorithmsResponse = await fetch('http://10.0.0.176:3000/data-algorithms');
      if (!marketAlgorithmsResponse.ok) {
        throw new Error('Failed to fetch market data');
      }
      const marketAlgorithms = await marketAlgorithmsResponse.json();
  
      // store the market data in AsyncStorage
      await AsyncStorage.setItem('marketData', JSON.stringify(marketAlgorithms));
  
      setMarketFunctions(marketAlgorithms);
      setIsSymbolValid(true);
    } catch (error) {
      // console.error('Error occurred:', error);
  
      if (error.message.includes('400')) {
        alert('Market symbol is required or invalid.');
      } else if (error.message.includes('404')) {
        if (error.message.includes('Market symbol not found')) {
          alert('Invalid market symbol. Please check and try again.');
        } else if (error.message.includes('No data found for the symbol')) {
          alert('No data found for the given market symbol.');
        }
      } else if (error.message.includes('429')) {
        alert('Too many requests. Please try again later.');
      } else if (error.message.includes('500')) {
        alert('An error occurred on the server. Please try again.');
      } else {
        alert('Failed to submit market symbol. Please try again later.');
      }
  
      setIsSymbolValid(false);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View>
      
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
  <Title style={isDarkMode ? styles.darkTitle : styles.title}>Market Predictions</Title>

  {/* Market Overview + Graph */}
  <Card style={isDarkMode ? styles.darkCard : styles.card}>
    <Card.Title
      title="Market Overview"
      left={(props) => <Avatar.Icon {...props} icon="trending-up" style={styles.icon} />}
      titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
    />
    <Text style={isDarkMode ? styles.darkStockSymbol : styles.stockSymbol}>
      {isSymbolValid ? `Viewing: ${marketSymbol}` : 'No symbol selected'}
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
          style={isDarkMode ? styles.darkPlaceholderText : styles.placeholderText}
          placeholder="Enter custom market symbol"
          value={marketSymbol}
          onChangeText={handleSymbolChange}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={isDarkMode ? styles.submitButtonDark : styles.submitButton}>Submit</Text>
        </TouchableOpacity>
      </View>
    )}
  </Card>

  {/* Market Predictions */}
  <Card style={isDarkMode ? styles.darkCard : styles.card}>
  <Card.Title
    title="Market Predictions"
    left={(props) => <Avatar.Icon {...props} icon="chart-timeline-variant-shimmer" style={styles.icon} />}
    titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
  />
  <View>
    {/* Conditional rendering for when marketSymbol is not loaded */}
    {isSymbolValid ? (
      <>
        <Text style={isDarkMode ? styles.darkMarketText : styles.marketText}>
          The market appears to be {marketFunctions?.marketTrend?.trend || 'unavailable'}.
        </Text>
        <Text style={isDarkMode ? styles.darkPredictionsText : styles.predictionsText}>
          First Open: ${marketFunctions?.marketTrend?.firstOpen?.toFixed(2) || 'N/A'}
        </Text>
        <Text style={isDarkMode ? styles.darkPredictionsText : styles.predictionsText}>
          Last Close: ${marketFunctions?.marketTrend?.lastClose?.toFixed(2) || 'N/A'}
        </Text>
        <Text style={isDarkMode ? styles.darkPredictionsText : styles.predictionsText}>
          Net Change: ${marketFunctions?.marketTrend?.netChange?.toFixed(2) || 'N/A'}
        </Text>
        <Text style={isDarkMode ? styles.darkPredictionsText : styles.predictionsText}>
          Regression Trend: {marketFunctions?.marketTrend?.trend || 'N/A'}
        </Text>
      </>
    ) : (
      <Text style={isDarkMode ? styles.darkMarketText : styles.marketText}>
        Market appears to be empty. Please enter a market symbol.
      </Text>
    )}
  </View>
</Card>
  
  {/* Monthly Changes */}
      {isSymbolValid ? (
      <Card style={isDarkMode ? styles.darkCard : styles.card}>
        <Card.Title
          title="Monthly Changes"
          left={(props) => <Avatar.Icon {...props} icon="calendar-today" style={styles.icon} />}
          titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
        />
        <View style={styles.changeTextContainer}>
          {marketFunctions?.monthlyPercentChanges.map((change, index) => {
            const fromMonth = new Date(change.from).toLocaleString('en-US', { month: 'long' });
            const toMonth = new Date(change.to).toLocaleString('en-US', { month: 'long' });
            
            return (
              <View key={index} style={styles.changeItem}>
                <Text style={[isDarkMode ? styles.darkText : styles.text, styles.dateText]}>
                  {fromMonth} - {toMonth}
                </Text>
                <Text
                  style={[
                    isDarkMode ? styles.darkText : styles.text,
                    styles.percentChangeText,
                    change.percentChange.startsWith('-') ? styles.percentChangeNegative : styles.percentChangePositive,
                  ]}
                >
                  {change.percentChange}%
                </Text>
              </View>
            );
          })}
        </View>
      </Card>
    ) : null}

  {/* Risk Analysis */}
  {isSymbolValid ? (
  <Card style={isDarkMode ? styles.darkCard : styles.card}>
    <Card.Title
      title="Risk Analysis"
      left={(props) => <Avatar.Icon {...props} icon="alert-circle" style={styles.icon} />}
      titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
    />
    <View style={styles.detailsContainer}>
      <View style={styles.progressBarContainer}>
        <Text style={isDarkMode ? styles.darkRiskText : styles.riskText}>
          Risk Level: {marketFunctions?.riskLevel}
        </Text>
        <ProgressBar
          progress={
            marketFunctions?.riskLevel === 'Low Risk' ? 0.25 : 
            marketFunctions?.riskLevel === 'Moderate Risk' ? 0.5 : 
            0.75
          }
          color={
            marketFunctions?.riskLevel === 'Low Risk' ? 'green' :
            marketFunctions?.riskLevel === 'Moderate Risk' ? 'yellow' :
            'red'
          }
          style={styles.progressBar}
        />
      </View>
      <View style={styles.progressBarContainer}>
        <Text style={isDarkMode ? styles.darkRiskText : styles.riskText}>
          Market Volatility: {marketFunctions?.standardDeviation.toFixed(2)}
        </Text>
      </View>
    </View>
  </Card>
  ) : null}


  { /* Removed investment opportunities and market sentiment */ }

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
  placeholderText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center'
  },
  predictionsText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 30,
    fontSize: 16, 
    fontWeight: 'bold'
  },
  riskText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center'
  },
  changeTextContainer: {
    padding: 5,
    marginBottom: -5
  },
  changeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, 
  },
  dateText: {
    flex: 1,  
    textAlign: 'left', 
  },
  percentChangeText: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
  percentChangeNegative: {
    color: 'red', 
  },
  percentChangePositive: {
    color: 'green',
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center'
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
  progressBar: {
    height: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButton: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
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
  submitButtonDark: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
      },
  darkStockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: -5,
    textAlign: 'center'
  },
  darkMarketText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  darkPlaceholderText: {
    fontSize: 18,
    color: '#AAAAAA',
    marginBottom: 15,
    textAlign: 'center'
  },
  darkPredictionsText: {
    textAlign: 'center',
    color: '#AAAAAA',
    marginTop: 30,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
  darkRiskText: {
    fontSize: 18,
    color: '#AAAAAA',
    marginBottom: 15,
    fontWeight: '600',
    textAlign: 'center'
  },
});
