import React, { useEffect, useState, useContext } from 'react';
import { Alert, View, StyleSheet, ScrollView, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Title, Card, Avatar } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getMonth, getYear, subMonths } from 'date-fns';
import { UserContext } from '../../UserContext';
import { Timestamp, doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig'

export default function IncomeTrackingScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const navigation = useNavigation();
  const { userProfile, setUserProfile } = useContext(UserContext);

  const [currentMonthIncome, setCurrentMonthIncome] = useState(0);
  const [previousMonthIncome, setPreviousMonthIncome] = useState(0);
  const [incomeSources, setIncomeSources] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const translateCategory = (category) => {
    switch (category) {
      case 'investment':
        return 'Investment';
      case 'realEstate':
        return 'Real Estate';
      case 'retirement':
        return 'Retirement';
      default:
        return 'Unknown';
    }
  };

  // Function to handle deleting an income from Firestore
  const handleDeleteIncome = async (incomeId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this income source?",
      [
        {
          text: "Cancel",
          style: "default",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Delete the income from Firestore
              await deleteDoc(doc(db, 'incomes', incomeId));
        
              // Update UserContext by removing the deleted income
              setUserProfile((prevProfile) => {
                const updatedIncomes = prevProfile.incomes.filter((income) => income.id !== incomeId);
        
                return {
                  ...prevProfile,
                  incomes: updatedIncomes,
                };
              });
        
              // Also update the local incomeSources state
              setIncomeSources((prevSources) => prevSources.filter((income) => income.id !== incomeId));
        
              console.log('Income deleted successfully');
            } catch (error) {
              console.error('Error deleting income:', error);
            }
          },
          style: "destructive", // Makes the "Delete" button stand out
        },
      ],
      { cancelable: true }
    );
  };

  // Logic to re-fetch incomes if incomes is missing or empty
  useEffect(() => {
    const fetchIncomes = async () => {
      const user = auth.currentUser; // Get the logged-in user
      if (user) {
        try {
          const incomeRef = collection(db, 'incomes');
          const querySnapshot = await getDocs(incomeRef);
          const incomes = querySnapshot.docs
            .filter(doc => doc.data().userId === user.uid)
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
          
          // Update the userProfile context with the fetched incomes
          setUserProfile(prevProfile => ({
            ...prevProfile,
            incomes,
          }));
        } catch (error) {
          console.error("Error fetching incomes:", error);
        }
      }
    };
  
    // Re-fetch if incomes are missing
    if (!userProfile?.incomes || userProfile.incomes.length === 0) {
      fetchIncomes();
    }
  }, [userProfile, setUserProfile]);

  useEffect(() => {
    const processIncomeData = () => {
      const currentDate = new Date();
      const currentMonth = getMonth(currentDate);
      const previousMonthDate = subMonths(currentDate, 1);
      const previousMonth = getMonth(previousMonthDate);
      const year = getYear(currentDate);
  
      let currentIncomeTotal = 0;
      let previousIncomeTotal = 0;
      const monthlyIncomes = [];
      const allIncomes = [];
  
      userProfile?.incomes?.forEach((income) => {
        if (income?.timestamp && income.timestamp instanceof Timestamp) {
          const incomeDate = income.timestamp.toDate();
          const incomeMonth = getMonth(incomeDate);
          const incomeYear = getYear(incomeDate);
  
          if (incomeMonth === currentMonth && incomeYear === year) {
            currentIncomeTotal += income.incomePerMonth;
            monthlyIncomes.push(income);
          } else if (incomeMonth === previousMonth && incomeYear === year) {
            previousIncomeTotal += income.incomePerMonth;
          }
          allIncomes.push(income);
        }
      });
  
      setCurrentMonthIncome(currentIncomeTotal);
      setPreviousMonthIncome(previousIncomeTotal);
  
      return { monthlyIncomes, allIncomes };
    };
  
    const { monthlyIncomes, allIncomes } = processIncomeData();
    
    // Use a small delay to ensure the component refreshes state correctly
    setTimeout(() => {
      setIncomeSources(
        (showAll ? allIncomes : monthlyIncomes).sort(
          (a, b) => (b?.timestamp?.toDate() || 0) - (a?.timestamp?.toDate() || 0)
        )
      );
    }, 100); // Delay to trigger the correct update
  }, [userProfile, showAll]);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = getMonth(currentDate);
    const currentYear = getYear(currentDate);
  
    if (userProfile?.incomes) {
      const currentMonthIncomes = userProfile.incomes.filter((income) => {
        if (income.timestamp instanceof Timestamp) {
          const incomeDate = income.timestamp.toDate();
          const incomeMonth = getMonth(incomeDate);
          const incomeYear = getYear(incomeDate);
          return incomeMonth === currentMonth && incomeYear === currentYear;
        }
        return false;
      });
  
      // Prepare PieChart data
      const categoryTotals = currentMonthIncomes.reduce((totals, income) => {
        if (income.category && !isNaN(income.incomePerMonth)) {
          totals[income.category] = (totals[income.category] || 0) + income.incomePerMonth;
        }
        return totals;
      }, {});
  
      const chartData = Object.entries(categoryTotals).map(([category, total]) => ({
        name: translateCategory(category),
        population: total,
        color: category === 'investment' ? '#00796B' : category === 'realEstate' ? '#004D40' : '#B2DFDB',
        legendFontColor: isDarkMode ? '#FFFFFF' : '#000000',
        legendFontSize: 11,
      }));
  
      setChartData(chartData);
    }
  }, [userProfile, isDarkMode]);

  const incomeChange = currentMonthIncome - previousMonthIncome;

  const getTextStyle = (amount) => {
    return {
      color: amount >= 0 ? 'green' : 'red',
      fontWeight: 'bold',
    };
  };

  return (
    <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Income Tracking</Title>

        {/* Income for Month Card */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Income for Month"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, getTextStyle(currentMonthIncome)]}>
              ${currentMonthIncome.toFixed(2)}
            </Text>
          </View>
        </Card>

        {/* Change From Last Month Card */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Change From Last Month"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, getTextStyle(incomeChange)]}>
              {incomeChange >= 0 ? `+$${incomeChange.toFixed(2)}` : `-$${Math.abs(incomeChange).toFixed(2)}`}
            </Text>
          </View>
        </Card>

        {/* Income Sources Chart */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Income Sources Chart"
            left={(props) => <Avatar.Icon {...props} icon="chart-pie" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              width={300} // Adjust width if needed
              height={220} // Adjust height if needed
              chartConfig={{
                backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: isDarkMode ? '#FFFFFF' : '#333',
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </Card>

        {/* Income Sources with "Show All" button */}
        <View style={styles.titleRow}>
          <Title style={isDarkMode ? styles.darkTitle : styles.title}>Income Sources</Title>
          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <Text style={styles.showAllButton}>Show {showAll ? "Less" : "All"}</Text>
          </TouchableOpacity>
        </View>

        {incomeSources.map((income, index) => (
          <Card key={index} style={isDarkMode ? styles.darkCard : styles.card}>
            <Card.Title
              title={income.name}
              left={(props) => <Avatar.Icon {...props} icon="cash" style={styles.icon} />}
              titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
            />
            <View style={styles.sliderContainer}>
              <Text style={isDarkMode ? styles.darkText : styles.text}>
                Category: {translateCategory(income.category)}
              </Text>
              <Text style={isDarkMode ? styles.darkText : styles.text}>
                Income Per Month: ${income.incomePerMonth.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteIncome(income.id)}>
              <Text style={isDarkMode ? styles.deleteText : styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
      <FAB
        icon="plus"
        color="rgba(255, 255, 255, 0.9)"
        style={isDarkMode ? styles.darkFab : styles.fab}
        onPress={() => navigation.navigate("AddIncome")}
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align "Show All" to the right
    alignItems: 'center',
    marginBottom: 10,
  },
  showAllButton: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 10,
    marginRight: 15,
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
  sliderContainer: {
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
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
  darkText: {
    fontSize: 16,
    color: '#AAAAAA',
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