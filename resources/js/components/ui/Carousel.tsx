import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
    snap?: 'start' | 'center' | 'end';
    vertical?: boolean;
}

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
    ({ snap = 'center', vertical, className = '', children, ...props }, ref) => {
        const classes = [
            'carousel',
            snap && `carousel-${snap}`,
            vertical && 'carousel-vertical',
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

Carousel.displayName = 'Carousel';

interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
    id?: string;
    src?: string;
    alt?: string;
    prevId?: string;
    nextId?: string;
}

function CarouselItem({
    id,
    src,
    alt = '',
    prevId,
    nextId,
    className = '',
    children,
    ...props
}: CarouselItemProps) {
    return (
        <div id={id} className={`carousel-item relative w-full ${className}`} {...props}>
            {src ? <img src={src} alt={alt} className="w-full" /> : children}
            {(prevId || nextId) && (
                <div className="absolute inset-y-1/2 left-5 right-5 flex -translate-y-1/2 transform justify-between">
                    {prevId && (
                        <a href={`#${prevId}`} className="btn btn-circle">
                            ❮
                        </a>
                    )}
                    {nextId && (
                        <a href={`#${nextId}`} className="btn btn-circle">
                            ❯
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

export { Carousel, CarouselItem, type CarouselProps, type CarouselItemProps };
