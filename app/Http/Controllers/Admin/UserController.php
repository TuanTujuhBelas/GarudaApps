<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Ranting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['role', 'ranting'])->get();
        $roles = Role::all();
        $rantings = Ranting::all();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'rantings' => $rantings,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'ranting_id' => 'nullable|exists:rantings,id',
            'is_aktif' => 'required|boolean',
        ]);

        // Proteksi: Respati dan Bagus tidak bisa diubah role-nya atau dinonaktifkan
        if ($user->email === 'respati@garuda.com' || $user->email === 'bagus@garuda.com') {
            $user->update([
                'is_aktif' => true, // Selalu aktif
                // role_id tidak diupdate untuk menjaga mereka tetap Super Admin
            ]);
            return redirect()->back()->with('message', 'Biodata Super Admin utama diperbarui (Role & Status diproteksi).');
        }

        $user->update([
            'role_id' => $request->role_id,
            'ranting_id' => $request->ranting_id ?: null,
            'is_aktif' => $request->is_aktif,
        ]);

        return redirect()->back()->with('message', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        // Mencegah hapus diri sendiri
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak bisa menghapus akun Anda sendiri.');
        }

        $user->delete();
        return redirect()->back()->with('message', 'User berhasil dihapus.');
    }
}
