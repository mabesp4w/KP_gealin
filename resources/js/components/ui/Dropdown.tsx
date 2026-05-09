import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

type DropdownPosition = 'top' | 'bottom' | 'left' | 'right';
type DropdownAlign = 'start' | 'end';

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
    trigger: ReactNode;
    position?: DropdownPosition;
    align?: DropdownAlign;
    hover?: boolean;
    open?: boolean;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
    (
        {
            trigger,
            position,
            align,
            hover,
            open,
            className = '',
            children,
            ...props
        },
        ref,
    ) => {
        const classes = [
            'dropdown',
            position && `dropdown-${position}`,
            align && `dropdown-${align}`,
            hover && 'dropdown-hover',
            open && 'dropdown-open',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div ref={ref} className={classes} {...props}>
                <div tabIndex={0} role="button" className="btn m-1">
                    {trigger}
                </div>
                <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
                >
                    {children}
                </ul>
            </div>
        );
    },
);

Dropdown.displayName = 'Dropdown';

interface DropdownItemProps extends HTMLAttributes<HTMLLIElement> {
    disabled?: boolean;
}

function DropdownItem({
    disabled,
    className = '',
    children,
    ...props
}: DropdownItemProps) {
    return (
        <li className={`${disabled ? 'disabled' : ''} ${className}`} {...props}>
            <a>{children}</a>
        </li>
    );
}

export {
    Dropdown,
    DropdownItem,
    type DropdownProps,
    type DropdownItemProps,
    type DropdownPosition,
};
