import * as z from 'zod';

/**
 * Zod schema for validating calendar event form data.
 * 
 * This schema defines the structure and validation rules for calendar event forms,
 * ensuring data integrity before events are created or updated. It handles validation
 * for all required and optional fields with appropriate constraints.
 *
 * @property title - Required event title (non-empty string)
 * @property start - Event start time as a string (will be converted to Date)
 * @property end - Event end time as a string (will be converted to Date)
 * @property meetingLink - Optional URL for virtual meetings
 * @property description - Event description with a 100-word limit
 * @property color - Color code for the event (can be null)
 * @property allDay - Whether the event spans the entire day
 * @property recurring - Whether the event repeats on a schedule
 * @property members - Optional array of member IDs who are invited to the event
 */
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

/**
 * Type definition for calendar event form values.
 * 
 * This type is inferred from the Zod schema and represents the structure of
 * validated form data for calendar events. It's used for type checking in form
 * handling components and ensures consistency between validation and usage.
 *
 * @see formSchema - The Zod schema this type is derived from
 */
export type AddEventFormValues = z.infer<typeof formSchema>;
