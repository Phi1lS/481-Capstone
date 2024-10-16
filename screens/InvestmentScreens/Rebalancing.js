import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Platform } from 'react-native';
import { Title, Card, Avatar, Button } from 'react-native-paper';
import { UserContext } from '../../UserContext'; // Import UserContext

export default function RebalancingScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { userProfile } = useContext(UserContext); // Get userProfile from context

  // Calculate asset allocations
  const calculateAllocations = () => {
    const assets = userProfile.assets || [];

    const totalValue = assets.reduce((total, asset) => total + (asset.value || 0), 0);
    const allocations = {
      stocks: 0,
      bonds: 0,
      realEstate: 0,
      cash: 0,
    };

    assets.forEach((asset) => {
      if (asset.assetType === 'stock') allocations.stocks += asset.value || 0;
      if (asset.assetType === 'bond') allocations.bonds += asset.value || 0;
      if (asset.assetType === 'realEstate') allocations.realEstate += asset.value || 0;
      if (asset.assetType === 'cash') allocations.cash += asset.value || 0;
    });

    // Calculate percentages
    return {
      stocks: (allocations.stocks / totalValue) || 0,
      bonds: (allocations.bonds / totalValue) || 0,
      realEstate: (allocations.realEstate / totalValue) || 0,
      cash: (allocations.cash / totalValue) || 0,
    };
  };

  const allocations = calculateAllocations();

  const renderProgressBar = (progress, color) => (
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  );

  return (
    <View>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Rebalancing</Title>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Current Portfolio"
            left={(props) => <Avatar.Icon {...props} icon="wallet-outline" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.detailsContainer}>
            <View style={styles.progressBarContainer}>
              <Text style={isDarkMode ? styles.darkText : styles.text}>Stocks</Text>
              <Text style={isDarkMode ? styles.darkText : styles.text}>{(allocations.stocks * 100).toFixed(2)}%</Text>
            </View>
            {renderProgressBar(allocations.stocks, '#00796B')}

            <View style={[styles.progressBarContainer, styles.spacing]}>
              <Text style={isDarkMode ? styles.darkText : styles.text}>Bonds</Text>
              <Text style={isDarkMode ? styles.darkText : styles.text}>{(allocations.bonds * 100).toFixed(2)}%</Text>
            </View>
            {renderProgressBar(allocations.bonds, '#004D40')}

            <View style={[styles.progressBarContainer, styles.spacing]}>
              <Text style={isDarkMode ? styles.darkText : styles.text}>Real Estate</Text>
              <Text style={isDarkMode ? styles.darkText : styles.text}>{(allocations.realEstate * 100).toFixed(2)}%</Text>
            </View>
            {renderProgressBar(allocations.realEstate, '#B2DFDB')}

            <View style={[styles.progressBarContainer, styles.spacing]}>
              <Text style={isDarkMode ? styles.darkText : styles.text}>Cash</Text>
              <Text style={isDarkMode ? styles.darkText : styles.text}>{(allocations.cash * 100).toFixed(2)}%</Text>
            </View>
            {renderProgressBar(allocations.cash, '#4CAF50')}
          </View>
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Rebalance Your Portfolio"
            left={(props) => <Avatar.Icon {...props} icon="swap-horizontal" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              Adjust your investments to maintain your desired asset allocation.
            </Text>

            <Button
              mode="contained"
              onPress={() => console.log('Rebalance Action')}
              style={styles.rebalanceButton}
              labelStyle={styles.buttonLabel}
            >
              Rebalance Now
            </Button>
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
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 15,
        elevation: 10,
      }
    }),
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
    marginTop: 15,
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacing: {
    marginTop: 20, // Added margin to increase space between progress bars
  },
  progressBarBackground: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 7,
    overflow: 'hidden',
    width: '65%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 7,
  },
  text: {
    fontSize: 19,
    color: '#555',
  },
  rebalanceButton: {
    backgroundColor: '#00796B',
    padding: 14,
    borderRadius: 8,
    marginTop: 25,
  },
  rebalanceButtonPressed: {
    backgroundColor: '#005D4F',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  darkCard: {
    marginBottom: 25,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 15,
        elevation: 10,
      }
    }),
    padding: 25,
  },
  darkCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkText: {
    fontSize: 19,
    color: '#AAAAAA',
  },
});

