import React from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme } from 'react-native';
import { Title, Card, Avatar, ProgressBar } from 'react-native-paper';
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
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Market Predictions</Title>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Market Overview"
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

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Recent Predictions"
            left={(props) => <Avatar.Icon {...props} icon="calendar-today" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Stock Market: +5% in the next quarter</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Real Estate: Steady growth expected</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Bonds: Lower returns predicted</Text>
          </View>
        </Card>

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

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
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
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
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
        </Card>
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
});
