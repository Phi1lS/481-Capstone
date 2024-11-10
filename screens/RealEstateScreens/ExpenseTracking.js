import React, { useState, useEffect, useContext } from "react";
import { Alert, View, StyleSheet, ScrollView, Text, useColorScheme, TouchableOpacity } from "react-native";
import { getMonth, getYear, subMonths } from 'date-fns';
import { UserContext } from '../../UserContext';
import { Title, Card, Avatar, FAB } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { Timestamp, doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

export default function ExpenseTracking({ navigation }) {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [previousMonthExpenses, setPreviousMonthExpenses] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { userProfile, setUserProfile } = useContext(UserContext);

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

  const handleDeleteExpense = async (expenseId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this expense?",
      [
        {
          text: "Cancel",
          style: "default",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'expenses', expenseId));
              setUserProfile((prevProfile) => ({
                ...prevProfile,
                expenses: prevProfile.expenses.filter((expense) => expense.id !== expenseId),
              }));
              setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
              console.log('Expense deleted successfully');
            } catch (error) {
              console.error('Error deleting expense:', error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const expenseRef = collection(db, 'expenses');
          const querySnapshot = await getDocs(expenseRef);
          const fetchedExpenses = querySnapshot.docs
            .filter(doc => doc.data().userId === user.uid)
            .map(doc => ({ id: doc.id, ...doc.data() }));
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            expenses: fetchedExpenses,
          }));
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      }
    };

    if (!userProfile?.expenses || userProfile.expenses.length === 0) {
      fetchExpenses();
    }
  }, [userProfile, setUserProfile]);

  useEffect(() => {
    const processExpenseData = () => {
      const currentDate = new Date();
      const currentMonth = getMonth(currentDate);
      const previousMonthDate = subMonths(currentDate, 1);
      const previousMonth = getMonth(previousMonthDate);
      const year = getYear(currentDate);

      let currentExpenseTotal = 0;
      let previousExpenseTotal = 0;
      const monthlyExpenses = [];
      const allExpenses = [];

      userProfile?.expenses?.forEach((expense) => {
        if (expense?.timestamp && expense.timestamp instanceof Timestamp) {
          const expenseDate = expense.timestamp.toDate();
          const expenseMonth = getMonth(expenseDate);
          const expenseYear = getYear(expenseDate);

          if (expenseMonth === currentMonth && expenseYear === year) {
            currentExpenseTotal += expense.expenseAmount;
            monthlyExpenses.push(expense);
          } else if (expenseMonth === previousMonth && expenseYear === year) {
            previousExpenseTotal += expense.expenseAmount;
          }
          allExpenses.push(expense);
        }
      });

      setCurrentMonthExpenses(currentExpenseTotal);
      setPreviousMonthExpenses(previousExpenseTotal);

      return { monthlyExpenses, allExpenses };
    };

    const { monthlyExpenses, allExpenses } = processExpenseData();

    setTimeout(() => {
      setExpenses(
        (showAll ? allExpenses : monthlyExpenses).sort(
          (a, b) => (b?.timestamp?.toDate() || 0) - (a?.timestamp?.toDate() || 0)
        )
      );
    }, 100);
  }, [userProfile, showAll]);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = getMonth(currentDate);
    const currentYear = getYear(currentDate);

    if (userProfile?.expenses) {
      const currentMonthExpenses = userProfile.expenses.filter((expense) => {
        if (expense.timestamp instanceof Timestamp) {
          const expenseDate = expense.timestamp.toDate();
          const expenseMonth = getMonth(expenseDate);
          const expenseYear = getYear(expenseDate);
          return expenseMonth === currentMonth && expenseYear === currentYear;
        }
        return false;
      });

      const categoryTotals = currentMonthExpenses.reduce((totals, expense) => {
        if (expense.category && !isNaN(expense.expenseAmount)) {
          totals[expense.category] = (totals[expense.category] || 0) + expense.expenseAmount;
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

  const expenseChange = currentMonthExpenses - previousMonthExpenses;

  const getTextStyle = (amount) => ({
    color: amount > 0 ? 'red' : 'green',
    fontWeight: 'bold',
  });

  return (
    <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Expense Tracking</Title>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Expenses for Month"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, getTextStyle(currentMonthExpenses)]}>
              ${currentMonthExpenses.toFixed(2)}
            </Text>
          </View>
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Change from Last Month"
            left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={[isDarkMode ? styles.darkText : styles.text, getTextStyle(expenseChange)]}>
              {expenseChange >= 0 ? `+$${expenseChange.toFixed(2)}` : `-$${Math.abs(expenseChange).toFixed(2)}`}
            </Text>
          </View>
        </Card>

        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Expense Chart"
            left={(props) => <Avatar.Icon {...props} icon="chart-pie" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <PieChart
              data={chartData}
              width={300}
              height={220}
              chartConfig={{
                backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                backgroundGradientFrom: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                backgroundGradientTo: isDarkMode ? "#1E1E1E" : "#FFFFFF",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: isDarkMode ? "#FFFFFF" : "#333",
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </Card>

        <View style={styles.titleRow}>
          <Title style={isDarkMode ? styles.darkTitle : styles.title}>Expense Sources</Title>
          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <Text style={styles.showAllButton}>Show {showAll ? "Less" : "All"}</Text>
          </TouchableOpacity>
        </View>

        {expenses.map((expense, index) => (
          <Card key={index} style={isDarkMode ? styles.darkCard : styles.card}>
            <Card.Title
              title={expense.name}
              left={(props) => <Avatar.Icon {...props} icon="cash" style={styles.icon} />}
              titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
            />
            <View style={styles.sliderContainer}>
              <Text style={isDarkMode ? styles.darkText : styles.text}>
                Category: {translateCategory(expense.category)}
              </Text>
              <Text style={isDarkMode ? styles.darkText : styles.text}>
                Expense Amount: ${expense.expenseAmount.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteExpense(expense.id)}>
              <Text style={isDarkMode ? styles.deleteText : styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
      <FAB
        icon="plus"
        color="rgba(255, 255, 255, 0.9)"
        style={isDarkMode ? styles.darkFab : styles.fab}
        onPress={() => navigation.navigate("NewExpense")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f7f9fc",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    marginBottom: 25,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 10,
    padding: 15,
  },
  icon: {
    backgroundColor: "#E8F5E9",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sliderContainer: {
    marginTop: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'right',
    right: 15,
    bottom: 125,
  },

  // Dark mode styles
  darkContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  darkTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  darkCard: {
    marginBottom: 25,
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 10,
    padding: 15,
  },
  darkCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  darkText: {
    fontSize: 16,
    color: "#AAAAAA",
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
  showAllButton: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 10,
    marginRight: 15,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  
});
