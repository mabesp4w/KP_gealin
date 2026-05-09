import { Link } from '@inertiajs/react';
import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

interface BreadcrumbsProps extends HTMLAttributes<HTMLDivElement> {
    items: BreadcrumbItem[];
}

interface BreadcrumbItem {
    label: ReactNode;
    href?: string;
    icon?: ReactNode;
}

const Breadcrumbs = forwardRef<HTMLDivElement, BreadcrumbsProps>(
    ({ items, className = '', ...props }, ref) => {
        return (
            <div ref={ref} className={`breadcrumbs text-sm ${className}`} {...props}>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            {item.href ? (
                                <Link href={item.href} className="inline-flex items-center gap-2">
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="inline-flex items-center gap-2">
                                    {item.icon}
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    },
);

Breadcrumbs.displayName = 'Breadcrumbs';

export { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbItem };
