import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-base-200">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                        <h1 className="card-title text-3xl font-bold">
                            Dashboard
                        </h1>
                        <p className="text-base-content/70">
                            You are logged in!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
