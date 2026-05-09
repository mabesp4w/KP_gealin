import { Link } from '@inertiajs/react';
import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

type MenuSize = 'xs' | 'sm' | 'md' | 'lg';
type MenuDirection = 'horizontal' | 'vertical';

interface MenuProps extends HTMLAttributes<HTMLUListElement> {
    size?: MenuSize;
    direction?: MenuDirection;
    rounded?: boolean;
}

const Menu = forwardRef<HTMLUListElement, MenuProps>(
    ({ size, direction, rounded, className = '', children, ...props }, ref) => {
        const classes = [
            'menu',
            size && `menu-${size}`,
            direction && `menu-${direction}`,
            rounded && 'rounded-box',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <ul ref={ref} className={classes} {...props}>
                {children}
            </ul>
        );
    },
);

Menu.displayName = 'Menu';

interface MenuItemProps extends HTMLAttributes<HTMLLIElement> {
    href?: string;
    active?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
    badge?: ReactNode;
}

function MenuItem({
    href,
    active,
    disabled,
    icon,
    badge,
    className = '',
    children,
    ...props
}: MenuItemProps) {
    const liClasses = [disabled && 'disabled', className]
        .filter(Boolean)
        .join(' ');

    const content = (
        <>
            {icon}
            {children}
            {badge && <span className="badge badge-sm">{badge}</span>}
        </>
    );

    return (
        <li className={liClasses} {...props}>
            {href ? (
                <Link href={href} className={active ? 'active' : ''}>
                    {content}
                </Link>
            ) : (
                <a className={active ? 'active' : ''}>{content}</a>
            )}
        </li>
    );
}

function MenuTitle({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLLIElement>) {
    return (
        <li className={`menu-title ${className}`} {...props}>
            {children}
        </li>
    );
}

interface SubMenuProps extends HTMLAttributes<HTMLLIElement> {
    label: ReactNode;
    icon?: ReactNode;
    open?: boolean;
}

function SubMenu({
    label,
    icon,
    open,
    className = '',
    children,
    ...props
}: SubMenuProps) {
    return (
        <li className={className} {...props}>
            <details open={open}>
                <summary>
                    {icon}
                    {label}
                </summary>
                <ul>{children}</ul>
            </details>
        </li>
    );
}

export {
    Menu,
    MenuItem,
    MenuTitle,
    SubMenu,
    type MenuProps,
    type MenuItemProps,
    type SubMenuProps,
};
