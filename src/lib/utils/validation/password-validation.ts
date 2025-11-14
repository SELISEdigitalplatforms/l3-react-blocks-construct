import { z } from 'zod';

const ALLOWED_SPECIAL_CHARS = '@$!%*?&';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,30}$/;

export const createPasswordValidationSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z.string().refine((password) => PASSWORD_REGEX.test(password), {
        message: `${t('PASSWORD_CONTAIN_LOWER_UPPER_SPECAIAL_CHARACTERS')} (${ALLOWED_SPECIAL_CHARS})`,
      }),
      confirmPassword: z
        .string()
        .min(8, { message: t('PASSWORD_MUST_LEAST_EIGHT_CHARACTERS') })
        .max(30, { message: t('PASSWORD_MUST_NOT_EXCEED_THIRTY_CHAR') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('PASSWORDS_MUST_MATCH'),
      path: ['confirmPassword'],
    });

export type PasswordFormType = z.infer<ReturnType<typeof createPasswordValidationSchema>>;

export const passwordFormDefaultValues: PasswordFormType = {
  password: '',
  confirmPassword: '',
};

export const getPasswordRequirements = (t: (key: string) => string) => [
  {
    key: 'length',
    label: t('BETWEEN_EIGHT_THIRTY_CHARACTERS'),
    regex: (password: string) => password.length >= 8 && password.length <= 30,
  },
  {
    key: 'case',
    label: t('AT_LEAST_ONE_UPPERCASE_AND_ONE_LOWERCASE_LETTER'),
    regex: (password: string) => {
      return /[a-z]/.test(password) && /[A-Z]/.test(password);
    },
  },
  {
    key: 'number',
    label: t('AT_LEAST_ONE_DIGIT'),
    regex: (password: string) => /\d/.test(password),
  },
  {
    key: 'special',
    label: t('AT_LEAST_ONE_SPECIAL_CHARACTER'),
    regex: (password: string) => /[@$!%*?&]/.test(password),
  },
];
