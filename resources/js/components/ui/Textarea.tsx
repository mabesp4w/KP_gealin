import { type TextareaHTMLAttributes, type ReactNode, forwardRef } from 'react';

type TextareaColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost';
type TextareaSize = 'xs' | 'sm' | 'md' | 'lg';
type TextareaVariant = 'bordered' | 'ghost';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
    label?: string;
    altLabel?: string;
    color?: TextareaColor;
    size?: TextareaSize;
    variant?: TextareaVariant;
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, altLabel, color, size, variant, error, className = '', value, ...props }, ref) => {
        const inputClasses = [
            'textarea',
            color && `textarea-${color}`,
            size && `textarea-${size}`,
            variant && `textarea-${variant}`,
            error && 'textarea-error',
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
                <textarea ref={ref} className={inputClasses} value={value ?? ''} {...props} />
                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error">{error}</span>
                    </label>
                )}
            </div>
        );
    },
);

Textarea.displayName = 'Textarea';

export { Textarea, type TextareaProps };
