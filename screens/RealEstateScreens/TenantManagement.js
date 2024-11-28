import React, { useState, useEffect, useContext } from "react";
import { Alert, View, StyleSheet, ScrollView, Text, useColorScheme, TouchableOpacity } from "react-native";
import { getMonth, getYear, subMonths } from 'date-fns';
import { UserContext } from '../../UserContext';
import { Title, Card, Avatar, FAB, Button } from "react-native-paper";
import { Timestamp, doc, deleteDoc, collection, getDocs, addDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { format, add } from 'date-fns';

export function TenantCard({ tenant, style }) {
  const { userProfile, setUserProfile, sendNotification } = useContext(UserContext); 

  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const handleRenew = async (tenant) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.error('User not logged in');
        return;
      }



      // Add tenant to Firestore with a timestamp
      const newTenant = {
        userId: user.uid,
        name: tenant.name,
        leaseStartDate: add(tenant.leaseStartDate.toDate() ?? serverTimestamp().toDate(), { years: 1 }),
        building: tenant.building,
        apartmentNumber: tenant.apartmentNumber,
        rentAmount: tenant.rentAmount, // Remove commas
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'tenants'), newTenant);
      Alert.alert('Tenant added successfully.');

      // Use sendNotification from UserContext
      await sendNotification(
        user.uid,
        `Tenant "${tenant.name}" was renewed successfully.`,
        'tenant'
      );


    } catch (error) {
      console.error('Error renewing tenant:', error);
      Alert.alert('Error', 'Failed to renew tenant. Please try again.');
    }
  };

  const handleTerminate = (tenant) => {

  };
  return (
    <Card style={style}>
      <Card.Title
        title={tenant.name}
        left={(props) => <Avatar.Icon {...props} icon="account" style={styles.icon} />}
        titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
      />
      <View style={styles.sliderContainer}>
        <Text style={isDarkMode ? styles.darkText : styles.text}>Lease start date: {tenant.leaseStartDate ? format(tenant.leaseStartDate.toDate(), "MM/dd/yyyy") : "N/A"}</Text>
        <Text style={isDarkMode ? styles.darkText : styles.text}>Lease end date: {tenant.leaseStartDate ? format(add(tenant.leaseStartDate.toDate(), { years: 1 }), "MM/dd/yyyy") : "N/A"}</Text>
      </View>
      <Card.Actions>
        <Button textColor={isDarkMode ? styles.darkText.color : styles.text.color} onPress={() => handleRenew(tenant)}>Renew</Button>
        <Button mode="outlined" textColor={isDarkMode ? styles.darkText.color : styles.text.color} onPress={() => handleTerminate(tenant)}>
          Terminate Lease
        </Button>
      </Card.Actions>
    </Card>
  )
}

export default function TenantManagement({ navigation }) {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const [tenants, setTenants] = useState([]);
  //const [chartData, setChartData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { userProfile, setUserProfile } = useContext(UserContext);



  const handleDeleteTenant = async (tenantId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this tenant?",
      [
        {
          text: "Cancel",
          style: "default",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'tenants', tenantId));
              setUserProfile((prevProfile) => ({
                ...prevProfile,
                tenants: prevProfile.tenants.filter((tenant) => tenant.id !== tenantId),
              }));
              setTenants((prev) => prev.filter((tenant) => tenant.id !== tenantId));
              console.log('Tenant deleted successfully');
            } catch (error) {
              console.error('Error deleting tenant:', error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const fetchTenants = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const tenantRef = collection(db, 'tenants');
          const querySnapshot = await getDocs(tenantRef);
          const fetchedTenants = querySnapshot.docs
            .filter(doc => doc.data().userId === user.uid)
            .map(doc => ({ id: doc.id, ...doc.data() }));
          setUserProfile((prevProfile) => ({
            ...prevProfile,
            tenants: fetchedTenants,
          }));
        } catch (error) {
          console.error("Error fetching tenants:", error);
        }
      }
    };

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

      const allTenants = [];

      userProfile?.tenants?.forEach((tenant) => {
        if (tenant?.timestamp && tenant.timestamp instanceof Timestamp) {

          allTenants.push(tenant);
        }
      });

      return { allTenants };
    };

    const { allTenants } = processTenantData();

    setTimeout(() => {
      setTenants(
        allTenants.sort(
          (a, b) => (b?.timestamp?.toDate() || 0) - (a?.timestamp?.toDate() || 0)
        )
      );
    }, 100);
  }, [userProfile, showAll]);


  const getTextStyle = (amount) => ({
    color: amount > 0 ? 'red' : 'green',
    fontWeight: 'bold',
  });

  return (
    <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>

        <View style={styles.titleRow}>
          <Title style={isDarkMode ? styles.darkTitle : styles.title}>Tenants</Title>
        </View>

        {tenants.map((tenant, index) => (
          <TenantCard key={index} style={isDarkMode ? styles.darkCard : styles.card} tenant={tenant} />
        ))}
      </ScrollView>
      <FAB
        icon="plus"
        color="rgba(255, 255, 255, 0.9)"
        style={isDarkMode ? styles.darkFab : styles.fab}
        onPress={() => navigation.navigate("NewTenant")}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  darkSafeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
