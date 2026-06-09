<?php

namespace App\Http\Controllers\Murid;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $muridId = auth()->id();

        $events = Event::with(['registrations' => fn ($q) => $q->where('murid_id', $muridId)])
            ->orderBy('tanggal_pelaksanaan', 'asc')
            ->get()
            ->map(function ($event) {
                $reg = $event->registrations->first();
                return [
                    'id'                  => $event->id,
                    'nama_acara'          => $event->nama_acara,
                    'tanggal_pelaksanaan' => $event->tanggal_pelaksanaan->format('Y-m-d'),
                    'deskripsi'           => $event->deskripsi,
                    'is_past'             => $event->tanggal_pelaksanaan->isPast(),
                    'registrasi'          => $reg ? [
                        'id'     => $reg->id,
                        'status' => $reg->status,
                    ] : null,
                ];
            });

        return Inertia::render('Murid/Events', [
            'events' => $events,
        ]);
    }

    public function daftar(Request $request, Event $event)
    {
        abort_if($event->tanggal_pelaksanaan->isPast(), 422, 'Pendaftaran sudah ditutup untuk acara ini.');

        $request->validate([
            'file_berkas' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $existing = EventRegistration::where('event_id', $event->id)
            ->where('murid_id', auth()->id())
            ->first();

        if ($existing && $existing->status === 'ACC') {
            return redirect()->back()->with('error', 'Berkas Anda sudah disetujui dan tidak dapat diubah.');
        }

        $path = $request->file('file_berkas')->store('berkas', 'public');

        try {
            if ($existing) {
                $oldPath = $existing->file_berkas_path;
                $existing->update(['file_berkas_path' => $path, 'status' => 'Menunggu']);
                if ($oldPath) {
                    Storage::disk('public')->delete($oldPath);
                }
            } else {
                EventRegistration::create([
                    'event_id'         => $event->id,
                    'murid_id'         => auth()->id(),
                    'file_berkas_path' => $path,
                    'status'           => 'Menunggu',
                ]);
            }
        } catch (\Exception $e) {
            Storage::disk('public')->delete($path);
            throw $e;
        }

        ActivityLogger::log('upload_berkas', auth()->user()->name . " mengunggah berkas untuk acara '{$event->nama_acara}'", 'EventRegistration', null);

        return redirect()->back()->with('message', 'Berkas berhasil dikirim, menunggu verifikasi.');
    }
}
