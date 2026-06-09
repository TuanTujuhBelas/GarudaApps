<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Royalti;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoyaltiController extends Controller
{
    public function index(Request $request)
    {
        $query = Royalti::with(['pelatih', 'pencatat'])->orderBy('tanggal_pembayaran', 'desc');

        if ($request->filled('bulan')) {
            $query->whereMonth('tanggal_pembayaran', $request->bulan);
        }
        if ($request->filled('tahun')) {
            $query->whereYear('tanggal_pembayaran', $request->tahun);
        }
        if ($request->filled('pelatih_id')) {
            $query->where('pelatih_id', $request->pelatih_id);
        }

        $totalRoyalti = (clone $query)->sum('nominal');

        $pelatihList = User::whereHas('role', fn ($q) => $q->where('nama_role', 'Pelatih'))
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Royalti/Index', [
            'royaltis'    => $query->paginate(25)->withQueryString(),
            'filters'     => $request->only(['bulan', 'tahun', 'pelatih_id']),
            'total'       => $totalRoyalti,
            'pelatihList' => $pelatihList,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'pelatih_id'         => 'required|exists:users,id',
            'nominal'            => 'required|numeric|min:1',
            'keterangan'         => 'nullable|string|max:500',
            'tanggal_pembayaran' => 'required|date',
        ]);

        $royalti = Royalti::create([
            'pelatih_id'         => $request->pelatih_id,
            'nominal'            => $request->nominal,
            'keterangan'         => $request->keterangan,
            'tanggal_pembayaran' => $request->tanggal_pembayaran,
            'dicatat_oleh'       => auth()->id(),
        ]);

        $pelatih = User::find($request->pelatih_id);
        $nominal = 'Rp ' . number_format($royalti->nominal, 0, ',', '.');
        ActivityLogger::log('create_royalti', "Royalti {$nominal} dicatat untuk Pelatih {$pelatih->name}", 'Royalti', $royalti->id);

        return redirect()->back()->with('message', 'Royalti berhasil dicatat.');
    }

    public function update(Request $request, Royalti $royalti)
    {
        $request->validate([
            'pelatih_id'         => 'required|exists:users,id',
            'nominal'            => 'required|numeric|min:1',
            'keterangan'         => 'nullable|string|max:500',
            'tanggal_pembayaran' => 'required|date',
        ]);

        $royalti->update($request->only(['pelatih_id', 'nominal', 'keterangan', 'tanggal_pembayaran']));

        ActivityLogger::log('update_royalti', "Royalti #{$royalti->id} diperbarui", 'Royalti', $royalti->id);

        return redirect()->back()->with('message', 'Royalti berhasil diperbarui.');
    }

    public function destroy(Royalti $royalti)
    {
        ActivityLogger::log('delete_royalti', "Royalti #{$royalti->id} dihapus", 'Royalti', $royalti->id);

        $royalti->delete();

        return redirect()->back()->with('message', 'Royalti berhasil dihapus.');
    }
}
