import { z } from 'zod';

const ALLOWED_SPECIAL_CHARS = '@$!%*?&';

// const PASSWORD_REGEX = new RegExp(
//   // eslint-disable-next-line no-useless-escape
//   `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d${ALLOWED_SPECIAL_CHARS.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]{8,30}$`
// );

const PASSWORD_REGEX = new RegExp(
  // eslint-disable-next-line no-useless-escape
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]{8,30}$`
);

export const createPasswordValidationSchema = () =>
  z
    .object({
      password: z.string().refine((password) => PASSWORD_REGEX.test(password), {
        message: `Password must contain lowercase, uppercase, number, and only these special characters: ${ALLOWED_SPECIAL_CHARS}`,
      }),
      confirmPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(30, 'Password must not exceed 30 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    });

export type PasswordFormType = z.infer<ReturnType<typeof createPasswordValidationSchema>>;

export const passwordFormDefaultValues: PasswordFormType = {
  password: '',
  confirmPassword: '',
};

export const PASSWORD_REQUIREMENTS = [
  {
    key: 'length',
    label: 'Between 8 and 30 characters',
    regex: (password: string) => password.length >= 8 && password.length <= 30,
  },
  {
    key: 'case',
    label: 'At least 1 uppercase and 1 lowercase letter',
    regex: (password: string) => /(?=.*[a-z])(?=.*[A-Z])/.test(password),
  },
  {
    key: 'number',
    label: 'At least 1 digit',
    regex: (password: string) => /(?=.*\d)/.test(password),
  },
  {
    key: 'special',
    label: `At least 1 special character (${ALLOWED_SPECIAL_CHARS.split('').join(' ')})`,
    regex: (password: string) => /(?=.*[@$!%*?&])/.test(password),
  },
  // {
  //   key: 'disallowedChars',
  //   label: 'No disallowed special characters',
  //   regex: (password: string) => !/[^A-Za-z\d@$!%*?&]/.test(password),
  // },
];
