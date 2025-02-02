import { SetStateAction, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

const languages = [
  { key: 'en', title: 'English' },
  { key: 'de', title: 'German' },
  { key: 'fr', title: 'French' },
];

function LanguageSelector() {
  const [language, setLanguage] = useState('en');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const changeLanguage = (newLanguage: SetStateAction<string>) => {
    setLanguage(newLanguage);
  };

  return (
    <DropdownMenu onOpenChange={(open) => setIsDropdownOpen(open)}>
      <DropdownMenuTrigger asChild className="cursor-pointer p-2 rounded-full hover:bg-muted">
        <div className="flex items-center justify-center gap-1 w-8 h-8 bg-muted rounded-full">
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
