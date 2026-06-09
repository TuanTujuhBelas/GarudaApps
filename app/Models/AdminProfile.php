<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'gelar', 'tempat_lahir', 'tanggal_lahir', 'alamat', 'nomor_hp'])]
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
}
