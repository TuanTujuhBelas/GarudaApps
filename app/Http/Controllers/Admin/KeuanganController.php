<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cashflow;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KeuanganController extends Controller
{
    public function index(Request $request)
    {
        $query = Cashflow::with('bendahara')->orderBy('tanggal_transaksi', 'desc');

        if ($request->filled('bulan')) {
            $query->whereMonth('tanggal_transaksi', $request->bulan);
        }
        if ($request->filled('tahun')) {
            $query->whereYear('tanggal_transaksi', $request->tahun);
        }

        $pemasukan   = Cashflow::where('tipe_transaksi', 'Pemasukan')->sum('nominal');
        $pengeluaran = Cashflow::where('tipe_transaksi', 'Pengeluaran')->sum('nominal');

        return Inertia::render('Bendahara/Keuangan', [
            'cashflows' => $query->paginate(25)->withQueryString(),
            'filters'   => $request->only(['bulan', 'tahun']),
            'saldo'     => [
                'pemasukan'   => $pemasukan,
                'pengeluaran' => $pengeluaran,
                'akhir'       => $pemasukan - $pengeluaran,
            ],
            'routeNames' => [
                'index'   => 'admin.keuangan.index',
                'store'   => 'admin.keuangan.store',
                'update'  => 'admin.keuangan.update',
                'destroy' => 'admin.keuangan.destroy',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipe_transaksi'    => 'required|in:Pemasukan,Pengeluaran',
            'nominal'           => 'required|numeric|min:1',
            'keterangan'        => 'required|string|max:500',
            'tanggal_transaksi' => 'required|date',
        ]);

        Cashflow::create([
            'bendahara_id'      => auth()->id(),
            'tipe_transaksi'    => $request->tipe_transaksi,
            'nominal'           => $request->nominal,
            'keterangan'        => $request->keterangan,
            'tanggal_transaksi' => $request->tanggal_transaksi,
        ]);

        return redirect()->back()->with('message', 'Transaksi berhasil dicatat.');
    }

    public function update(Request $request, Cashflow $cashflow)
    {
        $request->validate([
            'tipe_transaksi'    => 'required|in:Pemasukan,Pengeluaran',
            'nominal'           => 'required|numeric|min:1',
            'keterangan'        => 'required|string|max:500',
            'tanggal_transaksi' => 'required|date',
        ]);

        $cashflow->update($request->only(['tipe_transaksi', 'nominal', 'keterangan', 'tanggal_transaksi']));

        return redirect()->back()->with('message', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(Cashflow $cashflow)
    {
        $cashflow->delete();

        return redirect()->back()->with('message', 'Transaksi berhasil dihapus.');
    }
}
