import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { Comment } from "../../Types/ArticleType";

interface PendingComment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  isPending: true;
}

type CommentOrPending = Comment | PendingComment;

interface CommentsListProps {
  comments: Comment[];
  pendingComments?: PendingComment[];
}

export default function CommentsList({ comments, pendingComments = [] }: CommentsListProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Rafraîchir les dates toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 60000); // 60 secondes

    return () => clearInterval(interval);
  }, []);

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "À l'instant";
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays}j`;
    } else {
      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks < 4) {
        return `Il y a ${diffInWeeks}sem`;
      } else {
        const diffInMonths = Math.floor(diffInDays / 30);
        return `Il y a ${diffInMonths}mois`;
      }
    }
  };

  // Combiner les commentaires réels et en attente
  const allComments: CommentOrPending[] = [...comments, ...pendingComments];

  if (allComments.length === 0) {
    return (
      <View className="items-center py-8">
        <Text className="text-gray-500 text-base mb-2">
          Aucun commentaire pour le moment
        </Text>
        <Text className="text-gray-400 text-sm">
          Soyez le premier à commenter !
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-4">
      {allComments.map((comment: CommentOrPending) => (
        <View key={comment.id} className="flex-row">
          {comment.author.avatar ? (
            <Image
              source={
                typeof comment.author.avatar === "string"
                  ? { uri: comment.author.avatar }
                  : comment.author.avatar
              }
              className="w-8 h-8 rounded-full mr-3"
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mr-3">
              <Text className="text-orange-600 font-semibold text-sm">
                {comment.author.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <View className={`rounded-lg p-3 mb-1 ${
              'isPending' in comment ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
            }`}>
              <View className="flex-row items-center mb-1">
                <Text className="font-semibold text-gray-800 text-sm">
                  {comment.author.name}
                </Text>
                {'isPending' in comment && (
                  <View className="ml-2 flex-row items-center">
                    <View className="w-2 h-2 bg-orange-400 rounded-full mr-1 animate-pulse" />
                    <Text className="text-orange-600 text-xs font-medium">
                      En cours...
                    </Text>
                  </View>
                )}
              </View>
              <Text className={`text-sm ${
                'isPending' in comment ? 'text-gray-600' : 'text-gray-700'
              }`}>
                {comment.content}
              </Text>
            </View>
            <Text className="text-gray-400 text-xs ml-3">
              {formatCommentDate(comment.createdAt)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
