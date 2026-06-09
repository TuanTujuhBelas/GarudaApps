<?php

namespace App\Http\Controllers\Pelatih;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerifikasiController extends Controller
{
    public function index()
    {
        $events = Event::with(['registrations.murid.ranting'])
            ->orderBy('tanggal_pelaksanaan', 'desc')
            ->get()
            ->map(function ($event) {
                return [
                    'id'                  => $event->id,
                    'nama_acara'          => $event->nama_acara,
                    'tanggal_pelaksanaan' => $event->tanggal_pelaksanaan->format('Y-m-d'),
                    'registrations'       => $event->registrations->map(fn ($reg) => [
                        'id'               => $reg->id,
                        'status'           => $reg->status,
                        'file_berkas_path' => $reg->file_berkas_path,
                        'murid'            => [
                            'name'    => $reg->murid->name,
                            'ranting' => $reg->murid->ranting?->nama_ranting,
                        ],
                    ]),
                ];
            });

        return Inertia::render('Pelatih/Verifikasi', [
            'events' => $events,
        ]);
    }

    public function update(Request $request, EventRegistration $registration)
    {
        abort_if($registration->status !== 'Menunggu', 422, 'Berkas ini sudah diverifikasi sebelumnya.');

        $request->validate([
            'status' => 'required|in:ACC,Ditolak',
        ]);

        $registration->update(['status' => $request->status]);

        ActivityLogger::log('verify_berkas', "Berkas murid untuk event diubah statusnya menjadi {$request->status}", 'EventRegistration', $registration->id);

        return redirect()->back()->with('message', 'Status berkas berhasil diperbarui.');
    }
}
