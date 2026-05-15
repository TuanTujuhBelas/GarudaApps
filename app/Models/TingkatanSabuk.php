<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TingkatanSabuk extends Model
{
    protected $table = 'tingkatan_sabuk';

    protected $fillable = ['urutan', 'nama_sabuk'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'sabuk_id');
    }
}
