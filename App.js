import * as React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, Appbar, IconButton } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import RealEstateScreen from './screens/RealEstateScreen';
import InvestmentScreen from './screens/InvestmentScreen';
import RetirementScreen from './screens/RetirementScreen';
import UserAccountsScreen from './screens/UserAccountsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom AppBar for stack navigation
function CustomAppBar({ navigation, back, route }) {
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={route.name} />
    </Appbar.Header>
  );
}

// Stack Navigator for Home
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomAppBar {...props} />,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Real Estate
function RealEstateStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomAppBar {...props} />,
      }}
    >
      <Stack.Screen name="Real Estate" component={RealEstateScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Investment
function InvestmentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomAppBar {...props} />,
      }}
    >
      <Stack.Screen name="Investment" component={InvestmentScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Retirement
function RetirementStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomAppBar {...props} />,
      }}
    >
      <Stack.Screen name="Retirement" component={RetirementScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Account
function AccountStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomAppBar {...props} />,
      }}
    >
      <Stack.Screen name="Account" component={UserAccountsScreen} />
    </Stack.Navigator>
  );
}

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
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="InvestmentTab" component={InvestmentStack} options={{ title: 'Investment' }} />
      <Tab.Screen name="RealEstateTab" component={RealEstateStack} options={{ title: 'Real Estate' }} />
      <Tab.Screen name="RetirementTab" component={RetirementStack} options={{ title: 'Retirement' }} />
      <Tab.Screen name="AccountTab" component={AccountStack} options={{ title: 'Account' }} />
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
