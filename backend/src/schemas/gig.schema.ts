import { z } from 'zod';

export const createGigSchema = z.object({
  workerId: z
    .string()
    .uuid('workerId must be a valid UUID'),

  location: z
    .string()
    .min(3, 'location must be at least 3 characters'),

  title: z
    .string()
    .optional(),

  expectedDurationMinutes: z
    .number()
    .int('expectedDurationMinutes must be an integer')
    .min(15, 'expectedDurationMinutes must be at least 15')
    .default(60)
    .optional(),
});

export type CreateGigInput = z.infer<typeof createGigSchema>;
