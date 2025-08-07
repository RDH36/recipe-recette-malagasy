import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddCommentFormProps {
  onSubmit: (comment: string) => void;
  isSubmitting: boolean;
}

export default function AddCommentForm({ onSubmit, isSubmitting }: AddCommentFormProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (newComment.trim()) {
      onSubmit(newComment.trim());
      setNewComment("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="bg-white border-t border-gray-100"
    >
      <View className="flex-row items-center p-4 space-x-3">
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Ajoutez un commentaire..."
          multiline
          className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 max-h-24"
          editable={!isSubmitting}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!newComment.trim() || isSubmitting}
          className={`p-3 rounded-lg ${
            newComment.trim() && !isSubmitting
              ? "bg-orange-500"
              : "bg-gray-200"
          }`}
        >
          {isSubmitting ? (
            <View className="w-6 h-6 items-center justify-center">
              <Text className="text-gray-500 text-xs">...</Text>
            </View>
          ) : (
            <Ionicons
              name="send"
              size={20}
              color={newComment.trim() ? "white" : "#9CA3AF"}
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
