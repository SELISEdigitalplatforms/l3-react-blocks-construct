import { useState, useEffect, useCallback } from 'react';

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

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { key: 'length', label: 'Between 8 and 30 characters' },
  { key: 'case', label: 'At least 1 uppercase and 1 lowercase letter' },
  { key: 'number', label: 'At least 1 digit' },
  { key: 'special', label: 'At least 1 special character' },
];

const hasLowercase = /[a-z]/;
const hasUppercase = /[A-Z]/;
const hasNumber = /\d/;
const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

export const usePasswordStrength = (password: string) => {
  const [strength, setStrength] = useState(0);
  const [checks, setChecks] = useState<PasswordChecks>({
    length: false,
    case: false,
    number: false,
    special: false,
  });

  const validatePassword = useCallback(() => {
    const newChecks: PasswordChecks = {
      length: password.length >= 8 && password.length <= 30,
      case: hasLowercase.test(password) && hasUppercase.test(password),
      number: hasNumber.test(password),
      special: hasSpecialChar.test(password),
    };

    setChecks(newChecks);

    const strengthScore = Object.values(newChecks).filter(Boolean).length;
    setStrength(strengthScore * 25);

    return Object.values(newChecks).every(Boolean);
  }, [password]);

  useEffect(() => {
    validatePassword();
  }, [validatePassword]);

  const getStrengthColor = () => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return {
    strength,
    checks,
    allRequirementsMet: Object.values(checks).every(Boolean),
    getStrengthColor,
    requirements: PASSWORD_REQUIREMENTS,
  };
};
