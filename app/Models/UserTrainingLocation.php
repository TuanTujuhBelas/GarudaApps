<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTrainingLocation extends Model
{
    protected $fillable = ['user_id', 'ranting_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ranting(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\Ranting::class);
    }
}
