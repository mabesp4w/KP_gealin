import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

type FileInputColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost';
type FileInputSize = 'xs' | 'sm' | 'md' | 'lg';
type FileInputVariant = 'bordered' | 'ghost';

interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    altLabel?: string;
    color?: FileInputColor;
    size?: FileInputSize;
    variant?: FileInputVariant;
    error?: string;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
    ({ label, altLabel, color, size, variant, error, className = '', ...props }, ref) => {
        const inputClasses = [
            'file-input',
            color && `file-input-${color}`,
            size && `file-input-${size}`,
            variant && `file-input-${variant}`,
            error && 'file-input-error',
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
                <input ref={ref} type="file" className={inputClasses} {...props} />
                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error">{error}</span>
                    </label>
                )}
            </div>
        );
    },
);

FileInput.displayName = 'FileInput';

export { FileInput, type FileInputProps };
