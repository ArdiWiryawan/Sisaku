import { Bell, Download, Palette, RotateCcw, ShieldCheck, Smartphone, Upload, User } from "lucide-react";
import { useRef } from "react";
import { APP_VERSION } from "../data/defaults";
import type { AppSettings, Category, Expense, Income, Pocket } from "../types";

type SettingsPageProps = {
  settings: AppSettings;
  expenses: Expense[];
  incomes: Income[];
  pockets: Pocket[];
  categories: Category[];
  storageError: string | null;
  isOffline: boolean;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onExportCSV: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onResetData: () => void;
};

export function SettingsPage({
  settings,
  expenses,
  incomes,
  pockets,
  categories,
  storageError,
  isOffline,
  onUpdateSettings,
  onExportCSV,
  onExportBackup,
  onImportBackup,
  onResetData,
}: SettingsPageProps) {
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const activeExpenses = expenses.filter((expense) => !expense.deletedAt);
  const activeIncomes = incomes.filter((income) => !income.deletedAt);

  return (
    <div className="page settings-page">
      <header className="mobile-only-header">
        <h1>Pengaturan</h1>
      </header>

      <section className="page-header desktop-only-header">
        <div>
          <p className="eyebrow">Pengaturan</p>
          <h1>Atur SisaKu seperlunya.</h1>
        </div>
      </section>

      <div className="settings-grid">
        <section className="card settings-card">
          <div className="card-header-row">
            <div>
              <p className="eyebrow">Profil</p>
              <h2>Identitas kamu</h2>
            </div>
            <div className="icon-bubble primary">
              <User size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="field" style={{ marginTop: "12px" }}>
            <label htmlFor="user-name-input">Nama Pengguna</label>
            <input
              id="user-name-input"
              type="text"
              value={settings.userName ?? ""}
              placeholder="Masukkan nama kamu..."
              maxLength={30}
              onChange={(event) => onUpdateSettings({ userName: event.target.value })}
            />
          </div>
        </section>

        <section className="card settings-card">
          <div className="card-header-row">
            <div>
              <p className="eyebrow">Tema</p>
              <h2>Tampilan aplikasi</h2>
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
              <p className="eyebrow">Backup</p>
              <h2>Data lokal</h2>
            </div>
            <div className="icon-bubble safe">
              <Download size={20} aria-hidden="true" />
            </div>
          </div>
          <p>Unduh backup JSON untuk memulihkan data penuh. CSV tetap tersedia untuk cek catatan di spreadsheet.</p>
          <div className="settings-stats">
            <span>{pockets.length} rencana</span>
            <span>{activeExpenses.length} pengeluaran</span>
            <span>{activeIncomes.length} uang masuk</span>
            <span>{categories.length} kategori</span>
          </div>
          <div className="card-actions strong-actions">
            <button className="btn btn-primary" type="button" onClick={onExportBackup}>
              <Download size={16} aria-hidden="true" />
              Unduh backup
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => importInputRef.current?.click()}>
              <Upload size={16} aria-hidden="true" />
              Pulihkan backup
            </button>
            <button className="btn btn-secondary" type="button" onClick={onExportCSV}>
              <Download size={16} aria-hidden="true" />
              Unduh CSV
            </button>
          </div>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onImportBackup(file);
              }
              event.target.value = "";
            }}
          />
          {storageError ? <p className="form-error">{storageError}</p> : null}
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
              <p className="eyebrow">Privasi</p>
              <h2>Data tetap di perangkat</h2>
            </div>
            <div className="icon-bubble safe">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
          </div>
          <p>Data pengeluaran dan uang masuk tersimpan di perangkat ini. SisaKu tidak mengirim catatan ke server dan tidak perlu koneksi bank atau e-wallet.</p>
          <p className="version-line">SisaKu v{APP_VERSION}</p>
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
              <p className="eyebrow">Reset</p>
              <h2>Mulai dari kosong</h2>
            </div>
            <div className="icon-bubble danger">
              <RotateCcw size={20} aria-hidden="true" />
            </div>
          </div>
          <p>Reset hanya dipakai kalau kamu benar-benar ingin menghapus semua data lokal di perangkat ini.</p>
          <div className="card-actions strong-actions">
            <button className="btn btn-danger" type="button" onClick={onResetData}>
              <RotateCcw size={16} aria-hidden="true" />
              Reset data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
