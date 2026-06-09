<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Events/Index', [
            'events' => Event::withCount('registrations')
                ->orderBy('tanggal_pelaksanaan', 'desc')
                ->paginate(25),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_acara'          => 'required|string|max:150',
            'tanggal_pelaksanaan' => 'required|date',
            'deskripsi'           => 'nullable|string',
        ]);

        $event = Event::create($request->only(['nama_acara', 'tanggal_pelaksanaan', 'deskripsi']));

        ActivityLogger::log('create_event', "Acara '{$event->nama_acara}' dibuat", 'Event', $event->id);

        return redirect()->back()->with('message', 'Acara berhasil dibuat.');
    }

    public function update(Request $request, Event $event)
    {
        $request->validate([
            'nama_acara'          => 'required|string|max:150',
            'tanggal_pelaksanaan' => 'required|date',
            'deskripsi'           => 'nullable|string',
        ]);

        $event->update($request->only(['nama_acara', 'tanggal_pelaksanaan', 'deskripsi']));

        ActivityLogger::log('update_event', "Acara '{$event->nama_acara}' diperbarui", 'Event', $event->id);

        return redirect()->back()->with('message', 'Acara berhasil diperbarui.');
    }

    public function destroy(Event $event)
    {
        ActivityLogger::log('delete_event', "Acara '{$event->nama_acara}' dihapus", 'Event', $event->id);

        $event->delete();

        return redirect()->back()->with('message', 'Acara berhasil dihapus.');
    }
}
