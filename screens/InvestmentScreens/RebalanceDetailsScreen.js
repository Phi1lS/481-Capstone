import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { UserContext } from '../../UserContext';

export default function RebalanceDetailsScreen({ route }) {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  // Retrieve slider values from navigation parameters
  const { stockValue, bondValue, realEstateValue, cashValue } = route.params;

  const { userProfile } = useContext(UserContext);

  const portfolioValue = userProfile.assets.reduce((total, asset) => total + asset.value, 0);

  const calculateDollarAmount = (percent) =>
    parseFloat(((percent / 100) * portfolioValue).toFixed(2)).toLocaleString();

  const translateCategory = (category) => {
    switch (category) {
      case 'stock':
        return 'Stocks';
      case 'bond':
        return 'Bonds';
      case 'realEstate':
        return 'Real Estate';
      case 'cash':
        return 'Cash';
      default:
        return 'Unknown';
    }
  };

  const requiredAllocations = [
    { label: 'Stocks', value: calculateDollarAmount(stockValue), category: 'stock' },
    { label: 'Bonds', value: calculateDollarAmount(bondValue), category: 'bond' },
    { label: 'Real Estate', value: calculateDollarAmount(realEstateValue), category: 'realEstate' },
    { label: 'Cash', value: calculateDollarAmount(cashValue), category: 'cash' },
  ];

  // Determine the specific assets to be liquidated to reach the desired allocation
  const assetsToLiquidate = requiredAllocations.flatMap((allocation) => {
    const currentAssets = userProfile.assets.filter((asset) => asset.assetType === allocation.category);
    const totalValueInCategory = currentAssets.reduce((total, asset) => total + asset.value, 0);
    const requiredValue = parseFloat(allocation.value.replace(/,/g, ''));

    if (totalValueInCategory > requiredValue) {
      let excessValue = totalValueInCategory - requiredValue;
      const assetsToSell = [];

      for (const asset of currentAssets.sort((a, b) => b.value - a.value)) {
        if (excessValue <= 0) break;
        if (asset.value <= excessValue) {
          assetsToSell.push(asset);
          excessValue -= asset.value;
        } else {
          // Partially sell this asset to cover the remaining excess
          assetsToSell.push({
            ...asset,
            value: excessValue,
            partiallySold: true, // Indicate this is a partial liquidation
          });
          break;
        }
      }
      return assetsToSell;
    }
    return [];
  });

  return (
    <ScrollView style={isDarkMode ? styles.darkContainer : styles.container}>
      <Text style={isDarkMode ? styles.darkHeader : styles.header}>
        Portfolio Rebalancing Details
      </Text>

      <Text style={isDarkMode ? styles.darkSubHeader : styles.subHeader}>
        In order for your portfolio to have your desired allocation, you should have:
      </Text>

      <View style={styles.bulletList}>
        {requiredAllocations.map((item, index) => (
          <Text key={index} style={isDarkMode ? styles.darkBulletItem : styles.bulletItem}>
            • {item.label}: ${item.value}
          </Text>
        ))}
      </View>

      <Text style={isDarkMode ? styles.darkSectionHeader : styles.sectionHeader}>
        Assets to be Liquidated
      </Text>

      {assetsToLiquidate.length > 0 ? (
        assetsToLiquidate.map((asset, index) => (
          <View key={index} style={isDarkMode ? styles.darkAssetCard : styles.assetCard}>
            <View style={styles.assetCardContent}>
              <Text style={isDarkMode ? styles.darkAssetName : styles.assetName}>
                {asset.assetName}
              </Text>
              <Text style={isDarkMode ? styles.darkAssetType : styles.assetType}>
                {translateCategory(asset.assetType)} {asset.partiallySold ? '(Partial)' : ''}
              </Text>
            </View>
            <Text style={isDarkMode ? styles.darkAssetValue : styles.assetValue}>
              ${asset.value.toLocaleString()}
            </Text>
          </View>
        ))
      ) : (
        <Text style={isDarkMode ? styles.darkAssetText : styles.assetText}>
          No assets need to be liquidated.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  bulletList: {
    marginBottom: 20,
  },
  bulletItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  assetCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetCardContent: {
    flexDirection: 'column',
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  assetType: {
    fontSize: 14,
    color: '#555',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796B',
  },
  // Dark mode styles
  darkContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  darkHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  darkSubHeader: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  darkBulletItem: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 5,
  },
  darkSectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  darkAssetCard: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkAssetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkAssetType: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  darkAssetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});