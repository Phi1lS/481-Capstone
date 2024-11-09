import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Image, Text, useColorScheme, Platform } from 'react-native';
import { Avatar } from 'react-native-paper';
import { UserContext } from '../UserContext';
import { getDownloadURL, ref, Timestamp } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { getMonth, getYear, subMonths } from 'date-fns';
import { LineChart } from 'react-native-chart-kit';
import logo from '../assets/logo.png'

export default function HomeScreen() {
  const { userProfile, avatarUri, setAvatarUri } = useContext(UserContext); 
  const [investmentBalance, setInvestmentBalance] = useState(0); 
  const [realEstateIncome, setRealEstateIncome] = useState(0); 
  const [monthlyInvestmentData, setMonthlyInvestmentData] = useState(Array(12).fill(0)); // Monthly balances
  const scheme = useColorScheme();  
  const isDarkMode = scheme === 'dark';  

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      try {
        if (!avatarUri && userProfile.avatarPath) {
          const avatarRef = ref(storage, userProfile.avatarPath);
          const url = await getDownloadURL(avatarRef);
          await Image.prefetch(url);
          setAvatarUri(url);
        }
      } catch (error) {
        const fallbackUrl = await getDownloadURL(ref(storage, 'default/avatar.png'));
        await Image.prefetch(fallbackUrl);
        setAvatarUri(fallbackUrl);
      }
    };
    fetchAvatarUrl();
  }, [userProfile.avatarPath, avatarUri, setAvatarUri]);

  useEffect(() => {
    const calculateInvestmentBalances = () => {
      const monthlyData = Array(12).fill(0);
      const currentDate = new Date();
      let cumulativeBalance = 0;  // Start from 0
  
      // Step 1: Group incomes by month and year, filtering out duplicates based on timestamp
      const monthlyIncomes = {};
      const incomeTimestamps = new Set();
  
      userProfile.incomes
        .filter(income => income.category === 'investment')
        .forEach(income => {
          const incomeDate = income.timestamp.toDate();
          const month = getMonth(incomeDate);
          const year = getYear(incomeDate);
          const key = `${year}-${month}`;
          const timestampString = income.timestamp.toMillis();
  
          if (!incomeTimestamps.has(timestampString)) {
            incomeTimestamps.add(timestampString);
  
            if (!monthlyIncomes[key]) {
              monthlyIncomes[key] = 0;
            }
            monthlyIncomes[key] += income.incomePerMonth;
          }
        });
  
      //console.log("Monthly Incomes Grouped by Month-Year (Unique by Timestamp):", monthlyIncomes);
  
      // Step 2: Group assets for stock and bond by month, treating them as monthly additions
      const monthlyAssets = {};
      userProfile.assets
      .filter(asset => asset.assetType === 'stock' || asset.assetType === 'bond')
      .forEach(asset => {
        // Ensure asset.timestamp exists and is valid before calling toDate()
        if (asset.timestamp && asset.timestamp.toDate) {
          const assetDate = asset.timestamp.toDate();
          const month = getMonth(assetDate);
          const year = getYear(assetDate);
          const key = `${year}-${month}`;
          const timestampString = asset.timestamp.toMillis();

          // Exclude assets with timestamps that match any income
          if (!incomeTimestamps.has(timestampString)) {
            if (!monthlyAssets[key]) {
              monthlyAssets[key] = 0;
            }
            monthlyAssets[key] += asset.value;
          }
        } else {
          //console.warn("Asset is missing a valid timestamp:", asset);
        }
      });
  
      //console.log("Monthly Assets Grouped by Month-Year (Excluding Duplicates):", monthlyAssets);
  
      // Step 3: Calculate cumulative balance over 12 months
      for (let i = 0; i < 12; i++) {
        const date = subMonths(currentDate, 11 - i);
        const month = getMonth(date);
        const year = getYear(date);
        const key = `${year}-${month}`;
  
        // Add monthly income if available
        if (monthlyIncomes[key] !== undefined) {
          cumulativeBalance += monthlyIncomes[key];
          //console.log(`Adding income for ${key}:`, monthlyIncomes[key]);
        }
  
        // Add monthly asset value if available
        if (monthlyAssets[key] !== undefined) {
          cumulativeBalance += monthlyAssets[key];
          //console.log(`Adding asset value for ${key}:`, monthlyAssets[key]);
        }
  
        // Store cumulative balance for the graph data
        monthlyData[i] = cumulativeBalance;
        //console.log(`Month ${i + 1} (${month + 1}-${year}) -> Cumulative Balance:`, cumulativeBalance);
      }
  
      // Set final data
      setMonthlyInvestmentData(monthlyData);
      setInvestmentBalance(cumulativeBalance);
  
      //console.log("Final Monthly Data for Graph:", monthlyData);
      //console.log("Final Cumulative Balance:", cumulativeBalance);
    };
  
    if (userProfile.assets.length > 0 || userProfile.incomes.length > 0) {
      calculateInvestmentBalances();
    }
  }, [userProfile]);

  useEffect(() => {
    const calculateRealEstateIncome = () => {
      const currentDate = new Date();
      const currentMonth = getMonth(currentDate);
      const currentYear = getYear(currentDate);
  
      const realEstateIncomes = userProfile?.incomes?.filter((income) => {
        const incomeDate = income.timestamp && income.timestamp.toDate ? income.timestamp.toDate() : null; 
        if (incomeDate) {
          const incomeMonth = getMonth(incomeDate);
          const incomeYear = getYear(incomeDate);
          return income.category === 'realEstate' && incomeMonth === currentMonth && incomeYear === currentYear;
        }
        return false;
      });
  
      const totalRealEstateIncome = realEstateIncomes?.reduce((total, income) => total + income.incomePerMonth, 0);
      setRealEstateIncome(totalRealEstateIncome || 0);
    };
    calculateRealEstateIncome();
  }, [userProfile]);

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? "#121212" : "#F5F5F5"} 
      />

      <View style={isDarkMode ? styles.darkHeaderBackground : styles.headerBackground}>
        <Image source={logo} style={styles.logo} resizeMode="contain" /> 
        <View style={styles.header}>
          {avatarUri ? (
            <Avatar.Image size={50} source={{ uri: avatarUri }} style={styles.avatar} /> 
          ) : (
            <Text>Avatar not available</Text>  
          )}
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Hello, {userProfile.firstName} {userProfile.lastName}</Text>
            <Text style={styles.subGreeting}>Welcome back to InvestAlign</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={isDarkMode ? styles.darkSectionTitle : styles.sectionTitle}>Your Dashboard</Text>

        <View style={styles.dashboard}>
          {/* Investment Balance */}
          <View style={isDarkMode ? styles.darkDashboardItem : styles.dashboardItem}>
            <Text style={isDarkMode ? styles.darkSummaryLabel : styles.summaryLabel}>Investment Balance</Text>
            <Text style={isDarkMode ? styles.darkSummaryValue : styles.summaryValue}>
              ${investmentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>

            {/* Line Chart for Monthly Investment Balance */}
            <LineChart
              data={{
                labels: Array.from({ length: 12 }, (_, i) =>
                  i % 2 === 0 ? subMonths(new Date(), i).toLocaleString('default', { month: 'short' }) : ''
                ).reverse(),
                datasets: [
                  {
                    data: monthlyInvestmentData,
                  },
                ],
              }}
              width={300} // Adjust width as needed
              height={220} // Adjust height as needed
              chartConfig={{
                backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                labelColor: () => (isDarkMode ? '#FFFFFF' : '#000000'),
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: isDarkMode ? '#00796B' : '#004D40',
                },
                formatYLabel: (value) => {
                  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
                  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
                  return value.toString();
                },
                decimalPlaces: 0, // Remove decimals if you prefer whole numbers
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>

          <View style={isDarkMode ? styles.darkDashboardItem : styles.dashboardItem}>
            <Text style={isDarkMode ? styles.darkSummaryLabel : styles.summaryLabel}>Retirement Account Balance</Text>
            <Text style={isDarkMode ? styles.darkSummaryValue : styles.summaryValue}>
              ${userProfile.totalSavings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={isDarkMode ? styles.darkDashboardItem : styles.dashboardItem}>
            <Text style={isDarkMode ? styles.darkSummaryLabel : styles.summaryLabel}>
              Real Estate Income for the Month
            </Text>
            {realEstateIncome !== null && (
              <Text style={isDarkMode ? styles.darkSummaryValue : styles.summaryValue}>
                ${realEstateIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            )}
          </View>

          <View style={isDarkMode ? styles.darkDashboardItem : styles.dashboardItem}>
            <Text style={isDarkMode ? styles.darkSummaryLabel : styles.summaryLabel}>Expenses for the Month</Text>
            <Text style={isDarkMode ? styles.darkSummaryValue : styles.summaryValue}>$X,XXX</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  headerBackground: {
    backgroundColor: '#004D40',
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 150,
    height: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    backgroundColor: '#00796B',
  },
  headerText: {
    marginLeft: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subGreeting: {
    fontSize: 16,
    color: '#B2DFDB',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 20,
    color: '#333333',
  },
  dashboard: {
    paddingHorizontal: 10,
  },
  dashboardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  summaryValue: {
    fontSize: 18,
    color: '#00796B',
    marginTop: 5,
  },
  placeholderGraph: {
    height: 100,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  placeholderText: {
    color: '#004D40',
  },
  // Dark mode styles
  darkContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  darkHeaderBackground: {
    backgroundColor: '#00251A',
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  darkSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 20,
    color: '#FFFFFF',
  },
  darkDashboardItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  darkSummaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkSummaryValue: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 5,
  },
  darkPlaceholderGraph: {
    height: 100,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  darkPlaceholderText: {
    color: '#4CAF50',
  },
});
