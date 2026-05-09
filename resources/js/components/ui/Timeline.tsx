import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

interface TimelineProps extends HTMLAttributes<HTMLUListElement> {
    vertical?: boolean;
    horizontal?: boolean;
    snap?: boolean;
    compact?: boolean;
}

const Timeline = forwardRef<HTMLUListElement, TimelineProps>(
    ({ vertical, horizontal, snap, compact, className = '', children, ...props }, ref) => {
        const classes = [
            'timeline',
            vertical && 'timeline-vertical',
            horizontal && 'timeline-horizontal',
            snap && 'timeline-snap-icon',
            compact && 'timeline-compact',
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

Timeline.displayName = 'Timeline';

interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
    start?: ReactNode;
    middle?: ReactNode;
    end?: ReactNode;
    connector?: 'start' | 'end' | 'both';
}

function TimelineItem({
    start,
    middle,
    end,
    connector = 'both',
    className = '',
    ...props
}: TimelineItemProps) {
    return (
        <li className={className} {...props}>
            {(connector === 'start' || connector === 'both') && <hr />}
            {start && <div className="timeline-start">{start}</div>}
            <div className="timeline-middle">
                {middle || (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </div>
            {end && <div className="timeline-end">{end}</div>}
            {(connector === 'end' || connector === 'both') && <hr />}
        </li>
    );
}

export {
    Timeline,
    TimelineItem,
    type TimelineProps,
    type TimelineItemProps,
};
