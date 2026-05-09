import { type InputHTMLAttributes, forwardRef } from 'react';

type CheckboxColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    color?: CheckboxColor;
    size?: CheckboxSize;
    error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, color, size, error, className = '', ...props }, ref) => {
        const inputClasses = [
            'checkbox',
            color && `checkbox-${color}`,
            size && `checkbox-${size}`,
            error && 'checkbox-error',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        if (label) {
            return (
                <div className="form-control">
                    <label className="label cursor-pointer gap-3">
                        <input ref={ref} type="checkbox" className={inputClasses} {...props} />
                        <span className="label-text">{label}</span>
                    </label>
                    {error && <span className="label-text-alt text-error">{error}</span>}
                </div>
            );
        }

        return <input ref={ref} type="checkbox" className={inputClasses} {...props} />;
    },
);

Checkbox.displayName = 'Checkbox';

export { Checkbox, type CheckboxProps, type CheckboxColor, type CheckboxSize };
