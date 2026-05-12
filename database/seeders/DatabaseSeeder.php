<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            RantingSeeder::class,
        ]);

        // User::factory(10)->create();

        $superAdminRoleId = \App\Models\Role::where('nama_role', 'Super Admin')->first()->id;

        User::factory()->create([
            'name' => 'Respati Abimanyu',
            'email' => 'respati@garuda.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role_id' => $superAdminRoleId,
        ]);

        User::factory()->create([
            'name' => 'Bagus Rama',
            'email' => 'bagus@garuda.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role_id' => $superAdminRoleId,
        ]);
    }
}
