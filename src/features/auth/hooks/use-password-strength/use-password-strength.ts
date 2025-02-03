import { useState, useEffect, useCallback } from 'react';

const ALLOWED_SPECIAL_CHARS = '@$!%*?&';

export interface PasswordChecks {
  length: boolean;
  case: boolean;
  number: boolean;
  special: boolean;
  disallowedChars: boolean;
}

export interface PasswordRequirement {
  key: keyof PasswordChecks;
  label: string;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { key: 'length', label: 'Between 8 and 30 characters' },
  { key: 'case', label: 'At least 1 uppercase and 1 lowercase letter' },
  { key: 'number', label: 'At least 1 digit' },
  {
    key: 'special',
    label: `At least 1 special character (${ALLOWED_SPECIAL_CHARS.split('').join(' ')})`,
  },
  { key: 'disallowedChars', label: 'No disallowed special characters' },
];

export const usePasswordStrength = (password: string) => {
  const [strength, setStrength] = useState(0);
  const [checks, setChecks] = useState<PasswordChecks>({
    length: false,
    case: false,
    number: false,
    special: false,
    disallowedChars: false,
  });

  const validatePassword = useCallback(() => {
    const specialCharsRegex = new RegExp(
      // eslint-disable-next-line no-useless-escape
      `[^A-Za-z\\d${ALLOWED_SPECIAL_CHARS.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]`
    );

    const newChecks: PasswordChecks = {
      length: password.length >= 8 && password.length <= 30,
      case: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
      number: /(?=.*\d)/.test(password),
      special: /(?=.*[@$!%*?&])/.test(password),
      disallowedChars: !specialCharsRegex.test(password),
    };

    setChecks(newChecks);

    const strengthScore = Object.values(newChecks).filter(Boolean).length;
    setStrength(strengthScore * 20);

    return Object.values(newChecks).every(Boolean);
  }, [password]);

  useEffect(() => {
    validatePassword();
  }, [validatePassword]);

  const getStrengthColor = () => {
    if (strength <= 20) return 'bg-red-500';
    if (strength <= 40) return 'bg-orange-500';
    if (strength <= 60) return 'bg-yellow-500';
    if (strength <= 80) return 'bg-green-500';
    return 'bg-green-600';
  };

  return {
    strength,
    checks,
    allRequirementsMet: Object.values(checks).every(Boolean),
    getStrengthColor,
    requirements: PASSWORD_REQUIREMENTS,
  };
};
