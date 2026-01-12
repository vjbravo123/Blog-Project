import { z } from "zod";

export const CreateBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  content: z.string().min(20, "Content is too short"),
  tags: z.string().optional(), // We will split this string into an array later
});