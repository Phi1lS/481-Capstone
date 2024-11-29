import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, TouchableOpacity, Alert } from 'react-native';
import { Title, Card, Avatar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Timestamp, doc, deleteDoc, collection, getDocs, addDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getMonth, subMonths, getYear, format, add, compareAsc } from 'date-fns';
import { UserContext } from '../../UserContext';
import { db, auth } from '../../firebaseConfig';
import { TenantCard } from './TenantManagement';



export default function LeaseManagementScreen() {
  const { userProfile, setUserProfile, sendNotification } = useContext(UserContext);
  const [showAll, setShowAll] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);  // New state for monthly expenses
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const handleManageTenants = () => {
    navigation.navigate("TenantManagement");
  };



  // Logic to re-fetch tenants if tenants is missing or empty
  useEffect(() => {
    const fetchTenants = async () => {
      const user = auth.currentUser; // Get the logged-in user
      if (user) {
        try {
          const tenantRef = collection(db, 'tenants');
          const querySnapshot = await getDocs(tenantRef);
          const tenants = querySnapshot.docs
            .filter(doc => doc.data().userId === user.uid)
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

          // Update the userProfile context with the fetched tenants
          setUserProfile(prevProfile => ({
            ...prevProfile,
            tenants: tenants,
          }));
        } catch (error) {
          console.error("Error fetching tenants:", error);
        }
      }
    };

    // Re-fetch if tenants are missing
    if (!userProfile?.tenants || userProfile.tenants.length === 0) {
      fetchTenants();
    }
  }, [userProfile, setUserProfile]);

  useEffect(() => {
    const processTenantData = () => {
      const currentDate = new Date();
      const currentMonth = getMonth(currentDate);
      const previousMonthDate = subMonths(currentDate, 1);
      const previousMonth = getMonth(previousMonthDate);
      const year = getYear(currentDate);

      const nearExpiringTenants = [];
      const allTenants = [];

      userProfile?.tenants?.forEach((tenant) => {
        if (tenant?.timestamp && tenant.timestamp instanceof Timestamp) {
          const leaseStartDate = tenant.leaseStartDate.toDate();
          const nineMonthsFromLeaseStart = add(leaseStartDate, { months: 9 });
          if (compareAsc(nineMonthsFromLeaseStart, currentDate) <= 0) {
            nearExpiringTenants.push(tenant);
          }
          allTenants.push(tenant);
        }
      });

      return { monthlyTenants: nearExpiringTenants, allTenants };
    };

    const { monthlyTenants, allTenants } = processTenantData();

    // Use a small delay to ensure the component refreshes state correctly
    setTimeout(() => {
      setTenants(
        (showAll ? allTenants : monthlyTenants).sort(
          (a, b) => (b?.timestamp?.toDate() || 0) - (a?.timestamp?.toDate() || 0)
        )
      );
    }, 100); // Delay to trigger the correct update
  }, [userProfile, showAll]);

  // Calculate monthly expenses
  useEffect(() => {
    const calculateMonthlyExpenses = () => {
      const currentDate = new Date();
      const currentMonth = getMonth(currentDate);
      const currentYear = getYear(currentDate);

      const currentMonthExpenses = userProfile?.expenses?.filter((expense) => {
        const expenseDate = expense.timestamp && expense.timestamp.toDate ? expense.timestamp.toDate() : null;
        if (expenseDate) {
          const expenseMonth = getMonth(expenseDate);
          const expenseYear = getYear(expenseDate);
          return expenseMonth === currentMonth && expenseYear === currentYear;
        }
        return false;
      });

      const totalExpenses = currentMonthExpenses?.reduce((total, expense) => total + expense.expenseAmount, 0);
      setMonthlyExpenses(totalExpenses || 0);
    };

    calculateMonthlyExpenses();
  }, [userProfile]);


  return (
    <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
      <Title style={isDarkMode ? styles.darkTitle : styles.title}>Lease Management</Title>

      {/* Lease Information Card */}
      <Card style={isDarkMode ? styles.darkCard : styles.card}>
        <Card.Title
          title="Tenants"
          left={(props) => <Avatar.Icon {...props} icon="tune" style={styles.icon} />}
          right={(props) =>
            <TouchableOpacity
              onPress={() => handleManageTenants()}
              style={{/* alignSelf: 'flex-end'*/ }}>
              <Text style={isDarkMode ? styles.manageLeasesText : styles.manageLeasesText}>Manage</Text>
            </TouchableOpacity>
          }
          titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
        />

      </Card>


      {/* Expense Card */}
      <Card style={isDarkMode ? styles.darkCard : styles.card}>
        <Card.Title
          title="Expenses"
          left={(props) => <Avatar.Icon {...props} icon="currency-usd" style={styles.icon} />}
          titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
        />
        <View style={styles.sliderContainer}>
          <Text style={isDarkMode ? styles.darkSummaryLabel : styles.summaryLabel}>Expenses for the Month</Text>
          <Text style={[styles.expensesText]}>
            ${monthlyExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
      </Card>

      {/* Lease Tracking with "Show All" button */}
      <View style={styles.titleRow}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Lease Tracking</Title>
        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
          <Text style={styles.showAllButton}>Show {showAll ? "Less" : "All"}</Text>
        </TouchableOpacity>

      </View>
      <Text style={isDarkMode ? styles.darkText : styles.text}>{showAll ? "Here are all tenants" : "Here are all tenants with leases expiring in the next three months"}</Text>
      
      {tenants.map((tenant, index) => (
        <TenantCard
          key={index}
          tenant={tenant}
          style={isDarkMode ? styles.darkCard : styles.card}
          setTenants={setTenants}
        />

      ))}


      {/* Add more sliders for other asset classes as needed */}
    </ScrollView>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  manageLeasesText: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 10,
    marginRight: 15,
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
  slider: {
    width: '100%',
    height: 40,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  expensesText: {
    fontSize: 18,
    color: 'red',
    marginTop: 5,
  },

  // Dark mode styles
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
  darkSummaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
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

});
