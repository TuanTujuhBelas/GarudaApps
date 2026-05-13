<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nama_acara', 'tanggal_pelaksanaan', 'deskripsi'])]
class Event extends Model
{
    protected function casts(): array
    {
        return [
            'tanggal_pelaksanaan' => 'date',
        ];
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }
}
