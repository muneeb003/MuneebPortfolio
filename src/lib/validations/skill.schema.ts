import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_id: z.string().uuid("Invalid category"),
  icon_slug: z.string().optional().or(z.literal("")),
  proficiency: z.number().int().min(1).max(5).default(3),
  order: z.number().int().default(0),
  color: z.string().optional().or(z.literal("")),
});

export type SkillFormData = z.infer<typeof skillSchema>;

export const skillCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  order: z.number().int().default(0),
});
