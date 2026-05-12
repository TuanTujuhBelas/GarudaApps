<?php

namespace Database\Seeders;

use App\Models\Ranting;
use Illuminate\Database\Seeder;

class RantingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rantings = [
            ['nama_ranting' => 'Sabuk Putih', 'keterangan' => 'Tingkatan Dasar'],
            ['nama_ranting' => 'Sabuk Kuning', 'keterangan' => 'Tingkatan Lanjutan 1'],
            ['nama_ranting' => 'Sabuk Hijau', 'keterangan' => 'Tingkatan Lanjutan 2'],
            ['nama_ranting' => 'Sabuk Biru', 'keterangan' => 'Tingkatan Menengah 1'],
            ['nama_ranting' => 'Sabuk Cokelat', 'keterangan' => 'Tingkatan Menengah 2'],
            ['nama_ranting' => 'Sabuk Merah', 'keterangan' => 'Tingkatan Tinggi'],
            ['nama_ranting' => 'Sabuk Hitam', 'keterangan' => 'Tingkatan Master'],
        ];

        foreach ($rantings as $ranting) {
            Ranting::create($ranting);
        }
    }
}
