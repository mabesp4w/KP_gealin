import {
    type ReactNode,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

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

const Modal = forwardRef<ModalHandle, ModalProps>(
    (
        {
            open,
            onClose,
            position = 'middle',
            closeOnBackdrop = true,
            className = '',
            boxClassName = '',
            children,
        },
        ref,
    ) => {
        const dialogRef = useRef<HTMLDialogElement>(null);

        useImperativeHandle(ref, () => ({
            showModal: () => dialogRef.current?.showModal(),
            close: () => dialogRef.current?.close(),
        }));

        useEffect(() => {
            if (!dialogRef.current) return;
            if (open) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }, [open]);

        const handleClose = useCallback(() => {
            onClose?.();
        }, [onClose]);

        const modalClasses = [
            'modal',
            position && `modal-${position}`,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const boxClasses = ['modal-box', boxClassName].filter(Boolean).join(' ');

        return (
            <dialog ref={dialogRef} className={modalClasses} onClose={handleClose}>
                <div className={boxClasses}>
                    {children}
                </div>
                {closeOnBackdrop && (
                    <form method="dialog" className="modal-backdrop">
                        <button type="submit">close</button>
                    </form>
                )}
            </dialog>
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
