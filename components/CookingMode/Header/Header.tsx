import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center mb-4">
      <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <ArrowLeft size={24} className="text-primary-light" />
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-primary-light">
        Vous êtes en train de cuisiner {title}
      </Text>
    </View>
  );
};

export default Header;
