import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { Toaster } from './components/ui';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
                <Toaster position="top-right" />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Fix: Allow TinyMCE to receive focus inside native <dialog> (top layer).
// Native <dialog> with showModal() traps focus and blocks focusin events
// to elements outside the dialog. TinyMCE uses an iframe + aux containers
// on document.body, so we stop propagation for TinyMCE-owned targets.
document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('.tox-tinymce, .tox-tinymce-aux, .tox-dialog, .tox-dialog-wrap')) {
        e.stopImmediatePropagation();
    }
});
