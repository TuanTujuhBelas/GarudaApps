<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTrainingLocation extends Model
{
    protected $fillable = ['user_id', 'nama_lokasi', 'alamat_lokasi'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
