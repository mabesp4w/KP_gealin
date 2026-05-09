import { type HTMLAttributes, forwardRef } from 'react';

type ProgressColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface ProgressProps extends HTMLAttributes<HTMLProgressElement> {
    value?: number;
    max?: number;
    color?: ProgressColor;
}

const Progress = forwardRef<HTMLProgressElement, ProgressProps>(
    ({ value, max = 100, color, className = '', ...props }, ref) => {
        const classes = ['progress', color && `progress-${color}`, className]
            .filter(Boolean)
            .join(' ');

        return (
            <progress
                ref={ref}
                className={classes}
                value={value}
                max={max}
                {...props}
            />
        );
    },
);

Progress.displayName = 'Progress';

// Radial progress
interface RadialProgressProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
    size?: string;
    thickness?: string;
    color?: ProgressColor;
}

function RadialProgress({
    value,
    size = '4rem',
    thickness = '4px',
    color,
    className = '',
    children,
    ...props
}: RadialProgressProps) {
    const classes = ['radial-progress', color && `text-${color}`, className]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            style={
                {
                    '--value': value,
                    '--size': size,
                    '--thickness': thickness,
                } as React.CSSProperties
            }
            role="progressbar"
            aria-valuenow={value}
            {...props}
        >
            {children ?? `${value}%`}
        </div>
    );
}

export {
    Progress,
    RadialProgress,
    type ProgressProps,
    type RadialProgressProps,
};
