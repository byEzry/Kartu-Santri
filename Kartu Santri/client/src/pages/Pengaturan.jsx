import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building2,
  Users,
  UserPlus,
  ShieldCheck,
  KeyRound,
  Edit,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  Upload,
  Globe,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Search,
  Server,
  Database,
  RefreshCw,
  ExternalLink,
  Crown,
  FileText,
  Palette,
  Plus,
  X
} from 'lucide-react';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { StampQudsiyyah, SignaturePengasuh } from '../components/CardSantri';

const MASTER_TABLES = [
  {
    id: 'jenjang',
    title: 'Jenjang Pendidikan',
    name: 'Jenjang Pendidikan',
    placeholder: 'Ketik jenjang (misal: MI, MTs, MA)...'
  },
  {
    id: 'program',
    title: 'Program',
    name: 'Program',
    placeholder: 'Ketik nama program (misal: Tahfidz, Kitab)...'
  },
  {
    id: 'kamar',
    title: 'Asrama',
    name: 'Asrama',
    placeholder: 'Ketik nama asrama (misal: Khadijah 01)...'
  },
  {
    id: 'kelas',
    title: 'Kelas',
    name: 'Kelas',
    placeholder: 'Ketik nama kelas (misal: VII, VIII, IX)...'
  },
  {
    id: 'rombel',
    title: 'Ruang',
    name: 'Ruang',
    placeholder: 'Ketik nama ruang (misal: A, B, C)...'
  }
];

