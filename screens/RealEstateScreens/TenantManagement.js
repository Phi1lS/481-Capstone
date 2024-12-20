import React, { useState, useEffect, useContext } from "react";
import { Alert, View, StyleSheet, ScrollView, Text, useColorScheme, TouchableOpacity } from "react-native";
import { compareAsc, getMonth, getYear, subMonths } from 'date-fns';
import { UserContext } from '../../UserContext';
import { Title, Card, Avatar, FAB, Button } from "react-native-paper";
import { Timestamp, doc, deleteDoc, collection, getDocs, onSnapshot, addDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { format, add } from 'date-fns';

// TenantCard Component
export function TenantCard({ tenant, style, setTenants }) {
  const { userProfile, setUserProfile, sendNotification } = useContext(UserContext);
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  const handleRenew = async (tenant) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        return;
      }

      const newTenant = {
        userId: user.uid,
        name: tenant.name,
        leaseStartDate: add(tenant.leaseStartDate.toDate(), { years: 1 }),
        building: tenant.building,
        apartmentNumber: tenant.apartmentNumber,
        rentAmount: tenant.rentAmount,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "tenants"), newTenant);
      Alert.alert("Tenant renewed successfully.");
      await sendNotification(
        user.uid,
        `Tenant "${tenant.name}" was renewed successfully.`,
        "tenant"
      );
    } catch (error) {
      console.error("Error renewing tenant:", error);
      Alert.alert("Error", "Failed to renew tenant. Please try again.");
    }
  };

  const handleTerminate = (tenant) => {
    const tenantId = tenant.id;
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to terminate this lease?",
      [
        {
          text: "Cancel",
          style: "default",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "tenants", tenantId));
              setUserProfile((prev) => ({
                ...prev,
                tenants: prev.tenants.filter((t) => t.id !== tenantId),
              }));
              setTenants((prev) => prev.filter((t) => t.id !== tenantId));
            } catch (error) {
              console.error("Error deleting tenant:", error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const leaseEndDate = add(tenant.leaseStartDate.toDate(), { years: 1 });

  return (
    <Card style={style}>
      <Card.Title
        title={tenant.name}
        left={(props) => <Avatar.Icon {...props} icon="account" style={styles.icon} />}
        titleStyle={isDarkMode ? styles.darkCardTitle : styles.cardTitle}
      />
      <View style={styles.sliderContainer}>
        <Text style={isDarkMode ? styles.darkText : styles.text}>
          Lease start date: {tenant.leaseStartDate ? format(tenant.leaseStartDate.toDate(), "MM/dd/yyyy") : "N/A"}
        </Text>
        <Text style={isDarkMode ? styles.darkText : styles.text}>
          Lease end date: {format(leaseEndDate, "MM/dd/yyyy")}
        </Text>
        <Text style={isDarkMode ? styles.darkText : styles.text}>
          Status: {compareAsc(leaseEndDate, Date.now()) > 0 ? "Current" : "Expired"}
        </Text>
      </View>
      <Card.Actions>
        <Button textColor={isDarkMode ? styles.darkText.color : styles.text.color} onPress={() => handleRenew(tenant)}>
          Renew
        </Button>
        <Button mode="outlined" textColor={isDarkMode ? styles.darkText.color : styles.text.color} onPress={() => handleTerminate(tenant)}>
          Terminate Lease
        </Button>
      </Card.Actions>
    </Card>
  );
}

// TenantManagement Component
export default function TenantManagement({ navigation }) {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const [tenants, setTenants] = useState([]);
  const { userProfile, setUserProfile } = useContext(UserContext);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const tenantRef = collection(db, "tenants");
      const unsubscribe = onSnapshot(
        tenantRef,
        (snapshot) => {
          const fetchedTenants = snapshot.docs
            .filter((doc) => doc.data().userId === user.uid)
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
              leaseEndDate: add(doc.data().leaseStartDate.toDate(), { years: 1 }),
            }));

          setTenants(fetchedTenants.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()));
          setUserProfile((prev) => ({ ...prev, tenants: fetchedTenants }));
        },
        (error) => {
          console.error("Error fetching tenants:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [setUserProfile]);

  return (
    <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView contentContainerStyle={isDarkMode ? styles.darkContainer : styles.container}>
        <View style={styles.titleRow}>
          <Title style={isDarkMode ? styles.darkTitle : styles.title}>Tenants</Title>
        </View>
        {tenants.map((tenant, index) => (
          <TenantCard
            key={index}
            style={isDarkMode ? styles.darkCard : styles.card}
            tenant={tenant}
            setTenants={setTenants}
          />
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
  darkSummaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
