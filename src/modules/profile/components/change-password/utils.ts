import z from 'zod';

export const getChangePasswordValidationSchemas = (t: (key: string) => string) =>
  z.object({
    oldPassword: z.string().min(1, { message: t('CURRENT_PASSWORD_CANT_EMPTY') }),
    newPassword: z.string().min(8, { message: t('PASSWORD_MUST_EIGHT_CHARACTER_LONG') }),
    confirmNewPassword: z.string().min(8, { message: t('PASSWORD_MUST_EIGHT_CHARACTER_LONG') }),
  });

export type changePasswordFormType = z.infer<ReturnType<typeof getChangePasswordValidationSchemas>>;

export const changePasswordFormDefaultValue: changePasswordFormType = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};
