import { type HTMLAttributes, type ImgHTMLAttributes, forwardRef } from 'react';

type AvatarSize = 'w-8' | 'w-10' | 'w-12' | 'w-16' | 'w-20' | 'w-24' | 'w-32';
type AvatarShape = 'squircle' | 'circle' | 'hexagon' | 'triangle';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    size?: AvatarSize;
    shape?: AvatarShape;
    online?: boolean;
    offline?: boolean;
    placeholder?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    (
        {
            src,
            alt = '',
            size = 'w-12',
            shape = 'circle',
            online,
            offline,
            placeholder,
            className = '',
            children,
            ...props
        },
        ref,
    ) => {
        const wrapperClasses = [
            'avatar',
            online && 'online',
            offline && 'offline',
            !src && placeholder && 'placeholder',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const innerClasses = [`${size}`, 'rounded-full'];

        if (!src && placeholder) {
            innerClasses.push('bg-neutral', 'text-neutral-content');
        }

        return (
            <div ref={ref} className={wrapperClasses} {...props}>
                <div className={innerClasses.join(' ')}>
                    {src ? (
                        <img src={src} alt={alt} />
                    ) : placeholder ? (
                        <span className="text-xl">{placeholder}</span>
                    ) : (
                        children
                    )}
                </div>
            </div>
        );
    },
);

Avatar.displayName = 'Avatar';

interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
    max?: number;
}

function AvatarGroup({
    className = '',
    children,
    ...props
}: AvatarGroupProps) {
    return (
        <div className={`avatar-group -space-x-6 ${className}`} {...props}>
            {children}
        </div>
    );
}

export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps };
