import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { TextInput, Avatar, Icon } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';


export default function AddIncomeScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const inputStyle = isDarkMode ? styles.darkInput : styles.input;
  return (
    <View style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <View style={isDarkMode ? styles.darkContainer : styles.container}>
        <TextInput
          placeholder="Name"
          style={isDarkMode ? styles.darkInput : styles.input}
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}

        />
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          placeholder={{ label: "Category", value: null }}
          onValueChange={(value) => console.log(value)}
          Icon={() => <Icon source="menu-down" style={styles.icon} size={24} />}
          style={{
            inputAndroid: inputStyle,
            inputIOS: inputStyle,
            iconContainer: {
              top: (inputStyle.height / 2) - 20,
              padding: 8,
            }
          }}
          and
          items={[
            { label: "Employment", value: "employment" },
            { label: "Real Estate", value: "realEstate" }
          ]}
        />

        <TextInput
          placeholder="Income Per Month"
          style={isDarkMode ? styles.darkInput : styles.input}
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888'}

        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 16,
  },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#00796B',
    borderWidth: 1,
  },
  // Dark mode styles
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

  darkInput: {
    height: 50,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#4CAF50',
    borderWidth: 1,
    color: '#FFFFFF',
  },
});
