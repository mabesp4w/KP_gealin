import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

type AlertColor = 'info' | 'success' | 'warning' | 'error';
type AlertVariant = 'soft' | 'dash' | 'outline';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    color?: AlertColor;
    variant?: AlertVariant;
    icon?: ReactNode;
    actions?: ReactNode;
    onClose?: () => void;
}

const ALERT_ICONS: Record<AlertColor, ReactNode> = {
    info: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    success: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    warning: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    error: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(
    (
        { color, variant, icon, actions, onClose, className = '', children, ...props },
        ref,
    ) => {
        const classes = [
            'alert',
            color && `alert-${color}`,
            variant && `alert-${variant}`,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const displayIcon = icon ?? (color ? ALERT_ICONS[color] : null);

        return (
            <div ref={ref} role="alert" className={classes} {...props}>
                {displayIcon}
                <div>{children}</div>
                {(actions || onClose) && (
                    <div className="flex items-center gap-2">
                        {actions}
                        {onClose && (
                            <button className="btn btn-sm btn-ghost" onClick={onClose}>
                                ✕
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    },
);

Alert.displayName = 'Alert';

export { Alert, type AlertProps, type AlertColor };
