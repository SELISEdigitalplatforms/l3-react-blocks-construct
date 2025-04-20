import { z } from 'zod';

/**
 * Sign Up Form Schema
 *
 * Defines the validation schema, type definition, and default values for the user sign-up form.
 * This module ensures that the username field is not left empty.
 *
 * Exports:
 * - signupFormValidationSchema: Zod validation schema for the sign-up form
 * - signupFormType: TypeScript type for the sign-up form, inferred from the schema
 * - signupFormDefaultValue: Default initial values for the sign-up form
 *
 * @module signupForm
 */

export const signupFormValidationSchema = z.object({
  username: z.string().min(1, "user name can't be empty"),
});

export type signupFormType = z.infer<typeof signupFormValidationSchema>;

export const signupFormDefaultValue: signupFormType = {
  username: '',
};
