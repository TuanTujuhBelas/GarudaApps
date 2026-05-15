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
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Super Admin
Route::middleware(['auth', 'verified', 'role:Super Admin'])->group(function () {
    Route::get('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
    Route::patch('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');

    Route::get('/admin/keuangan', [\App\Http\Controllers\Admin\KeuanganController::class, 'index'])->name('admin.keuangan.index');
    Route::post('/admin/keuangan', [\App\Http\Controllers\Admin\KeuanganController::class, 'store'])->name('admin.keuangan.store');
    Route::patch('/admin/keuangan/{cashflow}', [\App\Http\Controllers\Admin\KeuanganController::class, 'update'])->name('admin.keuangan.update');
    Route::delete('/admin/keuangan/{cashflow}', [\App\Http\Controllers\Admin\KeuanganController::class, 'destroy'])->name('admin.keuangan.destroy');

    Route::get('/admin/events', [\App\Http\Controllers\Admin\EventController::class, 'index'])->name('admin.events.index');
    Route::post('/admin/events', [\App\Http\Controllers\Admin\EventController::class, 'store'])->name('admin.events.store');
    Route::patch('/admin/events/{event}', [\App\Http\Controllers\Admin\EventController::class, 'update'])->name('admin.events.update');
    Route::delete('/admin/events/{event}', [\App\Http\Controllers\Admin\EventController::class, 'destroy'])->name('admin.events.destroy');

    Route::get('/admin/sabuk', [\App\Http\Controllers\Admin\SabukController::class, 'index'])->name('admin.sabuk.index');
    Route::post('/admin/sabuk', [\App\Http\Controllers\Admin\SabukController::class, 'store'])->name('admin.sabuk.store');
    Route::patch('/admin/sabuk/{sabuk}', [\App\Http\Controllers\Admin\SabukController::class, 'update'])->name('admin.sabuk.update');
    Route::delete('/admin/sabuk/{sabuk}', [\App\Http\Controllers\Admin\SabukController::class, 'destroy'])->name('admin.sabuk.destroy');
});

// Bendahara
Route::middleware(['auth', 'verified', 'role:Bendahara'])->group(function () {
    Route::get('/bendahara/keuangan', [\App\Http\Controllers\Bendahara\CashflowController::class, 'index'])->name('bendahara.keuangan.index');
    Route::post('/bendahara/keuangan', [\App\Http\Controllers\Bendahara\CashflowController::class, 'store'])->name('bendahara.keuangan.store');
    Route::patch('/bendahara/keuangan/{cashflow}', [\App\Http\Controllers\Bendahara\CashflowController::class, 'update'])->name('bendahara.keuangan.update');
    Route::delete('/bendahara/keuangan/{cashflow}', [\App\Http\Controllers\Bendahara\CashflowController::class, 'destroy'])->name('bendahara.keuangan.destroy');
});

// Pelatih
Route::middleware(['auth', 'verified', 'role:Pelatih'])->group(function () {
    Route::get('/pelatih/keuangan', [\App\Http\Controllers\Pelatih\KeuanganController::class, 'index'])->name('pelatih.keuangan.index');
    Route::get('/pelatih/verifikasi', [\App\Http\Controllers\Pelatih\VerifikasiController::class, 'index'])->name('pelatih.verifikasi.index');
    Route::patch('/pelatih/verifikasi/{registration}', [\App\Http\Controllers\Pelatih\VerifikasiController::class, 'update'])->name('pelatih.verifikasi.update');
});

// Murid
Route::middleware(['auth', 'verified', 'role:Murid'])->group(function () {
    Route::get('/murid/events', [\App\Http\Controllers\Murid\EventController::class, 'index'])->name('murid.events.index');
    Route::post('/murid/events/{event}/daftar', [\App\Http\Controllers\Murid\EventController::class, 'daftar'])->name('murid.events.daftar');
});

require __DIR__.'/auth.php';
