<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('gelar')->nullable()->after('name');
            $table->text('alamat')->nullable()->after('gelar');
            $table->string('tempat_lahir')->nullable()->after('alamat');
            $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
            $table->boolean('is_aktif')->default(true)->after('password');
            $table->string('latihan_di')->nullable()->after('is_aktif'); // Khusus Murid
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['gelar', 'alamat', 'tempat_lahir', 'tanggal_lahir', 'is_aktif', 'latihan_di']);
        });
    }
};
