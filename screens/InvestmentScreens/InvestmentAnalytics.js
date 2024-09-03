import React from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Card, Avatar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function InvestmentAnalyticsScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  // Get screen width to make the chart fit the screen properly
  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 65, 78],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green color for the line
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
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Investment Analytics</Title>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Performance Over Time"
            left={(props) => <Avatar.Icon {...props} icon="chart-line" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={{ alignItems: 'center' }}>
            <LineChart
              data={data}
              width={screenWidth - 40}  // Subtracting 40 to account for padding on each side
              height={220}
              chartConfig={chartConfig}
              style={{ marginVertical: 20, borderRadius: 16 }}
              bezier
            />
          </View>
        </Card>
        
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Detailed Analytics"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.detailsContainer}>
            <View style={styles.analyticsRow}>
              <MaterialCommunityIcons
                name="arrow-up-bold-circle"
                size={28}
                color={isDarkMode ? '#76FF03' : '#00796B'}
              />
              <Text style={isDarkMode ? styles.darkText : styles.text}>Total Return: 15%</Text>
            </View>
            <View style={styles.analyticsRow}>
              <MaterialCommunityIcons
                name="arrow-down-bold-circle"
                size={28}
                color={isDarkMode ? '#FF3D00' : '#D32F2F'}
              />
              <Text style={isDarkMode ? styles.darkText : styles.text}>Volatility: 8%</Text>
            </View>
            {/* Add more analytics rows as needed */}
          </View>
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
  detailsContainer: {
    marginTop: 20,
  },
  analyticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginLeft: 10,
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
  analyticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  darkText: {
    fontSize: 18,
    color: '#AAAAAA',
    marginLeft: 10,
  },
});
