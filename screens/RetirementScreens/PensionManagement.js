import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  useColorScheme,
  Dimensions,
  TextInput,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Title, Card, Avatar, Button, pressable } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";

export default function InvestmentAnalyticsScreen() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  // Get screen width to make the chart fit the screen properly
  const screenWidth = Dimensions.get("window").width;

  //income values
  const [totalSavings, setTotalSavings] = useState(5000);
  const [retirementGoal, setRetirementGoal] = useState(10000);
  const [futureValue, setFutureValue] = useState(7500);

  //values for calculator
  const [age, setAge] = useState("");
  const [retirementaAge, setRetirementaAge] = useState("");
  const [rateOfReturn, setRateOfReturn] = useState("");
  const [annualContributions, setAnnualContributions] = useState("");

  //varialbe and functions for button
  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = () => {
    setIsPressed(true);
  };
  const handlePressOut = () => {
    setIsPressed(false);
  };

  //function for inputtext
  const handleInput = (input, setFunction) => {
    const numbericInput = input.replace(/[^0-9]/g, "");
    setFunction(input);
  };

  return (
    <SafeAreaView style={isDarkMode ? styles.darkSafeArea : styles.safeArea}>
      <ScrollView
        contentContainerStyle={
          isDarkMode ? styles.darkContainer : styles.container
        }
      >
        <Title style={isDarkMode ? styles.darkTitle : styles.title}>
          Retirement Savings
        </Title>

        {/* Pension management card */}
        <Card style={isDarkMode ? styles.darkCard : styles.card}>
          <Card.Title
            title="Pension Accounts"
            titleStyle={[
              isDarkMode ? styles.darkCardTitle : styles.cardTitle,
              { fontSize: 20 },
            ]}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="format-list-text"
                style={styles.icon}
              />
            )}
          />

          {/* pensions */}

          <View
            style={[
              isDarkMode ? styles.darkCard : styles.card,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <Text
              style={[
                isDarkMode ? styles.darkText : styles.text,
                { textAlign: "left", fontSize: 20 },
              ]}
            >
              Roth IRA
            </Text>
            <Text
              style={[
                isDarkMode ? styles.darkMoneyValue : styles.moneyValue,
                { textAlign: "center", fontSize: 20 },
              ]}
            >
              $ XXX,XXX
            </Text>
            <Pressable
              style={({ pressed }) => [
                isDarkMode
                  ? styles.darkCalculateButton
                  : styles.calculateButton,
                { backgroundColor: pressed ? "#005D4F" : "#4CAF50" },
              ]}
            >
              <Text
                style={[
                  isDarkMode ? styles.darkCardTitle : styles.cardTitle,
                  { fontSize: 20 },
                ]}
              >
                Details
              </Text>
            </Pressable>
          </View>
          <View
            style={[
              isDarkMode ? styles.darkCard : styles.card,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <Text
              style={[
                isDarkMode ? styles.darkText : styles.text,
                { textAlign: "left", fontSize: 20 },
              ]}
            >
              Some Pension
            </Text>
            <Text
              style={[
                isDarkMode ? styles.darkMoneyValue : styles.moneyValue,
                { textAlign: "center", fontSize: 20 },
              ]}
            >
              $ XXX,XXX
            </Text>
            <Pressable
              style={({ pressed }) => [
                isDarkMode
                  ? styles.darkCalculateButton
                  : styles.calculateButton,
                { backgroundColor: pressed ? "#005D4F" : "#4CAF50" },
              ]}
            >
              <Text
                style={[
                  isDarkMode ? styles.darkCardTitle : styles.cardTitle,
                  { fontSize: 20 },
                ]}
              >
                Details
              </Text>
            </Pressable>
          </View>
          <Pressable
            style={({ pressed }) => [
              isDarkMode ? styles.darkCalculateButton : styles.calculateButton,
              { backgroundColor: pressed ? "#005D4F" : "#4CAF50" },
            ]}
          >
            <Text
              style={[
                isDarkMode ? styles.darkCardTitle : styles.cardTitle,
                { fontSize: 20, textAlign: "center" },
              ]}
            >
              Add new Pension
            </Text>
          </Pressable>
          {/* Add more sliders for other asset classes */}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Light mode styles
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
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
    padding: 5,
  },
  icon: {
    backgroundColor: "#E8F5E9",
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  detailsContainer: {
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    color: "#555",
    marginLeft: 10,
  },
  placeholderGraph: {
    height: 100,
    backgroundColor: "#E0F2F1",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 5,
  },
  textInput: {},
  buttonLabel: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: "#00796B",
    padding: 5,
    borderRadius: 8,
    marginTop: 0,
  },
  calculateButtonPressed: {
    backgroundColor: "#005D4F",
  },
  // Dark mode styles
  darkSafeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
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
    padding: 10,
  },
  darkCardTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  darkText: {
    fontSize: 18,
    color: "#AAAAAA",
    marginLeft: 10,
  },
  moneyValue: {
    fontSize: 50,
    color: "#00796B",
    textAlign: "center",
  },
  darkMoneyValue: {
    fontSize: 50,
    color: "#4CAF50",
    marginTop: 0,
    textAlign: "center",
  },
  darkPlaceholderGraph: {
    height: 100,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 5,
  },
  darkBar: {
    color: "#4CAF50",
  },
  darkCalculateButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 8,
    marginTop: 0,
  },
});
