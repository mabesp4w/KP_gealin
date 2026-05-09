import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
    tip: string;
    position?: TooltipPosition;
    color?: TooltipColor;
    open?: boolean;
    children: ReactNode;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
    ({ tip, position, color, open, className = '', children, ...props }, ref) => {
        const classes = [
            'tooltip',
            position && `tooltip-${position}`,
            color && `tooltip-${color}`,
            open && 'tooltip-open',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div ref={ref} className={classes} data-tip={tip} {...props}>
                {children}
            </div>
        );
    },
);

Tooltip.displayName = 'Tooltip';

export { Tooltip, type TooltipProps, type TooltipPosition, type TooltipColor };
