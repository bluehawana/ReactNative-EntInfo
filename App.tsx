import React from 'react';
import { StyleSheet, StatusBar, Share, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/queryClient';
import { MoviesScreen } from './components/screens/MoviesScreen';
import { TVsScreen } from './components/screens/TVsScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { TrendingByRegionScreen } from './components/screens/TrendingByRegionScreen';
import { DetailScreen } from './components/screens/DetailScreen';
import { colors, spacing } from './theme/simple';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  MainTabs: undefined;
  Detail: { id: number; mediaType: 'movie' | 'tv' };
};

type TabParamList = {
  Movies: undefined;
  TVs: undefined;
  Home: undefined;
  Search: undefined;
  Trending: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Movies"
        component={MoviesScreen}
        options={{
          tabBarLabel: 'Movies',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'film' : 'film-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TVs"
        component={TVsScreen}
        options={{
          tabBarLabel: 'TV',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'tv' : 'tv-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Trending"
        component={TrendingByRegionScreen}
        options={{
          tabBarLabel: 'Global',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'globe' : 'globe-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this movie/TV show on EntInfo app!',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share');
    }
  };

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.background,
          text: colors.text,
          border: colors.border,
          notification: colors.primary,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          presentation: 'modal',
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            headerTitle: '',
            headerBackTitle: 'Back',
            headerTransparent: true,
            headerTintColor: colors.textInverse,
            headerRight: () => (
              <TouchableOpacity onPress={handleShare} style={{ marginRight: 16 }}>
                <Ionicons name="share-outline" size={24} color={colors.textInverse} />
              </TouchableOpacity>
            ),
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowColor: 'transparent',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    paddingBottom: 28,
    paddingTop: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(15,23,30,0.98)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
