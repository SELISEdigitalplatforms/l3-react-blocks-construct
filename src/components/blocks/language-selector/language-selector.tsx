import { SetStateAction, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

/**
 * LanguageSelector Component
 *
 * A dropdown menu component that allows users to select their preferred language
 * from a predefined list of available languages.
 *
 * Features:
 * - Dropdown interface for language selection
 * - Visual indicator of currently selected language
 * - Circular button design with language code display
 * - Disabled state for currently unavailable languages
 * - Visual separation between language options
 *
 * State:
 * - Tracks currently selected language
 * - Controls dropdown open/close state
 *
 * @returns {JSX.Element} A language selection dropdown menu
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
 *
 * @note Currently only English is selectable; other languages are displayed but disabled
 * @note Languages are defined in the component as a static array
 */

const languages = [
  { key: 'en', title: 'English' },
  { key: 'de', title: 'German' },
  { key: 'fr', title: 'French' },
];

function LanguageSelector() {
  const [language, setLanguage] = useState('en');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const changeLanguage = (newLanguage: SetStateAction<string>) => {
    setLanguage(newLanguage);
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild className="cursor-pointer rounded-full hover:bg-muted">
        <div className="flex items-center justify-center gap-1 w-[34px] h-[34px] bg-muted rounded-full">
          <span className="text-sm font-semibold uppercase">{language}</span>
          {/* {isDropdownOpen ? (
            <ChevronUp className="h-4 w-4 text-medium-emphasis" />
          ) : (
            <ChevronDown className="h-4 w-4 text-medium-emphasis" />
          )} */}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {languages.map((lang, i) => (
          <div key={lang.key}>
            <DropdownMenuItem
              className={`${lang.key === language ? 'font-bold cursor-pointer' : ''} 
                      ${lang.title !== 'English' ? 'pointer-events-none text-gray-300' : ''}`}
              onClick={() => (lang.title !== 'English' ? null : changeLanguage(lang.key))}
            >
              {lang.title}
            </DropdownMenuItem>
            {i !== languages.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;
