import { z } from 'zod';

/**
 * Sign In Form Schema
 *
 * Defines the validation schema, type definition, and default values for the user sign-in form.
 * This module ensures that the username is not empty and the password meets the minimum length requirement.
 *
 * Exports:
 * - signinFormValidationSchema: Zod validation schema for the sign-in form
 * - signinFormType: TypeScript type for the sign-in form, inferred from the schema
 * - signinFormDefaultValue: Default initial values for the sign-in form
 *
 * @module signinForm
 */

export const signinFormValidationSchema = z.object({
  username: z.string().min(1, "User name can't be empty"),
  password: z.string().min(8, 'Password must be at least 8 character long'),
});

export type signinFormType = z.infer<typeof signinFormValidationSchema>;

export const signinFormDefaultValue: signinFormType = {
  username: 'demo.construct@seliseblocks.com',
  password: 'H%FE*FYi5oTQ!VyT6TkEy',
};
