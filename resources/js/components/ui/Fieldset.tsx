import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

interface FieldsetProps extends HTMLAttributes<HTMLFieldSetElement> {
    legend?: ReactNode;
    disabled?: boolean;
}

const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
    ({ legend, disabled, className = '', children, ...props }, ref) => {
        const classes = [
            'fieldset',
            'bg-base-200',
            'border border-base-300',
            'p-4',
            'rounded-box',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <fieldset ref={ref} className={classes} disabled={disabled} {...props}>
                {legend && (
                    <legend className="fieldset-legend">{legend}</legend>
                )}
                {children}
            </fieldset>
        );
    },
);

Fieldset.displayName = 'Fieldset';

function FieldsetLabel({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLLabelElement>) {
    return (
        <label className={`fieldset-label ${className}`} {...props}>
            {children}
        </label>
    );
}

export { Fieldset, FieldsetLabel, type FieldsetProps };
