import { type InputHTMLAttributes, forwardRef } from 'react';

type RangeColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
type RangeSize = 'xs' | 'sm' | 'md' | 'lg';

interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    color?: RangeColor;
    size?: RangeSize;
    showValue?: boolean;
    steps?: number;
    error?: string;
}

const Range = forwardRef<HTMLInputElement, RangeProps>(
    (
        {
            label,
            color,
            size,
            showValue,
            steps,
            error,
            min = 0,
            max = 100,
            value,
            className = '',
            ...props
        },
        ref,
    ) => {
        const inputClasses = [
            'range',
            color && `range-${color}`,
            size && `range-${size}`,
            'w-full',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className="form-control w-full">
                {(label || showValue) && (
                    <label className="label">
                        {label && <span className="label-text">{label}</span>}
                        {showValue && (
                            <span className="label-text-alt">{value ?? min}</span>
                        )}
                    </label>
                )}
                <input
                    ref={ref}
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    step={steps}
                    className={inputClasses}
                    {...props}
                />
                {steps && (
                    <div className="flex w-full justify-between px-2 text-xs">
                        {Array.from(
                            { length: Math.floor((Number(max) - Number(min)) / steps) + 1 },
                            (_, i) => (
                                <span key={i}>|</span>
                            ),
                        )}
                    </div>
                )}
                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error">{error}</span>
                    </label>
                )}
            </div>
        );
    },
);

Range.displayName = 'Range';

export { Range, type RangeProps };
