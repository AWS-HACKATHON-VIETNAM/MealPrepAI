import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import HomeScreen from '../screens/main/HomeScreen';
import GroceryListScreen from '../screens/main/GroceryListScreen';
import SavedRecipesScreen from '../screens/main/SavedRecipesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { COLORS, FONT_SIZES } from '../utils/constants';

const Tab = createBottomTabNavigator();

// Simple icon component (you can replace with react-native-vector-icons)
const TabIcon = ({ name, focused }) => {
  const getIconText = () => {
    switch (name) {
      case 'Home':
        return '🏠';
      case 'Grocery':
        return '🛒';
      case 'Saved':
        return '💾';
      case 'Profile':
        return '👤';
      default:
        return '●';
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{getIconText()}</Text>
      <Text
        style={{
          fontSize: FONT_SIZES.small,
          color: focused ? COLORS.primary : COLORS.textSecondary,
          fontWeight: focused ? '600' : '400',
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Grocery" component={GroceryListScreen} />
      <Tab.Screen name="Saved" component={SavedRecipesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
