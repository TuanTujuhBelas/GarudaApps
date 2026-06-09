<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nama_ranting', 'keterangan', 'kode', 'nomor_urut_terakhir'])]
class Ranting extends Model
{
    public function murid()
    {
        return $this->hasMany(Murid::class);
    }

    public function pelatih()
    {
        return $this->hasMany(Pelatih::class);
    }

    public function generateNomorAnggota(): string
    {
        $this->increment('nomor_urut_terakhir');
        $this->refresh();

        return now()->format('Y')
            . now()->format('m')
            . $this->kode
            . str_pad($this->nomor_urut_terakhir, 3, '0', STR_PAD_LEFT);
    }
}
