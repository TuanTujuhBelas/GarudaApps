<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
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

        Event::create($request->only(['nama_acara', 'tanggal_pelaksanaan', 'deskripsi']));

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

        return redirect()->back()->with('message', 'Acara berhasil diperbarui.');
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->back()->with('message', 'Acara berhasil dihapus.');
    }
}
