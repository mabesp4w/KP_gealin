import { type HTMLAttributes, type ReactNode, forwardRef, useState } from 'react';

type TabsSize = 'xs' | 'sm' | 'md' | 'lg';
type TabsVariant = 'bordered' | 'lifted' | 'boxed';

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
    size?: TabsSize;
    variant?: TabsVariant;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
    ({ size, variant, className = '', children, ...props }, ref) => {
        const classes = [
            'tabs',
            size && `tabs-${size}`,
            variant && `tabs-${variant}`,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div ref={ref} role="tablist" className={classes} {...props}>
                {children}
            </div>
        );
    },
);

Tabs.displayName = 'Tabs';

interface TabProps extends HTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    active?: boolean;
    disabled?: boolean;
}

function Tab({
    label,
    name,
    active,
    disabled,
    className = '',
    ...props
}: TabProps) {
    const classes = ['tab', active && 'tab-active', disabled && 'tab-disabled', className]
        .filter(Boolean)
        .join(' ');

    return (
        <input
            type="radio"
            name={name}
            role="tab"
            className={classes}
            aria-label={label}
            defaultChecked={active}
            disabled={disabled}
            {...props}
        />
    );
}

interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

function TabContent({
    className = '',
    children,
    ...props
}: TabContentProps) {
    return (
        <div role="tabpanel" className={`tab-content p-6 ${className}`} {...props}>
            {children}
        </div>
    );
}

// ── Controlled Tabs ──────────────────────────────────────
interface ControlledTabsProps {
    tabs: { label: string; content: ReactNode; disabled?: boolean }[];
    variant?: TabsVariant;
    size?: TabsSize;
    defaultIndex?: number;
    className?: string;
}

function ControlledTabs({
    tabs,
    variant,
    size,
    defaultIndex = 0,
    className = '',
}: ControlledTabsProps) {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);

    const tabsClasses = [
        'tabs',
        size && `tabs-${size}`,
        variant && `tabs-${variant}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div>
            <div role="tablist" className={tabsClasses}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        role="tab"
                        className={`tab ${activeIndex === index ? 'tab-active' : ''} ${tab.disabled ? 'tab-disabled' : ''}`}
                        onClick={() => !tab.disabled && setActiveIndex(index)}
                        disabled={tab.disabled}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="p-6">{tabs[activeIndex]?.content}</div>
        </div>
    );
}

export {
    Tabs,
    Tab,
    TabContent,
    ControlledTabs,
    type TabsProps,
    type TabProps,
    type ControlledTabsProps,
};
