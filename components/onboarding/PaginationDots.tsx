import { View } from "react-native";

type PaginationDotsProps = {
  currentIndex: number;
  totalSlides: number;
};

/**
 * Composant pour afficher les indicateurs de pagination
 */
export default function PaginationDots({
  currentIndex,
  totalSlides,
}: PaginationDotsProps) {
  return (
    <View className="flex-row justify-center items-center absolute bottom-40 left-0 right-0 z-10">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <View
          key={index}
          className={`h-2 mx-1 rounded-full ${
            currentIndex === index ? "w-5 bg-orange-500" : "w-2 bg-gray-300"
          }`}
        />
      ))}
    </View>
  );
}
