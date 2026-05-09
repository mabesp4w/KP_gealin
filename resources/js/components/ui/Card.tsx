import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

type CardVariant = 'bordered' | 'dash';
type CardSize = 'compact' | 'side' | 'normal';
type CardImagePosition = 'full' | 'overlay';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    size?: CardSize;
    glass?: boolean;
    imagePosition?: CardImagePosition;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        { variant, size, glass, imagePosition, className = '', children, ...props },
        ref,
    ) => {
        const classes = [
            'card',
            'bg-base-100',
            variant && variant === 'bordered' ? 'card-border' : variant === 'dash' ? 'card-dash' : '',
            size && size === 'compact' ? 'card-compact' : size === 'side' ? 'card-side' : '',
            imagePosition && `image-${imagePosition}`,
            glass && 'glass',
            'shadow-sm',
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

Card.displayName = 'Card';

function CardBody({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`card-body ${className}`} {...props}>
            {children}
        </div>
    );
}

function CardTitle({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2 className={`card-title ${className}`} {...props}>
            {children}
        </h2>
    );
}

function CardActions({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`card-actions justify-end ${className}`} {...props}>
            {children}
        </div>
    );
}

function CardFigure({
    src,
    alt = '',
    className = '',
    ...props
}: { src: string; alt?: string } & HTMLAttributes<HTMLElement>) {
    return (
        <figure className={className} {...props}>
            <img src={src} alt={alt} />
        </figure>
    );
}

export {
    Card,
    CardBody,
    CardTitle,
    CardActions,
    CardFigure,
    type CardProps,
};
