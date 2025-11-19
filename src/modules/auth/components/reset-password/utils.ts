import {
  createPasswordValidationSchema,
  PasswordFormType,
  passwordFormDefaultValues,
} from '../../../../lib/utils/validation/password-validation';

/**
 * Reset Password Form Schema
 *
 * Defines the validation schema, type definition, and default values for the reset password form.
 * This module reuses common password validation logic from a shared password validation module.
 *
 * Exports:
 * - resetPasswordFormValidationSchema: Zod validation schema for password reset, created from common password validation schema
 * - resetPasswordFormType: TypeScript type for the reset password form, aliased from common password form type
 * - resetPasswordFormDefaultValue: Default initial values for the form, reused from common password defaults
 *
 * @module resetPasswordForm
 */

export const getResetPasswordFormValidationSchema = (t: (key: string) => string) =>
  createPasswordValidationSchema(t);
export type resetPasswordFormType = PasswordFormType;
export const resetPasswordFormDefaultValue = passwordFormDefaultValues;
