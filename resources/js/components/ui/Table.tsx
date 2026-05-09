import { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, forwardRef } from 'react';

type TableSize = 'xs' | 'sm' | 'md' | 'lg';

interface TableProps extends HTMLAttributes<HTMLTableElement> {
    zebra?: boolean;
    pinRows?: boolean;
    pinCols?: boolean;
    size?: TableSize;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
    ({ zebra, pinRows, pinCols, size, className = '', children, ...props }, ref) => {
        const classes = [
            'table',
            zebra && 'table-zebra',
            pinRows && 'table-pin-rows',
            pinCols && 'table-pin-cols',
            size && `table-${size}`,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className="overflow-x-auto">
                <table ref={ref} className={classes} {...props}>
                    {children}
                </table>
            </div>
        );
    },
);

Table.displayName = 'Table';

function TableHead({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <thead className={className} {...props}>
            {children}
        </thead>
    );
}

function TableBody({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody className={className} {...props}>
            {children}
        </tbody>
    );
}

function TableFoot({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tfoot className={className} {...props}>
            {children}
        </tfoot>
    );
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
    hover?: boolean;
    active?: boolean;
}

function TableRow({
    hover,
    active,
    className = '',
    children,
    ...props
}: TableRowProps) {
    const classes = [hover && 'hover', active && 'active', className]
        .filter(Boolean)
        .join(' ');

    return (
        <tr className={classes} {...props}>
            {children}
        </tr>
    );
}

function TableHeaderCell({
    className = '',
    children,
    ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th className={className} {...props}>
            {children}
        </th>
    );
}

function TableCell({
    className = '',
    children,
    ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td className={className} {...props}>
            {children}
        </td>
    );
}

export {
    Table,
    TableHead,
    TableBody,
    TableFoot,
    TableRow,
    TableHeaderCell,
    TableCell,
    type TableProps,
    type TableRowProps,
};
