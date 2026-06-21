import { Bell, Download, RotateCcw, ShieldCheck, Smartphone } from "lucide-react";
import { APP_VERSION } from "../data/defaults";
import type { AppSettings, Category, Expense, Pocket } from "../types";

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
  return (
    <div className="page settings-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Saya</p>
          <h1>Profil hematmu.</h1>
        </div>
      </section>

      <div className="settings-grid">
        <section className="card profile-card">
          <img src="/assets/kiko-mascot.png" alt="Kiko, maskot SisaKu" />
          <div>
            <p className="eyebrow">Kiko menemani</p>
            <h2>Data tetap aman di perangkatmu.</h2>
            <p>Semua catatan uang saku tetap lokal. Kamu bisa export CSV kapan saja.</p>
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
              <strong>Reminder placeholder</strong>
              <small>Notifikasi native belum diaktifkan di MVP.</small>
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
          <p>Export data ke CSV agar kamu punya cadangan di luar aplikasi.</p>
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
              Reset Data
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
            <li>Setelah dipasang, SisaKu bisa dibuka seperti aplikasi biasa.</li>
          </ol>
          <p className="offline-note">{isOffline ? "Kamu sedang offline. Data tetap tersimpan di perangkat ini." : "Offline basic aktif setelah app pernah dibuka dari build production."}</p>
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
          <p>Data kamu tersimpan di perangkat ini. SisaKu tidak mengirim data pengeluaran ke server dan tidak membutuhkan koneksi bank atau e-wallet untuk MVP.</p>
          <p className="version-line">SisaKu v{APP_VERSION}</p>
        </section>
      </div>
    </div>
  );
}
