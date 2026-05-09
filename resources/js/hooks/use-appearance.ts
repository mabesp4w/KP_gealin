import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'appearance';

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(appearance: Appearance) {
    const theme = appearance === 'system' ? getSystemTheme() : appearance;
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function initializeTheme() {
    const saved = (localStorage.getItem(STORAGE_KEY) as Appearance) || 'system';
    applyTheme(saved);
}

export function useAppearance() {
    const [appearance, setAppearanceState] = useState<Appearance>(() => {
        if (typeof window === 'undefined') return 'system';
        return (localStorage.getItem(STORAGE_KEY) as Appearance) || 'system';
    });

    const setAppearance = useCallback((value: Appearance) => {
        setAppearanceState(value);
        localStorage.setItem(STORAGE_KEY, value);
        applyTheme(value);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            if (appearance === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [appearance]);

    return { appearance, setAppearance } as const;
}
