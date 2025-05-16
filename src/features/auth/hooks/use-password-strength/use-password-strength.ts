import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const ALLOWED_SPECIAL_CHARS = '@$!%*?&';

export interface PasswordChecks {
  length: boolean;
  case: boolean;
  number: boolean;
  special: boolean;
}

export interface PasswordRequirement {
  key: keyof PasswordChecks;
  label: string;
}

export const getPasswordRequirements = (t: (key: string) => string): PasswordRequirement[] => [
  { key: 'length', label: t('BETWEEN_EIGHT_THIRTY_CHARACTERS') },
  { key: 'case', label: t('AT_LEAST_ONE_UPPERCASE_AND_ONE_LOWERCASE_LETTER') },
  { key: 'number', label: t('AT_LEAST_ONE_DIGIT') },
  {
    key: 'special',
    label: `${t('AT_LEAST_ONE_SPECIAL_CHARACTER')} (${ALLOWED_SPECIAL_CHARS.split('').join(' ')})`,
  },
];

export const usePasswordStrength = (password: string) => {
  const { t } = useTranslation();
  const [strength, setStrength] = useState(0);
  const requirements = getPasswordRequirements(t);
  const [checks, setChecks] = useState<PasswordChecks>({
    length: false,
    case: false,
    number: false,
    special: false,
  });

  const validatePassword = useCallback(() => {
    const newChecks: PasswordChecks = {
      length: password.length >= 8 && password.length <= 30,
      case: /[a-z]/.test(password) && /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    setChecks(newChecks);

    const strengthScore = Object.values(newChecks).filter(Boolean).length * 25; // Adjusted to 25 for 100% scale
    setStrength(strengthScore);

    return Object.values(newChecks).every(Boolean);
  }, [password]);

  useEffect(() => {
    validatePassword();
  }, [validatePassword]);

  const getStrengthColor = () => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  return {
    strength,
    checks,
    allRequirementsMet: Object.values(checks).every(Boolean),
    getStrengthColor,
    requirements,
  };
};
