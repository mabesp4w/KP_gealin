import { type SelectHTMLAttributes, type ReactNode, forwardRef } from 'react';

type NativeSelectColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost';
type NativeSelectSize = 'xs' | 'sm' | 'md' | 'lg';
type NativeSelectVariant = 'bordered' | 'ghost';

interface NativeSelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    altLabel?: string;
    options: NativeSelectOption[];
    placeholder?: string;
    color?: NativeSelectColor;
    size?: NativeSelectSize;
    variant?: NativeSelectVariant;
    error?: string;
}

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
    (
        { label, altLabel, options, placeholder, color, size, variant, error, className = '', ...props },
        ref,
    ) => {
        const selectClasses = [
            'select',
            color && `select-${color}`,
            size && `select-${size}`,
            variant && `select-${variant}`,
            error && 'select-error',
            'w-full',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className="form-control w-full">
                {label && (
                    <label className="label">
                        <span className="label-text">{label}</span>
                        {altLabel && <span className="label-text-alt">{altLabel}</span>}
                    </label>
                )}
                <select ref={ref} className={selectClasses} {...props}>
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error">{error}</span>
                    </label>
                )}
            </div>
        );
    },
);

NativeSelect.displayName = 'NativeSelect';

export { NativeSelect, type NativeSelectProps, type NativeSelectOption };
