import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, TouchableOpacity } from 'react-native';
import { Title, Card, Avatar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Timestamp, doc, deleteDoc, collection, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { getMonth, subMonths, getYear, format } from 'date-fns';
import { UserContext } from '../../UserContext';
import { db, auth } from '../../firebaseConfig'



export default function LeaseManagementScreen() {
  const { userProfile, setUserProfile } = useContext(UserContext);
  const [showAll, setShowAll] = useState(false);
  const [tenants, setTenants] = useState([]);
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
  
      const monthlyTenants = [];
      const allTenants = [];
  
      userProfile?.tenants?.forEach((tenant) => {
        if (tenant?.timestamp && tenant.timestamp instanceof Timestamp) {
          const tenantDate = tenant.timestamp.toDate();
          const tenantMonth = getMonth(tenantDate);
          const tenantYear = getYear(tenantDate);
  
          if (tenantMonth === currentMonth && tenantYear === year) {
            monthlyTenants.push(tenant);
          } 
          allTenants.push(tenant);
        }
      });
    
      return { monthlyTenants, allTenants };
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


  return (
    <View>
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
            <Text style={isDarkMode ? styles.darkText : styles.text}>$XXX,XXX</Text>
          </View>
        </Card>

        {/* Lease Tracking with "Show All" button */}
        <View style={styles.titleRow}>
          <Title style={isDarkMode ? styles.darkTitle : styles.title}>Lease Tracking</Title>
          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <Text style={styles.showAllButton}>Show {showAll ? "Less" : "All"}</Text>
          </TouchableOpacity>
        </View>

        {tenants.map((tenant, index) => (
          <Card key={index} style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title={tenant.name}
            left={(props) => <Avatar.Icon {...props} icon="account" style={styles.icon} />}
            titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
          />
          <View style={styles.sliderContainer}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Lease start date: {tenant.leaseStartDate ? format(tenant.leaseStartDate.toDate(), "MM/dd/yyyy") : "N/A"}</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>Lease end date: {tenant.leaseEndDate ? format(tenant.leaseEndDate.toDate(), "MM/dd/yyyy") : "N/A"}</Text>
          </View>
          <Card.Actions>
            <Button textColor={isDarkMode ? styles.darkText.color : styles.text.color}>Renew</Button>
            <Button mode="outlined" textColor={isDarkMode ? styles.darkText.color : styles.text.color}>
              Terminate Lease
            </Button>
          </Card.Actions>
        </Card>
        ))}
        

        {/* Add more sliders for other asset classes as needed */}
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  manageLeasesText: {
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
