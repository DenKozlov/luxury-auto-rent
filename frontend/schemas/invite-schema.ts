import { z } from "zod";

export const formSchema = z.object({
  email: z.email("Incorrect email format"),
  role: z.string().optional(),
});

export type InviteFormValues = z.infer<typeof formSchema>;
