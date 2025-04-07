import Search from "@/components/Search/Search"
import { useNavigation } from "expo-router"
import { ArrowLeftIcon } from "lucide-react-native"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"

export default function SearchPage() {
  const navigation = useNavigation()
  return (
    <View className="py-1 px-4 flex-row items-center gap-2">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeftIcon size={20} color="black" />
      </TouchableOpacity>
      <Search />
    </View>
  )
}
