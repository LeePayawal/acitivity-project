// server/validation.ts
import { z } from "zod";

export const CreateKeySchema = z.object({
  type: z.enum(["Running", "Dress shoes", "Sneakers", "Boots"]),
  brand: z.string().min(2).max(100),
  model: z.string().min(1).max(100),
  size: z.string().min(1).max(20),
  price: z.number().min(1),
  imageUrl: z.string().url().optional(),
});

export const DeleteKeySchema = z.object({
  keyId: z.string().uuid(),
});
