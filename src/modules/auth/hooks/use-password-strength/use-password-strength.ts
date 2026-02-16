import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const ALLOWED_SPECIAL_CHARS = '@$!%*?&';
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 30;
const STRENGTH_MULTIPLIER = 25;
const STRENGTH_THRESHOLDS = {
  WEAK: 25,
  MEDIUM: 50,
  STRONG: 75,
} as const;

const STRENGTH_COLORS = {
  WEAK: 'bg-red-500',
  MEDIUM_WEAK: 'bg-orange-500',
  MEDIUM_STRONG: 'bg-yellow-500',
  STRONG: 'bg-green-600',
} as const;

const REGEX_PATTERNS = {
  LOWERCASE: /[a-z]/,
  UPPERCASE: /[A-Z]/,
  DIGIT: /\d/,
  SPECIAL: new RegExp(`[${ALLOWED_SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`),
} as const;

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

const formatSpecialCharsDisplay = (chars: string): string => chars.split('').join(' ');

export const getPasswordRequirements = (t: (key: string) => string): PasswordRequirement[] => [
  { key: 'length', label: t('BETWEEN_EIGHT_THIRTY_CHARACTERS') },
  { key: 'case', label: t('AT_LEAST_ONE_UPPERCASE_AND_ONE_LOWERCASE_LETTER') },
  { key: 'number', label: t('AT_LEAST_ONE_DIGIT') },
  {
    key: 'special',
    label: `${t('AT_LEAST_ONE_SPECIAL_CHARACTER')} (${formatSpecialCharsDisplay(ALLOWED_SPECIAL_CHARS)})`,
  },
];

const createInitialChecks = (): PasswordChecks => ({
  length: false,
  case: false,
  number: false,
  special: false,
});

const validatePasswordChecks = (password: string): PasswordChecks => ({
  length: password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH,
  case: REGEX_PATTERNS.LOWERCASE.test(password) && REGEX_PATTERNS.UPPERCASE.test(password),
  number: REGEX_PATTERNS.DIGIT.test(password),
  special: REGEX_PATTERNS.SPECIAL.test(password),
});

const calculateStrength = (checks: PasswordChecks): number =>
  Object.values(checks).filter(Boolean).length * STRENGTH_MULTIPLIER;

const areAllRequirementsMet = (checks: PasswordChecks): boolean =>
  Object.values(checks).every(Boolean);

const getStrengthColor = (strength: number): string => {
  if (strength <= STRENGTH_THRESHOLDS.WEAK) return STRENGTH_COLORS.WEAK;
  if (strength <= STRENGTH_THRESHOLDS.MEDIUM) return STRENGTH_COLORS.MEDIUM_WEAK;
  if (strength <= STRENGTH_THRESHOLDS.STRONG) return STRENGTH_COLORS.MEDIUM_STRONG;
  return STRENGTH_COLORS.STRONG;
};

export const usePasswordStrength = (password: string) => {
  const { t } = useTranslation();
  const [strength, setStrength] = useState(0);
  const requirements = getPasswordRequirements(t);
  const [checks, setChecks] = useState<PasswordChecks>(createInitialChecks);

  const validatePassword = useCallback(() => {
    const newChecks = validatePasswordChecks(password);
    setChecks(newChecks);

    const strengthScore = calculateStrength(newChecks);
    setStrength(strengthScore);

    return areAllRequirementsMet(newChecks);
  }, [password]);

  useEffect(() => {
    validatePassword();
  }, [validatePassword]);

  return {
    strength,
    checks,
    allRequirementsMet: areAllRequirementsMet(checks),
    getStrengthColor: () => getStrengthColor(strength),
    requirements,
  };
};
