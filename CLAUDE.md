# CLAUDE.md — PS. Garuda Amarta Management Web

## Gambaran Proyek

Aplikasi manajemen perguruan pencak silat **PS. Garuda Amarta**. Mengelola anggota, tingkatan sabuk, keuangan (buku kas), dan acara/pertandingan.

**Stack:** Laravel 13 + React 18 + Inertia.js 2 + Tailwind CSS 4 + PostgreSQL (Supabase) + Vercel

---

## Perintah Development

```bash
# Jalankan semua sekaligus (server + queue + log + vite)
composer dev

# Hanya frontend
npm run dev

# Build production
npm run build

# Jalankan test
composer test
```

---

## Arsitektur

Proyek ini menggunakan **Laravel + Inertia.js + React** — bukan REST API.

- Laravel menangani routing, auth, validasi, dan query database
- Inertia.js menjembatani backend ke frontend (data dikirim sebagai props ke React)
- React hanya merender UI, tidak ada fetch/axios manual untuk data halaman
- `useForm` dari `@inertiajs/react` dipakai untuk semua form submission

**Alur request:**
```
Browser → Vercel → api/index.php → Route (web.php) → Middleware → Controller → Model → Inertia::render() → React Component
```

---

## Sistem Role

Ada 4 role, masing-masing punya dashboard sendiri:

| Role | Dashboard Route | Nama di DB |
|------|----------------|------------|
| Super Admin | `/admin/dashboard` | `Super Admin` |
| Bendahara | `/bendahara/dashboard` | `Bendahara` |
| Pelatih | `/pelatih/dashboard` | `Pelatih` |
| Murid | `/murid/dashboard` | `Murid` |

**Cara cek role di controller:**
```php
$user->hasRole('Super Admin')  // method di User model
$user->role->nama_role === 'Bendahara'
```

**Cara cek role di React:**
```jsx
const { auth } = usePage().props;
const role = auth.user.role.nama_role; // 'Super Admin' | 'Bendahara' | 'Pelatih' | 'Murid'
```

**Shared props** (tersedia di semua halaman via `usePage().props.auth.user`):
```js
{ id, name, email, is_aktif, role: { id, nama_role } }
```

---

## Routing Pattern

**File:** `routes/web.php`

```php
// Middleware yang tersedia: auth, verified, role:NamaRole

// Route dengan akses per role
Route::middleware(['auth', 'verified', 'role:Bendahara'])->group(function () {
    // ...
});

// Route dengan multi-role
Route::middleware(['auth', 'verified'])->group(function () {
    // cek di controller
});
```

Untuk route yang diakses 2+ role, cek di controller dengan `hasRole()` lalu return Inertia sesuai kondisi.

---

## Database

**PostgreSQL** via Supabase. **Jangan pakai migrasi Laravel** — DDL ditulis sebagai raw SQL dan dieksekusi langsung di Supabase dashboard.

### Tabel yang ada:

| Tabel | Keterangan |
|-------|-----------|
| `users` | Semua pengguna (semua role) |
| `roles` | Definisi role (4 baris) |
| `rantings` | Tingkatan sabuk (7 baris) |
| `user_training_locations` | Lokasi latihan milik Pelatih |
| `cashflows` | Transaksi keuangan (Modul 3) |
| `events` | Acara/pertandingan (Modul 4) |
| `event_registrations` | Pendaftaran murid ke acara (Modul 4) |

### Relasi User:
```
users → roles (belongsTo)
users → rantings (belongsTo, nullable)
users → user_training_locations (hasMany)
users → cashflows (hasMany, sebagai bendahara_id)
users → event_registrations (hasMany, sebagai murid_id)
```

---

## Modul yang Sedang Dikerjakan (FSD)

### Modul 3 — Buku Kas

| Role | Akses |
|------|-------|
| Bendahara | Full CRUD — catat pemasukan & pengeluaran |
| Pelatih | Read-only — lihat laporan, filter bulan/tahun |
| Super Admin | Read-only — lihat semua laporan |

**Tabel:** `cashflows` — kolom: `bendahara_id`, `tipe_transaksi` (Pemasukan/Pengeluaran), `nominal`, `keterangan`, `tanggal_transaksi`

**Saldo dihitung:** `SUM(pemasukan) - SUM(pengeluaran)` — tidak disimpan di DB, dihitung di controller.

### Modul 4 — Acara & Pertandingan

| Role | Akses |
|------|-------|
| Super Admin | Full CRUD acara |
| Pelatih | View acara, verifikasi berkas murid (ACC/Tolak) |
| Murid | View acara, upload berkas pendaftaran |
| Bendahara | View only |

**Tabel:** `events` (acara), `event_registrations` (pendaftaran + berkas + status)

**Status berkas:** `Menunggu` → `ACC` atau `Ditolak`

**File upload:** Simpan ke `storage/app/public/berkas/`, akses via `Storage::url()`

---

## Konvensi UI

### Tema

Semua halaman utama pakai **dark theme**:
- Background: `bg-[#0a0a0a]`
- Teks utama: `text-white`
- Teks sekunder: `text-gray-400`
- Border: `border-white/10`

Halaman profil dan auth (GuestLayout) pakai light theme.

### Warna Brand (dari `resources/css/app.css`)

- **Primary Red:** `#610000` / Tailwind `bg-primary` — warna utama brand
- **Tombol utama:** `bg-red-600 hover:bg-red-700`
- **Tombol danger:** `bg-red-600` (DangerButton component)
- **Font:** Hanken Grotesk (sans), JetBrains Mono (mono)

### Komponen yang Sudah Ada

```
resources/js/Components/
├── Modal.jsx          — Dialog dengan backdrop blur (Headless UI)
├── PrimaryButton.jsx  — Tombol utama (override ke red-600)
├── SecondaryButton.jsx— Tombol batal/sekunder
├── DangerButton.jsx   — Tombol delete (red-600)
├── TextInput.jsx      — Input text dengan ref forwarding
├── InputLabel.jsx     — Label form
├── InputError.jsx     — Pesan error validasi
├── Checkbox.jsx       — Checkbox
├── Dropdown.jsx       — Dropdown menu (Headless UI)
├── NavLink.jsx        — Link navigasi navbar
└── ResponsiveNavLink.jsx
```

### Pattern Glassmorphic Table (dipakai di semua halaman admin)

```jsx
<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="bg-white/5 border-b border-white/10">
        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
          Kolom
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-white/5">
      <tr className="hover:bg-white/[0.02] transition-colors">
        <td className="px-6 py-4 text-sm text-white">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Pattern Status Badge

```jsx
// Status keuangan
const tipeClass = tipe === 'Pemasukan'
  ? 'bg-emerald-500/20 text-emerald-400'
  : 'bg-red-500/20 text-red-400';

// Status verifikasi berkas
const statusClass = {
  'Menunggu': 'bg-orange-500/20 text-orange-400',
  'ACC':      'bg-emerald-500/20 text-emerald-400',
  'Ditolak':  'bg-red-500/20 text-red-400',
}[status];

<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
  {status}
</span>
```

### Pattern Search + Debounce (400ms)

```jsx
const [search, setSearch] = useState(filters?.search || '');
const isFirstRender = useRef(true);

useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const timer = setTimeout(() => {
        router.get(route('nama.route'), { search: search || undefined }, {
            preserveState: true, replace: true, preserveScroll: true,
        });
    }, 400);
    return () => clearTimeout(timer);
}, [search]);
```

### Pattern Form dengan Modal

```jsx
const { data, setData, post, patch, processing, errors, reset } = useForm({ field: '' });

const handleSubmit = (e) => {
    e.preventDefault();
    post(route('nama.route'), { onSuccess: () => { setIsOpen(false); reset(); } });
};

<Modal show={isOpen} onClose={() => setIsOpen(false)} maxWidth="md">
    <form onSubmit={handleSubmit} className="p-6">
        <h2 className="text-lg font-medium text-white mb-4">Judul Modal</h2>
        <div className="space-y-4">
            <div>
                <InputLabel value="Label" className="text-gray-400" />
                <TextInput
                    value={data.field}
                    onChange={(e) => setData('field', e.target.value)}
                    className="mt-1 block w-full bg-white/5 border-white/10 text-white"
                />
                <InputError message={errors.field} className="mt-1" />
            </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
            <SecondaryButton onClick={() => setIsOpen(false)}>Batal</SecondaryButton>
            <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
        </div>
    </form>
</Modal>
```

### Format Rupiah

```jsx
const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
// Output: "Rp 150.000"
```

### Icon Library

Pakai **lucide-react** secara konsisten:
```jsx
import { Search, Plus, Trash2, Edit2, Check, X, Upload, FileText, Eye } from 'lucide-react';
```

---

## Struktur Folder Penting

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          — Controller untuk Super Admin
│   │   ├── Bendahara/      — Controller Modul Keuangan
│   │   ├── Pelatih/        — Controller Modul Pelatih
│   │   ├── Murid/          — Controller Modul Murid
│   │   └── Auth/           — Login, Register, dll
│   └── Middleware/
│       └── RoleMiddleware.php
├── Models/
│   ├── User.php
│   ├── Role.php
│   ├── Ranting.php
│   ├── Cashflow.php        — Modul 3
│   ├── Event.php           — Modul 4
│   └── EventRegistration.php — Modul 4

resources/js/
├── Pages/
│   ├── Admin/              — Halaman Super Admin
│   ├── Bendahara/          — Halaman Bendahara
│   ├── Pelatih/            — Halaman Pelatih
│   ├── Murid/              — Halaman Murid
│   ├── Auth/               — Login, Register, dll
│   └── Profile/
├── Layouts/
│   ├── AuthenticatedLayout.jsx
│   └── GuestLayout.jsx
└── Components/             — Komponen reusable
```

---

## Hal-hal Penting yang Harus Diingat

1. **Tidak ada migrasi** — DDL ditulis sebagai raw SQL, dieksekusi di Supabase dashboard
2. **Inertia bukan REST** — jangan fetch data dengan axios/fetch, gunakan props dari controller
3. **Super Admin terlindungi** — tidak bisa diedit/dihapus, ada validasi di backend dan frontend
4. **File upload** — simpan ke `storage/app/public/berkas/`, jalankan `php artisan storage:link` jika baru
5. **Semua halaman baru** — ikuti dark theme pattern yang sudah ada
6. **Ziggy routes** — gunakan `route('nama.route')` di React (sudah dikonfigurasi)
7. **Pagination** — selalu gunakan `->paginate(25)` di controller, render `users.links` di React


### Security & Reliability
- Implement defense-in-depth security practices
- Design for failure with circuit breakers, retries, and fallbacks
- Plan disaster recovery and business continuity
- Ensure data encryption at rest and in transit
- Implement audit logging and monitoring

### Performance Engineering
- Profile and optimize database queries
- Design efficient data access patterns
- Implement connection pooling and resource management
- Plan capacity based on load projections
- Identify and eliminate bottlenecks