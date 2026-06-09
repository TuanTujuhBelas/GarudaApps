<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Murid;
use App\Models\Pelatih;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'roles'          => \App\Models\Role::whereIn('nama_role', ['Pelatih', 'Murid'])->get(),
            'rantings'       => \App\Models\Ranting::orderBy('kode')->get(),
            'tingkatanSabuk' => \App\Models\TingkatanSabuk::orderBy('urutan')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()->min(8)->mixedCase()],
            'role_id'  => ['required', Rule::exists('roles', 'id')->where(fn ($q) => $q->whereIn('nama_role', ['Pelatih', 'Murid']))],

            // Murid
            'ranting_id'       => 'nullable|exists:rantings,id',
            'tempat_lahir'     => 'nullable|string|max:100',
            'tanggal_lahir'    => 'nullable|date',
            'nomor_hp'         => 'nullable|string|max:20',
            'pernah_beladiri'  => 'nullable|boolean',
            'jenis_beladiri'   => 'nullable|string|max:255',
            'alasan_mendaftar' => 'nullable|string|max:2000',

            // Pelatih
            'gelar'             => 'nullable|string|max:100',
            'alamat'            => 'nullable|string|max:2000',
            'sabuk_id'          => 'nullable|exists:tingkatan_sabuk,id',
            'training_locations'              => 'nullable|array|max:10',
            'training_locations.*.nama_lokasi'   => 'nullable|string|max:255',
            'training_locations.*.alamat_lokasi' => 'nullable|string|max:1000',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role_id'  => $request->role_id,
            'is_aktif' => true,
        ]);

        $roleName = \App\Models\Role::find($request->role_id)?->nama_role;

        if ($roleName === 'Murid') {
            Murid::create([
                'user_id'          => $user->id,
                'ranting_id'       => $request->ranting_id,
                'tempat_lahir'     => $request->tempat_lahir,
                'tanggal_lahir'    => $request->tanggal_lahir,
                'nomor_hp'         => $request->nomor_hp,
                'pernah_beladiri'  => $request->boolean('pernah_beladiri'),
                'jenis_beladiri'   => $request->jenis_beladiri,
                'alasan_mendaftar' => $request->alasan_mendaftar,
                'status_verifikasi' => 'Menunggu',
            ]);
        }

        if ($roleName === 'Pelatih') {
            Pelatih::create([
                'user_id'      => $user->id,
                'ranting_id'   => $request->ranting_id,
                'gelar'        => $request->gelar,
                'sabuk_id'     => $request->sabuk_id,
                'tempat_lahir' => $request->tempat_lahir,
                'tanggal_lahir' => $request->tanggal_lahir,
                'alamat'       => $request->alamat,
                'nomor_hp'     => $request->nomor_hp,
            ]);

            if ($request->has('training_locations') && is_array($request->training_locations)) {
                foreach ($request->training_locations as $loc) {
                    if (!empty($loc['nama_lokasi']) && !empty($loc['alamat_lokasi'])) {
                        $user->trainingLocations()->create([
                            'nama_lokasi'   => $loc['nama_lokasi'],
                            'alamat_lokasi' => $loc['alamat_lokasi'],
                        ]);
                    }
                }
            }
        }

        event(new Registered($user));
        Auth::login($user);

        ActivityLogger::log('register', "Akun baru terdaftar: {$user->name} ({$roleName})", 'User', $user->id);

        return redirect(route('dashboard', absolute: false));
    }
}
