import { z } from 'zod';

/**
 * Forgot Password Form Schema
 *
 * Defines the validation schema, type definition, and default values for the forgot password form.
 * These utilities work together to provide type safety and validation for the forgot password workflow.
 *
 * Exports:
 * - forgotPasswordFormValidationSchema: Zod validation schema that enforces email presence
 * - forgotPasswordFormType: TypeScript type derived from the validation schema
 * - forgotPasswordFormDefaultValue: Default initial values for the form
 *
 * @module forgotPasswordForm
 */

/**
 * Zod validation schema for the forgot password form
 *
 * Validates that:
 * - Email field is a string and not empty
 */
export const getForgotPasswordFormValidationSchema = (t: (key: string) => string) => z.object({
  email: z.string().min(1, { message: t('EMAIL_NAME_CANT_EMPTY') }),
});

/**
 * TypeScript type definition for the forgot password form
 * Inferred from the Zod validation schema
 */

export type forgotPasswordFormType = z.infer<ReturnType<typeof getForgotPasswordFormValidationSchema>>;

/**
 * Default values for the forgot password form
 * Provides an empty email string as the initial state
 */
export const forgotPasswordFormDefaultValue: forgotPasswordFormType = {
  email: '',
};
