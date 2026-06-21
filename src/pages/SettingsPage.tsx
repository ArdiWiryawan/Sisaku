import { Bell, Download, Palette, RotateCcw, ShieldCheck, Smartphone, Settings, Edit3 } from "lucide-react";
import { useState } from "react";
import { APP_VERSION } from "../data/defaults";
import { Modal } from "../components/Modal";
import type { AppSettings, Category, Expense, Pocket } from "../types";
import { calculateStreak } from "../utils/gamification";

type SettingsPageProps = {
  settings: AppSettings;
  expenses: Expense[];
  pockets: Pocket[];
  categories: Category[];
  storageError: string | null;
  isOffline: boolean;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onExportCSV: () => void;
  onResetData: () => void;
};

export function SettingsPage({ settings, expenses, pockets, categories, storageError, isOffline, onUpdateSettings, onExportCSV, onResetData }: SettingsPageProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState(settings.userName ?? "Dika Pratama");
  const [bioInput, setBioInput] = useState(settings.userBio ?? "Anak hemat masa depan cerah ✨");

  // Calculate streak from active expenses
  const activeExpenses = expenses.filter((e) => !e.deletedAt);
  const streakDays = calculateStreak(activeExpenses.map((e) => e.date));

  const handleOpenEditModal = () => {
    setNameInput(settings.userName ?? "Dika Pratama");
    setBioInput(settings.userBio ?? "Anak hemat masa depan cerah ✨");
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      userName: nameInput,
      userBio: bioInput,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="page settings-page">
      {/* Custom Mobile Header */}
      <header className="mobile-only-header">
        <h1>Saya</h1>
        <button
          className="mobile-header-icon-btn"
          type="button"
          onClick={() => alert("⚙️ Kiko: Pengaturan preferensi dan notifikasi tersimpan secara otomatis di memori lokal HP-mu!")}
          aria-label="Pengaturan"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Desktop traditional header */}
      <section className="page-header desktop-only-header">
        <div>
          <p className="eyebrow">Saya</p>
          <h1>Atur pengalaman SisaKu.</h1>
        </div>
      </section>

      {/* Profile and Streak section */}
      <div className="profile-section-v2">
        <section className="profile-hero-card">
          <div className="profile-hero-avatar" aria-hidden="true">
            {(settings.userName ?? "Dika").charAt(0)}
          </div>
          <div className="profile-hero-info">
            <h2>{settings.userName ?? "Dika Pratama"}</h2>
            <p>{settings.userBio ?? "Anak hemat masa depan cerah ✨"}</p>
            <button className="btn btn-secondary btn-sm" type="button" onClick={handleOpenEditModal}>
              <Edit3 size={14} aria-hidden="true" />
              Edit Profil
            </button>
          </div>
        </section>

        <section className="card streak-card-v2" aria-label="Informasi streak">
          <div className="streak-icon-wrap" aria-hidden="true">🔥</div>
          <div className="streak-content-wrap">
            <h3>Streak hari ini</h3>
            <p>Kamu sudah mencatat <strong>{streakDays} hari</strong> berturut-turut. Pertahankan streak-mu!</p>
          </div>
        </section>
      </div>

      <div className="settings-grid">
        <section className="card profile-card">
          <img src="/assets/kiko-mascot.png" alt="Kiko, maskot SisaKu" />
          <div>
            <p className="eyebrow">Kiko menemani</p>
            <h2>Catatanmu tetap di perangkat ini.</h2>
            <p>SisaKu menyimpan data secara lokal. Kamu bisa unduh CSV kapan saja kalau butuh cadangan.</p>
          </div>
        </section>

        <section className="card settings-card">
          <div className="card-header-row">
            <div>
              <p className="eyebrow">Tampilan</p>
              <h2>Tema aplikasi</h2>
            </div>
            <div className="icon-bubble primary">
              <Palette size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="segmented-control" style={{ marginTop: "8px" }}>
            <button className={settings.theme === "light" ? "selected" : ""} type="button" onClick={() => onUpdateSettings({ theme: "light" })}>
              Terang
            </button>
            <button className={settings.theme === "dark" ? "selected" : ""} type="button" onClick={() => onUpdateSettings({ theme: "dark" })}>
              Gelap
            </button>
          </div>
        </section>

        <section className="card settings-card">
          <div className="card-header-row">
            <div>
              <p className="eyebrow">Reminder</p>
              <h2>Cek uang harian</h2>
            </div>
            <div className="icon-bubble primary">
              <Bell size={20} aria-hidden="true" />
            </div>
          </div>
          <label className="toggle-row">
            <span>
              <strong>Pengingat cek uang</strong>
              <small>Notifikasi native belum aktif di versi MVP.</small>
            </span>
            <input
              type="checkbox"
              checked={settings.reminderEnabled}
              onChange={(event) => onUpdateSettings({ reminderEnabled: event.target.checked })}
            />
          </label>
          <div className="field">
            <label htmlFor="reminder-time">Jam reminder</label>
            <input
              id="reminder-time"
              type="time"
              value={settings.reminderTime ?? "21:00"}
              onChange={(event) => onUpdateSettings({ reminderTime: event.target.value })}
            />
          </div>
        </section>

        <section className="card settings-card">
          <div className="card-header-row">
            <div>
              <p className="eyebrow">Data lokal</p>
              <h2>Export dan reset</h2>
            </div>
            <div className="icon-bubble safe">
              <Download size={20} aria-hidden="true" />
            </div>
          </div>
          <p>Unduh CSV untuk menyimpan cadangan atau mengecek catatanmu di spreadsheet.</p>
          <div className="settings-stats">
            <span>{pockets.length} pocket</span>
            <span>{expenses.length} transaksi</span>
            <span>{categories.length} kategori</span>
          </div>
          <div className="card-actions strong-actions">
            <button className="btn btn-secondary" type="button" onClick={onExportCSV}>
              <Download size={16} aria-hidden="true" />
              Export CSV
            </button>
            <button className="btn btn-danger" type="button" onClick={onResetData}>
              <RotateCcw size={16} aria-hidden="true" />
              Reset data
            </button>
          </div>
          {storageError ? <p className="form-error">{storageError}</p> : null}
        </section>

        <section className="card settings-card">
          <div className="card-header-row">
            <div>
              <p className="eyebrow">Install PWA</p>
              <h2>Pasang di HP</h2>
            </div>
            <div className="icon-bubble warning">
              <Smartphone size={20} aria-hidden="true" />
            </div>
          </div>
          <ol className="simple-steps">
            <li>Android Chrome: buka menu browser, lalu pilih Install app atau Add to Home screen.</li>
            <li>iPhone Safari: tap Share, pilih Add to Home Screen, lalu tap Add.</li>
            <li>Setelah terpasang, SisaKu bisa dibuka seperti aplikasi biasa.</li>
          </ol>
          <p className="offline-note">{isOffline ? "Kamu sedang offline. Catatan tetap tersimpan di perangkat ini." : "Mode offline aktif setelah app pernah dibuka dari versi production."}</p>
        </section>

        <section className="card settings-card">
          <div className="card-header-row">
            <div>
              <p className="eyebrow">Privasi</p>
              <h2>Data tetap di perangkat</h2>
            </div>
            <div className="icon-bubble safe">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
          </div>
          <p>Data pengeluaranmu tersimpan di perangkat ini. SisaKu tidak mengirim catatan ke server dan tidak perlu koneksi bank atau e-wallet di versi MVP.</p>
          <p className="version-line">SisaKu v{APP_VERSION}</p>
        </section>
      </div>

      {/* Edit Profile Modal */}
      <Modal title="Edit Profil" open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <form onSubmit={handleSaveProfile} className="profile-edit-form">
          <div className="field">
            <label htmlFor="profile-name">Nama Panggilan / Lengkap</label>
            <input
              id="profile-name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Contoh: Dika Pratama"
              required
            />
          </div>
          <div className="field" style={{ marginTop: "16px" }}>
            <label htmlFor="profile-bio">Slogan / Bio</label>
            <input
              id="profile-bio"
              type="text"
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              placeholder="Contoh: Anak hemat masa depan cerah ✨"
            />
          </div>
          <div className="card-actions strong-actions" style={{ marginTop: "24px" }}>
            <button className="btn btn-secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </button>
            <button className="btn btn-primary" type="submit">
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
