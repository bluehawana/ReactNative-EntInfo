import React from 'react';
import { StyleSheet, StatusBar, Share, Alert, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './services/queryClient';
import { MoviesScreen } from './components/screens/MoviesScreen';
import { TVsScreen } from './components/screens/TVsScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { TrendingByRegionScreen } from './components/screens/TrendingByRegionScreen';
import { DetailScreen } from './components/screens/DetailScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AuthProvider } from './hooks/useAuth';
import { colors } from './theme/simple';
import { Ionicons } from '@expo/vector-icons';

const isTV = Platform.isTV;

type RootStackParamList = {
  MainTabs: undefined;
  Detail: { id: number; mediaType: 'movie' | 'tv' };
};

type TabParamList = {
  Movies: undefined;
  TVs: undefined;
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  Trending: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICON_SIZE = isTV ? 32 : 22;

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
            <Ionicons name={focused ? 'home' : 'home-outline'} size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Movies"
        component={MoviesScreen}
        options={{
          tabBarLabel: 'Movies',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'film' : 'film-outline'} size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TVs"
        component={TVsScreen}
        options={{
          tabBarLabel: 'TV',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'tv' : 'tv-outline'} size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Trending"
        component={TrendingByRegionScreen}
        options={{
          tabBarLabel: 'Global',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'globe' : 'globe-outline'} size={TAB_ICON_SIZE} color={color} />
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
        message: 'Check out this movie/TV show on 2Watch app!',
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
          options={({ navigation }) => ({
            headerTitle: '',
            headerBackVisible: false,
            headerTransparent: true,
            headerTintColor: colors.textInverse,
            headerLeftContainerStyle: { paddingLeft: 10 },
            headerRightContainerStyle: { paddingRight: 10 },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.detailHeaderButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color={colors.textInverse} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={handleShare} style={styles.detailHeaderButton}>
                <Ionicons name="share-outline" size={22} color={colors.textInverse} />
              </TouchableOpacity>
            ),
            contentStyle: { backgroundColor: colors.background },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowColor: 'transparent',
    borderTopWidth: 0,
    position: isTV ? 'relative' : 'absolute',
    bottom: isTV ? undefined : 0,
    left: isTV ? undefined : 0,
    right: isTV ? undefined : 0,
    height: isTV ? 70 : 90,
    paddingBottom: isTV ? 10 : 28,
    paddingTop: 8,
    paddingHorizontal: isTV ? 40 : 10,
    backgroundColor: isTV ? colors.background : 'rgba(15,23,30,0.98)',
  },
  tabLabel: {
    fontSize: isTV ? 14 : 10,
    fontWeight: '600',
    marginTop: 2,
  },
  detailHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
