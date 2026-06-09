<?php

namespace App\Http\Controllers\Pelatih;

use App\Http\Controllers\Controller;
use App\Models\Murid;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VerifikasiMuridController extends Controller
{
    public function index()
    {
        $muridMenunggu = Murid::with(['user', 'ranting'])
            ->where('status_verifikasi', 'Menunggu')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn ($m) => [
                'id'               => $m->id,
                'nama'             => $m->user->name,
                'email'            => $m->user->email,
                'ranting'          => $m->ranting?->nama_ranting,
                'tempat_lahir'     => $m->tempat_lahir,
                'tanggal_lahir'    => $m->tanggal_lahir?->format('Y-m-d'),
                'nomor_hp'         => $m->nomor_hp,
                'pernah_beladiri'  => $m->pernah_beladiri,
                'jenis_beladiri'   => $m->jenis_beladiri,
                'alasan_mendaftar' => $m->alasan_mendaftar,
                'mendaftar_pada'   => $m->created_at->format('Y-m-d'),
            ]);

        return Inertia::render('Pelatih/VerifikasiMurid', [
            'muridList' => $muridMenunggu,
        ]);
    }

    public function approve(Murid $murid)
    {
        if ($murid->status_verifikasi !== 'Menunggu') {
            return redirect()->back()->with('error', 'Murid ini sudah diverifikasi.');
        }

        DB::transaction(function () use ($murid) {
            $ranting = $murid->ranting;
            $nomor   = $ranting->generateNomorAnggota();

            $murid->update([
                'status_verifikasi' => 'Aktif',
                'nomor_anggota'     => $nomor,
                'disetujui_oleh'    => auth()->id(),
                'disetujui_pada'    => now(),
            ]);

            ActivityLogger::log(
                'approve_murid',
                "Pelatih " . auth()->user()->name . " menyetujui murid {$murid->user->name} — No. {$nomor}",
                'Murid',
                $murid->id
            );
        });

        return redirect()->back()->with('message', 'Murid berhasil disetujui dan nomor anggota telah diterbitkan.');
    }

    public function reject(Request $request, Murid $murid)
    {
        if ($murid->status_verifikasi !== 'Menunggu') {
            return redirect()->back()->with('error', 'Murid ini sudah diverifikasi.');
        }

        $murid->update(['status_verifikasi' => 'Ditolak']);

        ActivityLogger::log(
            'reject_murid',
            "Pelatih " . auth()->user()->name . " menolak pendaftaran murid {$murid->user->name}",
            'Murid',
            $murid->id
        );

        return redirect()->back()->with('message', 'Pendaftaran murid ditolak.');
    }
}
