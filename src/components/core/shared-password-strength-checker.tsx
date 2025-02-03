import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { usePasswordStrength } from 'features/auth/hooks/use-password-strength/use-password-strength';

interface SharedPasswordStrengthCheckerProps {
  password: string;
  confirmPassword: string;
  onRequirementsMet: (met: boolean) => void;
}

export const SharedPasswordStrengthChecker: React.FC<SharedPasswordStrengthCheckerProps> = ({
  password,
  confirmPassword,
  onRequirementsMet,
}) => {
  const { strength, checks, getStrengthColor, requirements } = usePasswordStrength(password);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword && password !== '');
    const allMet = Object.values(checks).every((check) => check) && passwordsMatch;
    onRequirementsMet(allMet);
  }, [password, confirmPassword, checks, passwordsMatch, onRequirementsMet]);

  return (
    <div className="w-full mx-auto px-6 py-4 rounded-lg shadow-sm border border-primary-shade-50">
      <h2 className="text-sm font-semibold text-high-emphasis mb-2">Password Requirements</h2>
      <div className="h-1 w-full bg-primary-shade-50 rounded mb-2">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        />
      </div>

      <p className="text-medium-emphasis mb-2 text-xs">
        Your password must meet these requirements:
      </p>

      <ul className="space-y-1 text-medium-emphasis text-xs">
        {requirements.map((requirement) => (
          <li key={requirement.key} className="flex items-center gap-2">
            {checks[requirement.key] ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            {requirement.label}
          </li>
        ))}
        <li className="flex items-center gap-2">
          {passwordsMatch ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <X className="w-4 h-4 text-red-500" />
          )}
          Passwords match
        </li>
      </ul>
    </div>
  );
};
