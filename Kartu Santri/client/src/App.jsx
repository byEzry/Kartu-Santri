import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { PrintModal } from './components/PrintModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { DataSantri } from './pages/DataSantri';
import { SantriFormPage } from './pages/SantriFormPage';
import { SantriDetailPage } from './pages/SantriDetailPage';
import { GeneratorKartu } from './pages/GeneratorKartu';
import { KesehatanBerobat } from './pages/KesehatanBerobat';
import { ImportExcel } from './pages/ImportExcel';
import { PengaturanDesain } from './pages/PengaturanDesain';
import { PengaturanPesantren } from './pages/PengaturanPesantren';
import { Pengaturan } from './pages/Pengaturan';
import { BackupRestore } from './pages/BackupRestore';

export function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pesantren_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [previousTab, setPreviousTab] = useState('santri');
  const [pesantren, setPesantren] = useState(null);
  const [template, setTemplate] = useState(null);

  // Active records for full page views
  const [santriToEdit, setSantriToEdit] = useState(null);
  const [santriToView, setSantriToView] = useState(null);

  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [santriListToPrint, setSantriListToPrint] = useState([]);
  const [initialPrintMode, setInitialPrintMode] = useState('pvc');

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json.success) {
        setPesantren(json.pesantren);
        setTemplate(json.template);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Set default tab based on user role upon login
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'kesehatan') {
        setCurrentTab('kesehatan_berobat');
      } else {
        setCurrentTab('dashboard');
      }
    }
  }, [currentUser]);

  // Guard: Protect admin-only tabs from non-admin roles
  useEffect(() => {
    if (currentUser) {
      const role = currentUser.role || 'admin';
      const adminOnlyTabs = ['pengaturan', 'pengaturan_pesantren', 'pengaturan_master', 'pengaturan_akun', 'pesantren', 'backup'];
      if (role !== 'admin' && adminOnlyTabs.includes(currentTab)) {
        setCurrentTab(role === 'kesehatan' ? 'kesehatan_berobat' : 'dashboard');
      }
      if (role === 'kesehatan') {
        const restrictedForKesehatan = ['dashboard', 'generator', 'desain', 'import', 'santri_form'];
        if (restrictedForKesehatan.includes(currentTab)) {
          setCurrentTab('kesehatan_berobat');
        }
      }
    }
  }, [currentTab, currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('pesantren_auth_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    if (window.confirm('Apakah anda yakin ingin keluar dari aplikasi?')) {
      setCurrentUser(null);
      try {
        localStorage.removeItem('pesantren_auth_user');
      } catch (e) {}
    }
  };

  // Handlers - now transitioning to full page view instead of modals
  const handleAddNewSantri = () => {
    setSantriToEdit(null);
    setPreviousTab(currentTab === 'santri_form' || currentTab === 'santri_detail' ? 'santri' : currentTab);
    setCurrentTab('santri_form');
  };

  const handleEditSantri = (santri) => {
    setSantriToEdit(santri);
    setPreviousTab(currentTab === 'santri_form' || currentTab === 'santri_detail' ? (santriToView ? 'santri_detail' : 'santri') : currentTab);
    setCurrentTab('santri_form');
  };

  const handleViewDetail = (santri) => {
    setSantriToView(santri);
    setPreviousTab(currentTab === 'santri_form' || currentTab === 'santri_detail' ? 'santri' : currentTab);
    setCurrentTab('santri_detail');
  };

  const handleOpenPrintModal = (santriArray, initialMode = 'pvc') => {
    if (!santriArray || santriArray.length === 0) return;
    setSantriListToPrint(santriArray);
    setInitialPrintMode(initialMode);
    setIsPrintOpen(true);
  };

  const handleSaveAndCreateCard = (savedSantri) => {
    setCurrentTab(previousTab || 'santri');
    setSantriToEdit(null);
    handleOpenPrintModal([savedSantri]);
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If not logged in, render LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} pesantren={pesantren} />;
  }

  // Page title mapping
  const titles = {
    dashboard: 'Dashboard',
    pengaturan: 'Pengaturan Aplikasi',
    pengaturan_pesantren: 'Profil Pondok Pesantren',
    pengaturan_master: 'Master Data',
    pengaturan_akun: 'Data Akun & Hak Akses',
    pesantren: 'Profil Pondok Pesantren',
    santri: 'Data Santri',
    import: 'Impor Data Excel & Foto',
    generator: 'Generator Kartu Santri & Mahrom',
    kesehatan_berobat: 'Layanan Cetak Kolektif Santri Berobat',
    desain: 'Pengaturan Desain Kartu',
    backup: 'Backup & Restore Database'
  };

  const userRole = currentUser.role || 'admin';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F3F5] font-sans text-teal-900">
      {/* Sidebar Navigation with Role-Aware Menu Filtering & Mobile Off-canvas Drawer */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        pesantren={pesantren}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#F1F3F5]">
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        <main className="flex-1 overflow-y-auto bg-[#F1F3F5]">
          {/* Dashboard (Admin & TU) */}
          {currentTab === 'dashboard' && (userRole === 'admin' || userRole === 'tu') && (
            <Dashboard
              currentUser={currentUser}
              onNavigate={setCurrentTab}
              onAddNewSantri={handleAddNewSantri}
              onOpenCardDetail={handleViewDetail}
              onQuickPrint={handleOpenPrintModal}
            />
          )}

          {/* Master Data Santri (Accessible to Admin, TU, Kesehatan) */}
          {currentTab === 'santri' && (
            <DataSantri
              onAddNewSantri={handleAddNewSantri}
              onEditSantri={handleEditSantri}
              onViewDetail={handleViewDetail}
              onPrintCards={handleOpenPrintModal}
              onOpenImport={() => setCurrentTab('import')}
              userRole={userRole}
            />
          )}

          {/* Generator Kartu (Admin & TU) */}
          {currentTab === 'generator' && (userRole === 'admin' || userRole === 'tu') && (
            <GeneratorKartu
              pesantren={pesantren}
              template={template}
              onOpenPrintModal={handleOpenPrintModal}
            />
          )}

          {/* Layanan Cetak Kolektif Berobat (Admin, TU & Kesehatan) */}
          {currentTab === 'kesehatan_berobat' && (userRole === 'admin' || userRole === 'tu' || userRole === 'kesehatan') && (
            <KesehatanBerobat
              onPrintCards={handleOpenPrintModal}
            />
          )}

          {/* Impor Excel (Admin & TU) */}
          {currentTab === 'import' && (userRole === 'admin' || userRole === 'tu') && (
            <ImportExcel
              onImportComplete={() => {}}
              onBackToSantri={() => setCurrentTab('santri')}
            />
          )}

          {/* Desain Kartu (Admin & TU) */}
          {currentTab === 'desain' && (userRole === 'admin' || userRole === 'tu') && (
            <PengaturanDesain
              template={template}
              pesantren={pesantren}
              sampleSantri={santriToView}
              onUpdateTemplate={(newTemplate) => setTemplate(newTemplate)}
            />
          )}

          {/* Pengaturan Menu (Profil Pesantren, Master Data, Data Akun, Sistem) */}
          {(currentTab === 'pengaturan' || currentTab === 'pengaturan_pesantren' || currentTab === 'pengaturan_master' || currentTab === 'pengaturan_akun' || currentTab === 'pesantren') && userRole === 'admin' && (
            <Pengaturan
              initialSubTab={
                currentTab === 'pengaturan_master'
                  ? 'master'
                  : currentTab === 'pengaturan_akun'
                  ? 'akun'
                  : currentTab === 'pengaturan_pesantren' || currentTab === 'pesantren'
                  ? 'pesantren'
                  : 'pesantren'
              }
              pesantren={pesantren}
              onUpdatePesantren={(newPesantren) => setPesantren(newPesantren)}
              currentUser={currentUser}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'backup' && userRole === 'admin' && (
            <BackupRestore onRestoreSuccess={fetchSettings} />
          )}

          {/* Lembar Input Manual / Edit Santri - Model Halaman Penuh */}
          {currentTab === 'santri_form' && (
            <SantriFormPage
              santriToEdit={santriToEdit}
              onBack={() => {
                setCurrentTab(previousTab || 'santri');
                setSantriToEdit(null);
              }}
              onSaveSuccess={(savedSantri) => {
                if (santriToView && savedSantri && santriToView.id === savedSantri.id) {
                  setSantriToView(savedSantri);
                }
                setCurrentTab(previousTab || 'santri');
                setSantriToEdit(null);
              }}
              onSaveAndCreateCard={handleSaveAndCreateCard}
            />
          )}

          {/* Halaman Detail Santri Lengkap - Model Halaman Penuh */}
          {currentTab === 'santri_detail' && santriToView && (
            <SantriDetailPage
              santri={santriToView}
              pesantren={pesantren}
              template={template}
              onBack={() => {
                setCurrentTab(previousTab === 'santri_detail' ? 'santri' : (previousTab || 'santri'));
                setSantriToView(null);
              }}
              onEdit={(santri) => {
                setSantriToEdit(santri);
                setPreviousTab('santri_detail');
                setCurrentTab('santri_form');
              }}
              onPrint={handleOpenPrintModal}
            />
          )}
        </main>
      </div>

      {/* Global Modals (Hanya PrintModal untuk cetak kartu PVC) */}
      <PrintModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        santriList={santriListToPrint}
        pesantren={pesantren}
        template={template}
        initialMode={initialPrintMode}
        onPrintSuccess={() => {}}
      />
    </div>
  );
}

export default App;
