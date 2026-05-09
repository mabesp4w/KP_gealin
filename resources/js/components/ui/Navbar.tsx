import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

interface NavbarProps extends HTMLAttributes<HTMLDivElement> {
    glass?: boolean;
}

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
    ({ glass, className = '', children, ...props }, ref) => {
        const classes = ['navbar', 'bg-base-100', glass && 'glass', className]
            .filter(Boolean)
            .join(' ');

        return (
            <div ref={ref} className={classes} {...props}>
                {children}
            </div>
        );
    },
);

Navbar.displayName = 'Navbar';

function NavbarStart({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`navbar-start ${className}`} {...props}>
            {children}
        </div>
    );
}

function NavbarCenter({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`navbar-center ${className}`} {...props}>
            {children}
        </div>
    );
}

function NavbarEnd({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`navbar-end ${className}`} {...props}>
            {children}
        </div>
    );
}

export {
    Navbar,
    NavbarStart,
    NavbarCenter,
    NavbarEnd,
    type NavbarProps,
};
