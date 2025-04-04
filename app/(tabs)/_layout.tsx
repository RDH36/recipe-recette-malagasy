import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#e5e5e5",
          },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#999",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "",
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
          name="bookmarks/bookmarks"
          options={{
            title: "",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                size={24}
                color={color}
                style={{ marginTop: 1 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings/settings"
          options={{
            title: "",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={color}
                style={{ marginTop: 1 }}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
