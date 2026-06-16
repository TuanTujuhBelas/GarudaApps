<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Services\ActivityLogger;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response|RedirectResponse
    {
        if (! $request->user()->is_aktif) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return Redirect::route('login')->with('error', 'Akun Anda telah dinonaktifkan. Hubungi administrator.');
        }

        $user     = $request->user();
        $roleName = $user->role?->nama_role;
        $profil   = null;

        if ($roleName === 'Murid') {
            $murid  = $user->murid()->with(['ranting', 'tingkatanSabuk'])->first();
            $profil = $murid ? [
                'foto'              => $murid->foto,
                'nomor_anggota'     => $murid->nomor_anggota,
                'ranting'           => $murid->ranting?->nama_ranting,
                'sabuk_id'          => $murid->sabuk_id,
                'sabuk'             => $murid->tingkatanSabuk?->nama_sabuk,
                'status_verifikasi' => $murid->status_verifikasi,
            ] : null;
        } elseif ($roleName === 'Pelatih') {
            $pelatih = $user->pelatih()->with(['ranting', 'tingkatanSabuk'])->first();
            $profil  = $pelatih ? [
                'foto'          => $pelatih->foto,
                'nomor_anggota' => $pelatih->nomor_anggota,
                'ranting'       => $pelatih->ranting?->nama_ranting,
                'gelar'         => $pelatih->gelar,
                'sabuk_id'      => $pelatih->sabuk_id,
                'sabuk'         => $pelatih->tingkatanSabuk?->nama_sabuk,
            ] : null;
        } else {
            $adminProfile = $user->adminProfile()->with(['ranting', 'tingkatanSabuk'])->first();
            $profil       = $adminProfile ? [
                'foto'          => $adminProfile->foto,
                'nomor_anggota' => $adminProfile->nomor_anggota,
                'ranting'       => $adminProfile->ranting?->nama_ranting,
                'gelar'         => $adminProfile->gelar,
                'sabuk_id'      => $adminProfile->sabuk_id,
                'sabuk'         => $adminProfile->tingkatanSabuk?->nama_sabuk,
            ] : null;
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail'  => $request->user() instanceof MustVerifyEmail,
            'status'           => session('status'),
            'message'          => session('message'),
            'error'            => session('error'),
            'role'             => $roleName,
            'profil'           => $profil,
            'tingkatanSabuk'   => \App\Models\TingkatanSabuk::orderBy('urutan')->get(['id', 'nama_sabuk']),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        if (! $request->user()->is_aktif) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return Redirect::route('login')->with('error', 'Akun Anda telah dinonaktifkan. Hubungi administrator.');
        }

        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        ActivityLogger::log('update_profile', auth()->user()->name . " memperbarui profil", 'User', auth()->user()->id);

        return Redirect::route('profile.edit');
    }

    public function updateSabuk(Request $request): RedirectResponse
    {
        $request->validate([
            'sabuk_id' => 'nullable|exists:tingkatan_sabuk,id',
        ]);

        $user     = $request->user();
        $roleName = $user->role?->nama_role;
        $sabukId  = $request->sabuk_id ?: null;

        if ($roleName === 'Pelatih') {
            $user->pelatih()->updateOrCreate(['user_id' => $user->id], ['sabuk_id' => $sabukId]);
        } elseif ($roleName === 'Murid') {
            $user->murid()->updateOrCreate(['user_id' => $user->id], ['sabuk_id' => $sabukId]);
        } else {
            $user->adminProfile()->updateOrCreate(['user_id' => $user->id], ['sabuk_id' => $sabukId]);
        }

        ActivityLogger::log('update_sabuk', auth()->user()->name . " memperbarui tingkatan sabuk", 'User', $user->id);

        return Redirect::route('profile.edit')->with('message', 'Tingkatan sabuk berhasil diperbarui.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
