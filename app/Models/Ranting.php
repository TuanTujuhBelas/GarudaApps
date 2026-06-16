<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nama_ranting', 'kode', 'keterangan', 'nomor_urut_terakhir', 'maps', 'status', 'honor'])]
class Ranting extends Model
{
    protected function casts(): array
    {
        return [
            'honor' => 'decimal:2',
        ];
    }

    public function murid()
    {
        return $this->hasMany(Murid::class);
    }

    public function pelatih()
    {
        return $this->hasMany(Pelatih::class);
    }

    public function generateNomorAnggota(User $user): string
    {
        $this->increment('nomor_urut_terakhir');
        $this->refresh();

        $tahun = $user->created_at?->format('Y') ?? now()->format('Y');
        $bulan = $user->created_at?->format('m') ?? now()->format('m');

        return 'GA'
            . '-' . $tahun
            . '-' . $bulan
            . '-' . $this->kode
            . '-' . str_pad($this->nomor_urut_terakhir, 3, '0', STR_PAD_LEFT);
    }
}
