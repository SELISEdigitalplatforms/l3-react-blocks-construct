import { X } from 'lucide-react';
import darkLogo from '@/assets/images/construct_logo_dark.svg';
import lightLogo from '@/assets/images/construct_logo_light.svg';
import darksmallLogo from '@/assets/images/construct_logo_small_dark.svg';
import lightsmallLogo from '@/assets/images/construct_logo_small_light.svg';

interface LogoSectionProps {
  theme: string;
  open: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export const LogoSection = ({ theme, open, isMobile, onClose }: Readonly<LogoSectionProps>) => {
  return (
    <div className="relative h-10 w-full">
      <img
        src={theme === 'dark' ? lightLogo : darkLogo}
        alt="logo"
        className={`absolute left-4 top-1 h-10 w-auto max-w-full transition-all duration-300 ${
          open || isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <img
        src={theme === 'dark' ? darksmallLogo : lightsmallLogo}
        alt="smallLogo"
        className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
          open || isMobile ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {isMobile && (
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
