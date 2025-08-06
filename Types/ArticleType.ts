import { ImageSourcePropType } from "react-native";

export interface Article {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: ImageSourcePropType;
  };
  images?: ImageSourcePropType[];
  location?: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  isLikedByUser?: boolean;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: ImageSourcePropType;
  };
  content: string;
  createdAt: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  images?: string[];
  location?: string;
  tags: string[];
}
