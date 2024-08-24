export interface Article {
  _id: string;
  title: string;
  author: string | null;
  category: string;
  status: "draft" | "published" | "pending" | "archived";
  createdAt: string;
  likes: number;
  featuredArticle: boolean;
}
