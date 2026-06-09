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
            'kode'         => 'required|string|max:10|unique:rantings,kode',
            'keterangan'   => 'nullable|string|max:500',
        ]);

        $ranting = Ranting::create($request->only(['nama_ranting', 'kode', 'keterangan']));

        ActivityLogger::log('create_ranting', "Ranting '{$ranting->nama_ranting}' ({$ranting->kode}) dibuat", 'Ranting', $ranting->id);

        return redirect()->back()->with('message', 'Ranting berhasil ditambahkan.');
    }

    public function update(Request $request, Ranting $ranting)
    {
        $request->validate([
            'nama_ranting' => 'required|string|max:255',
            'kode'         => "required|string|max:10|unique:rantings,kode,{$ranting->id}",
            'keterangan'   => 'nullable|string|max:500',
        ]);

        $ranting->update($request->only(['nama_ranting', 'kode', 'keterangan']));

        ActivityLogger::log('update_ranting', "Ranting '{$ranting->nama_ranting}' ({$ranting->kode}) diperbarui", 'Ranting', $ranting->id);

        return redirect()->back()->with('message', 'Ranting berhasil diperbarui.');
    }

    public function destroy(Ranting $ranting)
    {
        if ($ranting->murid()->exists() || $ranting->pelatih()->exists()) {
            return redirect()->back()->with('error', 'Ranting tidak bisa dihapus karena masih memiliki anggota.');
        }

        ActivityLogger::log('delete_ranting', "Ranting '{$ranting->nama_ranting}' ({$ranting->kode}) dihapus", 'Ranting', $ranting->id);

        $ranting->delete();

        return redirect()->back()->with('message', 'Ranting berhasil dihapus.');
    }
}
