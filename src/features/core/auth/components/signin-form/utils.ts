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

export const getSigninFormValidationSchema = (t: (key: string) => string) => z.object({
  username: z.string().min(1, { message: t('USER_NAME_CANT_EMPTY') }),
  password: z.string().min(8, { message: t('PASSWORD_MIN_LENGTH') }),
});

export type signinFormType = z.infer<ReturnType<typeof getSigninFormValidationSchema>>;

export const signinFormDefaultValue: signinFormType = {
  username: '',
  password: '',
};
