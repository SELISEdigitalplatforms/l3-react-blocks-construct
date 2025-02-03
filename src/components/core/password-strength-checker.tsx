import React, { useState, useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';

const ALLOWED_SPECIAL_CHARS = '@$!%*?&';

interface PasswordChecks {
  length: boolean;
  case: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordRequirement {
  key: keyof PasswordChecks;
  label: string;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { key: 'length', label: 'Between 8 and 30 characters' },
  { key: 'case', label: 'At least 1 uppercase and 1 lowercase letter' },
  { key: 'number', label: 'At least 1 digit' },
  {
    key: 'special',
    label: `At least 1 special character (${ALLOWED_SPECIAL_CHARS.split('').join(' ')})`,
  },
];

interface PasswordStrengthIndicatorProps {
  password: string;
  confirmPassword?: string;
  onRequirementsMet?: (isValid: boolean) => void;
}

const PasswordStrengthIndicator = ({
  password,
  confirmPassword,
  onRequirementsMet,
}: PasswordStrengthIndicatorProps) => {
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
      case: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
      number: /(?=.*\d)/.test(password),
      special: /(?=.*[@$!%*?&])/.test(password),
    };

    setChecks(newChecks);

    // Calculate strength score
    const strengthScore = Object.values(newChecks).filter(Boolean).length;

    // Additional check for password match
    const passwordsMatch = confirmPassword
      ? password === confirmPassword && password.length > 0
      : true;

    // Adjust strength based on password match
    const finalStrength = passwordsMatch ? strengthScore * 25 : Math.min(strengthScore * 25, 75); // Cap at 75% if passwords don't match

    setStrength(finalStrength);

    const isValid = Object.values(newChecks).every(Boolean) && passwordsMatch;
    if (onRequirementsMet) {
      onRequirementsMet(isValid);
    }

    return isValid;
  }, [password, confirmPassword, onRequirementsMet]);

  useEffect(() => {
    validatePassword();
  }, [validatePassword]);

  const getStrengthColor = () => {
    if (strength === 0) return '';
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const passwordsMatch = confirmPassword
    ? password === confirmPassword && password.length > 0
    : true;

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          className="w-full rounded-md border border-gray-300 p-2"
          value={password}
          readOnly
        />
      </div>

      {/* Strength indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Strength</span>
          <span>{strength}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strength}%` }}
          />
        </div>
        {confirmPassword && !passwordsMatch && (
          <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
        )}
      </div>

      {/* Requirements list */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Requirements:</span>
        <ul className="space-y-1">
          {PASSWORD_REQUIREMENTS.map((requirement) => (
            <li key={requirement.key} className="flex items-center text-sm">
              {checks[requirement.key] ? (
                <Check className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <X className="mr-2 h-4 w-4 text-red-500" />
              )}
              {requirement.label}
            </li>
          ))}
          {confirmPassword && (
            <li className="flex items-center text-sm">
              {passwordsMatch ? (
                <Check className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <X className="mr-2 h-4 w-4 text-red-500" />
              )}
              Passwords must match
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
