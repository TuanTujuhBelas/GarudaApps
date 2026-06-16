<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use App\Models\Ranting;

#[Fillable(['user_id', 'nomor_anggota', 'foto', 'gelar', 'ranting_id', 'sabuk_id', 'tempat_lahir', 'tanggal_lahir', 'alamat', 'nomor_hp'])]
class AdminProfile extends Model
{
    protected $table = 'admin_profile';

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
}
