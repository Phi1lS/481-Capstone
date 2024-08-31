import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#004D40" />
      
      {/* Header Section */}
      <View style={styles.headerBackground}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.header}>
          <Avatar.Image size={50} source={require('../assets/avatar.png')} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Hello, User</Text>
            <Text style={styles.subGreeting}>Welcome back to InvestAlign</Text>
          </View>
        </View>
      </View>

      {/* Dashboard Section */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Your Dashboard</Text>

        <View style={styles.dashboard}>
          <View style={styles.dashboardItem}>
            <Text style={styles.summaryLabel}>Investment Balance</Text>
            <Text style={styles.summaryValue}>$XXX,XXX</Text>
            <View style={styles.placeholderGraph}>
              <Text style={styles.placeholderText}>Graph Placeholder</Text>
            </View>
          </View>

          <View style={styles.dashboardItem}>
            <Text style={styles.summaryLabel}>Retirement Account Balance</Text>
            <Text style={styles.summaryValue}>$XXX,XXX</Text>
          </View>

          <View style={styles.dashboardItem}>
            <Text style={styles.summaryLabel}>Real Estate Income</Text>
            <Text style={styles.summaryValue}>$X,XXX</Text>
          </View>

          <View style={styles.dashboardItem}>
            <Text style={styles.summaryLabel}>Expenses for the Month</Text>
            <Text style={styles.summaryValue}>$X,XXX</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  container: {
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
});

