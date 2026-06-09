<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MuridAktifMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $murid = $request->user()?->murid;

        if (!$murid || !$murid->isAktif()) {
            return redirect()->route('dashboard')
                ->with('error', 'Akun Anda belum diverifikasi oleh pelatih.');
        }

        return $next($request);
    }
}
