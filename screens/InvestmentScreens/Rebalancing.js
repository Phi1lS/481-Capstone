import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Platform } from 'react-native';
import { Title, Card, Avatar, Button } from 'react-native-paper';
import { UserContext } from '../../UserContext'; // Import UserContext
import Slider from '@react-native-community/slider';

export default function RebalancingScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { userProfile } = useContext(UserContext); // Get userProfile from context

  // Initial allocation calculations based on current assets
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

    // Calculate percentages based on total value
    return {
      stocks: (allocations.stocks / totalValue) || 0,
      bonds: (allocations.bonds / totalValue) || 0,
      realEstate: (allocations.realEstate / totalValue) || 0,
      cash: (allocations.cash / totalValue) || 0,
    };
  };

  const [allocations, setAllocations] = useState(calculateAllocations());

  // State for sliders
  const [stockValueChange, setStockValueChange] = useState(allocations.stocks * 100);
  const [bondValueChange, setBondValueChange] = useState(allocations.bonds * 100);
  const [realEstateValueChange, setRealEstateValueChange] = useState(allocations.realEstate * 100);
  const [cashValueChange, setCashValueChange] = useState(allocations.cash * 100);

  // Ensure the sum of all allocations doesn't exceed 100%
  const remainingPercent = (currentAllocation) => {
    const total = 100 - currentAllocation;
    return total < 0 ? 0 : total;
  };

  // Calculate and update the allocations based on slider values
  const updateAllocations = () => {
    const totalPercent = stockValueChange + bondValueChange + realEstateValueChange + cashValueChange;
    if (totalPercent > 100) {
      alert("Total allocation cannot exceed 100%");
      return;
    }
    
    setAllocations({
      stocks: stockValueChange / 100,
      bonds: bondValueChange / 100,
      realEstate: realEstateValueChange / 100,
      cash: cashValueChange / 100,
    });
  };

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
          
          {/* Stocks Slider */}
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Stocks: {Math.floor(stockValueChange)}%</Text>
            <Slider
              style={styles.slider}
              value={stockValueChange}
              onValueChange={(value) => setStockValueChange(value)}
              minimumValue={0}
              maximumValue={remainingPercent(bondValueChange + realEstateValueChange + cashValueChange)}
              step={1}
              minimumTrackTintColor="#00796B"
              maximumTrackTintColor="#000000"
            />
          </View>

          {/* Bonds Slider */}
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Bonds: {Math.floor(bondValueChange)}%</Text>
            <Slider
              style={styles.slider}
              value={bondValueChange}
              onValueChange={(value) => setBondValueChange(value)}
              minimumValue={0}
              maximumValue={remainingPercent(stockValueChange + realEstateValueChange + cashValueChange)}
              step={1}
              minimumTrackTintColor="#004D40"
              maximumTrackTintColor="#000000"
            />
          </View>

          {/* Real Estate Slider */}
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Real Estate: {Math.floor(realEstateValueChange)}%</Text>
            <Slider
              style={styles.slider}
              value={realEstateValueChange}
              onValueChange={(value) => setRealEstateValueChange(value)}
              minimumValue={0}
              maximumValue={remainingPercent(stockValueChange + bondValueChange + cashValueChange)}
              step={1}
              minimumTrackTintColor="#B2DFDB"
              maximumTrackTintColor="#000000"
            />
          </View>

          {/* Cash Slider */}
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Cash: {Math.floor(cashValueChange)}%</Text>
            <Slider
              style={styles.slider}
              value={cashValueChange}
              onValueChange={(value) => setCashValueChange(value)}
              minimumValue={0}
              maximumValue={remainingPercent(stockValueChange + bondValueChange + realEstateValueChange)}
              step={1}
              minimumTrackTintColor="#4CAF50"
              maximumTrackTintColor="#000000"
            />
          </View>
          
          <View style={styles.detailsContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>
              Adjust your investments to maintain your desired asset allocation.
            </Text>

            <Button
              mode="contained"
              onPress={updateAllocations}
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#004D40',
    margin: 15,
  },
  darkTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#B2DFDB',
    margin: 15,
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 10,
  },
  darkCard: {
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    elevation: 10,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
  },
  progressBarFill: {
    height: 10,
    borderRadius: 5,
  },
  icon: {
    backgroundColor: '#004D40',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  darkText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  sliderContainer: {
    marginBottom: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  detailsContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacing: {
    marginTop: 10,
  },
  rebalanceButton: {
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 8,
    backgroundColor: '#00796B',
  },
  buttonLabel: {
    fontSize: 16,
  },
});
