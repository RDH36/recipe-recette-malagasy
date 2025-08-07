import { ImageSourcePropType } from "react-native";

export interface Article {
  id: string;
  title: string;
  content: string;
  author: {
    id?: string;
    name: string;
    avatar?: ImageSourcePropType | string;
  };
  images?: ImageSourcePropType[] | string[];
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
    id?: string;
    name: string;
    avatar?: ImageSourcePropType | string;
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
