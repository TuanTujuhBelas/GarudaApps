<?php

namespace App\Http\Controllers\Pelatih;

use App\Http\Controllers\Controller;
use App\Models\Ranting;
use Inertia\Inertia;

class RantingController extends Controller
{
    public function index()
    {
        return Inertia::render('Shared/Ranting/Index', [
            'rantings' => Ranting::withCount(['murid', 'pelatih'])->orderBy('kode')->get(),
            'readonly' => true,
        ]);
    }
}
