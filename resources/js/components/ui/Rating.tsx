import { type InputHTMLAttributes, forwardRef, useState } from 'react';

type RatingSize = 'xs' | 'sm' | 'md' | 'lg';
type RatingMask = 'star' | 'star-2' | 'heart' | 'diamond' | 'circle' | 'hexagon' | 'hexagon-2' | 'decagon' | 'pentagon' | 'cross' | 'element';

interface RatingProps {
    name: string;
    value?: number;
    max?: number;
    size?: RatingSize;
    mask?: RatingMask;
    half?: boolean;
    color?: string;
    onChange?: (value: number) => void;
    disabled?: boolean;
    className?: string;
}

function Rating({
    name,
    value = 0,
    max = 5,
    size,
    mask = 'star-2',
    half,
    color = 'bg-orange-400',
    onChange,
    disabled,
    className = '',
}: RatingProps) {
    const ratingClasses = [
        'rating',
        size && `rating-${size}`,
        half && 'rating-half',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    if (half) {
        return (
            <div className={ratingClasses}>
                <input
                    type="radio"
                    name={name}
                    className="rating-hidden"
                    checked={value === 0}
                    onChange={() => onChange?.(0)}
                    disabled={disabled}
                />
                {Array.from({ length: max * 2 }, (_, i) => {
                    const starValue = (i + 1) / 2;
                    const isFirstHalf = i % 2 === 0;
                    return (
                        <input
                            key={i}
                            type="radio"
                            name={name}
                            className={`mask mask-${mask} ${isFirstHalf ? 'mask-half-1' : 'mask-half-2'} ${color}`}
                            checked={value === starValue}
                            onChange={() => onChange?.(starValue)}
                            disabled={disabled}
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <div className={ratingClasses}>
            <input
                type="radio"
                name={name}
                className="rating-hidden"
                checked={value === 0}
                onChange={() => onChange?.(0)}
                disabled={disabled}
            />
            {Array.from({ length: max }, (_, i) => (
                <input
                    key={i}
                    type="radio"
                    name={name}
                    className={`mask mask-${mask} ${color}`}
                    checked={value === i + 1}
                    onChange={() => onChange?.(i + 1)}
                    disabled={disabled}
                />
            ))}
        </div>
    );
}

export { Rating, type RatingProps };
