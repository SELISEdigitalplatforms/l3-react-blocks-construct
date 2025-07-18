import { Link } from 'react-router-dom';
import { Button } from 'components/ui/button';
import githubIcon from 'assets/images/social_media_github.svg';
import linkedinIcon from 'assets/images/social_media_in.svg';
import microsoftIcon from 'assets/images/social_media_ms.svg';
import googleIcon from 'assets/images/social_media_google.svg';
import { SignupForm } from 'features/auth/components/signup-form';
import darkLogo from 'assets/images/construct_logo_dark.svg';
import lightLogo from 'assets/images/construct_logo_light.svg';
import { useTheme } from 'styles/theme/theme-provider';
import { useTranslation } from 'react-i18next';

export function SignupPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const socialButtons = [
    { icon: googleIcon, alt: 'Google Logo' },
    { icon: microsoftIcon, alt: 'Microsoft Logo' },
    { icon: linkedinIcon, alt: 'LinkedIn Logo' },
    { icon: githubIcon, alt: 'GitHub Logo' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Logo theme={theme} />
      <SignupHeader t={t} />
      <SignupForm />
      <SocialLoginOptions t={t} socialButtons={socialButtons} />
    </div>
  );
}

type LogoProps = Readonly<{
  theme: string;
}>;

function Logo({ theme }: LogoProps) {
  return (
    <div className="w-32 h-14 mb-2">
      <img src={theme === 'dark' ? lightLogo : darkLogo} className="w-full h-full" alt="logo" />
    </div>
  );
}

type SignupHeaderProps = Readonly<{
  t: (key: string) => string;
}>;

function SignupHeader({ t }: SignupHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-high-emphasis">{t('SIGN_UP_ACCESS_OPEN_SOURCE')}</h2>
      <div className="flex items-center gap-1 mt-4">
        <span className="text-sm font-normal text-medium-emphasis">
          {t('ALREADY_HAVE_ACCOUNT')}
        </span>
        <Link
          to={'/login'}
          className="text-sm font-bold text-primary hover:text-primary-600 hover:underline"
        >
          {t('LOG_IN')}
        </Link>
      </div>
    </div>
  );
}

type SocialLoginOptionsProps = Readonly<{
  t: (key: string) => string;
  socialButtons: ReadonlyArray<Readonly<{ icon: string; alt: string }>>;
}>;

function SocialLoginOptions({ t, socialButtons }: SocialLoginOptionsProps) {
  return (
    <div>
      <Divider text={t('OR_CONTINUE_WITH')} />
      <div className="flex items-center gap-8">
        <div className="flex w-full items-center gap-4">
          {socialButtons.map((button) => (
            <SocialButton key={button.alt} icon={button.icon} alt={button.alt} />
          ))}
        </div>
      </div>
    </div>
  );
}

type SocialButtonProps = Readonly<{
  icon: string;
  alt: string;
}>;

function SocialButton({ icon, alt }: SocialButtonProps) {
  return (
    <Button variant="outline" className="w-[25%] h-12" disabled>
      <img src={icon} width={20} height={20} alt={alt} />
    </Button>
  );
}

type DividerProps = Readonly<{
  text: string;
}>;

export function Divider({ text }: DividerProps) {
  return (
    <div className="flex items-center gap-4 mb-6 mt-23">
      <div className="flex-1">
        <hr className="h-[2px] bg-gray-200 border-0 rounded" />
      </div>
      <div className="text-base font-normal text-low-emphasis">{text}</div>
      <div className="flex-1">
        <hr className="h-[2px] bg-gray-200 border-0 rounded" />
      </div>
    </div>
  );
}
