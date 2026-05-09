import toast, { Toaster as HotToaster, type ToastOptions } from 'react-hot-toast';

// ── Re-export Toaster (place in root layout) ────────────
interface ToasterProps {
    position?:
        | 'top-left'
        | 'top-center'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-center'
        | 'bottom-right';
}

function Toaster({ position = 'top-right' }: ToasterProps) {
    return (
        <HotToaster
            position={position}
            toastOptions={{
                className: 'alert shadow-lg',
                duration: 4000,
                style: {
                    borderRadius: 'var(--rounded-box, 1rem)',
                    padding: '12px 16px',
                },
                success: {
                    className: 'alert alert-success shadow-lg',
                    iconTheme: { primary: 'oklch(var(--su))', secondary: 'white' },
                },
                error: {
                    className: 'alert alert-error shadow-lg',
                    iconTheme: { primary: 'oklch(var(--er))', secondary: 'white' },
                },
            }}
        />
    );
}

// ── Helper functions ────────────────────────────────────
function showToast(message: string, options?: ToastOptions) {
    return toast(message, options);
}

function showSuccess(message: string, options?: ToastOptions) {
    return toast.success(message, options);
}

function showError(message: string, options?: ToastOptions) {
    return toast.error(message, options);
}

function showLoading(message: string, options?: ToastOptions) {
    return toast.loading(message, options);
}

function dismissToast(toastId?: string) {
    toast.dismiss(toastId);
}

// Promise-based toast
function showPromise<T>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: unknown) => string);
    },
) {
    return toast.promise(promise, messages);
}

export {
    Toaster,
    showToast,
    showSuccess,
    showError,
    showLoading,
    dismissToast,
    showPromise,
    type ToasterProps,
};
