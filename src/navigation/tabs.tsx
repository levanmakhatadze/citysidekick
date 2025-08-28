import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/MapScreen';
import ARScreen from '../screens/ARScreen';
import ChatScreen from '../screens/ChatScreen';
import { Ionicons } from '@expo/vector-icons';

export type TabParamList = {
  Map: undefined;
  AR: undefined;
  Chat: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const map: Record<string, keyof typeof Ionicons.glyphMap> = {
          Map: 'map',
          AR: 'scan',
          Chat: 'chatbubble-ellipses',
        };
        const name = map[route.name] ?? 'ellipse';
        return <Ionicons name={name as any} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="AR" component={ARScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}