export function Pengaturan({
  initialSubTab = 'pesantren',
  pesantren,
  onUpdatePesantren,
  currentUser,
  onNavigate
}) {
  const [activeTab, setActiveTab] = useState(
    initialSubTab === 'master' || initialSubTab === 'akun' || initialSubTab === 'pengaturan_master' || initialSubTab === 'pengaturan_akun' ? 'master' : 'pesantren'
  );
  const [masterSection, setMasterSection] = useState(
    initialSubTab === 'akun' || initialSubTab === 'pengaturan_akun' ? 'akun' : 'pilihan'
  );

  // Sync activeTab when initialSubTab changes from sidebar
  useEffect(() => {
    if (initialSubTab) {
      if (initialSubTab === 'pesantren' || initialSubTab === 'pengaturan_pesantren') {
        setActiveTab('pesantren');
      } else {
        setActiveTab('master');
        if (initialSubTab === 'akun' || initialSubTab === 'pengaturan_akun') {
          setMasterSection('akun');
        } else if (initialSubTab === 'sistem') {
          setMasterSection('sistem');
        }
      }
    }
  }, [initialSubTab]);

  /* ============================================================
     TAB 1: PROFIL PONDOK PESANTREN & PENGESAHAN KARTU
     ============================================================ */
  const [formDataPesantren, setFormDataPesantren] = useState({
    nama_pesantren: '',
    alamat_pesantren: '',
    kontak: '',
    website: '',
    email: '',
    nama_pengasuh: '',
    sebutan_pengasuh: '',
    tulisan_arab: '',
    nama_yayasan: '',
    tanggal_surat: '',
    tempat_terbit: ''
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [tulisanArabFile, setTulisanArabFile] = useState(null);
  const [tulisanArabPreview, setTulisanArabPreview] = useState(null);
  const [ttdFile, setTtdFile] = useState(null);
  const [ttdPreview, setTtdPreview] = useState(null);
  const [stempelFile, setStempelFile] = useState(null);
  const [stempelPreview, setStempelPreview] = useState(null);
  const [hapusTulisanArab, setHapusTulisanArab] = useState(false);
  const [hapusTtd, setHapusTtd] = useState(false);
  const [hapusStempel, setHapusStempel] = useState(false);

  const [isSavingPesantren, setIsSavingPesantren] = useState(false);
  const [pesantrenSuccessMsg, setPesantrenSuccessMsg] = useState('');
  const [pesantrenErrorMsg, setPesantrenErrorMsg] = useState('');

  useEffect(() => {
    if (pesantren) {
      setFormDataPesantren({
        nama_pesantren: pesantren.nama_pesantren || '',
        alamat_pesantren: pesantren.alamat_pesantren || '',
        kontak: pesantren.kontak || '',
        website: pesantren.website || '',
        email: pesantren.email || '',
        nama_pengasuh: pesantren.nama_pengasuh || 'MUHAMMAD AINUN NAJIB',
        sebutan_pengasuh: pesantren.sebutan_pengasuh || 'Pengasuh',
        tulisan_arab: pesantren.tulisan_arab || 'المؤسسة التربوية الإسلامية قدسية منار قدس',
        nama_yayasan: pesantren.nama_yayasan || 'YAYASAN PENDIDIKAN ISLAM QUDSIYYAH MENARA KUDUS',
        tanggal_surat: pesantren.tanggal_surat || 'Kudus, Juli 2025',
        tempat_terbit: pesantren.tempat_terbit || 'Kudus'
      });
      setLogoPreview(pesantren.logo_path || null);
      setTulisanArabPreview(pesantren.tulisan_arab_path || null);
      setTtdPreview(pesantren.ttd_pengasuh_path || null);
      setStempelPreview(pesantren.stempel_path || null);
      setHapusTulisanArab(false);
      setHapusTtd(false);
      setHapusStempel(false);
    }
  }, [pesantren]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file logo terlalu besar! Maksimal 5 MB.');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleTulisanArabChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file kaligrafi terlalu besar! Maksimal 5 MB.');
        return;
      }
      setTulisanArabFile(file);
      setTulisanArabPreview(URL.createObjectURL(file));
      setHapusTulisanArab(false);
    }
  };

  const handleResetTulisanArab = () => {
    setTulisanArabFile(null);
    setTulisanArabPreview(null);
    setHapusTulisanArab(true);
  };

  const handleTtdChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file TTD terlalu besar! Maksimal 5 MB.');
        return;
      }
      setTtdFile(file);
      setTtdPreview(URL.createObjectURL(file));
      setHapusTtd(false);
    }
  };

  const handleStempelChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file stempel terlalu besar! Maksimal 5 MB.');
        return;
      }
      setStempelFile(file);
      setStempelPreview(URL.createObjectURL(file));
      setHapusStempel(false);
    }
  };

  const handleResetTtd = () => {
    setTtdFile(null);
    setTtdPreview(null);
    setHapusTtd(true);
  };

  const handleResetStempel = () => {
    setStempelFile(null);
    setStempelPreview(null);
    setHapusStempel(true);
  };

  const handleSetCurrentDate = () => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const d = new Date();
    const kota = formDataPesantren.tempat_terbit || 'Kudus';
    const formatted = `${kota}, ${months[d.getMonth()]} ${d.getFullYear()}`;
    setFormDataPesantren(prev => ({ ...prev, tanggal_surat: formatted }));
  };

  const handleSavePesantren = async (e) => {
    e.preventDefault();
    setIsSavingPesantren(true);
    setPesantrenSuccessMsg('');
    setPesantrenErrorMsg('');

    try {
      const data = new FormData();
      Object.keys(formDataPesantren).forEach((k) => data.append(k, formDataPesantren[k] || ''));

      if (logoFile) {
        data.append('logo', logoFile);
      }
      if (tulisanArabFile) {
        data.append('tulisan_arab_img', tulisanArabFile);
      }
      if (ttdFile) {
        data.append('ttd_pengasuh', ttdFile);
      }
      if (stempelFile) {
        data.append('stempel', stempelFile);
      }
      if (hapusTulisanArab) {
        data.append('hapus_tulisan_arab_img', 'true');
      }
      if (hapusTtd) {
        data.append('hapus_ttd', 'true');
      }
      if (hapusStempel) {
        data.append('hapus_stempel', 'true');
      }

      const res = await fetch('/api/settings/pesantren', {
        method: 'PUT',
        body: data
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menyimpan profil pesantren.');
      }

      onUpdatePesantren(json.data);
      setPesantrenSuccessMsg('Profil pesantren dan pengesahan kartu berhasil disimpan dan diperbarui!');
      setTimeout(() => setPesantrenSuccessMsg(''), 4000);
    } catch (error) {
      setPesantrenErrorMsg(error.message);
      setTimeout(() => setPesantrenErrorMsg(''), 5000);
    } finally {
      setIsSavingPesantren(false);
    }
  };

  /* ============================================================
     TAB MASTER DATA: JENJANG, KELAS, KAMAR, ROMBEL, PROGRAM
     ============================================================ */
  const [masterData, setMasterData] = useState({
    jenjang: [],
    kelas: [],
    rombel: [],
    program: [],
    kamar: []
  });
  const [activeAddMap, setActiveAddMap] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [isSavingOption, setIsSavingOption] = useState(false);
  const [masterToast, setMasterToast] = useState(null);

  const showMasterToast = (message, type = 'success') => {
    setMasterToast({ message, type });
    setTimeout(() => setMasterToast(null), 3500);
  };

  const fetchMasterData = async () => {
    try {
      const res = await fetch('/api/settings/master-options');
      const json = await res.json();
      if (json.success && json.data) {
        setMasterData(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch master data', e);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const handleToggleAdd = (catId) => {
    setActiveAddMap((prev) => {
      const nextState = !prev[catId];
      if (nextState) {
        setTimeout(() => {
          const el = document.getElementById(`input-master-${catId}`);
          if (el) {
            el.focus();
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 50);
      }
      return { ...prev, [catId]: nextState };
    });
  };

  const handleCancelAdd = (catId) => {
    setActiveAddMap((prev) => ({ ...prev, [catId]: false }));
    setInputValues((prev) => ({ ...prev, [catId]: '' }));
  };

  const [editingMap, setEditingMap] = useState({});

  const handleStartEdit = (catId, item) => {
    setEditingMap((prev) => ({
      ...prev,
      [catId]: {
        id: item.id,
        value: item.label || item.value,
        originalValue: item.label || item.value
      }
    }));
    setTimeout(() => {
      const el = document.getElementById(`input-edit-master-${item.id}`);
      if (el) {
        el.focus();
        el.select();
      }
    }, 50);
  };

  const handleCancelEdit = (catId) => {
    setEditingMap((prev) => {
      const next = { ...prev };
      delete next[catId];
      return next;
    });
  };

  const handleSaveEdit = async (e, catId, catName) => {
    if (e) e.preventDefault();
    const editState = editingMap[catId];
    if (!editState) return;

    const val = (editState.value || '').trim();
    if (!val) {
      showMasterToast(`Nama data untuk ${catName} tidak boleh kosong!`, 'error');
      return;
    }

    if (val === editState.originalValue) {
      handleCancelEdit(catId);
      return;
    }

    try {
      setIsSavingOption(true);
      const res = await fetch(`/api/settings/master-options/${editState.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: val,
          label: val
        })
      });
      const json = await res.json();
      if (json.success) {
        showMasterToast(`Data ${catName} berhasil diubah menjadi "${val}".`);
        handleCancelEdit(catId);
        fetchMasterData();
      } else {
        showMasterToast(json.message || 'Gagal mengubah data pilihan.', 'error');
      }
    } catch (err) {
      showMasterToast('Gagal menghubungi server: ' + err.message, 'error');
    } finally {
      setIsSavingOption(false);
    }
  };

  const handleSaveInlineOption = async (e, catId, catName) => {
    if (e) e.preventDefault();
    const val = (inputValues[catId] || '').trim();
    if (!val) {
      showMasterToast(`Nama data untuk ${catName} tidak boleh kosong!`, 'error');
      return;
    }

    try {
      setIsSavingOption(true);
      const res = await fetch('/api/settings/master-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: catId,
          value: val,
          label: val
        })
      });
      const json = await res.json();
      if (json.success) {
        showMasterToast(`Data "${val}" berhasil ditambahkan ke ${catName}.`);
        setInputValues((prev) => ({ ...prev, [catId]: '' }));
        fetchMasterData();
        // Keep input open and auto-focused at bottom for rapid consecutive entry
        setTimeout(() => {
          const el = document.getElementById(`input-master-${catId}`);
          if (el) {
            el.focus();
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 80);
      } else {
        showMasterToast(json.message || 'Gagal menambahkan data pilihan.', 'error');
      }
    } catch (err) {
      showMasterToast('Gagal menghubungi server: ' + err.message, 'error');
    } finally {
      setIsSavingOption(false);
    }
  };

  const handleDeleteOptionSubmit = async (item) => {
    if (!window.confirm(`Hapus pilihan "${item.label || item.value}" dari database?`)) return;

    try {
      const res = await fetch(`/api/settings/master-options/${item.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showMasterToast(`Pilihan "${item.label || item.value}" berhasil dihapus.`);
        fetchMasterData();
      } else {
        showMasterToast(json.message || 'Gagal menghapus.', 'error');
      }
    } catch (err) {
      showMasterToast('Gagal menghapus: ' + err.message, 'error');
    }
  };

  /* ============================================================
     TAB 2: DATA AKUN & HAK AKSES PENGGUNA
     ============================================================ */
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Modal State: Create User
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    nama: '',
    username: '',
    password: '',
    role: 'tu'
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [createError, setCreateError] = useState('');
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Modal State: Edit User
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    nama: '',
    role: 'tu',
    newPassword: ''
  });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editError, setEditError] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Modal State: Delete Confirm
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Global user feedback toast
  const [accountToast, setAccountToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setAccountToast({ message, type });
    setTimeout(() => setAccountToast(null), 4000);
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch('/api/auth/users');
      const json = await res.json();
      if (json.success) {
        setUsers(json.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
      showToast('Gagal memuat data akun pengguna', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'akun' || masterSection === 'akun') {
      fetchUsers();
    }
  }, [activeTab, masterSection]);

  // Handle Create User Submit
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!createForm.nama.trim() || !createForm.username.trim() || !createForm.password.trim()) {
      setCreateError('Semua kolom wajib diisi!');
      return;
    }

    if (createForm.password.trim().length < 4) {
      setCreateError('Password minimal 4 karakter!');
      return;
    }

    try {
      setIsSubmittingCreate(true);
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: createForm.nama.trim(),
          username: createForm.username.trim(),
          password: createForm.password.trim(),
          role: createForm.role
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menambahkan akun.');
      }

      setIsCreateModalOpen(false);
      setCreateForm({ nama: '', username: '', password: '', role: 'tu' });
      showToast(`Akun "${json.data.username}" berhasil dibuat!`, 'success');
      fetchUsers();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setUserToEdit(user);
    setEditForm({
      nama: user.nama,
      role: user.role,
      newPassword: ''
    });
    setEditError('');
    setShowEditPassword(false);
    setIsEditModalOpen(true);
  };

  // Handle Edit User Submit
  const handleEditUser = async (e) => {
    e.preventDefault();
    setEditError('');

    if (!editForm.nama.trim()) {
      setEditError('Nama lengkap tidak boleh kosong!');
      return;
    }

    if (editForm.newPassword && editForm.newPassword.trim().length < 4) {
      setEditError('Password baru minimal 4 karakter!');
      return;
    }

    try {
      setIsSubmittingEdit(true);
      const payload = {
        nama: editForm.nama.trim(),
        role: editForm.role
      };
      if (editForm.newPassword.trim()) {
        payload.password = editForm.newPassword.trim();
      }

      const res = await fetch(`/api/auth/users/${userToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal memperbarui data akun.');
      }

      setIsEditModalOpen(false);
      showToast(`Akun "${userToEdit.username}" berhasil diperbarui!`, 'success');
      fetchUsers();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeletingUser(true);
      const res = await fetch(`/api/auth/users/${userToDelete.id}`, {
        method: 'DELETE'
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal menghapus pengguna.');
      }

      showToast(`Akun "${userToDelete.username}" berhasil dihapus.`, 'success');
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeletingUser(false);
    }
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.nama.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchSearch && matchRole;
  });

  const roleMeta = {
    admin: {
      label: 'Administrator',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      badgeColor: 'bg-amber-400 text-teal-950 font-bold',
      desc: 'Akses penuh ke semua modul, konfigurasi, profil, dan backup database.',
      icon: Crown
    },
    tu: {
      label: 'Tata Usaha',
      color: 'bg-sky-50 text-sky-800 border-sky-300',
      badgeColor: 'bg-sky-100 text-sky-900 font-semibold',
      desc: 'Akses operasional seperti admin (Beranda, Data Santri lengkap, Generator & Desain Kartu), tanpa menu Pengaturan dan Backup & Restore.',
      icon: FileText
    },
    kesehatan: {
      label: 'Perawat',
      color: 'bg-rose-50 text-rose-800 border-rose-300',
      badgeColor: 'bg-rose-100 text-rose-900 font-semibold',
      desc: 'Akses data santri dan layanan cetak kolektif santri berobat untuk faskes.',
      icon: ShieldCheck
    }
  };

  const totalAdmin = users.filter((u) => u.role === 'admin').length;
  const totalTU = users.filter((u) => u.role === 'tu').length;
  const totalKesehatan = users.filter((u) => u.role === 'kesehatan').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Header Banner with Tosca Theme */}
      <PageHeaderBanner
        title={activeTab === 'pesantren' ? 'Profil Pondok Pesantren' : 'Master Data'}
        subtitle={
          activeTab === 'pesantren'
            ? 'Kelola identitas lembaga, kop kartu, serta legalitas tanda tangan & stempel pondok pesantren'
            : 'Pusat master data: referensi pilihan santri, manajemen akun pengguna, dan informasi sistem'
        }
      />

      {/* ============================================================
          PROFIL PONDOK PESANTREN
          ============================================================ */}
      {activeTab === 'pesantren' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {pesantrenSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{pesantrenSuccessMsg}</span>
            </div>
          )}

          {pesantrenErrorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{pesantrenErrorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column (8 cols) */}
            <form onSubmit={handleSavePesantren} className="lg:col-span-8 bg-white rounded-2xl border border-teal-200/80 shadow-xs p-6 space-y-6">
              
              {/* SECTION 1: IDENTITAS LEMBAGA */}
              <div className="space-y-4">
                <div className="border-b border-teal-100/60 pb-3">
                  <h3 className="font-semibold text-teal-900 text-sm">
                    Identitas Lembaga
                  </h3>
                </div>

                {/* Logo Upload Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-xl bg-teal-50/20 border border-teal-200/80">
                  <div className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-teal-300 hover:border-teal-500 bg-white flex items-center justify-center overflow-hidden cursor-pointer group shrink-0 shadow-2xs">
                    <img
                      src={logoPreview || pesantren?.logo_path || '/logo-qudsiyyah.png'}
                      alt="Logo Pondok Pesantren"
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Klik untuk memilih logo baru"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <h4 className="text-xs font-medium text-teal-950">
                      <span>Logo</span>
                    </h4>
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-teal-300 bg-white text-teal-900 text-xs font-medium hover:bg-teal-50 transition cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-teal-600" />
                      <span>Unggah</span>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Tulisan Arab & Nama Yayasan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-slate-700">
                        Tulisan Arab Yayasan
                      </label>
                      {tulisanArabPreview && (
                        <button
                          type="button"
                          onClick={handleResetTulisanArab}
                          className="text-[11px] font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 transition cursor-pointer"
                          title="Hapus gambar kaligrafi kustom"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    <div className="relative flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-teal-200/80 bg-teal-50/20 min-h-[42px] transition hover:border-teal-400">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {tulisanArabPreview ? (
                          <img
                            src={tulisanArabPreview}
                            alt="Kaligrafi Arab"
                            className="h-7 max-w-[140px] sm:max-w-[170px] object-contain rounded bg-white px-2 py-0.5 border border-teal-200/70 shadow-2xs"
                          />
                        ) : (
                          <span className="text-xs text-slate-700 font-serif font-normal truncate">
                            {formDataPesantren.tulisan_arab || 'المؤسسة التربوية الإسلامية قدسية منار قدس'}
                          </span>
                        )}
                      </div>

                      <label className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-300 bg-white hover:bg-teal-50 text-teal-900 text-xs font-medium cursor-pointer transition shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-teal-600" />
                        <span>Unggah</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleTulisanArabChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Nama Yayasan
                    </label>
                    <input
                      type="text"
                      value={formDataPesantren.nama_yayasan}
                      onChange={(e) => setFormDataPesantren({ ...formDataPesantren, nama_yayasan: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-hidden font-normal text-slate-800 text-xs uppercase tracking-tight transition min-h-[42px]"
                      placeholder="YAYASAN PENDIDIKAN ISLAM QUDSIYYAH MENARA KUDUS"
                    />
                  </div>
                </div>

                {/* Nama Pondok Pesantren */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Nama Pondok Pesantren <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formDataPesantren.nama_pesantren}
                    onChange={(e) => setFormDataPesantren({ ...formDataPesantren, nama_pesantren: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-hidden font-normal text-slate-800 text-xs transition min-h-[42px]"
                    placeholder="Contoh: Pondok Pesantren Qudsiyyah Putri"
                  />
                </div>

                {/* Alamat Lengkap Pesantren */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Alamat Lengkap Pesantren
                  </label>
                  <textarea
                    rows={2}
                    value={formDataPesantren.alamat_pesantren}
                    onChange={(e) => setFormDataPesantren({ ...formDataPesantren, alamat_pesantren: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-hidden font-normal text-slate-800 text-xs transition"
                    placeholder="Jl. Lambao No. 1 Singocandi Kota Kudus, Telp. (0291) 2912874 - email : qudsiyyahputri@gmail.com"
                  />
                </div>

                {/* Kontak & Website */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Telp.
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={formDataPesantren.kontak}
                        onChange={(e) => setFormDataPesantren({ ...formDataPesantren, kontak: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-hidden font-normal text-xs text-slate-800 transition min-h-[42px]"
                        placeholder="Telp: (0291) 2912874"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Alamat Website
                    </label>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={formDataPesantren.website}
                        onChange={(e) => setFormDataPesantren({ ...formDataPesantren, website: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-hidden font-normal text-xs text-slate-800 transition min-h-[42px]"
                        placeholder="www.qudsiyyahputri.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      value={formDataPesantren.email}
                      onChange={(e) => setFormDataPesantren({ ...formDataPesantren, email: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-hidden font-normal text-xs text-slate-800 transition min-h-[42px]"
                      placeholder="qudsiyyahputri@gmail.com"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PENGESAHAN KARTU */}
              <div className="pt-6 border-t border-teal-100 space-y-4">
                <div className="border-b border-teal-100/60 pb-3">
                  <h3 className="font-semibold text-teal-900 text-sm">
                    Pengesahan Kartu
                  </h3>
                </div>

                {/* Tanggal Dikeluarkannya Kartu */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Tanggal Dikeluarkannya Kartu
                  </label>
                  <input
                    type="text"
                    value={formDataPesantren.tanggal_surat}
                    onChange={(e) => setFormDataPesantren({ ...formDataPesantren, tanggal_surat: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-hidden font-normal text-xs text-slate-800 min-h-[42px] transition"
                    placeholder="Contoh: Kudus, Oktober 2026"
                  />
                </div>

                {/* Nama Pengasuh & Jabatan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Nama Pengasuh
                    </label>
                    <input
                      type="text"
                      value={formDataPesantren.nama_pengasuh}
                      onChange={(e) => setFormDataPesantren({ ...formDataPesantren, nama_pengasuh: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-hidden font-normal text-xs text-slate-800 min-h-[42px] transition"
                      placeholder="MUHAMMAD AINUN NAJIB"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Jabatan
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Pengasuh"
                      value={formDataPesantren.sebutan_pengasuh}
                      onChange={(e) => setFormDataPesantren({ ...formDataPesantren, sebutan_pengasuh: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200/80 bg-teal-50/20 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-hidden font-normal text-xs text-slate-800 min-h-[42px] transition"
                    />
                  </div>
                </div>

                {/* Dual Upload Box: TTD Pengasuh & Stempel Pondok */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Upload TTD Pengasuh */}
                  <div className="p-4 rounded-xl border border-teal-200/80 bg-teal-50/20 space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between min-h-[22px]">
                      <span className="text-xs font-medium text-teal-950 flex items-center gap-1.5">
                        <Edit className="w-3.5 h-3.5 text-teal-700" />
                        <span>TTD Pengasuh</span>
                      </span>
                      {ttdPreview && (
                        <button
                          type="button"
                          onClick={handleResetTtd}
                          className="text-[11px] font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 transition cursor-pointer"
                          title="Hapus tanda tangan"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>

                    <div className="h-20 rounded-xl border border-dashed border-teal-300 bg-white flex items-center justify-center p-2 relative overflow-hidden group">
                      {ttdPreview ? (
                        <img
                          src={ttdPreview}
                          alt="TTD Pengasuh"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-slate-400 font-normal">PNG</span>
                      )}
                    </div>

                    <label className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-teal-300 bg-white text-teal-900 text-xs font-medium hover:bg-teal-50 transition cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-teal-600" />
                      <span>Unggah</span>
                      <input type="file" accept="image/*" onChange={handleTtdChange} className="hidden" />
                    </label>
                  </div>

                  {/* Upload Stempel Pondok */}
                  <div className="p-4 rounded-xl border border-teal-200/80 bg-teal-50/20 space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between min-h-[22px]">
                      <span className="text-xs font-medium text-teal-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                        <span>Stempel Pondok</span>
                      </span>
                      {stempelPreview && (
                        <button
                          type="button"
                          onClick={handleResetStempel}
                          className="text-[11px] font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 transition cursor-pointer"
                          title="Hapus stempel"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>

                    <div className="h-20 rounded-xl border border-dashed border-teal-300 bg-white flex items-center justify-center p-2 relative overflow-hidden group">
                      {stempelPreview ? (
                        <img
                          src={stempelPreview}
                          alt="Stempel Pondok"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-slate-400 font-normal">PNG</span>
                      )}
                    </div>

                    <label className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-teal-300 bg-white text-teal-900 text-xs font-medium hover:bg-teal-50 transition cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-teal-600" />
                      <span>Unggah</span>
                      <input type="file" accept="image/*" onChange={handleStempelChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-teal-100/60 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingPesantren}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-xs border border-teal-500 transition disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#20E2D7]" />
                  <span>{isSavingPesantren ? 'Menyimpan...' : 'Simpan Profil & Pengesahan'}</span>
                </button>
              </div>
            </form>

            {/* Live Card Synchronized Preview (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Kop Preview Card */}
              <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs p-5 space-y-4">
                <div className="border-b border-teal-100/60 pb-2">
                  <h4 className="font-semibold text-teal-900 text-xs uppercase tracking-wider flex items-center justify-between">
                    <span>Pratinjau Kop Kartu</span>
                    <span className="text-[10px] text-teal-600 font-medium lowercase">live preview</span>
                  </h4>
                </div>

                {/* Kop Preview Box */}
                <div className="rounded-xl overflow-hidden border border-emerald-300 bg-white text-slate-900 p-2.5 shadow-xs">
                  <div className="border-b border-emerald-600/20 pb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                        <img
                          src={logoPreview || pesantren?.logo_path || '/logo-qudsiyyah.png'}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1 leading-tight text-center">
                        {tulisanArabPreview ? (
                          <img
                            src={tulisanArabPreview}
                            alt="Kaligrafi Yayasan"
                            className="h-3.5 max-w-[180px] object-contain mx-auto mb-0.5"
                          />
                        ) : (
                          <p className="text-[9px] font-bold text-slate-800 leading-none font-serif">
                            {formDataPesantren.tulisan_arab || 'المؤسسة التربوية الإسلامية قدسية منار قدس'}
                          </p>
                        )}
                        <h4 className="font-franklin text-[7.5px] font-bold uppercase tracking-tight text-slate-800 leading-tight mt-0.5 whitespace-nowrap overflow-hidden">
                          {formDataPesantren.nama_yayasan || 'YAYASAN PENDIDIKAN ISLAM QUDSIYYAH MENARA KUDUS'}
                        </h4>
                        <h3 className="font-bookman text-[11px] font-bold uppercase tracking-tight text-slate-900 leading-tight mt-0.5 whitespace-nowrap overflow-hidden">
                          {formDataPesantren.nama_pesantren || 'PONDOK PESANTREN QUDSIYYAH PUTRI'}
                        </h3>
                      </div>
                    </div>
                    {/* Alamat diperbesar sedikit membentang sampai di bawah logo */}
                    <p className="font-franklin text-[6px] text-slate-600 font-medium leading-none tracking-tight text-center whitespace-nowrap overflow-hidden mt-1">
                      {formDataPesantren.alamat_pesantren || 'Alamat Pesantren Belum Diatur'}
                    </p>
                  </div>
                </div>

                {/* Pengesahan Live Preview Box */}
                <div className="border-t border-teal-100/60 pt-3">
                  <h4 className="font-semibold text-teal-900 text-xs uppercase tracking-wider mb-2">
                    Pratinjau Pengesahan Kartu
                  </h4>

                  <div className="p-3 rounded-xl border border-emerald-200 bg-[#f7fcf9] text-left flex flex-col items-start">
                    <p className="text-[8px] font-medium text-slate-800 leading-tight">
                      {formDataPesantren.tanggal_surat || 'Kudus, Juli 2025'}
                    </p>
                    <p className="text-[8px] font-medium text-slate-800 leading-tight">
                      {formDataPesantren.sebutan_pengasuh || 'Pengasuh'}
                    </p>

                    {/* Stamp & Signature Box (spasi dipersempit agar pas & tidak terlalu besar) */}
                    <div className="relative h-5 w-28 flex items-center justify-start my-0.5">
                      {/* Stempel */}
                      {stempelPreview && (
                        <div className="absolute left-7 -top-2.5 z-0 pointer-events-none">
                          <img
                            src={stempelPreview}
                            alt="Stempel"
                            className="w-9 h-9 object-contain drop-shadow-2xs opacity-85"
                            style={{ transform: 'rotate(-5deg)' }}
                          />
                        </div>
                      )}

                      {/* TTD */}
                      {ttdPreview && (
                        <div className="relative z-10 -ml-0.5">
                          <img
                            src={ttdPreview}
                            alt="TTD"
                            className="max-h-5 max-w-[65px] object-contain"
                          />
                        </div>
                      )}
                    </div>

                    <p className="text-[8.5px] font-bold uppercase text-slate-900 tracking-wide leading-none mt-0.5">
                      {formDataPesantren.nama_pengasuh || 'MUHAMMAD AINUN NAJIB'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: MASTER DATA (DATA PILIHAN, AKUN PENGGUNA, INFORMASI SISTEM)
          ============================================================ */}
      {activeTab === 'master' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sub-menu Navigation Pills for Master Data */}
          <div className="bg-white rounded-2xl border border-teal-200/80 p-1.5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setMasterSection('pilihan')}
              className={`w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer touch-manipulation active:scale-[0.99] ${
                masterSection === 'pilihan'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-teal-900 hover:bg-teal-50/60'
              }`}
            >
              <span>Data Pilihan (Kelas, Kamar, dll)</span>
            </button>

            <button
              type="button"
              onClick={() => setMasterSection('akun')}
              className={`w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer touch-manipulation active:scale-[0.99] ${
                masterSection === 'akun'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-teal-900 hover:bg-teal-50/60'
              }`}
            >
              <span>Data Akun & Hak Akses</span>
            </button>

            <button
              type="button"
              onClick={() => setMasterSection('sistem')}
              className={`w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer touch-manipulation active:scale-[0.99] ${
                masterSection === 'sistem'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-teal-900 hover:bg-teal-50/60'
              }`}
            >
              <span>Informasi Sistem & Jaringan</span>
            </button>
          </div>

          {/* ==================== SUB-SECTION 1: DATA PILIHAN ==================== */}
          {masterSection === 'pilihan' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {masterToast && (
                <div
                  className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in ${
                    masterToast.type === 'error'
                      ? 'bg-rose-50 border border-rose-200 text-rose-900'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  }`}
                >
                  {masterToast.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span>{masterToast.message}</span>
                </div>
              )}

              {/* Action Bar / Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-teal-100/60">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-teal-950">Master Data Pilihan</h2>
                  <p className="text-xs text-slate-500 font-normal">
                    Kelola data pilihan untuk jenjang pendidikan, program, asrama, kelas, dan ruang dalam satu tampilan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchMasterData}
                  className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-white hover:bg-teal-50 text-teal-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
                  title="Segarkan semua data master"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Segarkan Data</span>
                </button>
              </div>

              {/* Unified 1-View Grid of Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
                {MASTER_TABLES.map((table) => {
                  const items = masterData[table.id] || [];
                  const isAdding = !!activeAddMap[table.id];

                  return (
                    <div
                      key={table.id}
                      className="bg-white rounded-2xl border border-teal-200/80 shadow-xs overflow-hidden flex flex-col h-[290px] transition hover:border-teal-300"
                    >
                      {/* Table Header: Title on Top-Left, + Button on Top-Right */}
                      <div className="px-4 py-3 bg-[#E2F1ED] border-b border-[#B6E5DE] flex items-center justify-between gap-2 shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-teal-950 truncate">
                            {table.title}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleAdd(table.id)}
                          className={`inline-flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer gap-1 shrink-0 ${
                            isAdding
                              ? 'bg-teal-800 text-white'
                              : 'bg-teal-600 hover:bg-teal-700 text-white'
                          }`}
                          title={isAdding ? 'Tutup form input' : `Tambah data ${table.name}`}
                        >
                          {isAdding ? (
                            <>
                              <X className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline text-[11px] font-medium">Batal</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline text-[11px] font-medium">Tambah</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Table Structure: Model Tabel Kebawah */}
                      <div className="flex-1 overflow-x-auto overflow-y-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50/95 text-slate-600 border-b border-teal-100 sticky top-0 z-10 backdrop-blur-xs">
                            <tr className="h-[36px]">
                              <th className="px-3 w-12 text-center text-[11px] font-semibold text-slate-500">
                                No
                              </th>
                              <th className="px-3 text-[11px] font-semibold text-slate-600">
                                Nama / Pilihan
                              </th>
                              <th className="px-3 w-20 text-center text-[11px] font-semibold text-slate-500">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-teal-50/80">
                            {/* Data Rows (Tampil sesuai urutan input kronologis) */}
                            {items.map((item, idx) => {
                              const isEditing = editingMap[table.id] && editingMap[table.id].id === item.id;
                              const editState = editingMap[table.id];

                              if (isEditing) {
                                return (
                                  <tr
                                    key={item.id}
                                    className="h-[41px] bg-teal-50/90 border-y border-teal-300 animate-in fade-in duration-100"
                                  >
                                    <td className="px-3 text-center text-teal-800 font-bold text-xs font-mono">
                                      {idx + 1}
                                    </td>
                                    <td className="px-2">
                                      <form
                                        onSubmit={(e) => handleSaveEdit(e, table.id, table.name)}
                                        className="flex items-center gap-1.5"
                                      >
                                        <input
                                          id={`input-edit-master-${item.id}`}
                                          type="text"
                                          autoFocus
                                          value={editState.value}
                                          onChange={(e) => {
                                            const newVal = e.target.value;
                                            setEditingMap((prev) => ({
                                              ...prev,
                                              [table.id]: { ...prev[table.id], value: newVal }
                                            }));
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Escape') handleCancelEdit(table.id);
                                          }}
                                          placeholder={table.placeholder}
                                          className="w-full px-2.5 py-1 text-xs font-normal text-slate-900 bg-white border border-teal-400 rounded-lg outline-hidden focus:border-teal-700 focus:ring-1 focus:ring-teal-600 shadow-2xs"
                                        />
                                      </form>
                                    </td>
                                    <td className="px-2 text-center">
                                      <div className="inline-flex items-center justify-center gap-1">
                                        <button
                                          type="button"
                                          onClick={(e) => handleSaveEdit(e, table.id, table.name)}
                                          disabled={isSavingOption}
                                          className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition cursor-pointer inline-flex items-center justify-center shadow-2xs disabled:opacity-50"
                                          title="Simpan Perubahan (Enter)"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleCancelEdit(table.id)}
                                          className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer inline-flex items-center justify-center"
                                          title="Batal (Esc)"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              return (
                                <tr
                                  key={item.id}
                                  className="h-[41px] hover:bg-teal-50/40 transition group"
                                >
                                  <td className="px-3 text-center text-slate-500 text-xs font-mono">
                                    {idx + 1}
                                  </td>
                                  <td className="px-3 text-slate-800 text-xs font-medium truncate">
                                    {item.label || item.value}
                                  </td>
                                  <td className="px-2 text-center">
                                    <div className="inline-flex items-center justify-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleStartEdit(table.id, item)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition cursor-pointer inline-flex items-center justify-center"
                                        title="Ubah / edit data ini"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteOptionSubmit(item)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer inline-flex items-center justify-center"
                                        title="Hapus data ini"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}

                            {/* Inline Input Row at the BOTTOM of the table (dimasukkan dibawahnya) */}
                            {isAdding && (
                              <tr className="h-[41px] bg-teal-50/70 border-t border-teal-200 animate-in fade-in duration-150">
                                <td className="px-3 text-center text-teal-700 font-bold text-xs font-mono">
                                  {items.length + 1}
                                </td>
                                <td className="px-2">
                                  <form
                                    id={`form-add-${table.id}`}
                                    onSubmit={(e) => handleSaveInlineOption(e, table.id, table.name)}
                                    className="w-full flex items-center"
                                  >
                                    <input
                                      id={`input-master-${table.id}`}
                                      type="text"
                                      autoFocus
                                      value={inputValues[table.id] || ''}
                                      onChange={(e) =>
                                        setInputValues((prev) => ({
                                          ...prev,
                                          [table.id]: e.target.value
                                        }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') handleCancelAdd(table.id);
                                      }}
                                      placeholder={table.placeholder}
                                      className="w-full px-2.5 py-1 text-xs font-normal text-slate-800 bg-white border border-teal-300 rounded-lg outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-500 shadow-2xs"
                                    />
                                  </form>
                                </td>
                                <td className="px-2 text-center">
                                  <div className="inline-flex items-center justify-center gap-1">
                                    <button
                                      type="submit"
                                      form={`form-add-${table.id}`}
                                      disabled={isSavingOption}
                                      className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition cursor-pointer inline-flex items-center justify-center shadow-2xs disabled:opacity-50 touch-manipulation active:scale-95"
                                      title="Simpan (Enter)"
                                      aria-label="Simpan Data Baru"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCancelAdd(table.id)}
                                      className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer inline-flex items-center justify-center touch-manipulation active:scale-95"
                                      title="Batal (Esc)"
                                      aria-label="Batal"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}

                            {items.length === 0 && !isAdding && (
                              <tr>
                                <td colSpan={3} className="py-12 px-4 text-center text-slate-400 text-xs">
                                  Belum ada data {table.name.toLowerCase()}.
                                  <div className="mt-1">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdd(table.id)}
                                      className="text-teal-600 hover:text-teal-800 font-semibold text-[11px] hover:underline cursor-pointer"
                                    >
                                      + Klik tombol + di atas untuk menambah
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
        </div>
      )}

      {/* ==================== SUB-SECTION 2: DATA AKUN & HAK AKSES ==================== */}
      {masterSection === 'akun' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Toast Notification */}
          {accountToast && (
            <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in ${
              accountToast.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-900'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
            }`}>
              {accountToast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{accountToast.message}</span>
            </div>
          )}

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-teal-200/80 p-4 shadow-xs min-h-[82px] flex flex-col justify-center">
              <p className="text-xs text-slate-600 font-medium">Total Akun Pengguna</p>
              <h3 className="text-2xl font-bold text-teal-950 mt-1">{users.length}</h3>
            </div>

            <div className="bg-white rounded-2xl border border-teal-200/80 p-4 shadow-xs min-h-[82px] flex flex-col justify-center">
              <p className="text-xs text-slate-600 font-medium">Administrator</p>
              <h3 className="text-2xl font-bold text-teal-950 mt-1">{totalAdmin}</h3>
            </div>

            <div className="bg-white rounded-2xl border border-teal-200/80 p-4 shadow-xs min-h-[82px] flex flex-col justify-center">
              <p className="text-xs text-slate-600 font-medium">Tata Usaha</p>
              <h3 className="text-2xl font-bold text-teal-950 mt-1">{totalTU}</h3>
            </div>

            <div className="bg-white rounded-2xl border border-teal-200/80 p-4 shadow-xs min-h-[82px] flex flex-col justify-center">
              <p className="text-xs text-slate-600 font-medium">Perawat</p>
              <h3 className="text-2xl font-bold text-teal-950 mt-1">{totalKesehatan}</h3>
            </div>
          </div>

          {/* User Management Main Table Box */}
          <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs overflow-hidden">
            {/* Header Action Bar */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-teal-950 text-sm sm:text-base">Daftar Akun Pengguna</h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 sm:flex-initial min-w-[140px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Cari nama / username..."
                    className="h-9 pl-8 pr-3 rounded-xl border border-teal-200 text-xs bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden w-full sm:w-48 text-slate-800 font-normal"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-teal-200 text-xs bg-white text-slate-800 font-normal focus:border-teal-600 outline-hidden cursor-pointer"
                >
                  <option value="all">Semua Peran</option>
                  <option value="admin">Administrator</option>
                  <option value="tu">Tata Usaha</option>
                  <option value="kesehatan">Perawat</option>
                </select>

                {/* Refresh */}
                <button
                  type="button"
                  onClick={fetchUsers}
                  disabled={loadingUsers}
                  className="h-9 px-2.5 rounded-xl border border-teal-200 bg-white hover:bg-teal-50 text-teal-700 transition cursor-pointer flex items-center justify-center shadow-2xs"
                  title="Muat Ulang Data Akun"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
                </button>

                {/* Add User Button */}
                <button
                  type="button"
                  onClick={() => {
                    setCreateForm({ nama: '', username: '', password: '', role: 'tu' });
                    setCreateError('');
                    setShowCreatePassword(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="h-9 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center shadow-2xs transition cursor-pointer w-full sm:w-auto"
                >
                  <span>Tambah Pengguna</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-xs border-collapse">
                <thead className="bg-slate-50/95 text-slate-600 border-b border-teal-100 font-semibold text-[11px]">
                  <tr className="h-[38px]">
                    <th className="py-2 px-4 font-semibold text-slate-600">Nama Pengguna</th>
                    <th className="py-2 px-4 font-semibold text-slate-600">Username Login</th>
                    <th className="py-2 px-4 font-semibold text-slate-600">Hak Akses / Peran</th>
                    <th className="py-2 px-4 font-semibold text-slate-600">Dibuat Pada</th>
                    <th className="py-2 px-4 text-center font-semibold text-slate-600 w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-50/80">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-teal-600 mb-1" />
                        <span>Memuat daftar akun...</span>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Tidak ada akun pengguna yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const meta = roleMeta[u.role] || roleMeta.tu;
                      const RoleIcon = meta.icon;
                      const isSuperAdmin = u.username === 'admin';
                      const isCurrentUser = currentUser?.id === u.id;

                      return (
                        <tr key={u.id} className="h-[46px] hover:bg-teal-50/30 transition">
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                                {u.nama ? u.nama.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="min-w-0">
                                <span className="font-medium text-slate-900 text-xs truncate block">
                                  {u.nama}
                                </span>
                                {isCurrentUser && (
                                  <span className="text-[10px] text-teal-700 font-medium block">
                                    (Akun anda saat ini)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-4 font-mono font-medium text-teal-800 text-xs">
                            @{u.username}
                          </td>

                          <td className="py-2.5 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-teal-200 bg-teal-50/60 text-teal-900">
                              <span>{meta.label}</span>
                            </span>
                          </td>

                          <td className="py-2.5 px-4 text-slate-500 text-xs font-normal">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : '-'}
                          </td>

                          <td className="py-2.5 px-4 text-center">
                            <div className="inline-flex items-center justify-center gap-1.5">
                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => openEditModal(u)}
                                className="px-2.5 py-1 rounded-lg border border-teal-200 bg-white hover:bg-teal-50 text-teal-800 text-xs font-medium transition cursor-pointer"
                                title="Edit Akun & Ganti Password"
                              >
                                <span>Edit</span>
                              </button>

                              {/* Delete Button */}
                              {!isSuperAdmin && !isCurrentUser ? (
                                <button
                                  type="button"
                                  onClick={() => setUserToDelete(u)}
                                  className="px-2.5 py-1 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-medium transition cursor-pointer inline-flex items-center justify-center"
                                  title="Hapus Akun Pengguna"
                                >
                                  <span>Hapus</span>
                                </button>
                              ) : (
                                <span
                                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-300 text-xs font-medium cursor-not-allowed inline-flex items-center justify-center"
                                  title={isSuperAdmin ? "Akun admin utama tidak boleh dihapus" : "Tidak bisa menghapus akun yang sedang dipakai"}
                                >
                                  <span>Hapus</span>
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-SECTION 3: INFORMASI SISTEM & JARINGAN ==================== */}
      {masterSection === 'sistem' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Server & Database Info */}
            <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs p-6 space-y-4">
              <div className="border-b border-teal-100/60 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-teal-900 text-base">Status Sistem & Basis Data</h3>
                  <p className="text-xs text-slate-500 font-normal">Arsitektur aplikasi dan penyimpanan lokal</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Versi Aplikasi</span>
                  <span className="font-mono font-bold text-teal-900">v1.0.0 (SIM Pesantren)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Runtime Server</span>
                  <span className="font-mono text-slate-800">Node.js (Express.js)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Database Mesin</span>
                  <span className="font-mono text-slate-800">SQLite (better-sqlite3, WAL mode)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Lokasi Database</span>
                  <span className="font-mono text-slate-800">server/data/pesantren.db</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Port Server Aktif</span>
                  <span className="font-mono font-bold text-amber-600">5000</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('backup')}
                  className="w-full py-2.5 px-4 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100/60 text-teal-900 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Database className="w-4 h-4 text-teal-700" />
                  <span>Buka Menu Backup & Restore Database</span>
                </button>
              </div>
            </div>

            {/* LAN Network Guide Card */}
            <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs p-6 space-y-4">
              <div className="border-b border-teal-100/60 pb-3">
                <h3 className="font-bold text-teal-900 text-base">Akses Jaringan Wi-Fi / LAN</h3>
                <p className="text-xs text-slate-500 font-normal">Akses aplikasi bersama dari laptop staf lain</p>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/80 space-y-2.5 text-xs text-teal-900">
                <p className="font-semibold text-teal-950">Cara menghubungkan laptop/komputer staf lain:</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 text-[11.5px] leading-relaxed">
                  <li>Pastikan semua laptop terhubung ke jaringan Wi-Fi atau kabel LAN yang sama di kantor pesantren.</li>
                  <li>Buka Command Prompt di komputer server utama, ketik: <code className="px-1.5 py-0.5 rounded-sm bg-teal-100 font-mono text-teal-900 font-bold">ipconfig</code>.</li>
                  <li>Cari baris <strong>IPv4 Address</strong> (contoh: <code className="font-mono text-amber-700 font-bold">192.168.1.50</code>).</li>
                  <li>Buka browser di laptop staf lain dan ketik: <code className="px-1.5 py-0.5 rounded-sm bg-teal-100 font-mono text-teal-900 font-bold">http://192.168.1.50:5000/</code></li>
                </ol>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('desain')}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#20E2D7]/60 bg-teal-50 hover:bg-teal-100/70 text-teal-950 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-[#0d9488]" />
                  <span>Kustomisasi Background & Desain Kartu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      )}

      {/* ============================================================
          MODAL 1: TAMBAH PENGGUNA BARU
          ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-teal-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-teal-100 bg-[#094B44] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Tambah Pengguna Baru</h3>
                <p className="text-[11px] text-teal-100 font-normal">Buat akun untuk staf atau pengurus</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-teal-200 hover:text-white transition cursor-pointer text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-4 text-xs">
              {createError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-teal-900 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ustazah Nurul Hidayah"
                  value={createForm.nama}
                  onChange={(e) => setCreateForm({ ...createForm, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-teal-900 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: nurul_tu (huruf kecil tanpa spasi)"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({ ...createForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden font-mono font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-teal-900 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 4 karakter"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden font-mono text-slate-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCreatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-teal-900 mb-1">
                  Peran
                </label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 bg-white font-medium text-slate-800 focus:border-teal-600 outline-hidden cursor-pointer"
                >
                  <option value="admin">Admin</option>
                  <option value="tu">Tata Usaha</option>
                  <option value="kesehatan">Perawat</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition flex items-center gap-1.5 shadow-2xs border border-[#20E2D7]/50 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-[#20E2D7]" />
                  <span>{isSubmittingCreate ? 'Menyimpan...' : 'Buat Akun'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: EDIT AKUN & RESET PASSWORD
          ============================================================ */}
      {isEditModalOpen && userToEdit && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-teal-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-teal-100 bg-[#094B44] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Edit Akun Pengguna</h3>
                <p className="text-[11px] text-teal-100 font-normal">Perbarui nama, peran, atau ubah password</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-teal-200 hover:text-white transition cursor-pointer text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-5 space-y-4 text-xs">
              {editError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-teal-900 mb-1">Username</label>
                <input
                  type="text"
                  disabled
                  value={`@${userToEdit.username}`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-mono text-slate-500 cursor-not-allowed font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Username bersifat unik dan tidak dapat diubah.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-teal-900 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editForm.nama}
                  onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 bg-teal-50/20 focus:bg-white focus:border-teal-600 outline-hidden font-medium text-slate-800"
                />
              </div>

              {/* Role Select (Locked for default admin) */}
              <div>
                <label className="block font-semibold text-teal-900 mb-1">Peran</label>
                {userToEdit.username === 'admin' ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                    <span>Admin Utama (Peran Terkunci)</span>
                  </div>
                ) : (
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200 bg-white font-medium text-slate-800 focus:border-teal-600 outline-hidden cursor-pointer"
                  >
                    <option value="admin">Admin</option>
                    <option value="tu">Tata Usaha</option>
                    <option value="kesehatan">Perawat</option>
                  </select>
                )}
              </div>

              {/* Optional Password Reset */}
              <div className="p-3.5 rounded-xl bg-teal-50/40 border border-teal-100 space-y-2">
                <label className="block font-semibold text-teal-900">
                  Ganti Password (Opsional)
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    placeholder="Kosongkan jika password tidak diubah"
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-200 bg-white focus:border-teal-600 outline-hidden font-mono text-slate-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10.5px] text-slate-500 block">
                  Isi hanya bila anda ingin mereset/mengganti password akun ini.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition flex items-center gap-1.5 shadow-2xs border border-[#20E2D7]/50 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-[#20E2D7]" />
                  <span>{isSubmittingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: KONFIRMASI HAPUS PENGGUNA
          ============================================================ */}
      {userToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-rose-200 shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Hapus Akun Pengguna?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah anda yakin ingin menghapus akun <strong>{userToDelete.nama}</strong> (@{userToDelete.username})?
                Akun ini tidak akan dapat login lagi.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeletingUser}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingUser ? 'Menghapus...' : 'Ya, Hapus Akun'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pengaturan;
