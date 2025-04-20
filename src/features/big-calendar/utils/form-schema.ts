import * as z from 'zod';

export const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  start: z.string(),
  end: z.string(),
  meetingLink: z.string().optional(),
  description: z.string().refine((value) => value.trim().split(/\s+/).length <= 100, {
    message: 'Description must be 100 words or less',
  }),
  color: z.string().nullable(),
  allDay: z.boolean().optional(),
  recurring: z.boolean().optional(),
  members: z.array(z.string()).optional(),
});

export type AddEventFormValues = z.infer<typeof formSchema>;
