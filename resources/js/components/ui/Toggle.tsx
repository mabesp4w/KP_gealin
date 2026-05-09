import { type InputHTMLAttributes, forwardRef } from 'react';

type ToggleColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
type ToggleSize = 'xs' | 'sm' | 'md' | 'lg';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    color?: ToggleColor;
    size?: ToggleSize;
    error?: string;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
    ({ label, color, size, error, className = '', ...props }, ref) => {
        const inputClasses = [
            'toggle',
            color && `toggle-${color}`,
            size && `toggle-${size}`,
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

Toggle.displayName = 'Toggle';

export { Toggle, type ToggleProps, type ToggleColor, type ToggleSize };
