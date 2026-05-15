<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $role = $user->role?->nama_role;

        switch ($role) {
            case 'Super Admin':
                return Inertia::render('Admin/Dashboard');
            case 'Bendahara':
                return Inertia::render('Bendahara/Dashboard');
            case 'Pelatih':
                return Inertia::render('Pelatih/Dashboard');
            case 'Murid':
                // Memuat data ranting sesuai FSD FR-02
                $user->load('ranting');
                return Inertia::render('Murid/Dashboard', [
                    'user' => $user
                ]);
            default:
                return Inertia::render('Dashboard');
        }
    }
}
