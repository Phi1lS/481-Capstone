import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Alert, TouchableOpacity } from 'react-native';
import { Title, Card, Avatar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import Slider from '@react-native-community/slider';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { UserContext } from '../../UserContext'; // Ensure you have the UserContext imported
import { db, auth } from '../../firebaseConfig';

export default function AssetAllocationScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { userProfile } = useContext(UserContext);
  const [assets, setAssets] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAssets = () => {
      const userAssets = userProfile.assets || [];
      setAssets(userAssets);
    };

    fetchAssets();
  }, [userProfile]);

  const handleDeleteAsset = async (assetId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this asset?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'assets', assetId));
              setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
              // console.log('Asset deleted successfully');
            } catch (error) {
              console.error('Error deleting asset:', error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const translateType = (type) => {
    switch (type) {
      case 'stock':
        return 'Stocks';
      case 'bond':
        return 'Bonds';
      case 'realEstate':
        return 'Real Estate';
      case 'cash':
        return 'Cash';
      default:
        return 'None';
    }
  };

  // Function to format numbers with commas
  const formatValue = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const allocationData = [
    { name: 'Stocks', population: assets.filter(asset => asset.assetType === 'stock').reduce((total, asset) => total + (asset.value || 0), 0), color: '#00796B', legendFontSize: 11 },
    { name: 'Bonds', population: assets.filter(asset => asset.assetType === 'bond').reduce((total, asset) => total + (asset.value || 0), 0), color: '#004D40', legendFontSize: 11 },
    { name: 'Real Estate', population: assets.filter(asset => asset.assetType === 'realEstate').reduce((total, asset) => total + (asset.value || 0), 0), color: '#B2DFDB', legendFontSize: 11 },
    { name: 'Cash', population: assets.filter(asset => asset.assetType === 'cash').reduce((total, asset) => total + (asset.value || 0), 0), color: '#4CAF50', legendFontSize: 11 },
  ];

  return (
    <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Asset Allocation</Title>
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Current Allocation"
            left={(props) => <Avatar.Icon {...props} icon="chart-pie" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <PieChart
            data={allocationData}
            width={350}  // Further increase width
            height={220}
            chartConfig={{
              backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: isDarkMode ? '#FFFFFF' : '#333',
              style: {
                paddingRight: 40,
              },
              // Set label style
              propsForLabels: {
                fontSize: 12,  // Adjust this size as needed
              },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card>

        <View style={styles.titleRow}>
          <Title style={isDarkMode ? styles.darkTitle : styles.title}>Assets</Title>
        </View>

         {/* Assets List */}
         {assets
          .sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0)) // Sort by timestamp
          .map(asset => (
            <Card key={asset.id} style={isDarkMode ? styles.darkCard : styles.card}>
              <Card.Title
                title={asset.assetName}
                left={(props) => <Avatar.Icon {...props} icon="cash" style={styles.icon} />}
                titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
              />
              <View style={styles.sliderContainer}>
                <Text style={isDarkMode ? styles.darkText : styles.text}>
                  Asset Type: {translateType(asset.assetType) || "None"}
                </Text>
                <Text style={isDarkMode ? styles.darkText : styles.text}>
                  Value: ${formatValue(asset.value.toFixed(2))}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleDeleteAsset(asset.id)}
                style = {{ alignSelf: 'flex-end' }}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </Card>
          ))}
      </ScrollView>
      <FAB
        style={isDarkMode ? styles.darkFab : styles.fab}
        icon="cog"
        color="rgba(255, 255, 255, 0.9)"
        onPress={() => navigation.navigate('ManageAssets')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  darkSafeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  darkContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
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
  darkCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sliderContainer: {
    marginTop: 20,
  },
  darkText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align "Show All" to the right
    alignItems: 'center',
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(0, 121, 107, 0.6)', // 60% opacity
  },
  darkFab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.6)', // 60% opacity
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'right',
    right: 15,
    bottom: 125,
  },
});