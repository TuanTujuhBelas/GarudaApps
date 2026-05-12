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
    public function index(Request $request)
    {
        $query = User::with(['role', 'ranting']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Users/Index', [
            'users'    => $query->paginate(25)->withQueryString(),
            'roles'    => Role::all(),
            'rantings' => Ranting::all(),
            'filters'  => $request->only('search'),
            'stats'    => [
                'total' => User::count(),
                'aktif' => User::where('is_aktif', true)->count(),
            ],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'role_id'   => 'required|exists:roles,id',
            'ranting_id' => 'nullable|exists:rantings,id',
            'is_aktif'  => 'required|boolean',
        ]);

        if ($user->role?->nama_role === 'Super Admin') {
            return redirect()->back()->with('error', 'Role dan status Super Admin tidak dapat diubah.');
        }

        $user->update([
            'role_id'    => $request->role_id,
            'ranting_id' => $request->ranting_id ?: null,
            'is_aktif'   => $request->is_aktif,
        ]);

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

        $user->delete();

        return redirect()->back()->with('message', 'User berhasil dihapus.');
    }
}
