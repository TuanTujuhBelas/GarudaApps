<?php

namespace App\Http\Controllers\Bendahara;

use App\Http\Controllers\Controller;
use App\Models\Cashflow;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashflowController extends Controller
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

        return Inertia::render('Bendahara/Keuangan', [
            'cashflows'  => $query->paginate(25)->withQueryString(),
            'filters'    => $request->only(['bulan', 'tahun']),
            'saldo'      => $this->hitungSaldo($request),
            'routeNames' => [
                'index'   => 'bendahara.keuangan.index',
                'store'   => 'bendahara.keuangan.store',
                'update'  => 'bendahara.keuangan.update',
                'destroy' => 'bendahara.keuangan.destroy',
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
        abort_if($cashflow->bendahara_id !== auth()->id(), 403);

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
        abort_if($cashflow->bendahara_id !== auth()->id(), 403);

        $cashflow->delete();

        return redirect()->back()->with('message', 'Transaksi berhasil dihapus.');
    }

    private function hitungSaldo(Request $request): array
    {
        $pemasukan = Cashflow::where('tipe_transaksi', 'Pemasukan')
            ->when($request->filled('bulan'), fn($q) => $q->whereMonth('tanggal_transaksi', $request->bulan))
            ->when($request->filled('tahun'), fn($q) => $q->whereYear('tanggal_transaksi', $request->tahun))
            ->sum('nominal');
        $pengeluaran = Cashflow::where('tipe_transaksi', 'Pengeluaran')
            ->when($request->filled('bulan'), fn($q) => $q->whereMonth('tanggal_transaksi', $request->bulan))
            ->when($request->filled('tahun'), fn($q) => $q->whereYear('tanggal_transaksi', $request->tahun))
            ->sum('nominal');

        return [
            'pemasukan'   => $pemasukan,
            'pengeluaran' => $pengeluaran,
            'akhir'       => $pemasukan - $pengeluaran,
        ];
    }
}
