<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminProfile;
use App\Models\Ranting;
use App\Models\Role;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['role', 'pelatih.ranting', 'pelatih.tingkatanSabuk', 'pelatih.trainingLocations.ranting', 'murid.ranting', 'murid.tingkatanSabuk', 'adminProfile.ranting', 'adminProfile.tingkatanSabuk']);

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
                    'nomor_anggota'      => $u->pelatih->nomor_anggota,
                    'ranting_id'         => $u->pelatih->ranting_id,
                    'ranting'            => $u->pelatih->ranting?->nama_ranting,
                    'foto'               => $u->pelatih->foto,
                    'gelar'              => $u->pelatih->gelar,
                    'sabuk'              => $u->pelatih->tingkatanSabuk?->nama_sabuk,
                    'ranting_tambahan'   => $u->pelatih->trainingLocations
                        ->map(fn ($tl) => ['id' => $tl->ranting_id, 'nama' => $tl->ranting?->nama_ranting])
                        ->filter(fn ($r) => $r['nama'])
                        ->values(),
                ] : null,
                'Murid' => $u->murid ? [
                    'nomor_anggota'     => $u->murid->nomor_anggota,
                    'ranting_id'        => $u->murid->ranting_id,
                    'ranting'           => $u->murid->ranting?->nama_ranting,
                    'sabuk_id'          => $u->murid->sabuk_id,
                    'sabuk'             => $u->murid->tingkatanSabuk?->nama_sabuk,
                    'status_verifikasi' => $u->murid->status_verifikasi,
                    'foto'              => $u->murid->foto,
                ] : null,
                default => $u->adminProfile ? [
                    'nomor_anggota' => $u->adminProfile->nomor_anggota,
                    'foto'          => $u->adminProfile->foto,
                    'gelar'         => $u->adminProfile->gelar,
                    'ranting_id'    => $u->adminProfile->ranting_id,
                    'ranting'       => $u->adminProfile->ranting?->nama_ranting,
                    'sabuk_id'      => $u->adminProfile->sabuk_id,
                    'sabuk'         => $u->adminProfile->tingkatanSabuk?->nama_sabuk,
                ] : ['nomor_anggota' => null, 'foto' => null, 'gelar' => null, 'ranting_id' => null, 'ranting' => null, 'sabuk_id' => null, 'sabuk' => null],
            },
        ]);

        return Inertia::render('Admin/Users/Index', [
            'users'          => $mapped,
            'roles'          => Role::all(),
            'rantings'       => Ranting::orderBy('kode')->get(['id', 'kode', 'nama_ranting']),
            'tingkatanSabuk' => \App\Models\TingkatanSabuk::orderBy('urutan')->get(['id', 'nama_sabuk']),
            'filters'        => $request->only('search'),
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
            'role_id'    => 'required|exists:roles,id',
            'is_aktif'   => 'required|boolean',
            'ranting_id' => 'nullable|exists:rantings,id',
            'sabuk_id'   => 'nullable|exists:tingkatan_sabuk,id',
        ]);

        if ($user->role?->nama_role === 'Super Admin') {
            return redirect()->back()->with('error', 'Role dan status Super Admin tidak dapat diubah.');
        }

        $user->update([
            'role_id'  => $request->role_id,
            'is_aktif' => $request->is_aktif,
        ]);

        $user->refresh();
        $user->load(['pelatih', 'murid', 'adminProfile']);

        $role      = $user->role?->nama_role;
        $rantingId = $request->filled('ranting_id') ? (int) $request->ranting_id : null;
        $sabukId   = $request->filled('sabuk_id')   ? (int) $request->sabuk_id   : null;

        if ($role === 'Pelatih') {
            if ($user->pelatih) {
                $user->pelatih->update(['ranting_id' => $rantingId, 'sabuk_id' => $sabukId]);
            } else {
                \App\Models\Pelatih::create(['user_id' => $user->id, 'ranting_id' => $rantingId, 'sabuk_id' => $sabukId]);
            }
        } elseif ($role === 'Murid') {
            if ($user->murid) {
                $user->murid->update(['ranting_id' => $rantingId, 'sabuk_id' => $sabukId]);
            } else {
                \App\Models\Murid::create(['user_id' => $user->id, 'ranting_id' => $rantingId, 'sabuk_id' => $sabukId]);
            }
        } else {
            if ($user->adminProfile) {
                $user->adminProfile->update(['ranting_id' => $rantingId, 'sabuk_id' => $sabukId]);
            } else {
                AdminProfile::create(['user_id' => $user->id, 'ranting_id' => $rantingId, 'sabuk_id' => $sabukId]);
            }
        }

        ActivityLogger::log('update_user', "Data user {$user->name} diperbarui", 'User', $user->id);

        return redirect()->back()->with('message', 'User berhasil diperbarui.');
    }

    public function generateNomor(User $user)
    {
        $user->load(['role', 'pelatih.ranting', 'murid.ranting', 'adminProfile']);
        $role = $user->role?->nama_role;

        $existing = match ($role) {
            'Pelatih' => $user->pelatih?->nomor_anggota,
            'Murid'   => $user->murid?->nomor_anggota,
            default   => $user->adminProfile?->nomor_anggota,
        };

        if ($existing) {
            return redirect()->back()->with('error', "{$user->name} sudah memiliki nomor anggota: {$existing}.");
        }

        // Ambil ranting user, fallback ke Pusat (kode 001)
        $ranting = match ($role) {
            'Pelatih' => $user->pelatih?->ranting,
            'Murid'   => $user->murid?->ranting,
            default   => null,
        } ?? Ranting::where('kode', '001')->first();

        if (!$ranting) {
            return redirect()->back()->with('error', 'Ranting Pusat (001) belum ada. Tambahkan dulu di menu Kelola Ranting.');
        }

        $nomor = $ranting->generateNomorAnggota($user);

        if ($role === 'Pelatih') {
            $user->pelatih
                ? $user->pelatih->update(['nomor_anggota' => $nomor])
                : \App\Models\Pelatih::create(['user_id' => $user->id, 'nomor_anggota' => $nomor]);
        } elseif ($role === 'Murid') {
            $user->murid
                ? $user->murid->update(['nomor_anggota' => $nomor])
                : \App\Models\Murid::create(['user_id' => $user->id, 'nomor_anggota' => $nomor]);
        } else {
            $user->adminProfile
                ? $user->adminProfile->update(['nomor_anggota' => $nomor])
                : AdminProfile::create(['user_id' => $user->id, 'nomor_anggota' => $nomor]);
        }

        ActivityLogger::log('generate_nomor', "Nomor anggota {$nomor} di-generate untuk {$user->name}", 'User', $user->id);

        return redirect()->back()->with('message', "Nomor anggota {$nomor} berhasil di-generate untuk {$user->name}.");
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
