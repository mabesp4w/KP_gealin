import { type InputHTMLAttributes, forwardRef } from 'react';

type RadioColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
type RadioSize = 'xs' | 'sm' | 'md' | 'lg';

interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    color?: RadioColor;
    size?: RadioSize;
    error?: string;
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
    ({ label, color, size, error, className = '', ...props }, ref) => {
        const inputClasses = [
            'radio',
            color && `radio-${color}`,
            size && `radio-${size}`,
            error && 'radio-error',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        if (label) {
            return (
                <div className="form-control">
                    <label className="label cursor-pointer gap-3">
                        <input ref={ref} type="radio" className={inputClasses} {...props} />
                        <span className="label-text">{label}</span>
                    </label>
                </div>
            );
        }

        return <input ref={ref} type="radio" className={inputClasses} {...props} />;
    },
);

RadioButton.displayName = 'RadioButton';

// RadioGroup for convenience
interface RadioGroupProps {
    name: string;
    options: { label: string; value: string; disabled?: boolean }[];
    value?: string;
    onChange?: (value: string) => void;
    color?: RadioColor;
    size?: RadioSize;
    direction?: 'vertical' | 'horizontal';
    className?: string;
    error?: string;
}

function RadioGroup({
    name,
    options,
    value,
    onChange,
    color,
    size,
    direction = 'vertical',
    className = '',
    error,
}: RadioGroupProps) {
    return (
        <div className={`${direction === 'horizontal' ? 'flex gap-4' : 'space-y-1'} ${className}`}>
            {options.map((option) => (
                <RadioButton
                    key={option.value}
                    name={name}
                    label={option.label}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onChange?.(option.value)}
                    disabled={option.disabled}
                    color={color}
                    size={size}
                />
            ))}
            {error && <span className="label-text-alt text-error">{error}</span>}
        </div>
    );
}

export { RadioButton, RadioGroup, type RadioButtonProps, type RadioGroupProps };
