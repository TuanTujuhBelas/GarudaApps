<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'roles' => \App\Models\Role::whereIn('nama_role', ['Pelatih', 'Murid'])->get(),
            'rantings' => \App\Models\Ranting::all(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()->min(8)->mixedCase()],
            'role_id' => ['required', Rule::exists('roles', 'id')->where(function ($q) {
                $q->whereIn('nama_role', ['Pelatih', 'Murid']);
            })],
            'gelar' => 'nullable|string|max:100',
            'alamat' => 'nullable|string|max:2000',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'ranting_id' => 'nullable|exists:rantings,id',
            'latihan_di' => 'nullable|string|max:255',
            'training_locations' => 'nullable|array|max:10',
            'training_locations.*.nama_lokasi' => 'required|string|max:255',
            'training_locations.*.alamat_lokasi' => 'required|string|max:1000',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'gelar' => $request->gelar,
            'alamat' => $request->alamat,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'ranting_id' => $request->ranting_id,
            'latihan_di' => $request->latihan_di,
            'is_aktif' => true,
        ]);

        if ($request->has('training_locations') && is_array($request->training_locations)) {
            foreach ($request->training_locations as $loc) {
                if (!empty($loc['nama_lokasi']) && !empty($loc['alamat_lokasi'])) {
                    $user->trainingLocations()->create([
                        'nama_lokasi' => $loc['nama_lokasi'],
                        'alamat_lokasi' => $loc['alamat_lokasi'],
                    ]);
                }
            }
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
