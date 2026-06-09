<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['role', 'pelatih.ranting', 'murid.ranting']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(25)->withQueryString();

        $mapped = $users->through(fn ($u) => [
            'id'       => $u->id,
            'name'     => $u->name,
            'email'    => $u->email,
            'is_aktif' => $u->is_aktif,
            'role'     => $u->role ? ['id' => $u->role->id, 'nama_role' => $u->role->nama_role] : null,
            'role_id'  => $u->role_id,
            'profil'   => match ($u->role?->nama_role) {
                'Pelatih' => $u->pelatih ? [
                    'nomor_anggota' => $u->pelatih->nomor_anggota,
                    'ranting'       => $u->pelatih->ranting?->nama_ranting,
                ] : null,
                'Murid' => $u->murid ? [
                    'nomor_anggota'     => $u->murid->nomor_anggota,
                    'ranting'           => $u->murid->ranting?->nama_ranting,
                    'status_verifikasi' => $u->murid->status_verifikasi,
                ] : null,
                default => null,
            },
        ]);

        return Inertia::render('Admin/Users/Index', [
            'users'   => $mapped,
            'roles'   => Role::all(),
            'filters' => $request->only('search'),
            'stats'   => [
                'total'    => User::count(),
                'aktif'    => User::where('is_aktif', true)->count(),
                'menunggu' => \App\Models\Murid::where('status_verifikasi', 'Menunggu')->count(),
            ],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'role_id'  => 'required|exists:roles,id',
            'is_aktif' => 'required|boolean',
        ]);

        if ($user->role?->nama_role === 'Super Admin') {
            return redirect()->back()->with('error', 'Role dan status Super Admin tidak dapat diubah.');
        }

        $user->update([
            'role_id'  => $request->role_id,
            'is_aktif' => $request->is_aktif,
        ]);

        ActivityLogger::log('update_user', "Data user {$user->name} diperbarui", 'User', $user->id);

        return redirect()->back()->with('message', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak bisa menghapus akun Anda sendiri.');
        }

        if ($user->role?->nama_role === 'Super Admin') {
            return redirect()->back()->with('error', 'Akun Super Admin tidak dapat dihapus.');
        }

        ActivityLogger::log('delete_user', "User {$user->name} dihapus", 'User', $user->id);

        $user->delete();

        return redirect()->back()->with('message', 'User berhasil dihapus.');
    }
}
