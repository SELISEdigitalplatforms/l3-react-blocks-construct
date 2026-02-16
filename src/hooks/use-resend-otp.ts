import { useState, useEffect } from 'react';

/**
 * Custom hook to manage the countdown timer for OTP resend functionality.
 *
 * This hook tracks the remaining time for OTP resend, formats it into a human-readable string,
 * and disables or enables the resend action based on the countdown.
 *
 * @param {Object} props - The properties for the hook.
 * @param {number} [props.initialTime=120] - The initial countdown time in seconds. Defaults to 120 seconds.
 * @param {Function} props.onResend - Callback function to trigger when the OTP is resent.
 *
 * @returns {Object} The hook's return object contains:
 * - `formattedTime`: A string representing the remaining time in "min sec" or "sec" format.
 * - `isResendDisabled`: A boolean indicating whether the resend action is disabled.
 * - `handleResend`: A function to reset the timer and trigger the `onResend` callback.
 *
 * @example
 * const { formattedTime, isResendDisabled, handleResend } = useResendOTP({
 *   initialTime: 60,
 *   onResend: () => { console.log('OTP resent!'); }
 * });
 *
 * console.log(formattedTime); // "60 sec"
 * handleResend(); // Resets the timer and triggers onResend.
 */

interface ResendOTPProps {
  initialTime?: number;
  onResend: () => void;
}

const useResendOTPTime = ({ initialTime = 120, onResend }: Readonly<ResendOTPProps>) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (minutes > 0) {
      return `${minutes} min ${seconds} sec`;
    } else {
      return `${seconds} sec`;
    }
  };

  useEffect(() => {
    if (remainingTime === 0) {
      setIsResendDisabled(false);
      return;
    }

    if (remainingTime > 0 && isResendDisabled) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime, isResendDisabled]);

  const resetTimer = () => {
    setRemainingTime(initialTime);
    setIsResendDisabled(true);
  };

  const handleResend = () => {
    resetTimer();
    onResend();
  };

  return {
    formattedTime: formatTime(remainingTime),
    isResendDisabled,
    handleResend,
  };
};

export default useResendOTPTime;
