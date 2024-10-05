import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  useColorScheme,
} from "react-native";
import {
  Title,
  Card,
  Avatar,
  TextInput,
  Button,
  List,
} from "react-native-paper";
import { formatCurrency } from "react-native-format-currency";

export default function ExpenseTracking({ navigation }) {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  //const for expense list
  const [listOpen, setListOpen] = useState(false);
  const [expenseType, setExpenseType] = useState("");
  const handleListPress = () => setListOpen(!listOpen);

  //const for date list
  const [dateListOpen, setDateListOpen] = useState(false);
  const [expenseDate, setExpenseDate] = useState("");
  const handleDateListPress = () => setDateListOpen(!dateListOpen);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  //const for expense name
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);

  //const for expense amount
  const [formattedExpenseAmount] = formatCurrency({
    amount: expenseAmount,
    code: "USD",
  });
  const [expenseAmountChange, setExpenseAmountChange] = useState(expenseAmount);
  const [isEditing, setIsEditing] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const startEditMode = () => {
    setIsEditing(true);
  };
  const saveAndExitEdit = () => {
    setExpenseAmount(expenseAmountChange);
    setIsEditing(false);
  };
  const testExpenseInput = (input) => {
    setExpenseAmountChange(input.replace(/[^0-9.]/g, ''));
  }
  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <View>
      <ScrollView
        contentContainerStyle={
          isDarkMode ? styles.darkContainer : styles.container
        }
      >

        {/* Card for expense name */}

          <View>
            <TextInput
              style={[
                isDarkMode ? styles.darkInputBox : styles.inputBox,
                {
                  width: '90%',
                  height: 10,
                  color: isDarkMode ? "#4CAF50" : "#00796B",
                  alignSelf: "center",
                  textAlign: "center",
                  fontSize: 25,
                  borderColor: '#00796B',
                  marginTop: 40
                },
              ]}
              keyboardType="default"
              value={expenseName}
              onChangeText={(input) => setExpenseName(input)}
              placeholder="Enter Name"
              placeholderTextColor={isDarkMode ? "#FFFFFF" : "#333"}
            />
          </View>

        {/* Card for expense Amount */}
        <Card style={isDarkMode ? styles.darkInputBox : styles.inputBox}>
          <View style={styles.detailsContainer}>
            {isEditing ? (
              <TextInput
                style={[
                  isDarkMode ? styles.darkCard : styles.card,
                  {
                    width: 300,
                    height: 70,
                    color: isDarkMode ? "#4CAF50" : "#00796B",
                    alignSelf: "center",
                    textAlign: "center",
                    fontSize: 50,
                  },
                ]}
                keyboardType="numeric"
                value={String(expenseAmountChange)}
                onChangeText={testExpenseInput}
                placeholder="Enter numb"
                placeholderTextColor={isDarkMode ? "#FFFFFF" : "#333"}
              />
            ) : (
              <Text
                style={isDarkMode ? styles.darkMoneyValue : styles.moneyValue}
              >
                {formattedExpenseAmount}
              </Text>
            )}
          </View>
          {/* Buttons for editing and saving expense amount */}
          {isEditing ? (
            <Button
              mode="contained"
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => saveAndExitEdit()}
              style={[
                isDarkMode
                  ? styles.darkRebalanceButton
                  : styles.rebalanceButton,
                isPressed && styles.rebalanceButtonPressed,
              ]}
              labelStyle={styles.buttonLabel}
            >
              Save Expense
            </Button>
          ) : (
            <Button
              mode="contained"
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => startEditMode()}
              style={[
                isDarkMode
                  ? styles.darkRebalanceButton
                  : styles.rebalanceButton,
                isPressed && styles.rebalanceButtonPressed,
              ]}
              labelStyle={styles.buttonLabel}
            >
              Edit Expense Amount
            </Button>
          )}
        </Card>

        {/* Card for expense type */}

          <View style={ styles.detailsContainer}>
            <List.Accordion
              style={[
                isDarkMode ? styles.darkInputBox : styles.inputBox
                ,{marginBottom: 0}
              ]}
              title={expenseType ? expenseType : "Choose an Expense Type"}
              titleStyle={[
                styles.buttonLabel,
                {
                  color: isDarkMode ? "#FFFFFF" : "#333",
                  paddingBottom: 10,
                  textAlign: "center",
                  fontSize: 20,
                  marginTop: 0,
                  paddingTop: 5,
                },
              ]}
              expanded={listOpen}
              onPress={handleListPress}
            >
              <List.Item
                title="Employment"
                onPress={() => {
                  setExpenseType("Employment");
                  setListOpen(false);
                }}
                titleStyle={[isDarkMode ? styles.darkInputBox : styles.inputBox,{ textAlign: "center", marginVertical: 0,
                  paddingLeft: 0 }]}
              />
              <List.Item
                title="Real Estate"
                onPress={() => {
                  setExpenseType("Real Estate");
                  setListOpen(false);
                }}
                titleStyle={[isDarkMode ? styles.darkInputBox : styles.inputBox,{ textAlign: "center", marginVertical: 0,
                  paddingLeft: 0 }]}
              />
            </List.Accordion>
          </View>


        {/* Card for expense Date */}

          <View style={styles.detailsContainer}>
            <List.Accordion
              style={[
                isDarkMode ? styles.darkInputBox : styles.inputBox
              ]}
              title={expenseDate ? expenseDate : "Choose a Month"}
              titleStyle={[
                styles.buttonLabel,
                {
                  color: isDarkMode ? "#FFFFFF" : "#333",
                  paddingBottom: 10,
                  textAlign: "center",
                  fontSize: 20,
                  marginTop: 0,
                  paddingTop: 5,
                },
              ]}
              expanded={dateListOpen}
              onPress={handleDateListPress}
            >
              <View
                style={[
                  {
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                    paddingHorizontal: 5,
                  },
                ]}
              >
                {months.map((currMonth) => (
                  <List.Item
                    key={currMonth}
                    title={currMonth}
                    onPress={() => {
                      setExpenseDate(currMonth);
                      setDateListOpen(false);
                    }}
                    titleStyle={[{ textAlign: "center" }]}
                    style={[isDarkMode ? styles.darkInputBox : styles.inputBox,
                      { width: "30%", 
                        marginVertical: 5,
                        paddingLeft: 0
                    }]}
                  />
                ))}
              </View>
            </List.Accordion>
          </View>


        <Button
          mode="contained"
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate("ExpenseTracking")}
          style={[
            isDarkMode ? styles.darkRebalanceButton : styles.rebalanceButton,
            isPressed && styles.rebalanceButtonPressed,
          ]}
          labelStyle={styles.buttonLabel}
        >
          Confirm Expense
        </Button>
        {/* Add more sliders for other asset classes */}
      </ScrollView>
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
  detailsContainer: {
    marginTop: 20,
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
  moneyValue: {
    fontSize: 50,
    color: "#00796B",
    textAlign: "center",
  },
  rebalanceButton: {
    backgroundColor: "#00796B",
    padding: 14,
    borderRadius: 8,
    marginTop: 25,
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputBox: {
    marginVertical: 20,
    padding: 20,
    width: '90%',

    alignSelf: 'center',
    
    borderWidth: 1.5,
    borderRadius: 10,
    borderStyle: 'solid',
    borderBlockColor: '#00796B',
    borderColor: '#00796B',
   
    backgroundColor: "#ffffff"
  },
  // Dark mode styles
  darkInputBox: {
    marginVertical: 20,
    padding: 20,
    width: '90%',

    alignSelf: 'center',
    
    borderWidth: 1.5,
    borderRadius: 10,
    borderStyle: 'solid',
    borderBlockColor: '#4CAF50',
    borderColor: '#4CAF50',
   
    backgroundColor: "#1E1E1E"
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
  darkMoneyValue: {
    fontSize: 50,
    color: "#4CAF50",
    marginTop: 0,
    textAlign: "center",
  },
  darkRebalanceButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    marginTop: 25,
  },
});
