import { useState } from 'react';
import LightboxComponent, { type Slide } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface LightboxProps {
    slides: Slide[];
    open?: boolean;
    onClose?: () => void;
    index?: number;
}

function Lightbox({ slides, open = false, onClose, index = 0 }: LightboxProps) {
    return (
        <LightboxComponent
            open={open}
            close={onClose || (() => {})}
            slides={slides}
            index={index}
        />
    );
}

// ── Image Gallery with Lightbox ──────────────────────────
interface ImageGalleryProps {
    images: { src: string; alt?: string; thumbnail?: string }[];
    columns?: 2 | 3 | 4;
    gap?: string;
    className?: string;
}

function ImageGallery({
    images,
    columns = 3,
    gap = 'gap-2',
    className = '',
}: ImageGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    };

    const slides: Slide[] = images.map((img) => ({
        src: img.src,
        alt: img.alt,
    }));

    return (
        <>
            <div className={`grid ${gridCols[columns]} ${gap} ${className}`}>
                {images.map((image, index) => (
                    <figure
                        key={index}
                        className="cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105"
                        onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                        }}
                    >
                        <img
                            src={image.thumbnail || image.src}
                            alt={image.alt || ''}
                            className="h-full w-full object-cover"
                        />
                    </figure>
                ))}
            </div>
            <Lightbox
                slides={slides}
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                index={lightboxIndex}
            />
        </>
    );
}

export { Lightbox, ImageGallery, type LightboxProps, type ImageGalleryProps };
