import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { Pressable } from "react-native"

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
              style={({ pressed }) => [props.style, pressed && { opacity: 1 }]}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
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
            title: "Favorites",
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
            title: "Settings",
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
  )
}
