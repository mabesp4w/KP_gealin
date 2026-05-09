import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

type TextInputColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost';
type TextInputSize = 'xs' | 'sm' | 'md' | 'lg';
type TextInputVariant = 'bordered' | 'ghost';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    altLabel?: string;
    color?: TextInputColor;
    size?: TextInputSize;
    variant?: TextInputVariant;
    error?: string;
    topRightLabel?: ReactNode;
    bottomRightLabel?: ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    (
        {
            label,
            altLabel,
            color,
            size,
            variant,
            error,
            topRightLabel,
            bottomRightLabel,
            className = '',
            ...props
        },
        ref,
    ) => {
        const inputClasses = [
            'input',
            color && `input-${color}`,
            size && `input-${size}`,
            variant && `input-${variant}`,
            error && 'input-error',
            'w-full',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className="form-control w-full">
                {(label || topRightLabel) && (
                    <label className="label">
                        {label && <span className="label-text">{label}</span>}
                        {topRightLabel && (
                            <span className="label-text-alt">{topRightLabel}</span>
                        )}
                    </label>
                )}
                <input ref={ref} className={inputClasses} {...props} />
                {(error || altLabel || bottomRightLabel) && (
                    <label className="label">
                        {(error || altLabel) && (
                            <span className={`label-text-alt ${error ? 'text-error' : ''}`}>
                                {error || altLabel}
                            </span>
                        )}
                        {bottomRightLabel && (
                            <span className="label-text-alt">{bottomRightLabel}</span>
                        )}
                    </label>
                )}
            </div>
        );
    },
);

TextInput.displayName = 'TextInput';

export { TextInput, type TextInputProps, type TextInputColor, type TextInputSize };
