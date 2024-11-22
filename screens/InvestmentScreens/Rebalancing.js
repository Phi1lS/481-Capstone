import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Platform } from 'react-native';
import { Title, Card, Avatar, Button, Modal } from 'react-native-paper';
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

  // Modal state
  const [isModalVisible, setModalVisible] = useState(false);
  const [liquidationList, setLiquidationList] = useState([]);

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

      // Calculate liquidation details
    const liquidationNeeded = calculateLiquidation();
    const liquidationItems = generateLiquidationList(liquidationNeeded);
    
    setLiquidationList(liquidationItems);

    setModalVisible(true);  // Show modal for confirmation
  };

  const handleConfirmRebalance = () => {
    console.log("Confirm rebalance");
    setAllocations({
      stocks: stockValueChange / 100,
      bonds: bondValueChange / 100,
      realEstate: realEstateValueChange / 100,
      cash: cashValueChange / 100,
    });
    setModalVisible(false);  // Close the modal after confirming
  };

  const handleCancelRebalance = () => {
    console.log("Cancel rebalance");
    setModalVisible(false);  // Close modal if canceled
  };

  const calculateLiquidation = () => {
    const assets = userProfile.assets || [];
    const totalValue = assets.reduce((total, asset) => total + (asset.value || 0), 0);

    // Calculate the target value for each asset category based on the new allocations
    const targetValues = {
      stocks: (stockValueChange / 100) * totalValue,
      bonds: (bondValueChange / 100) * totalValue,
      realEstate: (realEstateValueChange / 100) * totalValue,
      cash: (cashValueChange / 100) * totalValue,
    };

    // Determine how much needs to be liquidated for each category
    const liquidationNeeded = {
      stocks: targetValues.stocks - (allocations.stocks * totalValue),
      bonds: targetValues.bonds - (allocations.bonds * totalValue),
      realEstate: targetValues.realEstate - (allocations.realEstate * totalValue),
      cash: targetValues.cash - (allocations.cash * totalValue),
    };

    return liquidationNeeded;
  };

  const generateLiquidationList = (liquidationNeeded) => {
    const liquidationItems = [];

    if (liquidationNeeded.stocks < 0) {
      liquidationItems.push({
        type: 'Stocks',
        amount: Math.abs(liquidationNeeded.stocks),
      });
    }
    if (liquidationNeeded.bonds < 0) {
      liquidationItems.push({
        type: 'Bonds',
        amount: Math.abs(liquidationNeeded.bonds),
      });
    }
    if (liquidationNeeded.realEstate < 0) {
      liquidationItems.push({
        type: 'Real Estate',
        amount: Math.abs(liquidationNeeded.realEstate),
      });
    }
    if (liquidationNeeded.cash < 0) {
      liquidationItems.push({
        type: 'Cash',
        amount: Math.abs(liquidationNeeded.cash),
      });
    }

    return liquidationItems;
  };

  const renderProgressBar = (progress, color) => (
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
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
              maximumTrackTintColor="#B0BEC5"
              thumbTintColor="#004D40"
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
              maximumTrackTintColor="#B0BEC5"
              thumbTintColor="#00796B"
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
              maximumTrackTintColor="#B0BEC5"
              thumbTintColor="#004D40"
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
              maximumTrackTintColor="#B0BEC5"
              thumbTintColor="#00796B"
            />
          </View>

          {/* Rebalance Button */}
          <Button mode="contained" onPress={updateAllocations} style={styles.rebalanceButton}>
            Rebalance Now
          </Button>
        </Card>

        {/* Modal for confirmation */}
        <Modal visible={isModalVisible} onDismiss={handleCancelRebalance}>
          <Card style={isDarkMode ? styles.darkCard : styles.card}>
            <Card.Title title="Confirm Rebalance" />
            <Card.Content>
              <Text>Are you sure you want to apply these new allocations?</Text>
              {liquidationList.length > 0 && (
                <View>
                  <Text style={isDarkMode ? styles.darkText : styles.text}>Assets to Liquidate:</Text>
                  {liquidationList.map((item, index) => (
                    <Text key={index} style={isDarkMode ? styles.darkText : styles.text}>
                      {item.type}: ${item.amount.toFixed(2)}
                    </Text>
                  ))}
                </View>
              )}
            </Card.Content>
            <Card.Actions>
              <Button onPress={handleCancelRebalance}>Cancel</Button>
              <Button onPress={handleConfirmRebalance}>Confirm</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1A1A1A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  darkTitle: {
    color: '#fff',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  darkCard: {
    backgroundColor: '#2C2C2C',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkCardTitle: {
    color: '#fff',
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  slider: {
    width: '100%',
  },
  liquidationItem: {
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  button: {
    marginVertical: 8,
  },
  rebalanceButton: {
    marginTop: 16,
  },
  spacing: {
    marginTop: 8,
  },
  icon: {
    backgroundColor: '#00796B',
  },
});