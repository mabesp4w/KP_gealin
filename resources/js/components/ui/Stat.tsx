import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

type StatColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'neutral';

interface StatGroupProps extends HTMLAttributes<HTMLDivElement> {
    vertical?: boolean;
}

const StatGroup = forwardRef<HTMLDivElement, StatGroupProps>(
    ({ vertical, className = '', children, ...props }, ref) => {
        const classes = ['stats shadow', vertical && 'stats-vertical', className]
            .filter(Boolean)
            .join(' ');

        return (
            <div ref={ref} className={classes} {...props}>
                {children}
            </div>
        );
    },
);

StatGroup.displayName = 'StatGroup';

interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'color'> {
    title: ReactNode;
    value: ReactNode;
    desc?: ReactNode;
    description?: ReactNode;
    figure?: ReactNode;
    color?: StatColor;
}

function Stat({
    title,
    value,
    desc,
    description,
    figure,
    color,
    className = '',
    ...props
}: StatProps) {
    const figureColor = color || 'primary';

    return (
        <div className={`stat bg-base-100 rounded-box shadow ${className}`} {...props}>
            {figure && <div className={`stat-figure text-${figureColor}`}>{figure}</div>}
            <div className="stat-title">{title}</div>
            <div className="stat-value text-base-content">{value}</div>
            {(desc || description) && <div className="stat-desc">{desc || description}</div>}
        </div>
    );
}

export { StatGroup, Stat, type StatGroupProps, type StatProps };
