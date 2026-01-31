import React from 'react';
import { Text, View, Image, StyleSheet, StatusBar, Share, Alert, TouchableOpacity } from 'react-native';
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

interface TabIconProps {
  focused: boolean;
  label: string;
  icon: string;
  iconFocused: string;
}

function TabIcon({ focused, label, icon, iconFocused }: TabIconProps) {
  return (
    <View style={styles.tabIconContainer}>
      <Ionicons
        name={focused ? iconFocused : icon}
        size={24}
        color={focused ? colors.primary : colors.textTertiary}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? colors.primary : colors.textTertiary },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tab.Screen
        name="Movies"
        component={MoviesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Movies" icon="film-outline" iconFocused="film" />
          ),
        }}
      />
      <Tab.Screen
        name="TVs"
        component={TVsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="TVs" icon="tv-outline" iconFocused="tv" />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Home" icon="home-outline" iconFocused="home" />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Search" icon="search-outline" iconFocused="search" />
          ),
        }}
      />
      <Tab.Screen
        name="Trending"
        component={TrendingByRegionScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Global" icon="globe-outline" iconFocused="globe" />
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
    <NavigationContainer>
      <StatusBar barStyle="default" />
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    height: 88,
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  tabLabel: {
    marginTop: 2,
    fontWeight: '500',
    fontSize: 10,
  },
});
