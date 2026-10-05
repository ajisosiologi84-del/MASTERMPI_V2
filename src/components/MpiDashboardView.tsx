import React, { useState } from 'react';
import { MpiConfig, MateriItem, GameItem, SoalLatih, GamificationState } from '../types';
import { MasterAdventureMap, MapNode } from './MasterAdventureMap';
import { sound } from '../utils/audio';
import { 
  BookOpen, 
  Gamepad2, 
  FileCheck2, 
  Star, 
  Trophy, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  Lock, 
  Award, 
  Flame, 
  Zap, 
  ChevronRight, 
  User, 
  Tablet, 
  Monitor, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Target,
  BarChart3
} from 'lucide-react';

interface MpiDashboardViewProps {
  config: MpiConfig;
  materiList: MateriItem[];
  gameList: GameItem[];
  soalList: SoalLatih[];
  studentInfo: { nama: string; kelas: string };
  completedBabIds: number[];
  completedGamesCount: number;
  isMateriCompleted: boolean;
  isBermainCompleted: boolean;
  onNavigateTab: (tab: 'materi' | 'bermain' | 'berlatih' | 'lkpd') => void;
  onOpenStudentGate: () => void;
  gamification: GamificationState;
  onOpenShop: () => void;
  onOpenSpinWheel: () => void;
  onNavigateToNode: (node: MapNode) => void;
}

