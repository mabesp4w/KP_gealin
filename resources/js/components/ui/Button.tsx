import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonColor =
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral'
    | 'ghost'
    | 'link';

type ButtonSize = 'lg' | 'md' | 'sm' | 'xs';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: ButtonColor;
    size?: ButtonSize;
    variant?: 'outline' | 'soft' | 'dash';
    wide?: boolean;
    block?: boolean;
    circle?: boolean;
    square?: boolean;
    glass?: boolean;
    loading?: boolean;
    active?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            color,
            size,
            variant,
            wide,
            block,
            circle,
            square,
            glass,
            loading,
            active,
            className = '',
            disabled,
            children,
            ...props
        },
        ref,
    ) => {
        const classes = [
            'btn',
            color && `btn-${color}`,
            size && `btn-${size}`,
            variant && `btn-${variant}`,
            wide && 'btn-wide',
            block && 'btn-block',
            circle && 'btn-circle',
            square && 'btn-square',
            glass && 'glass',
            active && 'btn-active',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <button
                ref={ref}
                className={classes}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <span className="loading loading-spinner" />}
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';

export { Button, type ButtonProps, type ButtonColor, type ButtonSize };
