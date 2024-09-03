import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title } from 'react-native-paper';

export default function RebalancingScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  return (
    <SafeAreaView style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <View style={styles.container}>
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>Rebalancing</Title>
        <Text style={isDarkMode ? styles.darkText : styles.text}>
          Adjust your portfolio to maintain your desired asset allocation.
        </Text>
        {/* Add process for rebalancing and other UI elements here */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  darkSafeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#333',
  },
  darkTitle: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  darkText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginTop: 10,
  },
});
