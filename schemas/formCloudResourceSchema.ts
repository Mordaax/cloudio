import { z } from "zod";

export const formCloudResourceSchema = z.object({
  name: z.string().min(4),
  description: z.string().optional(),
});

export type formCloudResourceSchemaType = z.infer<typeof formCloudResourceSchema>;