import { type HTMLAttributes, forwardRef } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    width?: string;
    height?: string;
    circle?: boolean;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    ({ width, height, circle, className = '', style, ...props }, ref) => {
        const classes = ['skeleton', circle && 'shrink-0', className]
            .filter(Boolean)
            .join(' ');

        return (
            <div
                ref={ref}
                className={classes}
                style={{
                    width: circle ? height || width : width,
                    height: height || (circle ? width : undefined),
                    borderRadius: circle ? '50%' : undefined,
                    ...style,
                }}
                {...props}
            />
        );
    },
);

Skeleton.displayName = 'Skeleton';

// Pre-built skeleton patterns
function SkeletonText({
    lines = 3,
    className = '',
}: {
    lines?: number;
    className?: string;
}) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {Array.from({ length: lines }, (_, i) => (
                <Skeleton
                    key={i}
                    height="0.75rem"
                    width={i === lines - 1 ? '60%' : '100%'}
                />
            ))}
        </div>
    );
}

function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`flex w-full flex-col gap-4 ${className}`}>
            <Skeleton height="12rem" width="100%" />
            <Skeleton height="1rem" width="70%" />
            <Skeleton height="0.75rem" width="100%" />
            <Skeleton height="0.75rem" width="100%" />
        </div>
    );
}

function SkeletonAvatar({
    size = '3rem',
    className = '',
}: {
    size?: string;
    className?: string;
}) {
    return <Skeleton circle width={size} height={size} className={className} />;
}

function SkeletonListItem({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-4 ${className}`}>
            <SkeletonAvatar />
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton height="0.75rem" width="40%" />
                <Skeleton height="0.5rem" width="70%" />
            </div>
        </div>
    );
}

export {
    Skeleton,
    SkeletonText,
    SkeletonCard,
    SkeletonAvatar,
    SkeletonListItem,
    type SkeletonProps,
};
