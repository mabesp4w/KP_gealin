import { Link } from '@inertiajs/react';
import { type HTMLAttributes, forwardRef } from 'react';

type PaginationSize = 'xs' | 'sm' | 'md' | 'lg';

interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
    size?: PaginationSize;
}

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
    ({ size, className = '', children, ...props }, ref) => {
        const classes = ['join', className].filter(Boolean).join(' ');

        return (
            <div ref={ref} className={classes} {...props}>
                {children}
            </div>
        );
    },
);

Pagination.displayName = 'Pagination';

interface PaginationButtonProps extends HTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    disabled?: boolean;
    href?: string;
    size?: PaginationSize;
}

function PaginationButton({
    active,
    disabled,
    href,
    size,
    className = '',
    children,
    ...props
}: PaginationButtonProps) {
    const classes = [
        'join-item',
        'btn',
        size && `btn-${size}`,
        active && 'btn-active',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    if (href && !disabled) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button className={classes} disabled={disabled} {...props}>
            {children}
        </button>
    );
}

// ── Laravel Pagination Helper ────────────────────────────
interface LaravelPaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface LaravelPaginationProps extends HTMLAttributes<HTMLDivElement> {
    data: LaravelPaginationData;
    size?: PaginationSize;
}

function LaravelPagination({
    data,
    size,
    className = '',
    ...props
}: LaravelPaginationProps) {
    if (data.last_page <= 1) return null;

    return (
        <Pagination className={className} {...props}>
            {data.links.map((link, index) => (
                <PaginationButton
                    key={index}
                    href={link.url || undefined}
                    active={link.active}
                    disabled={!link.url}
                    size={size}
                >
                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </PaginationButton>
            ))}
        </Pagination>
    );
}

export {
    Pagination,
    PaginationButton,
    LaravelPagination,
    type PaginationProps,
    type PaginationButtonProps,
    type LaravelPaginationData,
    type LaravelPaginationProps,
};
