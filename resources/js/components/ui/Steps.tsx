import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

type StepsDirection = 'vertical' | 'horizontal';

interface StepsProps extends HTMLAttributes<HTMLUListElement> {
    direction?: StepsDirection;
}

const Steps = forwardRef<HTMLUListElement, StepsProps>(
    ({ direction, className = '', children, ...props }, ref) => {
        const classes = [
            'steps',
            direction && `steps-${direction}`,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <ul ref={ref} className={classes} {...props}>
                {children}
            </ul>
        );
    },
);

Steps.displayName = 'Steps';

type StepColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'neutral';

interface StepProps extends HTMLAttributes<HTMLLIElement> {
    color?: StepColor;
    content?: string;
}

function Step({
    color,
    content,
    className = '',
    children,
    ...props
}: StepProps) {
    const classes = ['step', color && `step-${color}`, className]
        .filter(Boolean)
        .join(' ');

    return (
        <li className={classes} data-content={content} {...props}>
            {children}
        </li>
    );
}

export { Steps, Step, type StepsProps, type StepProps };
