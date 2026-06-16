<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'nomor_anggota', 'ranting_id', 'foto', 'gelar', 'sabuk_id', 'tempat_lahir', 'tanggal_lahir', 'alamat', 'nomor_hp'])]
class Pelatih extends Model
{
    protected $table = 'pelatih';

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
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

    public function tingkatanSabuk()
    {
        return $this->belongsTo(TingkatanSabuk::class, 'sabuk_id');
    }

    public function trainingLocations()
    {
        return $this->hasMany(UserTrainingLocation::class, 'user_id', 'user_id');
    }
}
