import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Title, Card, Avatar } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getMonth, getYear, subMonths } from 'date-fns';
import { UserContext } from '../../UserContext';

export default function IncomeTrackingScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const navigation = useNavigation();
  const { userProfile } = useContext(UserContext);

  const [currentMonthIncome, setCurrentMonthIncome] = useState(0);
  const [previousMonthIncome, setPreviousMonthIncome] = useState(0);
  const [incomeSources, setIncomeSources] = useState([]);
  const [showAll, setShowAll] = useState(false); // Toggle to show all income

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

  useEffect(() => {
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
      const incomeDate = income.timestamp.toDate();
      const incomeMonth = getMonth(incomeDate);
      const incomeYear = getYear(incomeDate);

      // Calculate income for the current and previous month
      if (incomeMonth === currentMonth && incomeYear === year) {
        currentIncomeTotal += income.incomePerMonth;
        monthlyIncomes.push(income);
      } else if (incomeMonth === previousMonth && incomeYear === year) {
        previousIncomeTotal += income.incomePerMonth;
      }
      // Add to all incomes for potential display
      allIncomes.push(income);
    });

    setCurrentMonthIncome(currentIncomeTotal);
    setPreviousMonthIncome(previousIncomeTotal);
    setIncomeSources(
      (showAll ? allIncomes : monthlyIncomes).sort(
        (a, b) => b.timestamp.toDate() - a.timestamp.toDate()
      )
    ); // Show either all or only the monthly income sources, sorted
  }, [userProfile, showAll]); // Re-run effect when userProfile or showAll changes

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
});