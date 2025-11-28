import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export default function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`fixed top-4 right-4 p-3 rounded-full shadow-lg z-50 transition-colors ${
        theme === 'dark'
          ? 'bg-gray-800 hover:bg-gray-700'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6" />
      ) : (
        <Sun className="w-6 h-6" />
      )}
    </button>
  );
}
