import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

type SwapAnimation = 'rotate' | 'flip';

interface SwapProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onContent: ReactNode;
    offContent: ReactNode;
    animation?: SwapAnimation;
    active?: boolean;
    className?: string;
}

const Swap = forwardRef<HTMLInputElement, SwapProps>(
    (
        { onContent, offContent, animation, active, className = '', ...props },
        ref,
    ) => {
        const classes = [
            'swap',
            animation && `swap-${animation}`,
            active && 'swap-active',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <label className={classes}>
                <input ref={ref} type="checkbox" {...props} />
                <div className="swap-on">{onContent}</div>
                <div className="swap-off">{offContent}</div>
            </label>
        );
    },
);

Swap.displayName = 'Swap';

export { Swap, type SwapProps, type SwapAnimation };
