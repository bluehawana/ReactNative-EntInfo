import * as React from "react";
import { Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Movies from "./components/pages/Movies";
import TVs from "./components/pages/TVs";
import Home from "./components/pages/Home";
import Search from "./components/pages/Search";
import WatchingList from "./components/pages/WatchingList";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          showLabel: false,
          style: {
            position: "absolute",
            elevation: 0,
            backgroundColor: "white",
            borderRadius: 15,
            height: 90,
          },
        }}
      >
        <Tab.Screen
          name="Movies"
          component={Movies}
          options={{
            tabBarShowLabel: false,
            tabBarStyle: [
              {
                display: "flex",
              },
              null,
            ],

            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={require("./assets/icons/Movies.png")}
                  resizeMode="contain"
                  style={{
                    width: 17,
                    height: 17,
                    tintColor: focused ? "blue" : "gray",
                  }}
                />
                <Text
                  style={{ color: focused ? "blue" : "gray", fontSize: 10 }}
                >
                  Movies
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="TVs"
          component={TVs}
          options={{
            tabBarShowLabel: false,
            tabBarStyle: [
              {
                display: "flex",
              },
              null,
            ],
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={require("./assets/icons/TVs.png")}
                  resizeMode="contain"
                  style={{
                    width: 17,
                    height: 17,
                    tintColor: focused ? "blue" : "gray",
                  }}
                />
                <Text
                  style={{ color: focused ? "blue" : "gray", fontSize: 10 }}
                >
                  TVs
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarShowLabel: false,
            tabBarStyle: [
              {
                display: "flex",
              },
              null,
            ],
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={require("./assets/icons/Home.png")}
                  resizeMode="contain"
                  style={{
                    width: 17,
                    height: 17,
                    tintColor: focused ? "blue" : "gray",
                  }}
                />
                <Text
                  style={{ color: focused ? "blue" : "gray", fontSize: 10 }}
                >
                  Home
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarShowLabel: false,
            tabBarStyle: [
              {
                display: "flex",
              },
              null,
            ],
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={require("./assets/icons/Search.png")}
                  resizeMode="contain"
                  style={{
                    width: 17,
                    height: 17,
                    tintColor: focused ? "blue" : "gray",
                  }}
                />
                <Text
                  style={{ color: focused ? "blue" : "gray", fontSize: 10 }}
                >
                  Search
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="WatchingList"
          component={WatchingList}
          options={{
            tabBarShowLabel: false,
            tabBarStyle: [
              {
                display: "flex",
              },
              null,
            ],
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={require("./assets/icons/WatchingList.png")}
                  resizeMode="contain"
                  style={{
                    width: 17,
                    height: 17,
                    tintColor: focused ? "blue" : "gray",
                  }}
                />
                <Text
                  style={{ color: focused ? "blue" : "gray", fontSize: 10 }}
                >
                  WatchingList
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
