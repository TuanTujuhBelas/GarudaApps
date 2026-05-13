<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['event_id', 'murid_id', 'file_berkas_path', 'status'])]
class EventRegistration extends Model
{
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function murid()
    {
        return $this->belongsTo(User::class, 'murid_id');
    }
}
