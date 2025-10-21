import { z } from 'zod';

export const getSigninFormValidationSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(1, { message: t('USER_NAME_CANT_EMPTY') }),
    password: z.string().min(8, { message: t('PASSWORD_MIN_LENGTH') }),
  });

export type signinFormType = z.infer<ReturnType<typeof getSigninFormValidationSchema>>;

export const signinFormDefaultValue: signinFormType = {
  username: '',
  password: '',
};
