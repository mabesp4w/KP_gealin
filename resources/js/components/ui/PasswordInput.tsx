import { type InputHTMLAttributes, forwardRef, useState } from 'react';

type PasswordInputColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost';
type PasswordInputSize = 'xs' | 'sm' | 'md' | 'lg';
type PasswordInputVariant = 'bordered' | 'ghost';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    altLabel?: string;
    color?: PasswordInputColor;
    size?: PasswordInputSize;
    variant?: PasswordInputVariant;
    error?: string;
    topRightLabel?: React.ReactNode;
    bottomRightLabel?: React.ReactNode;
}

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
        <path d="m2 2 20 20" />
    </svg>
);

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
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
        const [visible, setVisible] = useState(false);

        const inputClasses = [
            'input',
            color && `input-${color}`,
            size && `input-${size}`,
            variant && `input-${variant}`,
            error && 'input-error',
            'w-full pr-10',
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
                <div className="relative">
                    <input
                        ref={ref}
                        type={visible ? 'text' : 'password'}
                        className={inputClasses}
                        {...props}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70 transition-colors"
                        onClick={() => setVisible((v) => !v)}
                        tabIndex={-1}
                        aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                        {visible ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>
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

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput, type PasswordInputProps, type PasswordInputColor, type PasswordInputSize };
