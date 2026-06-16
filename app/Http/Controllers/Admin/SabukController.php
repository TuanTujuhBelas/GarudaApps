<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TingkatanSabuk;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SabukController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Sabuk/Index', [
            'sabuk' => TingkatanSabuk::orderBy('urutan')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'urutan'     => 'required|integer|min:1|unique:tingkatan_sabuk,urutan',
            'nama_sabuk' => 'required|string|max:255',
        ]);

        $sabuk = TingkatanSabuk::create($data);
        ActivityLogger::log('create_sabuk', "Tingkatan sabuk '{$sabuk->nama_sabuk}' (urutan {$sabuk->urutan}) ditambahkan", 'TingkatanSabuk', $sabuk->id);
        return back();
    }

    public function update(Request $request, TingkatanSabuk $sabuk)
    {
        $data = $request->validate([
            'urutan'     => 'required|integer|min:1|unique:tingkatan_sabuk,urutan,' . $sabuk->id,
            'nama_sabuk' => 'required|string|max:255',
        ]);

        $sabuk->update($data);
        ActivityLogger::log('update_sabuk', "Tingkatan sabuk '{$sabuk->nama_sabuk}' diperbarui", 'TingkatanSabuk', $sabuk->id);
        return back();
    }

    public function destroy(TingkatanSabuk $sabuk)
    {
        ActivityLogger::log('delete_sabuk', "Tingkatan sabuk '{$sabuk->nama_sabuk}' dihapus", 'TingkatanSabuk', $sabuk->id);
        $sabuk->delete();
        return back();
    }
}
