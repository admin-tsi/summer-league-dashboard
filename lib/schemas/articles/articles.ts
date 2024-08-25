import { z } from "zod";

export const ArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published", "pending", "archived"]),
  featuredImage: z.string().optional(),
  excerpt: z.string().optional(),
  highlightsVideo: z.string().optional(),
  imagesGallery: z.array(z.string()).optional(),
});
