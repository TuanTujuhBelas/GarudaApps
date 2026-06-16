<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/sabuk', [ProfileController::class, 'updateSabuk'])->name('profile.sabuk');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/foto', [\App\Http\Controllers\FotoController::class, 'update'])->name('profile.foto');
});

// ─── Super Admin ──────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'role:Super Admin'])->group(function () {
    // Users
    Route::get('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
    Route::patch('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::post('/admin/users/{user}/generate-nomor', [\App\Http\Controllers\Admin\UserController::class, 'generateNomor'])->name('admin.users.generate-nomor');

    // Keuangan
    Route::get('/admin/keuangan', [\App\Http\Controllers\Admin\KeuanganController::class, 'index'])->name('admin.keuangan.index');
    Route::post('/admin/keuangan', [\App\Http\Controllers\Admin\KeuanganController::class, 'store'])->name('admin.keuangan.store');
    Route::patch('/admin/keuangan/{cashflow}', [\App\Http\Controllers\Admin\KeuanganController::class, 'update'])->name('admin.keuangan.update');
    Route::delete('/admin/keuangan/{cashflow}', [\App\Http\Controllers\Admin\KeuanganController::class, 'destroy'])->name('admin.keuangan.destroy');

    // Events
    Route::get('/admin/events', [\App\Http\Controllers\Admin\EventController::class, 'index'])->name('admin.events.index');
    Route::post('/admin/events', [\App\Http\Controllers\Admin\EventController::class, 'store'])->name('admin.events.store');
    Route::patch('/admin/events/{event}', [\App\Http\Controllers\Admin\EventController::class, 'update'])->name('admin.events.update');
    Route::delete('/admin/events/{event}', [\App\Http\Controllers\Admin\EventController::class, 'destroy'])->name('admin.events.destroy');

    // Sabuk
    Route::get('/admin/sabuk', [\App\Http\Controllers\Admin\SabukController::class, 'index'])->name('admin.sabuk.index');
    Route::post('/admin/sabuk', [\App\Http\Controllers\Admin\SabukController::class, 'store'])->name('admin.sabuk.store');
    Route::patch('/admin/sabuk/{sabuk}', [\App\Http\Controllers\Admin\SabukController::class, 'update'])->name('admin.sabuk.update');
    Route::delete('/admin/sabuk/{sabuk}', [\App\Http\Controllers\Admin\SabukController::class, 'destroy'])->name('admin.sabuk.destroy');

    // Ranting (CRUD)
    Route::get('/admin/ranting', [\App\Http\Controllers\Admin\RantingController::class, 'index'])->name('admin.ranting.index');
    Route::post('/admin/ranting', [\App\Http\Controllers\Admin\RantingController::class, 'store'])->name('admin.ranting.store');
    Route::patch('/admin/ranting/{ranting}', [\App\Http\Controllers\Admin\RantingController::class, 'update'])->name('admin.ranting.update');
    Route::delete('/admin/ranting/{ranting}', [\App\Http\Controllers\Admin\RantingController::class, 'destroy'])->name('admin.ranting.destroy');

    // Royalti
    Route::get('/admin/royalti', [\App\Http\Controllers\Admin\RoyaltiController::class, 'index'])->name('admin.royalti.index');
    Route::post('/admin/royalti', [\App\Http\Controllers\Admin\RoyaltiController::class, 'store'])->name('admin.royalti.store');
    Route::patch('/admin/royalti/{royalti}', [\App\Http\Controllers\Admin\RoyaltiController::class, 'update'])->name('admin.royalti.update');
    Route::delete('/admin/royalti/{royalti}', [\App\Http\Controllers\Admin\RoyaltiController::class, 'destroy'])->name('admin.royalti.destroy');

    // Activity Logs
    Route::get('/admin/logs', [\App\Http\Controllers\Admin\LogController::class, 'index'])->name('admin.logs.index');
});

// ─── Bendahara ────────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'role:Bendahara'])->group(function () {
    Route::get('/bendahara/keuangan', [\App\Http\Controllers\Bendahara\CashflowController::class, 'index'])->name('bendahara.keuangan.index');
    Route::post('/bendahara/keuangan', [\App\Http\Controllers\Bendahara\CashflowController::class, 'store'])->name('bendahara.keuangan.store');
    Route::patch('/bendahara/keuangan/{cashflow}', [\App\Http\Controllers\Bendahara\CashflowController::class, 'update'])->name('bendahara.keuangan.update');
    Route::delete('/bendahara/keuangan/{cashflow}', [\App\Http\Controllers\Bendahara\CashflowController::class, 'destroy'])->name('bendahara.keuangan.destroy');

    Route::get('/bendahara/ranting', [\App\Http\Controllers\Bendahara\RantingController::class, 'index'])->name('bendahara.ranting.index');
});

// ─── Pelatih ──────────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'role:Pelatih'])->group(function () {
    Route::get('/pelatih/keuangan', [\App\Http\Controllers\Pelatih\KeuanganController::class, 'index'])->name('pelatih.keuangan.index');

    Route::get('/pelatih/ranting', [\App\Http\Controllers\Pelatih\RantingController::class, 'index'])->name('pelatih.ranting.index');

    // Verifikasi berkas event
    Route::get('/pelatih/verifikasi', [\App\Http\Controllers\Pelatih\VerifikasiController::class, 'index'])->name('pelatih.verifikasi.index');
    Route::patch('/pelatih/verifikasi/{registration}', [\App\Http\Controllers\Pelatih\VerifikasiController::class, 'update'])->name('pelatih.verifikasi.update');

    // Verifikasi murid baru
    Route::get('/pelatih/murid-baru', [\App\Http\Controllers\Pelatih\VerifikasiMuridController::class, 'index'])->name('pelatih.murid-baru.index');
    Route::patch('/pelatih/murid-baru/{murid}/approve', [\App\Http\Controllers\Pelatih\VerifikasiMuridController::class, 'approve'])->name('pelatih.murid-baru.approve');
    Route::patch('/pelatih/murid-baru/{murid}/reject', [\App\Http\Controllers\Pelatih\VerifikasiMuridController::class, 'reject'])->name('pelatih.murid-baru.reject');
});

// ─── Murid ────────────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'role:Murid'])->group(function () {
    // Hanya murid aktif yang bisa akses events
    Route::middleware('murid.aktif')->group(function () {
        Route::get('/murid/events', [\App\Http\Controllers\Murid\EventController::class, 'index'])->name('murid.events.index');
        Route::post('/murid/events/{event}/daftar', [\App\Http\Controllers\Murid\EventController::class, 'daftar'])->name('murid.events.daftar');
    });
});

require __DIR__.'/auth.php';
