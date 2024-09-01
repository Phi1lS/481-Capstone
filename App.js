import * as React from 'react';
import { Platform, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import RealEstateScreen from './screens/RealEstateScreen';
import InvestmentScreen from './screens/InvestmentScreen';
import RetirementScreen from './screens/RetirementScreen';
import UserAccountsScreen from './screens/UserAccountsScreen';

const Tab = createBottomTabNavigator();

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
    tabBarActiveText: '#4CAF50', // Brighter green for active tab text
  },
};

const CombinedDarkTheme = {
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
    tabBarActiveText: '#4CAF50', // Brighter green for active tab text in dark mode
  },
};

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
        tabBarActiveTintColor: theme.colors.tabBarActiveText, // Set the active text color
        tabBarInactiveTintColor: theme.colors.tabBarText,
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
      <Tab.Screen name="InvestmentTab" component={InvestmentScreen} options={{ title: 'Investment' }} />
      <Tab.Screen name="RealEstateTab" component={RealEstateScreen} options={{ title: 'Real Estate' }} />
      <Tab.Screen name="RetirementTab" component={RetirementScreen} options={{ title: 'Retirement' }} />
      <Tab.Screen name="AccountTab" component={UserAccountsScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <BottomTabs />
      </NavigationContainer>
    </PaperProvider>
  );
}
