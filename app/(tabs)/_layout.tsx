import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable } from "react-native";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0.5,
            borderTopColor: "rgba(97, 97, 97, 0.2)",
          },
          tabBarActiveTintColor: "#FF8050",
          tabBarInactiveTintColor: "#757575",
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={{ color: "transparent" }}
              style={({ pressed }) => [
                props.style,
                pressed && { opacity: 0.5 },
              ]}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Accueil",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
                style={{ marginTop: 1 }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="search/Search"
          options={{
            title: "Rechercher",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={24}
                color={color}
                style={{ marginTop: 1 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="community/index"
          options={{
            title: "Communauté",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={24}
                color={color}
                style={{ marginTop: 1 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarks/bookmarks"
          options={{
            title: "Favoris",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={24}
                color={color}
                style={{ marginTop: 1 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/Profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={color}
                style={{ marginTop: 1 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="community/create"
          options={{
            href: null, // Cache cet écran de la navigation
          }}
        />
        <Tabs.Screen
          name="community/article/[id]"
          options={{
            href: null, // Cache cet écran de la navigation
          }}
        />
      </Tabs>
    </>
  );
}
