import React, { useContext } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './UserContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';
import { ThemeProvider, ThemeContext } from './ThemeContext'; // Import ThemeProvider and ThemeContext

import HomeScreen from './screens/HomeScreen';
import RealEstateScreen from './screens/RealEstateScreen';
import RetirementScreen from './screens/RetirementScreen';
import InvestmentScreen from './screens/InvestmentScreen';
import AssetAllocation from './screens/InvestmentScreens/AssetAllocation';
import MarketPredictions from './screens/InvestmentScreens/MarketPredictions';
import Rebalancing from './screens/InvestmentScreens/Rebalancing';
import IncomeTracking from './screens/RealEstateScreens/IncomeTracking';
import ExpenseTracking from './screens/RealEstateScreens/ExpenseTracking';
import LeaseManagement from './screens/RealEstateScreens/LeaseManagement';
import TaxIntegration from './screens/RealEstateScreens/TaxIntegration';
import InvestmentAnalytics from './screens/InvestmentScreens/InvestmentAnalytics';
import LoginScreen from './screens/LoginScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import UserAccountsScreen from './screens/UserAccountsScreen';
import Notifications from './screens/UserAccountsScreen/Notifications';
import Preferences from './screens/UserAccountsScreen/Preferences';
import Profile from './screens/UserAccountsScreen/Profile';
import Security from './screens/UserAccountsScreen/Security';
import PortfolioRebalancing from './screens/RetirementScreens/PortfolioRebalancing';
import RetirementSavings from './screens/RetirementScreens/RetirementSavings';
import RetirementPlanning from './screens/RetirementScreens/RetirementPlanning';
import PensionManagement from './screens/RetirementScreens/PensionManagement';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// Investment stack for investment-related screens
function InvestmentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: '', // This removes the title text
        headerBackTitleVisible: false, // This hides the back title text
        headerTintColor: '#00796B', // This sets the arrow color
      }}
    >
      <Stack.Screen name="Investment" component={InvestmentScreen} />
      <Stack.Screen name="AssetAllocation" component={AssetAllocation} />
      <Stack.Screen name="MarketPredictions" component={MarketPredictions} />
      <Stack.Screen name="Rebalancing" component={Rebalancing} />
      <Stack.Screen name="InvestmentAnalytics" component={InvestmentAnalytics} />
    </Stack.Navigator>
  );
}

// Retirement stack for retirement-related screens
function RetirementStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: '', // This removes the title text
        headerBackTitleVisible: false, // This hides the back title text
        headerTintColor: '#00796B', // This sets the arrow color
      }}
    >
      <Stack.Screen name="Retirement" component={RetirementScreen} />
      <Stack.Screen name="PortfolioRebalancing" component={PortfolioRebalancing} />
      <Stack.Screen name="RetirementSavings" component={RetirementSavings} />
      <Stack.Screen name="RetirementPlanning" component={RetirementPlanning} /> 
      <Stack.Screen name="PensionManagement" component={PensionManagement} />
    </Stack.Navigator>
  );
}

// Real estate stack for real estate-related screens
function RealEstateStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: '',
        headerBackTitleVisible: false,
        headerTintColor: '#00796B',
      }}
    >
      <Stack.Screen name="RealEstate" component={RealEstateScreen} />
      <Stack.Screen name="IncomeTracking" component={IncomeTracking} />
      <Stack.Screen name="ExpenseTracking" component={ExpenseTracking} />
      <Stack.Screen name="LeaseManagement" component={LeaseManagement} />
      <Stack.Screen name="TaxIntegration" component={TaxIntegration} />
    </Stack.Navigator>
  );
}

// User account stack for user account-related screens
function UserAccountStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: '',
        headerBackTitleVisible: false,
        headerTintColor: '#00796B',
      }}
    >
      <Stack.Screen name="Account" component={UserAccountsScreen} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Security" component={Security} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Preferences" component={Preferences} />
    </Stack.Navigator>
  );
}

// Auth stack for login and account creation
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="CreateAccountScreen" component={CreateAccountScreen} />
      <AuthStack.Screen name="HomeTab" component={HomeScreen} />
    </AuthStack.Navigator>
  );
}

// Bottom Tabs for the main app
function BottomTabs() {
  const { theme } = useContext(ThemeContext); // Access theme from ThemeContext

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTab':
              iconName = 'home-outline';
              break;
            case 'InvestmentTab':
              iconName = 'chart-line';
              break;
            case 'RealEstateTab':
              iconName = 'home-city-outline';
              break;
            case 'RetirementTab':
              iconName = 'account-clock-outline';
              break;
            case 'AccountTab':
              iconName = 'account-settings-outline';
              break;
          }
          return <IconButton icon={iconName} color={color} size={size + 8} />;
        },
        tabBarActiveTintColor: theme.colors.tabBarActiveText,
        tabBarInactiveTintColor: theme.colors.tabBarText,
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? 40 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 120 : 70,
          backgroundColor: theme.colors.tabBarBackground,
          borderTopColor: theme.colors.border,
          borderTopWidth: 7,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="InvestmentTab" component={InvestmentStack} options={{ title: 'Investment' }} />
      <Tab.Screen name="RealEstateTab" component={RealEstateStack} options={{ title: 'Real Estate' }} />
      <Tab.Screen name="RetirementTab" component={RetirementStack} options={{ title: 'Retirement' }} />
      <Tab.Screen name="AccountTab" component={UserAccountStack} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}

// Main app function
export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider> {/* Ensure ThemeProvider wraps the entire app */}
      <ThemeContext.Consumer>
        {({ theme }) => (
          <PaperProvider theme={theme}> {/* Now PaperProvider has access to theme */}
            <UserProvider>
              <NavigationContainer theme={theme}> {/* Theme passed to NavigationContainer */}
                {user ? <BottomTabs /> : <AuthStackNavigator />}
              </NavigationContainer>
            </UserProvider>
          </PaperProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
