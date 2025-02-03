import React from 'react';
import { Check, X } from 'lucide-react';
import { usePasswordStrength } from 'features/auth/hooks/use-password-strength/use-password-strength';

interface PasswordStrengthCheckerProps {
  password: string;
  onRequirementsMet: (met: boolean) => void;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({
  password,
  onRequirementsMet,
}) => {
  const { strength, checks, allRequirementsMet, getStrengthColor, requirements } =
    usePasswordStrength(password);

  React.useEffect(() => {
    onRequirementsMet?.(allRequirementsMet);
  }, [allRequirementsMet, onRequirementsMet]);

  return (
    <div className="w-full mx-auto px-6 py-4 rounded-lg shadow-sm border border-primary-shade-50">
      <h2 className="text-sm font-semibold text-high-emphasis mb-2">Password strength</h2>
      <div className="h-1 w-full bg-primary-shade-50 rounded mb-2">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        />
      </div>

      <p className="text-medium-emphasis mb-2 text-xs">Check your password strength.</p>
      <p className="text-medium-emphasis mb-2 text-xs">Your password must contain:</p>
      <ul className="space-y-1 text-medium-emphasis text-xs">
        {requirements.map((requirement) => (
          <li key={requirement.key} className="flex items-center gap-2">
            {checks[requirement.key] ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <X className="w-4 h-4 text-error" />
            )}
            {requirement.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthChecker;
