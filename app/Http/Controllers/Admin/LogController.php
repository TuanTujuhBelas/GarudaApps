<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user')->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $query->where('description', 'like', "%{$request->search}%");
        }
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }
        if ($request->filled('tanggal')) {
            $query->whereDate('created_at', $request->tanggal);
        }

        $actions = ActivityLog::distinct()->orderBy('action')->pluck('action');

        return Inertia::render('Admin/Logs/Index', [
            'logs'    => $query->paginate(50)->withQueryString(),
            'filters' => $request->only(['search', 'action', 'tanggal']),
            'actions' => $actions,
        ]);
    }
}
