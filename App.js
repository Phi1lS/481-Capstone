import * as React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import RealEstateScreen from './screens/RealEstateScreen';
import InvestmentScreen from './screens/InvestmentScreen';
import RetirementScreen from './screens/RetirementScreen';
import UserAccountsScreen from './screens/UserAccountsScreen';

const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function BottomTabs() {
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
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? 40 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 120 : 70,
          backgroundColor: '#f7f9fc',
          borderTopColor: '#e0e0e0',
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
  return (
    <PaperProvider>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </PaperProvider>
  );
}
