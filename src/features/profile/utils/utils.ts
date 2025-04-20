import { z } from 'zod';

export const createUserFormValidationSchema = z.object({
  firstName: z.string().min(1, "First name can't be empty"),
  lastName: z.string().min(1, "Last name can't be empty"),
  email: z.string().email(),
});

export type CreateUserFormType = typeof profileFormDefaultvalue;

export const createUserFormDefaultvalue = {
  firstName: '',
  lastName: '',
  email: '',
};

export const profileFormValidationSchema = z.object({
  firstName: z.string().min(1, "First name can't be empty"),
  lastName: z.string().min(1, "Last name can't be empty"),
  // email: z.string().email(),
});

export type ProfileFormType = typeof profileFormDefaultvalue;

export const profileFormDefaultvalue = {
  itemId: '',
  firstName: '',
  lastName: '',
  email: '',
};

export const changePasswordFormValidationSchema = z.object({
  oldPassword: z.string().min(1, "Current password can't be empty"),
  newPassword: z.string().min(8, 'Password must be at least 8 character long'),
  confirmNewPassword: z.string().min(8, 'Password must be at least 8 character long'),
});

export type changePasswordFormType = z.infer<typeof changePasswordFormValidationSchema>;

export const changePasswordFormDefaultValue: changePasswordFormType = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};
