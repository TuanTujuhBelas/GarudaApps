<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'Super Admin',
            'Bendahara',
            'Pelatih',
            'Murid',
        ];

        foreach ($roles as $role) {
            Role::create(['nama_role' => $role]);
        }
    }
}
