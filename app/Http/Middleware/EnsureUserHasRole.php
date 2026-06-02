<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user() || ! in_array($request->user()->role, $roles)) {
            if ($request->user()) {
                // Redirect ke halaman sesuai role-nya
                return redirect($this->homeForRole($request->user()->role));
            }

            return redirect()->route('login');
        }

        return $next($request);
    }

    private function homeForRole(string $role): string
    {
        return match ($role) {
            'staf' => '/staf',
            'warga' => '/warga',
            default => '/login',
        };
    }
}
