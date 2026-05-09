import { type HTMLAttributes, type ReactNode, forwardRef, useState } from 'react';

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div ref={ref} className={`space-y-1 ${className}`} {...props}>
                {children}
            </div>
        );
    },
);

Accordion.displayName = 'Accordion';

type AccordionItemVariant = 'arrow' | 'plus';

interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title: ReactNode;
    variant?: AccordionItemVariant;
    name?: string;
    defaultOpen?: boolean;
}

function AccordionItem({
    title,
    variant = 'arrow',
    name,
    defaultOpen = false,
    className = '',
    children,
    ...props
}: AccordionItemProps) {
    const classes = [
        'collapse',
        variant && `collapse-${variant}`,
        'bg-base-100',
        'border border-base-300',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} {...props}>
            <input
                type="radio"
                name={name || 'accordion'}
                defaultChecked={defaultOpen}
            />
            <div className="collapse-title font-semibold">{title}</div>
            <div className="collapse-content text-sm">{children}</div>
        </div>
    );
}

interface CollapseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title: ReactNode;
    variant?: AccordionItemVariant;
    defaultOpen?: boolean;
    forceOpen?: boolean;
    forceClose?: boolean;
}

function Collapse({
    title,
    variant = 'arrow',
    defaultOpen = false,
    forceOpen,
    forceClose,
    className = '',
    children,
    ...props
}: CollapseProps) {
    const classes = [
        'collapse',
        variant && `collapse-${variant}`,
        'bg-base-100',
        'border border-base-300',
        forceOpen && 'collapse-open',
        forceClose && 'collapse-close',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} tabIndex={0} {...props}>
            <div className="collapse-title font-semibold">{title}</div>
            <div className="collapse-content text-sm">{children}</div>
        </div>
    );
}

export {
    Accordion,
    AccordionItem,
    Collapse,
    type AccordionProps,
    type AccordionItemProps,
    type CollapseProps,
};
