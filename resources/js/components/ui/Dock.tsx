import { Link } from '@inertiajs/react';
import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

type DockSize = 'xs' | 'sm' | 'md' | 'lg';

interface DockProps extends HTMLAttributes<HTMLDivElement> {
    size?: DockSize;
}

const Dock = forwardRef<HTMLDivElement, DockProps>(
    ({ size, className = '', children, ...props }, ref) => {
        const classes = [
            'dock',
            size && `dock-${size}`,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div ref={ref} className={classes} {...props}>
                {children}
            </div>
        );
    },
);

Dock.displayName = 'Dock';

interface DockItemProps {
    href?: string;
    icon: ReactNode;
    label?: string;
    active?: boolean;
    className?: string;
    onClick?: () => void;
}

function DockItem({
    href,
    icon,
    label,
    active,
    className = '',
    onClick,
}: DockItemProps) {
    const content = (
        <>
            {icon}
            {label && <span className="dock-label">{label}</span>}
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className={`${active ? 'dock-active' : ''} ${className}`}
                onClick={onClick}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            className={`${active ? 'dock-active' : ''} ${className}`}
            onClick={onClick}
        >
            {content}
        </button>
    );
}

export { Dock, DockItem, type DockProps, type DockItemProps };
