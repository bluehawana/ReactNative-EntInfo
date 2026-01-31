import React from 'react';
import { Text, View, Image, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/queryClient';
import { MoviesScreen } from './components/screens/MoviesScreen';
import { TVsScreen } from './components/screens/TVsScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { WatchingListScreen } from './components/screens/WatchingListScreen';
import { DetailScreen } from './components/screens/DetailScreen';
import { ThemeProvider, useTheme } from './theme';

type RootStackParamList = {
  MainTabs: undefined;
  Detail: { id: number; mediaType: 'movie' | 'tv' };
};

type TabParamList = {
  Movies: undefined;
  TVs: undefined;
  Home: undefined;
  Search: undefined;
  WatchingList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  focused: boolean;
  label: string;
  icon: ReturnType<typeof require>;
}

function TabIcon({ focused, label, icon }: TabIconProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.tabIconContainer}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[
          styles.tabIcon,
          { tintColor: focused ? colors.primary : colors.textTertiary, width: 20, height: 20 },
        ]}
      />
      <Text
        style={[
          styles.tabLabel,
          {
            color: focused ? colors.primary : colors.textTertiary,
            fontSize: 10,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  const { colors, spacing } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: spacing.sm,
            paddingTop: spacing.xs,
            height: spacing.lg + spacing.md,
          },
        ],
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
            <TabIcon focused={focused} label="Movies" icon={require('./assets/icons/Movies.png')} />
          ),
        }}
      />
      <Tab.Screen
        name="TVs"
        component={TVsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="TVs" icon={require('./assets/icons/TVs.png')} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Home" icon={require('./assets/icons/Home.png')} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Search" icon={require('./assets/icons/Search.png')} />
          ),
        }}
      />
      <Tab.Screen
        name="WatchingList"
        component={WatchingListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Watchlist" icon={require('./assets/icons/WatchingList.png')} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { colors } = useTheme();
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
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            headerTitle: '',
            headerBackTitle: 'Back',
            headerTransparent: true,
            headerTintColor: colors.textInverse,
            cardStyle: { backgroundColor: colors.background },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    transform: [{ scale: 0.85 }],
    marginBottom: -25,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 5,
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
  tabLabel: {
    marginTop: 4,
    fontWeight: '500',
  },
});
