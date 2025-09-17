import { z } from "zod";

export const CreateKeySchema = z.object({
  brand: z.string().min(2).max(100),
  storage: z.string().min(1).max(50),
  cpu: z.string().min(2).max(100),
  price: z.number().min(1),
  imageUrl: z.string().url().optional(),
});

export const DeleteKeySchema = z.object({
  keyId: z.string().uuid(),
});
