<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'user_id', 'nomor_anggota', 'ranting_id',
    'tempat_lahir', 'tanggal_lahir', 'nomor_hp',
    'pernah_beladiri', 'jenis_beladiri', 'alasan_mendaftar',
    'status_verifikasi', 'disetujui_oleh', 'disetujui_pada',
])]
class Murid extends Model
{
    protected function casts(): array
    {
        return [
            'tanggal_lahir'   => 'date',
            'pernah_beladiri' => 'boolean',
            'disetujui_pada'  => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ranting()
    {
        return $this->belongsTo(Ranting::class);
    }

    public function disetujuiOleh()
    {
        return $this->belongsTo(User::class, 'disetujui_oleh');
    }

    public function isAktif(): bool
    {
        return $this->status_verifikasi === 'Aktif';
    }

    public function isMenunggu(): bool
    {
        return $this->status_verifikasi === 'Menunggu';
    }
}
