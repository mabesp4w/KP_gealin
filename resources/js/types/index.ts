import { type ReactNode } from 'react';

interface PageProps {
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
            role?: string;
        };
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export type { PageProps };
