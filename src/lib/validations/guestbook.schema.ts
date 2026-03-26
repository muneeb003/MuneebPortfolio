import { z } from "zod";

export const guestbookSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  message: z
    .string()
    .min(1, "Message is required")
    .max(280, "Message must be 280 characters or fewer"),
});

export type GuestbookFormData = z.infer<typeof guestbookSchema>;
