import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { cn } from 'lib/utils';
import { useLanguageContext } from '../../../i18n/language-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Skeleton } from 'components/ui/skeleton';

/**
 * LanguageSelector Component
 *
 * A dropdown menu component that allows users to select their preferred language
 * from a list of available languages fetched from the API.
 *
 * @returns {JSX.Element} A language selection dropdown menu component
 *
 * @example
 * // Basic usage in a navigation bar
 * <nav className="flex items-center justify-between">
 *   <Logo />
 *   <div className="flex items-center gap-4">
 *     <LanguageSelector />
 *     <UserMenu />
 *   </div>
 * </nav>
 */

function LanguageSelector() {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentLanguage, setLanguage, availableLanguages, isLoading } = useLanguageContext();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && availableLanguages?.length > 0) {
      const currentLanguageExists = availableLanguages.some(
        (lang) => lang.languageCode === currentLanguage
      );

      if (!currentLanguageExists) {
        const defaultLanguage = availableLanguages.find((lang) => lang.isDefault);
        if (defaultLanguage) {
          setLanguage(defaultLanguage.languageCode);
        }
      }
    }
  }, [availableLanguages, currentLanguage, isLoading, setLanguage]);

  const authPaths = [
    '/login',
    '/signup',
    '/sent-email',
    '/activate',
    '/resetpassword',
    '/success',
    '/activate-failed',
    '/forgot-password',
    '/verify-key',
  ];

  const isAuthLayout = authPaths.some((path) => location.pathname.startsWith(path));

  const changeLanguage = async (newLanguageCode: string) => {
    await setLanguage(newLanguageCode);
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="flex items-center gap-1 h-[34px] px-2 rounded-[4px] hover:bg-surface">
          <span className="text-sm font-semibold text-medium-emphasis">
            {availableLanguages?.find((lang) => lang.languageCode === currentLanguage)
              ?.languageName || currentLanguage}
          </span>
          {isDropdownOpen ? (
            <ChevronUp className="h-4 w-4 text-medium-emphasis" />
          ) : (
            <ChevronDown className="h-4 w-4 text-medium-emphasis" />
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {isLoading && (
          <DropdownMenuItem disabled>
            {isAuthLayout ? t('LOADING_LANGUAGES') + '...' : <Skeleton className="h-4 w-24" />}
          </DropdownMenuItem>
        )}
        {!isLoading &&
          (availableLanguages && availableLanguages.length > 0 ? (
            availableLanguages.map((lang, i) => (
              <div key={lang.itemId}>
                <DropdownMenuItem
                  className={cn({
                    'font-bold cursor-pointer': lang.languageCode === currentLanguage,
                  })}
                  onClick={() => changeLanguage(lang.languageCode)}
                >
                  {lang.languageName} {lang.isDefault && '(Default)'}
                </DropdownMenuItem>
                {i !== availableLanguages.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))
          ) : (
            <DropdownMenuItem disabled>{t('NO_LANGUAGES_AVAILABLE')}</DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;
