import { SearchIcon } from "lucide-react-native"
import React from "react"
import { TextInput, View } from "react-native"

export default function Search() {
  return (
    <View className="relative flex flex-1 items-center">
      <SearchIcon className="absolute left-3 top-2 z-10 h-4 w-4 text-gray-400" />
      <TextInput
        placeholder="Search recipes..."
        className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm shadow-sm"
        autoFocus
        enterKeyHint="search"
      />
    </View>
  )
}
