<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ranting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RantingController extends Controller
{
    public function index(Request $request)
    {
        $query = Ranting::withCount(['murid', 'pelatih']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_ranting', 'like', "%{$request->search}%")
                  ->orWhere('kode', 'like', "%{$request->search}%");
            });
        }

        return Inertia::render('Admin/Ranting/Index', [
            'rantings' => $query->orderBy('kode')->paginate(25)->withQueryString(),
            'filters'  => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_ranting' => 'required|string|max:255',
            'keterangan'   => 'nullable|string|max:500',
            'maps'         => 'nullable|string|max:500',
            'status'       => 'required|in:Aktif,Nonaktif',
            'honor'        => 'nullable|numeric|min:0',
        ]);

        // Auto-generate kode 3 digit numerik
        $lastKode = Ranting::whereRaw("kode ~ '^[0-9]+$'")
            ->orderByRaw('CAST(kode AS INTEGER) DESC')
            ->value('kode') ?? '000';
        $newKode = str_pad((int) $lastKode + 1, 3, '0', STR_PAD_LEFT);

        $ranting = Ranting::create([
            'nama_ranting'        => $request->nama_ranting,
            'kode'                => $newKode,
            'keterangan'          => $request->keterangan,
            'maps'                => $request->maps,
            'status'              => $request->status,
            'honor'               => $request->honor,
            'nomor_urut_terakhir' => 0,
        ]);

        ActivityLogger::log('create_ranting', "Ranting '{$ranting->nama_ranting}' ({$ranting->kode}) dibuat", 'Ranting', $ranting->id);

        return redirect()->back()->with('message', "Ranting '{$ranting->nama_ranting}' berhasil ditambahkan dengan kode {$ranting->kode}.");
    }

    public function update(Request $request, Ranting $ranting)
    {
        $request->validate([
            'nama_ranting' => 'required|string|max:255',
            'keterangan'   => 'nullable|string|max:500',
            'maps'         => 'nullable|string|max:500',
            'status'       => 'required|in:Aktif,Nonaktif',
            'honor'        => 'nullable|numeric|min:0',
        ]);

        $ranting->update($request->only(['nama_ranting', 'keterangan', 'maps', 'status', 'honor']));

        ActivityLogger::log('update_ranting', "Ranting '{$ranting->nama_ranting}' ({$ranting->kode}) diperbarui", 'Ranting', $ranting->id);

        return redirect()->back()->with('message', 'Ranting berhasil diperbarui.');
    }

    public function destroy(Ranting $ranting)
    {
        if ($ranting->murid()->exists() || $ranting->pelatih()->exists()) {
            return redirect()->back()->with('error', 'Ranting tidak bisa dihapus karena masih memiliki anggota.');
        }

        if ($ranting->kode === '001') {
            return redirect()->back()->with('error', 'Ranting Pusat tidak dapat dihapus.');
        }

        ActivityLogger::log('delete_ranting', "Ranting '{$ranting->nama_ranting}' ({$ranting->kode}) dihapus", 'Ranting', $ranting->id);

        $ranting->delete();

        return redirect()->back()->with('message', 'Ranting berhasil dihapus.');
    }
}