export const MpiDashboardView: React.FC<MpiDashboardViewProps> = ({
  config,
  materiList,
  gameList,
  soalList,
  studentInfo,
  completedBabIds,
  completedGamesCount,
  isMateriCompleted,
  isBermainCompleted,
  onNavigateTab,
  onOpenStudentGate,
  gamification,
  onOpenShop,
  onOpenSpinWheel,
  onNavigateToNode
}) => {
  const [frameMode, setFrameMode] = useState<'full' | 'tablet'>('full');

  // Overall Completion Progress Calculations
  const totalMateri = materiList.length || 1;
  const totalGames = gameList.length || 1;
  const totalSoal = soalList.length || 1;

  const materiProgress = Math.min(100, Math.round((completedBabIds.length / totalMateri) * 100));
  const gameProgress = Math.min(100, Math.round((completedGamesCount / totalGames) * 100));
  const overallProgress = Math.round((materiProgress * 0.4) + (gameProgress * 0.4) + (isBermainCompleted ? 20 : 0));

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 animate-fade-in">
      
      {/* Top Controls: Frame Mode Toggle (Tablet Mockup vs Full Screen) */}
      <div className="flex items-center justify-between mb-4 bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
            <Compass size={18} />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black tracking-tight text-white">
              Dasbor Interaktif Hub Sosiologi
            </h2>
            <p className="text-[10px] text-slate-400">
              Tampilan UI/UX Gamifikasi Tablet untuk Pembelajaran MPI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setFrameMode('full');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              frameMode === 'full' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={14} />
            <span className="hidden sm:inline">Layar Penuh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setFrameMode('tablet');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              frameMode === 'tablet' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet size={14} />
            <span className="hidden sm:inline">Frame Tablet UI</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD CONTAINER (WITH TABLET FRAME OPTION) */}
      <div className={`transition-all duration-300 mx-auto ${
        frameMode === 'tablet' 
          ? 'max-w-4xl p-4 sm:p-8 rounded-[40px] bg-slate-950 border-[12px] border-slate-800 shadow-2xl relative overflow-hidden'
          : 'w-full'
      }`}>

        {/* Tablet Screen Mockup Top Camera Notch */}
        {frameMode === 'tablet' && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-2 border border-slate-800 z-30">
            <div className="w-2 h-2 rounded-full bg-slate-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" />
          </div>
        )}

        {/* INNER DASHBOARD CANVAS */}
        <div className="bg-gradient-to-b from-amber-50/80 via-white to-slate-50 text-slate-900 rounded-3xl p-4 sm:p-7 border border-amber-200/80 shadow-xl space-y-6">

          {/* 🌟 1. HEADER BRAND & STUDENT PROFILE BAR 🌟 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
            
            {/* Student Avatar & Welcome */}
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenStudentGate();
                }}
                className="relative group transition transform hover:scale-105"
                title="Klik untuk mengubah Identitas Siswa"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white">
                  👤
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                  ✓
                </div>
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    Siswa Aktif MPI
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {studentInfo.kelas || config.kelas}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Selamat Datang, {studentInfo.nama || 'Siswa'}!</span>
                  <Sparkles size={20} className="text-amber-500 animate-pulse" />
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  {config.judul} • {config.mataPelajaran} ({config.fase})
                </p>
              </div>
            </div>

            {/* Quick Action Category Badges (Inspired by Reference Image Top Bar) */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigateTab('materi');
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition flex items-center gap-2 shadow-2xs"
              >
                <BookOpen size={16} className="text-blue-600" />
                <span>Modul Materi ({completedBabIds.length}/{totalMateri})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigateTab('bermain');
                }}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 shadow-2xs ${
                  isMateriCompleted
                    ? 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-900'
                    : 'bg-slate-100 border-slate-200 text-slate-500 opacity-75'
                }`}
              >
                <Gamepad2 size={16} className={isMateriCompleted ? 'text-teal-600' : 'text-slate-400'} />
                <span>Modul Game ({completedGamesCount}/{totalGames})</span>
                {!isMateriCompleted && <Lock size={12} className="text-amber-600" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigateTab('berlatih');
                }}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 shadow-2xs ${
                  isBermainCompleted
                    ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900'
                    : 'bg-slate-100 border-slate-200 text-slate-500 opacity-75'
                }`}
              >
                <FileCheck2 size={16} className={isBermainCompleted ? 'text-indigo-600' : 'text-slate-400'} />
                <span>Bank Soal ({totalSoal} HOTS)</span>
                {!isBermainCompleted && <Lock size={12} className="text-amber-600" />}
              </button>
            </div>

          </div>

          {/* 📈 2. PROGRESS TRACKER CARD (INSPIRED BY REFERENCE IMAGE) 📈 */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 rounded-2xl p-5 shadow-lg relative overflow-hidden text-white">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
              
              <div className="space-y-1 text-center md:text-left">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-950/30 text-amber-200 border border-amber-300/30">
                  Progress Tracker Pembelajaran
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                  Progres Kelengkapan Misi MPI Sosiologi
                </h3>
                <p className="text-xs text-slate-900 font-medium max-w-lg">
                  Selesaikan Modul Materi & Kuis Mini untuk membuka Modul Bermain Game Peta Petualangan dan Bank Soal Evaluasi.
                </p>
              </div>

              {/* Progress Percentage Gauge Box */}
              <div className="flex items-center gap-4 bg-slate-950/90 text-white p-4 rounded-2xl border border-amber-300/40 shadow-xl shrink-0 w-full md:w-auto justify-center">
                
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#334155"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#f59e0b"
                      strokeWidth="6"
                      strokeDasharray={163}
                      strokeDashoffset={163 - (163 * overallProgress) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute font-black text-sm text-amber-400">
                    {overallProgress}%
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                    Capaian Total
                  </span>
                  <span className="text-base font-black text-white block">
                    {overallProgress >= 100 ? '🏆 Selesai Tuntas!' : `${overallProgress}% Selesai`}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Target KKM: <strong className="text-amber-400">{config.kkm} PTS</strong>
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* 🗺️ 3. CENTRAL MASTER GAMIFIED ADVENTURE MAP 🗺️ */}
          <MasterAdventureMap
            materiList={materiList}
            gameList={gameList}
            soalList={soalList}
            gamification={gamification}
            onNavigateToNode={onNavigateToNode}
            onOpenShop={onOpenShop}
            onOpenSpinWheel={onOpenSpinWheel}
          />

          {/* 📚 4. RESOURCE LIBRARY & TOPIC SHOWCASE CARDS (INSPIRED BY REFERENCE IMAGE) 📚 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Resource Library & Media Showcase
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Koleksi Visual Infografis & Studi Kasus
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigateTab('materi');
                }}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 transition flex items-center gap-1"
              >
                <span>Lihat Seluruh Media</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Resource Card 1 */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="h-32 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 flex flex-col justify-between relative overflow-hidden mb-3">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs w-max">
                    Infografis Teori
                  </span>
                  <h5 className="font-black text-sm leading-snug">
                    Syarat Kelompok Sosial (Soerjono Soekanto)
                  </h5>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  5 Indikator utama kesadaran keanggotaan (we-feeling), pola interaksi, dan struktur norma.
                </p>
              </div>

              {/* Resource Card 2 */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="h-32 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-3 flex flex-col justify-between relative overflow-hidden mb-3">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs w-max">
                    Komparasi Visual
                  </span>
                  <h5 className="font-black text-sm leading-snug">
                    Paguyuban (Gemeinschaft) vs Patembayan (Gesellschaft)
                  </h5>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  Perbandingan ikatan batin gotong royong keluarga vs relasi kontraktual perkotaan.
                </p>
              </div>

              {/* Resource Card 3 */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition sm:col-span-2 lg:col-span-1">
                <div className="h-32 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-3 flex flex-col justify-between relative overflow-hidden mb-3">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs w-max">
                    Game Interaktif
                  </span>
                  <h5 className="font-black text-sm leading-snug">
                    Game Tebak Jodoh & Pilah Ciri Sosiologi
                  </h5>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  Aktivitas gamifikasi 10 level untuk mengasah ingatan dan analisis materi Sosiologi.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
