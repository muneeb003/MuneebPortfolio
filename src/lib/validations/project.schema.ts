import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description_short: z.string().min(1, "Short description is required"),
  description_long: z.string(),
  cover_image_url: z.string().optional(),
  demo_url: z.string().optional(),
  github_url: z.string().optional(),
  tech_stack: z.array(z.string()),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean(),
  order: z.number().int(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
