import { useTheme } from '@/styles/theme/theme-provider';
import { Button } from '@/components/ui-kit/button';
import { Moon, Sun } from 'lucide-react';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-muted"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};
