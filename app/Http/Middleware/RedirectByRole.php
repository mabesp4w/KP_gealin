<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectByRole
{
    /**
     * Redirect authenticated user to their role-based home page.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            return redirect(self::homeFor($request->user()->role));
        }

        return $next($request);
    }

    /**
     * Get the home URL for a given role.
     */
    public static function homeFor(string $role): string
    {
        return match ($role) {
            'staf' => '/staf',
            'warga' => '/warga',
            default => '/login',
        };
    }
}
