<?php

namespace App\Http\Controllers;

use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class FotoController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'foto' => 'required|image|max:2048|mimes:jpg,jpeg,png,webp',
        ]);

        $user    = $request->user();
        $file    = $request->file('foto');
        $ext  = strtolower($file->getClientOriginalExtension());
        $path = "{$user->id}.{$ext}";

        $supabaseUrl = rtrim(config('services.supabase.url'), '/');
        $serviceKey  = config('services.supabase.service_role_key');

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$serviceKey}",
            'Content-Type'  => $file->getMimeType(),
            'x-upsert'      => 'true',
        ])->withBody(file_get_contents($file->getRealPath()), $file->getMimeType())
          ->put("{$supabaseUrl}/storage/v1/object/profile/{$path}");

        if (! $response->successful()) {
            return redirect()->back()->with('error', 'Gagal mengunggah foto. Silakan coba lagi.');
        }

        $publicUrl = "{$supabaseUrl}/storage/v1/object/public/profile/{$path}";

        $roleName = $user->role?->nama_role;

        if ($roleName === 'Murid') {
            $user->murid()->update(['foto' => $publicUrl]);
        } elseif ($roleName === 'Pelatih') {
            $user->pelatih()->update(['foto' => $publicUrl]);
        }

        ActivityLogger::log('update_foto', "{$user->name} memperbarui foto profil", 'User', $user->id);

        return redirect()->back()->with('message', 'Foto profil berhasil diperbarui.');
    }
}
