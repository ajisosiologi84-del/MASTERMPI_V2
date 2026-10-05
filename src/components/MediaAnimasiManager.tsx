import React, { useState } from 'react';
import { MediaItem, MediaType, AnimasiConfig, TabelData } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  FileText, 
  Table as TableIcon, 
  Music, 
  Video, 
  Sparkles, 
  Upload, 
  Play, 
  Pause, 
  Check, 
  X, 
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { parseVideoUrl } from '../utils/videoHelper';
import { sound } from '../utils/audio';
import { ConfirmDialog } from './ConfirmDialog';
import { 
  OPSI_ANIMASI_MASUK, 
  OPSI_ANIMASI_INTERAKSI, 
  OPSI_KECEPATAN_ANIMASI, 
  getAnimationClasses 
} from '../utils/animationHelper';

interface MediaAnimasiManagerProps {
  titleLabel: string;
  mediaList?: MediaItem[];
  animasi?: AnimasiConfig;
  onUpdateMediaList: (list: MediaItem[]) => void;
  onUpdateAnimasi: (anim: AnimasiConfig) => void;
}

const DEFAULT_ANIMASI: AnimasiConfig = { masuk: 'none', interaksi: 'none', kecepatan: 'normal' };

export const MediaAnimasiManager: React.FC<MediaAnimasiManagerProps> = ({
  titleLabel,
  mediaList = [],
  animasi = DEFAULT_ANIMASI,
  onUpdateMediaList,
  onUpdateAnimasi
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [deleteTargetMedia, setDeleteTargetMedia] = useState<MediaItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Form states for creating/editing a media item
  const [formTipe, setFormTipe] = useState<MediaType>('gambar');
  const [formJudul, setFormJudul] = useState('');
  const [formKeterangan, setFormKeterangan] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formPosisi, setFormPosisi] = useState<'atas' | 'bawah'>('atas');
  const [isUploading, setIsUploading] = useState(false);

  // Form states for custom table
  const [tableHeaders, setTableHeaders] = useState<string[]>(['No', 'Klasifikasi', 'Karakteristik']);
  const [tableRows, setTableRows] = useState<string[][]>([
    ['1', 'Kelompok Primer', 'Hubungan intim, tatap muka langsung, langgeng'],
    ['2', 'Kelompok Sekunder', 'Formal, kontraktual, berorientasi tujuan']
  ]);

  // Audio test playback state in modal
  const [testPlaying, setTestPlaying] = useState(false);
  const [animationTestKey, setAnimationTestKey] = useState(0);

  // Open modal for NEW media
  const handleOpenAddMedia = (tipeDefault: MediaType = 'gambar') => {
    sound.playClick();
    setFormTipe(tipeDefault);
    setFormJudul('');
    setFormKeterangan('');
    setFormUrl('');
    setFormPosisi('atas');
    setEditingMedia(null);
    setFormError(null);

    if (tipeDefault === 'tabel') {
      setTableHeaders(['No', 'Aspek / Dimensi', 'Uraian Konsep']);
      setTableRows([
        ['1', 'Dasar Pembentukan', 'Faktor kepentingan, garis darah, atau teritorial'],
        ['2', 'Karakteristik Hubungan', 'Pola komunikasi timbal balik berulang']
      ]);
    }

    setShowAddMediaModal(true);
  };

  // Open modal for EDITING media
  const handleOpenEditMedia = (item: MediaItem) => {
    sound.playClick();
    setEditingMedia(item);
    setFormTipe(item.tipe);
    setFormJudul(item.judul);
    setFormKeterangan(item.keterangan || '');
    setFormUrl(item.url || '');
    setFormPosisi(item.posisi || 'atas');
    setFormError(null);

    if (item.tipe === 'tabel' && item.tabelData) {
      setTableHeaders(item.tabelData.headers);
      setTableRows(item.tabelData.rows);
    }

    setShowAddMediaModal(true);
  };

  // Handle local file processing (Gambar / Infografis / Audio / Video) via FileReader Base64
  const processUploadedFile = (file: File) => {
    sound.playClick();
    setFormError(null);

    // Limit check (20MB max to protect browser memory)
    if (file.size > 20 * 1024 * 1024) {
      setFormError('Ukuran berkas melebihi 20MB. Disarankan mengompres media/video agar MPI cepat dan tidak memberatkan browser.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setIsUploading(false);
      const result = loadEvt.target?.result as string;
      setFormUrl(result);
      if (!formJudul || !formJudul.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
        setFormJudul(cleanName);
      }
      sound.playSuccess();
    };
    reader.onerror = () => {
      setIsUploading(false);
      setFormError('Gagal membaca berkas. Silakan coba berkas lain.');
      sound.playError();
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Save (Create or Update) Media
  const handleSaveMedia = () => {
    // Determine title automatically if left empty by user
    let finalJudul = formJudul.trim();
    if (!finalJudul) {
      if (formTipe === 'gambar') finalJudul = 'Foto / Gambar Visual Sosiologi';
      else if (formTipe === 'infografis') finalJudul = 'Infografis Ringkasan Teori Sosiologi';
      else if (formTipe === 'tabel') finalJudul = 'Tabel Matriks Komparasi Sosiologi';
      else if (formTipe === 'video') finalJudul = 'Video Pembelajaran Interaktif Sosiologi';
      else if (formTipe === 'musik') finalJudul = 'Audio Narasi Penjelasan Sosiologi';
      else finalJudul = 'Media Visual Sosiologi';
      setFormJudul(finalJudul);
    }

    // Validate media source URL or content for non-table types
    if (formTipe !== 'tabel' && !formUrl.trim()) {
      setFormError('Mohon unggah berkas media atau masukkan URL / tautan YouTube terlebih dahulu!');
      sound.playError();
      return;
    }

    sound.playSuccess();
    let tabelData: TabelData | undefined = undefined;
    if (formTipe === 'tabel') {
      tabelData = {
        judul: finalJudul,
        headers: tableHeaders,
        rows: tableRows
      };
    }

    if (editingMedia) {
      // Update existing
      const updated = (mediaList || []).map(m => m.id === editingMedia.id ? {
        ...m,
        tipe: formTipe,
        judul: finalJudul,
        keterangan: formKeterangan,
        url: formUrl,
        tabelData,
        posisi: formPosisi
      } : m);
      onUpdateMediaList(updated);
    } else {
      // Create new
      const newItem: MediaItem = {
        id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        tipe: formTipe,
        judul: finalJudul,
        keterangan: formKeterangan,
        url: formUrl,
        tabelData,
        posisi: formPosisi
      };
      onUpdateMediaList([...(mediaList || []), newItem]);
    }

    setShowAddMediaModal(false);
    setEditingMedia(null);
    setFormError(null);
  };

  // Request delete media item
  const handleRequestDeleteMedia = (item: MediaItem) => {
    sound.playClick();
    setDeleteTargetMedia(item);
  };

  // Confirm delete media item
  const handleConfirmDeleteMedia = () => {
    if (deleteTargetMedia) {
      sound.playSuccess();
      onUpdateMediaList(mediaList.filter(m => m.id !== deleteTargetMedia.id));
      if (editingMedia && editingMedia.id === deleteTargetMedia.id) {
        setShowAddMediaModal(false);
        setEditingMedia(null);
      }
      setDeleteTargetMedia(null);
    }
  };

  // Animation configuration changes
  const handleChangeMasuk = (masuk: AnimasiConfig['masuk']) => {
    sound.playClick();
    onUpdateAnimasi({ ...animasi, masuk });
    setAnimationTestKey(prev => prev + 1);
  };

  const handleChangeInteraksi = (interaksi: AnimasiConfig['interaksi']) => {
    sound.playClick();
    onUpdateAnimasi({ ...animasi, interaksi });
    setAnimationTestKey(prev => prev + 1);
  };

  const handleChangeKecepatan = (kecepatan: AnimasiConfig['kecepatan']) => {
    sound.playClick();
    onUpdateAnimasi({ ...animasi, kecepatan });
    setAnimationTestKey(prev => prev + 1);
  };

  // Table manipulation helpers
  const handleAddTableRow = () => {
    setTableRows([...tableRows, Array(tableHeaders.length).fill('')]);
  };

  const handleDeleteTableRow = (rIdx: number) => {
    if (tableRows.length <= 1) return;
    setTableRows(tableRows.filter((_, idx) => idx !== rIdx));
  };

  const handleUpdateTableCell = (rIdx: number, cIdx: number, val: string) => {
    const updated = [...tableRows];
    updated[rIdx] = [...updated[rIdx]];
    updated[rIdx][cIdx] = val;
    setTableRows(updated);
  };

  const handleAddTableColumn = () => {
    setTableHeaders([...tableHeaders, `Kolom ${tableHeaders.length + 1}`]);
    setTableRows(tableRows.map(row => [...row, '']));
  };

  const handleDeleteTableColumn = (cIdx: number) => {
    if (tableHeaders.length <= 1) return;
    setTableHeaders(tableHeaders.filter((_, idx) => idx !== cIdx));
    setTableRows(tableRows.map(row => row.filter((_, idx) => idx !== cIdx)));
  };

  const currentAnimClasses = getAnimationClasses(animasi);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      
      {/* Collapsible Bar Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-900">
                Media Pembelajaran & Efek Animasi Interaktif
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                {mediaList.length} Media Terlampir
              </span>
              {animasi.masuk && animasi.masuk !== 'none' && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  Animasi: {animasi.masuk}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Kelola Gambar, Infografis, Tabel, Visual, Musik/Audio, Video, dan Perintah Animasi pada {titleLabel}.
            </p>
          </div>
        </div>

        <button 
          className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 hover:bg-slate-200 transition"
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Accordion Content */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-200 space-y-5 animate-fade-in">
          
          {/* SECTION 1: CRUD MEDIA BUTTONS */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Daftar Lampiran Visual & Multimedia:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenAddMedia('gambar')}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition flex items-center gap-1"
                >
                  <ImageIcon size={13} /> + Gambar
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAddMedia('infografis')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1"
                >
                  <FileText size={13} /> + Infografis
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAddMedia('tabel')}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition flex items-center gap-1"
                >
                  <TableIcon size={13} /> + Tabel
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAddMedia('musik')}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition flex items-center gap-1"
                >
                  <Music size={13} /> + Musik/Audio
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAddMedia('video')}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition flex items-center gap-1"
                >
                  <Video size={13} /> + Video
                </button>
              </div>
            </div>

            {/* List of Attached Media Cards */}
            {mediaList.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500 bg-white">
                Belum ada media terlampir. Klik salah satu tombol di atas untuk menambahkan Gambar, Infografis, Tabel, Visual, Musik/Audio, atau Link Video.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {mediaList.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2.5 hover:border-indigo-300 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        {m.tipe === 'gambar' && <ImageIcon size={16} className="text-blue-600" />}
                        {m.tipe === 'infografis' && <FileText size={16} className="text-emerald-600" />}
                        {m.tipe === 'tabel' && <TableIcon size={16} className="text-indigo-600" />}
                        {m.tipe === 'visual_lain' && <Eye size={16} className="text-amber-600" />}
                        {m.tipe === 'musik' && <Music size={16} className="text-rose-600" />}
                        {m.tipe === 'video' && <Video size={16} className="text-purple-600" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {m.judul}
                        </div>
                        <div className="text-[10px] text-slate-500 capitalize flex items-center gap-1.5">
                          <span>{m.tipe.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>Posisi: {m.posisi || 'atas'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditMedia(m)}
                        title="Edit Media"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRequestDeleteMedia(m)}
                        title="Hapus Media"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: PILIHAN PERINTAH ANIMASI MPI */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-600" />
                <span>Pilihan Perintah Animasi & Efek Interaktif MPI</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Berlaku di Live Preview & Standalone Export
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Animasi Masuk (Entrance) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  1. Animasi Masuk (Entrance Effect)
                </label>
                <select
                  value={animasi.masuk || 'none'}
                  onChange={(e) => handleChangeMasuk(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {OPSI_ANIMASI_MASUK.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Animasi Interaksi (Hover / Action) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  2. Efek Interaktif (Hover / Respon)
                </label>
                <select
                  value={animasi.interaksi || 'none'}
                  onChange={(e) => handleChangeInteraksi(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {OPSI_ANIMASI_INTERAKSI.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kecepatan Animasi */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  3. Kecepatan / Tempo Animasi
                </label>
                <select
                  value={animasi.kecepatan || 'normal'}
                  onChange={(e) => handleChangeKecepatan(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {OPSI_KECEPATAN_ANIMASI.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Visual Test Box for the Animation */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div className="text-xs text-slate-600">
                <strong>Uji Tampilan:</strong> Amati simulasi gerakan pada kotak pratinjau di samping ini.
              </div>
              <div 
                key={animationTestKey}
                onClick={() => setAnimationTestKey(prev => prev + 1)}
                className={`cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs select-none ${currentAnimClasses}`}
                title="Klik untuk memicu ulang animasi"
              >
                ✨ Simulasi Efek Animasi ({animasi.masuk})
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= MODAL TAMBAH / EDIT MEDIA ================= */}
      {showAddMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                <Sparkles size={18} className="text-indigo-600" />
                <span>{editingMedia ? 'Edit Media Pembelajaran' : 'Tambah Media Visual / Audio / Video Baru'}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMediaModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Error Banner */}
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-bold animate-fade-in">
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}
              
              {/* Tipe Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Pilih Jenis Media
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'gambar', label: 'Gambar', icon: <ImageIcon size={14} /> },
                    { id: 'infografis', label: 'Infografis', icon: <FileText size={14} /> },
                    { id: 'tabel', label: 'Tabel Data', icon: <TableIcon size={14} /> },
                    { id: 'visual_lain', label: 'Visual Lain', icon: <Eye size={14} /> },
                    { id: 'musik', label: 'Musik/Audio', icon: <Music size={14} /> },
                    { id: 'video', label: 'Link Video', icon: <Video size={14} /> },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setFormTipe(t.id as MediaType);
                      }}
                      className={`py-2 px-2 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition ${
                        formTipe === t.id 
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {t.icon}
                      <span className="text-[10px]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Judul Media */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul / Label Media *
                </label>
                <input
                  type="text"
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  placeholder="Contoh: Infografis Syarat Kelompok Sosial, Tabel Komparasi Primer-Sekunder"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Keterangan / Sumber */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan / Sumber / Petunjuk Belajar
                </label>
                <input
                  type="text"
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  placeholder="Contoh: Sumber: Buku Sosiologi SMA Kemendikbudristek 2024 / Perhatikan kolom interaksi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Posisi */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Penempatan Posisi Media
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="posisiMedia"
                      value="atas"
                      checked={formPosisi === 'atas'}
                      onChange={() => setFormPosisi('atas')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Bagian Atas (Pengantar / Stimulus Awal)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="posisiMedia"
                      value="bawah"
                      checked={formPosisi === 'bawah'}
                      onChange={() => setFormPosisi('bawah')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Bagian Bawah (Pengayaan / Telaah Lanjut)</span>
                  </label>
                </div>
              </div>

              {/* INPUT SPESIFIK BERDASARKAN TIPE */}

              {/* 1. GAMBAR, INFOGRAFIS, & VISUAL LAINNYA */}
              {(formTipe === 'gambar' || formTipe === 'infografis' || formTipe === 'visual_lain') && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 block text-xs">
                    Pilih Metode Input Berkas Gambar:
                  </span>
                  
                  {/* File Upload with Drag & Drop */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Upload Gambar dari Komputer (Base64 Offline)
                    </label>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(true);
                      }}
                      onDragLeave={() => setIsDraggingFile(false)}
                      onDrop={handleFileDrop}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer ${
                        isDraggingFile 
                          ? 'border-indigo-500 bg-indigo-50/60' 
                          : 'border-slate-300 hover:border-indigo-400 bg-white'
                      }`}
                      onClick={() => document.getElementById('media-image-file-input')?.click()}
                    >
                      <input
                        id="media-image-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Upload size={18} />
                        </div>
                        <div className="text-xs font-bold text-slate-700">
                          Klik untuk memilih berkas atau Seret & Lepas (Drag & Drop) di sini
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Mendukung PNG, JPG, JPEG, WEBP, SVG, GIF (Maks. 10MB)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pustaka Ide Visual & Preset Gambar Sosiologi */}
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-indigo-600" />
                        <span>💡 Pustaka Ide Visual & Preset Gambar Sosiologi Siap Pakai:</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200/60 text-indigo-800">
                        1-Click Preset
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {[
                        {
                          label: "👥 Interaksi & Gotong Royong Komunitas",
                          url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
                          judul: "Foto Interaksi & Gotong Royong Komunitas Sosial",
                          keterangan: "Stimulus visual hubungan timbal balik & kesadaran keanggotaan kelompok sejati."
                        },
                        {
                          label: "🏡 Masyarakat Adat & Paguyuban (Gemeinschaft)",
                          url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
                          judul: "Foto Kehidupan Tradisional Masyarakat Adat (Paguyuban)",
                          keterangan: "Ilustrasi ikatan batin murni, kekal, dan berasaskan tradisi leluhur."
                        },
                        {
                          label: "🏙️ Masyarakat Perkotaan & Patembayan (Gesellschaft)",
                          url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
                          judul: "Foto Aktivitas Profesional Masyarakat Perkotaan (Patembayan)",
                          keterangan: "Visualisasi ikatan kontraktual formal & spesialisasi kerja modern."
                        },
                        {
                          label: "📊 Infografis Solidaritas Mekanik vs Organik",
                          url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
                          judul: "Infografis Komparasi Teori Solidaritas Emile Durkheim",
                          keterangan: "Diagram perbandingan ciri solidaritas mekanik desa vs organik kota."
                        },
                        {
                          label: "🕊️ Infografis Resolusi Konflik & Mediasi",
                          url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80",
                          judul: "Infografis Alur Resolusi Konflik & Integrasi Sosial",
                          keterangan: "Visualisasi alur identifikasi masalah, mediasi netral, dan konsensus damai."
                        }
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setFormUrl(preset.url);
                            setFormJudul(preset.judul);
                            setFormKeterangan(preset.keterangan);
                            setFormError(null);
                          }}
                          className="text-left p-2 rounded-lg bg-white border border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 text-[11px] font-bold text-slate-800 transition flex items-center justify-between group shadow-2xs"
                        >
                          <span className="truncate pr-1">{preset.label}</span>
                          <span className="text-[10px] text-indigo-600 font-extrabold group-hover:translate-x-0.5 transition shrink-0">
                            Pilih ➔
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Or Relative Path / URL */}
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Atau Masukkan URL / Path Gambar Relatif (misal: ./asset/img/gambar.jpg)
                    </label>
                    <input
                      type="text"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="./asset/img/kelompok_sosial.jpg atau https://..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono text-xs"
                    />
                  </div>

                  {/* Image Preview & Delete / Clear Button */}
                  {formUrl && (
                    <div className="mt-2 p-2.5 rounded-xl bg-white border border-slate-200 text-center space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Pratinjau Gambar</span>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setFormUrl('');
                          }}
                          className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline"
                        >
                          <Trash2 size={12} /> Hapus Berkas Gambar
                        </button>
                      </div>
                      <img 
                        src={formUrl} 
                        alt="Pratinjau" 
                        className="max-h-40 mx-auto object-contain rounded-lg border border-slate-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x300?text=Gambar+Relatif+Offline';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 2. TABEL DATA INTERAKTIF */}
              {formTipe === 'tabel' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">
                      Penyusun Tabel Interaktif:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleAddTableColumn}
                        className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] border border-indigo-200"
                      >
                        + Tambah Kolom
                      </button>
                      <button
                        type="button"
                        onClick={handleAddTableRow}
                        className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200"
                      >
                        + Tambah Baris
                      </button>
                    </div>
                  </div>

                  {/* Table Spreadsheet Editor */}
                  <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300">
                          {tableHeaders.map((header, cIdx) => (
                            <th key={cIdx} className="p-1.5 border-r border-slate-200 text-left">
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={header}
                                  onChange={(e) => {
                                    const updated = [...tableHeaders];
                                    updated[cIdx] = e.target.value;
                                    setTableHeaders(updated);
                                  }}
                                  className="w-full px-1.5 py-1 text-xs font-bold border border-slate-200 rounded bg-white"
                                />
                                {tableHeaders.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTableColumn(cIdx)}
                                    className="text-rose-500 hover:text-rose-700 p-0.5"
                                    title="Hapus Kolom"
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                            </th>
                          ))}
                          <th className="p-1.5 w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {tableRows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-1.5 border-r border-slate-200">
                                <input
                                  type="text"
                                  value={cell}
                                  onChange={(e) => handleUpdateTableCell(rIdx, cIdx, e.target.value)}
                                  className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded bg-white"
                                />
                              </td>
                            ))}
                            <td className="p-1.5 text-center">
                              {tableRows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTableRow(rIdx)}
                                  className="text-slate-400 hover:text-rose-600"
                                  title="Hapus Baris"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. MUSIK / AUDIO PENJELASAN */}
              {formTipe === 'musik' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 block text-xs">
                    Pengaturan Berkas Musik / Audio Penjelasan Guru:
                  </span>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Upload Berkas Audio (.mp3, .wav)
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Atau Masukkan URL Audio Eksternal
                    </label>
                    <input
                      type="text"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="https://.../narasi.mp3 atau ./asset/audio/lagu.mp3"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
                    />
                  </div>

                  {formUrl && (
                    <div className="mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 size={16} className="text-rose-600" />
                        <span className="font-bold text-rose-900 text-xs">Audio Siap Diputar</span>
                      </div>
                      <audio controls src={formUrl} className="h-8 max-w-xs" />
                    </div>
                  )}
                </div>
              )}

              {/* 4. LINK / EMBED VIDEO & UPLOAD MP4 */}
              {formTipe === 'video' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                      <Video size={16} className="text-purple-600" />
                      <span>Pengaturan Video Edukatif (YouTube Embed / Upload MP4):</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                      YouTube & MP4 Supported
                    </span>
                  </div>

                  {/* 1. Upload Video File (.mp4) */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Opsi A: Upload Berkas Video dari Komputer (.MP4)
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (!file.name.toLowerCase().endsWith('.mp4') && !file.type.includes('mp4')) {
                            alert('Mohon gunakan berkas video berformat MP4 (.mp4)!');
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setFormUrl(event.target.result as string);
                              sound.playSuccess();
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-100 file:text-purple-800 hover:file:bg-purple-200 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400">
                      *Mendukung format video MP4 (.mp4). Berkas akan disimpan sebagai base64 offline.
                    </p>
                  </div>

                  {/* 2. Youtube Link or URL Input */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Opsi B: Tautan Video YouTube (Otomatis Embed) atau Path MP4
                    </label>
                    <input
                      type="text"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="Contoh: https://www.youtube.com/watch?v=... atau ./asset/video/animasi.mp4"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <div className="p-2 rounded bg-purple-50/70 border border-purple-100 text-[11px] text-purple-900 leading-relaxed">
                      💡 <strong>Petunjuk YouTube Embed:</strong> Anda cukup memasukkan tautan YouTube biasa (<code>watch?v=...</code>, <code>youtu.be/...</code>, atau <code>youtube.com/shorts/...</code>). Sistem MASTERMPI akan secara otomatis mengonversinya menjadi frame embed interaktif tanpa iklan pengganggu.
                    </div>
                  </div>

                  {/* 3. Preset Video Sosiologi Siap Pakai */}
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-purple-950 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-purple-600" />
                        <span>Preset Video Pembelajaran Sosiologi Siap Pakai:</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {[
                        {
                          label: "🔴 YouTube Embed: Pembentukan Kelompok Sosial",
                          url: "https://www.youtube.com/watch?v=L_LUpnjgPso",
                          judul: "Video Pembelajaran: Pembentukan Kelompok Sosial (Kelas 11)",
                          keterangan: "Penjelasan mengenai syarat, norma, dan dinamika interaksi kelompok sosial."
                        },
                        {
                          label: "🔴 YouTube Embed: Paguyuban vs Patembayan",
                          url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
                          judul: "Video Analisis: Paguyuban (Gemeinschaft) vs Patembayan (Gesellschaft)",
                          keterangan: "Ulasan perbedaan ikatan batin murni vs ikatan kontrak profesional modern."
                        },
                        {
                          label: "🎥 Sample MP4: Animasi Interaksi Sosial",
                          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                          judul: "Video MP4 Animasi: Dinamika Kelompok & Interaksi Sosial",
                          keterangan: "Video animasi MP4 sampel interaksi sosial dan integrasi kelompok."
                        }
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setFormUrl(preset.url);
                            setFormJudul(preset.judul);
                            setFormKeterangan(preset.keterangan);
                            setFormError(null);
                          }}
                          className="text-left p-2 rounded-lg bg-white border border-purple-200 hover:border-purple-500 hover:bg-purple-50 text-[11px] font-bold text-slate-800 transition flex items-center justify-between group shadow-2xs"
                        >
                          <span className="truncate pr-1">{preset.label}</span>
                          <span className="text-[10px] text-purple-600 font-extrabold group-hover:translate-x-0.5 transition shrink-0">
                            Pilih ➔
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Live Video Player Preview */}
                  {formUrl && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                          Pratinjau Pemutar Video
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setFormUrl('');
                          }}
                          className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 hover:underline"
                        >
                          <Trash2 size={12} /> Hapus Video
                        </button>
                      </div>

                      <VideoPlayer videoUrl={formUrl} title={formJudul || 'Pratinjau Video'} />
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50">
              <div>
                {editingMedia ? (
                  <button
                    type="button"
                    onClick={() => handleRequestDeleteMedia(editingMedia)}
                    className="px-3.5 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>Hapus Media Ini</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">
                    *Media yang disimpan akan tampil secara interaktif pada halaman siswa.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowAddMediaModal(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveMedia}
                  disabled={isUploading}
                  className={`px-5 py-2 rounded-xl text-white font-black transition shadow-xs flex items-center gap-1.5 text-xs ${
                    isUploading
                      ? 'bg-slate-400 cursor-not-allowed opacity-80'
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses Berkas...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Simpan Media</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetMedia !== null}
        title="Hapus Media Pembelajaran?"
        message={`Apakah Anda yakin ingin menghapus media "${deleteTargetMedia?.judul}" dari komponen ini?`}
        confirmLabel="Ya, Hapus Media"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={handleConfirmDeleteMedia}
        onCancel={() => setDeleteTargetMedia(null)}
      />

    </div>
  );
};
