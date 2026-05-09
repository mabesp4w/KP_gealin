import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
    drawerId: string;
    sidebar: ReactNode;
    open?: boolean;
    end?: boolean;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
    ({ drawerId, sidebar, open, end, className = '', children, ...props }, ref) => {
        const classes = ['drawer', end && 'drawer-end', className]
            .filter(Boolean)
            .join(' ');

        return (
            <div ref={ref} className={classes} {...props}>
                <input
                    id={drawerId}
                    type="checkbox"
                    className="drawer-toggle"
                    defaultChecked={open}
                />
                <div className="drawer-content">{children}</div>
                <div className="drawer-side">
                    <label
                        htmlFor={drawerId}
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    />
                    {sidebar}
                </div>
            </div>
        );
    },
);

Drawer.displayName = 'Drawer';

interface DrawerButtonProps extends HTMLAttributes<HTMLLabelElement> {
    drawerId: string;
}

function DrawerButton({
    drawerId,
    className = '',
    children,
    ...props
}: DrawerButtonProps) {
    return (
        <label
            htmlFor={drawerId}
            className={`btn btn-primary drawer-button ${className}`}
            {...props}
        >
            {children}
        </label>
    );
}

export { Drawer, DrawerButton, type DrawerProps, type DrawerButtonProps };
