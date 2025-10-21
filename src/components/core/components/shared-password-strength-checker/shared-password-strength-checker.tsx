import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePasswordStrength } from '@/modules/auth/hooks/use-password-strength/use-password-strength';

/**
 * SharedPasswordStrengthChecker Component
 *
 * A visual component that displays password strength and requirement checks
 * to help users create strong, compliant passwords.
 *
 * Features:
 * - Real-time password strength visualization with color indicators
 * - Checklist of password requirements with pass/fail status
 * - Password matching validation
 * - Optional password exclusion check (e.g., different from current password)
 * - Callback for parent components when all requirements are met
 * - Styled container with consistent visual design
 *
 * Props:
 * @param {string} password - The current password value to check against requirements
 * @param {string} confirmPassword - The confirmation password to verify matching
 * @param {(met: boolean) => void} onRequirementsMet - Callback that triggers when requirements status changes
 * @param {string} [excludePassword] - Optional password that the new password should NOT match (e.g., current password)
 * @param {string} [excludePasswordLabel] - Optional label for the exclusion check (defaults to translation key)
 *
 * @example
 * // Basic usage
 * <SharedPasswordStrengthChecker
 *   password={password}
 *   confirmPassword={confirmPassword}
 *   onRequirementsMet={setIsValid}
 * />
 *
 * // Usage with current password exclusion (for password change)
 * <SharedPasswordStrengthChecker
 *   password={newPassword}
 *   confirmPassword={confirmPassword}
 *   onRequirementsMet={setIsValid}
 *   excludePassword={currentPassword}
 * />
 */

interface SharedPasswordStrengthCheckerProps {
  password: string;
  confirmPassword: string;
  onRequirementsMet: (met: boolean) => void;
  excludePassword?: string;
  excludePasswordLabel?: string;
}

export const SharedPasswordStrengthChecker = ({
  password,
  confirmPassword,
  onRequirementsMet,
  excludePassword,
  excludePasswordLabel,
}: Readonly<SharedPasswordStrengthCheckerProps>) => {
  const { t } = useTranslation();
  const { checks, requirements } = usePasswordStrength(password);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isDifferentFromExcluded, setIsDifferentFromExcluded] = useState(true);

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword && password !== '');

    if (excludePassword && password !== '') {
      setIsDifferentFromExcluded(password !== excludePassword);
    } else {
      setIsDifferentFromExcluded(true);
    }

    const allMet =
      Object.values(checks).every((check) => check) && passwordsMatch && isDifferentFromExcluded;
    onRequirementsMet(allMet);
  }, [
    password,
    confirmPassword,
    checks,
    passwordsMatch,
    excludePassword,
    isDifferentFromExcluded,
    onRequirementsMet,
  ]);

  const getAdjustedStrength = () => {
    const basicRequirements = Object.values(checks).filter(Boolean).length;
    let totalRequirements = Object.keys(checks).length;
    let metRequirements = basicRequirements;

    totalRequirements += 1;
    if (passwordsMatch) {
      metRequirements += 1;
    }

    if (excludePassword && password !== '') {
      totalRequirements += 1;
      if (isDifferentFromExcluded) {
        metRequirements += 1;
      }
    }

    return totalRequirements > 0 ? (metRequirements / totalRequirements) * 100 : 0;
  };

  const getAdjustedStrengthColor = () => {
    const adjustedStrength = getAdjustedStrength();
    if (adjustedStrength <= 25) return 'bg-red-500';
    if (adjustedStrength <= 50) return 'bg-orange-500';
    if (adjustedStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  return (
    <div className="w-full mx-auto px-6 py-4 rounded-lg shadow-sm border border-primary-50">
      <h2 className="text-sm font-semibold text-high-emphasis mb-2">
        {t('PASSWORD_REQUIREMENTS')}
      </h2>
      <div className="h-1 w-full bg-primary-50 rounded mb-2">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${getAdjustedStrengthColor()}`}
          style={{ width: `${getAdjustedStrength()}%` }}
        />
      </div>

      <p className="text-medium-emphasis mb-2 text-xs">
        {t('PASSWORD_MUST_MEET_THESE_REQUIREMENTS')}:
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

        {excludePassword && password !== '' && (
          <li className="flex items-center gap-2">
            {isDifferentFromExcluded ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            {excludePasswordLabel ?? "New password shouldn't match current password"}
          </li>
        )}

        <li className="flex items-center gap-2">
          {passwordsMatch ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <X className="w-4 h-4 text-red-500" />
          )}
          {t('PASSWORDS_MATCH')}
        </li>
      </ul>
    </div>
  );
};
