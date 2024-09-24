import * as React from 'react';
import { Platform, useColorScheme, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './UserContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';
import HomeScreen from './screens/HomeScreen';

{/* RealEstateScreen */}
import RealEstateScreen from './screens/RealEstateScreen';

{/* RetirementScreen */}
import RetirementScreen from './screens/RetirementScreen';

{/* InvestmentScreen */}
import InvestmentScreen from './screens/InvestmentScreen';
import AssetAllocation from './screens/InvestmentScreens/AssetAllocation';
import MarketPredictions from './screens/InvestmentScreens/MarketPredictions';
import Rebalancing from './screens/InvestmentScreens/Rebalancing';
import InvestmentAnalytics from './screens/InvestmentScreens/InvestmentAnalytics';
import LoginScreen from './screens/LoginScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';

{/* UserAccountScreen */}
import UserAccountsScreen from './screens/UserAccountsScreen';
import Notifications from './screens/UserAccountsScreen/Notifications';
import Preferences from './screens/UserAccountsScreen/Preferences';
import Profile from './screens/UserAccountsScreen/Profile';
import Security from './screens/UserAccountsScreen/Security';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// Themes
const CombinedDefaultTheme = {
  dark: false,
  colors: {
    primary: '#004D40',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#333333',
    border: '#e0e0e0',
    notification: '#00796B',
    accent: '#00796B',
    surface: '#FFFFFF',
    onSurface: '#333333',
    placeholder: '#666666',
    headerText: '#FFFFFF',
    placeholderValue: '#00796B',
    tabBarBackground: '#f7f9fc',
    tabBarText: 'gray',
    tabBarActiveText: '#4CAF50',
  },
};

export const CombinedDarkTheme = {
  dark: true,
  colors: {
    primary: '#004D40',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#333333',
    notification: '#004D40',
    accent: '#004D40',
    surface: '#1E1E1E',
    onSurface: '#FFFFFF',
    placeholder: '#888888',
    headerText: '#FFFFFF',
    placeholderValue: '#4CAF50',
    tabBarBackground: '#1E1E1E',
    tabBarText: '#FFFFFF',
    tabBarActiveText: '#4CAF50',
  },
};

// Investment stack for investment-related screens
function InvestmentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: '',
        headerBackTitleVisible: false,
        headerTintColor: '#00796B',
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

// Auth stack for user account preferences
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
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

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
        tabBarInactiveTintColor: theme.colors.tabBarText,  // Ensure proper dark/light mode handling
        tabBarLabelStyle: {
          fontSize: 14,
        },
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
      <Tab.Screen name="RealEstateTab" component={RealEstateScreen} options={{ title: 'Real Estate' }} />
      <Tab.Screen name="RetirementTab" component={RetirementScreen} options={{ title: 'Retirement' }} />
      <Tab.Screen name="AccountTab" component={UserAccountStack} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}

// Main app function
export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <UserProvider>
        <NavigationContainer theme={theme}>
          {user ? <BottomTabs /> : <AuthStackNavigator />}
        </NavigationContainer>
      </UserProvider>
    </PaperProvider>
  );
}
