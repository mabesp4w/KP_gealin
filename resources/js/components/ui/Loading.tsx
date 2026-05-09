import { type HTMLAttributes, forwardRef } from 'react';

type LoadingVariant = 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
type LoadingSize = 'xs' | 'sm' | 'md' | 'lg';
type LoadingColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'neutral';

interface LoadingProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: LoadingVariant;
    size?: LoadingSize;
    color?: LoadingColor;
}

const Loading = forwardRef<HTMLSpanElement, LoadingProps>(
    ({ variant = 'spinner', size = 'md', color, className = '', ...props }, ref) => {
        const classes = [
            'loading',
            `loading-${variant}`,
            `loading-${size}`,
            color && `text-${color}`,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return <span ref={ref} className={classes} {...props} />;
    },
);

Loading.displayName = 'Loading';

// Full-page loading overlay
interface LoadingOverlayProps {
    visible?: boolean;
    text?: string;
    variant?: LoadingVariant;
    size?: LoadingSize;
}

function LoadingOverlay({
    visible = true,
    text,
    variant = 'spinner',
    size = 'lg',
}: LoadingOverlayProps) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-100/80 backdrop-blur-sm">
            <Loading variant={variant} size={size} color="primary" />
            {text && <p className="mt-4 text-base-content/70">{text}</p>}
        </div>
    );
}

export {
    Loading,
    LoadingOverlay,
    type LoadingProps,
    type LoadingOverlayProps,
    type LoadingVariant,
    type LoadingSize,
};
