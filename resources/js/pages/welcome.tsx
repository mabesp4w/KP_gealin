import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canRegister }: { canRegister: boolean }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold">
                            Welcome
                        </h1>
                        <p className="py-6 text-base-content/70">
                            Laravel + React + TypeScript starter template with daisyUI.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link
                                href="/login"
                                className="btn btn-primary"
                            >
                                Login
                            </Link>
                            {canRegister && (
                                <Link
                                    href="/register"
                                    className="btn btn-outline"
                                >
                                    Register
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
