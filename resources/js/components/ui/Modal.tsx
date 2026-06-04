import {
    type ReactNode,
    type MouseEvent,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import { createPortal } from 'react-dom';

type ModalPosition = 'top' | 'bottom' | 'middle';

interface ModalProps {
    open?: boolean;
    onClose?: () => void;
    position?: ModalPosition;
    closeOnBackdrop?: boolean;
    className?: string;
    boxClassName?: string;
    children: ReactNode;
}

export interface ModalHandle {
    showModal: () => void;
    close: () => void;
}

const positionClasses: Record<ModalPosition, string> = {
    top: 'items-start pt-8',
    middle: 'items-center',
    bottom: 'items-end pb-8',
};

const Modal = forwardRef<ModalHandle, ModalProps>(
    (
        {
            open: controlledOpen,
            onClose,
            position = 'middle',
            closeOnBackdrop = true,
            className = '',
            boxClassName = '',
            children,
        },
        ref,
    ) => {
        const [internalOpen, setInternalOpen] = useState(false);
        const isOpen = controlledOpen ?? internalOpen;

        useImperativeHandle(ref, () => ({
            showModal: () => setInternalOpen(true),
            close: () => {
                setInternalOpen(false);
                onClose?.();
            },
        }));

        // Lock body scroll when open
        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            return () => {
                document.body.style.overflow = '';
            };
        }, [isOpen]);

        // Close on Escape key
        useEffect(() => {
            if (!isOpen) return;
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose?.();
                }
            };
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }, [isOpen, onClose]);

        const handleBackdropClick = useCallback(
            (e: MouseEvent<HTMLDivElement>) => {
                if (closeOnBackdrop && e.target === e.currentTarget) {
                    onClose?.();
                }
            },
            [closeOnBackdrop, onClose],
        );

        if (!isOpen) return null;

        const boxClasses = ['modal-box', boxClassName].filter(Boolean).join(' ');

        return createPortal(
            <div
                className={`fixed inset-0 z-[999] flex justify-center overflow-y-auto p-4 bg-black/40 ${positionClasses[position]} ${className}`}
                onClick={handleBackdropClick}
            >
                <div className={boxClasses} style={{ opacity: 1, scale: '1' }}>
                    {children}
                </div>
            </div>,
            document.body,
        );
    },
);

Modal.displayName = 'Modal';

function ModalHeader({
    className = '',
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return <h3 className={`text-lg font-bold ${className}`}>{children}</h3>;
}

function ModalBody({
    className = '',
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return <div className={`py-4 ${className}`}>{children}</div>;
}

function ModalAction({
    className = '',
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return <div className={`modal-action ${className}`}>{children}</div>;
}

export { Modal, ModalHeader, ModalBody, ModalAction, type ModalProps };
