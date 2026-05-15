<?php

namespace App\Http\Controllers\Pelatih;

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

        $pemasukan = Cashflow::where('tipe_transaksi', 'Pemasukan')
            ->when($request->filled('bulan'), fn($q) => $q->whereMonth('tanggal_transaksi', $request->bulan))
            ->when($request->filled('tahun'), fn($q) => $q->whereYear('tanggal_transaksi', $request->tahun))
            ->sum('nominal');
        $pengeluaran = Cashflow::where('tipe_transaksi', 'Pengeluaran')
            ->when($request->filled('bulan'), fn($q) => $q->whereMonth('tanggal_transaksi', $request->bulan))
            ->when($request->filled('tahun'), fn($q) => $q->whereYear('tanggal_transaksi', $request->tahun))
            ->sum('nominal');

        return Inertia::render('Pelatih/Keuangan', [
            'cashflows' => $query->paginate(25)->withQueryString(),
            'filters'   => $request->only(['bulan', 'tahun']),
            'saldo'     => [
                'pemasukan'   => $pemasukan,
                'pengeluaran' => $pengeluaran,
                'akhir'       => $pemasukan - $pengeluaran,
            ],
        ]);
    }
}
