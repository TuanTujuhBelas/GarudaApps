<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['bendahara_id', 'tipe_transaksi', 'nominal', 'keterangan', 'tanggal_transaksi'])]
class Cashflow extends Model
{
    protected function casts(): array
    {
        return [
            'nominal'           => 'decimal:2',
            'tanggal_transaksi' => 'date',
        ];
    }

    public function bendahara()
    {
        return $this->belongsTo(User::class, 'bendahara_id');
    }
}
