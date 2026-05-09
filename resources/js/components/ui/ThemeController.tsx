import { type InputHTMLAttributes, forwardRef, useCallback, useEffect, useState } from 'react';

const DAISY_THEMES = [
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
    'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween',
    'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy',
    'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn',
    'business', 'acid', 'lemonade', 'night', 'coffee', 'winter',
    'dim', 'nord', 'sunset', 'caramellatte', 'abyss', 'silk',
] as const;

type DaisyTheme = (typeof DAISY_THEMES)[number] | string;

interface ThemeControllerToggleProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
    variant?: 'toggle';
    theme: DaisyTheme;
}

interface ThemeControllerDropdownProps {
    variant: 'dropdown';
    themes?: DaisyTheme[];
    className?: string;
}

type ThemeControllerProps = ThemeControllerToggleProps | ThemeControllerDropdownProps;

const ThemeControllerToggle = forwardRef<HTMLInputElement, ThemeControllerToggleProps>(
    ({ theme, className = '', ...props }, ref) => {
        return (
            <input
                ref={ref}
                type="checkbox"
                value={theme}
                className={`toggle theme-controller ${className}`}
                {...props}
            />
        );
    },
);

ThemeControllerToggle.displayName = 'ThemeControllerToggle';

function ThemeControllerDropdown({
    themes = [...DAISY_THEMES],
    className = '',
}: ThemeControllerDropdownProps) {
    const [currentTheme, setCurrentTheme] = useState<DaisyTheme>('light');

    useEffect(() => {
        const saved = localStorage.getItem('daisy-theme');
        if (saved) {
            setCurrentTheme(saved);
            document.documentElement.setAttribute('data-theme', saved);
        }
    }, []);

    const handleChange = useCallback((theme: DaisyTheme) => {
        setCurrentTheme(theme);
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('daisy-theme', theme);
    }, []);

    return (
        <div className={`dropdown ${className}`}>
            <div tabIndex={0} role="button" className="btn m-1">
                Theme
                <svg
                    width="12px"
                    height="12px"
                    className="inline-block h-2 w-2 fill-current opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048"
                >
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
                </svg>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content bg-base-300 rounded-box z-10 max-h-80 w-52 overflow-y-auto p-2 shadow-2xl"
            >
                {themes.map((theme) => (
                    <li key={theme}>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label={theme}
                            value={theme}
                            checked={currentTheme === theme}
                            onChange={() => handleChange(theme)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ThemeController(props: ThemeControllerProps) {
    if (props.variant === 'dropdown') {
        return <ThemeControllerDropdown {...props} />;
    }
    return <ThemeControllerToggle {...props} />;
}

export { ThemeController, DAISY_THEMES, type ThemeControllerProps, type DaisyTheme };
