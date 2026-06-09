<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!$user->is_aktif) {
            Auth::logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();
            return redirect()->route('login')->with('error', 'Akun Anda telah dinonaktifkan. Hubungi administrator.');
        }

        $role = $user->role?->nama_role;

        switch ($role) {
            case 'Super Admin':
                return Inertia::render('Admin/Dashboard');

            case 'Bendahara':
                return Inertia::render('Bendahara/Dashboard');

            case 'Pelatih':
                $pelatih = $user->pelatih()->with(['ranting', 'tingkatanSabuk'])->first();
                return Inertia::render('Pelatih/Dashboard', [
                    'pelatih' => $pelatih ? [
                        'nama'          => $user->name,
                        'email'         => $user->email,
                        'foto'          => $pelatih->foto,
                        'nomor_anggota' => $pelatih->nomor_anggota,
                        'ranting'       => $pelatih->ranting?->nama_ranting,
                        'gelar'         => $pelatih->gelar,
                        'sabuk'         => $pelatih->tingkatanSabuk?->nama_sabuk,
                    ] : null,
                ]);

            case 'Murid':
                $murid = $user->murid()->with('ranting')->first();

                if (!$murid) {
                    return Inertia::render('Murid/Dashboard', [
                        'murid'   => null,
                        'pending' => true,
                    ]);
                }

                return Inertia::render('Murid/Dashboard', [
                    'murid'   => [
                        'nama'              => $user->name,
                        'email'             => $user->email,
                        'foto'              => $murid->foto,
                        'nomor_anggota'     => $murid->nomor_anggota,
                        'ranting'           => $murid->ranting?->nama_ranting,
                        'status_verifikasi' => $murid->status_verifikasi,
                        'tempat_lahir'      => $murid->tempat_lahir,
                        'tanggal_lahir'     => $murid->tanggal_lahir?->format('Y-m-d'),
                        'nomor_hp'          => $murid->nomor_hp,
                        'alasan_mendaftar'  => $murid->alasan_mendaftar,
                        'disetujui_pada'    => $murid->disetujui_pada?->format('Y-m-d'),
                    ],
                    'pending' => $murid->isMenunggu(),
                ]);

            default:
                return Inertia::render('Dashboard');
        }
    }
}
