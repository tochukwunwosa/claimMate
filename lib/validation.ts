import { z } from "zod";

export const waitListSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  profession: z.enum(["agent", "adjuster", "other"]).optional(),
  painPoints: z.string().optional(),
  featureRequests: z.string().optional(),
})

