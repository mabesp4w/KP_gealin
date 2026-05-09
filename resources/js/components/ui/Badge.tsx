import { type HTMLAttributes, forwardRef } from 'react';

type BadgeColor =
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral'
    | 'ghost';

type BadgeSize = 'lg' | 'md' | 'sm' | 'xs';
type BadgeVariant = 'outline' | 'dash' | 'soft';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    color?: BadgeColor;
    size?: BadgeSize;
    variant?: BadgeVariant;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ color, size, variant, className = '', children, ...props }, ref) => {
        const classes = [
            'badge',
            color && `badge-${color}`,
            size && `badge-${size}`,
            variant && `badge-${variant}`,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <span ref={ref} className={classes} {...props}>
                {children}
            </span>
        );
    },
);

Badge.displayName = 'Badge';

export { Badge, type BadgeProps, type BadgeColor, type BadgeSize };
