<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['pelatih_id', 'nominal', 'keterangan', 'tanggal_pembayaran', 'dicatat_oleh'])]
class Royalti extends Model
{
    protected $table = 'royalti';
    protected function casts(): array
    {
        return [
            'nominal'            => 'decimal:2',
            'tanggal_pembayaran' => 'date',
        ];
    }

    public function pelatih()
    {
        return $this->belongsTo(User::class, 'pelatih_id');
    }

    public function pencatat()
    {
        return $this->belongsTo(User::class, 'dicatat_oleh');
    }
}
