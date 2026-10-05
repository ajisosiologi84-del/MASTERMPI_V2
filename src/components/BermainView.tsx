import React, { useState, useEffect } from 'react';
import { dataBermain } from '../data/mpiData';
import { GameItem } from '../types';
import { sound } from '../utils/audio';
import { MediaDisplay } from './MediaDisplay';
import { GameAdventureMap, MapTheme } from './GameAdventureMap';
import { getAnimationClasses } from '../utils/animationHelper';
import { getGameIconBadge } from '../utils/iconHelper';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Flame, 
  ChevronRight,
  AlertCircle,
  ArrowRight,
  FileCheck2,
  Map,
  Star,
  Gamepad2,
  ChevronLeft,
  Award,
  Zap
} from 'lucide-react';

interface BermainViewProps {
  gameList?: GameItem[];
  onGameComplete?: (gameIdx: number) => void;
  isBermainCompleted?: boolean;
  onNavigateTab?: (tab: 'berlatih') => void;
}

export const BermainView: React.FC<BermainViewProps> = ({ 
  gameList,
  onGameComplete,
  isBermainCompleted = false,
  onNavigateTab
}) => {
  const activeGames = gameList && gameList.length > 0 ? gameList : dataBermain;
  const [viewMode, setViewMode] = useState<'MAP' | 'ARENA'>('MAP');
  const [mapTheme, setMapTheme] = useState<MapTheme>('valley');
  const [activeGameIdx, setActiveGameIdx] = useState(0);
  const [completedGames, setCompletedGames] = useState<boolean[]>(
    new Array(activeGames.length).fill(false)
  );
  const [levelStars, setLevelStars] = useState<{ [key: number]: number }>({});
  const [levelScores, setLevelScores] = useState<{ [key: number]: number }>({});
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  const safeIdx = Math.min(activeGameIdx, activeGames.length - 1);
  const currentGame: GameItem = activeGames[safeIdx] || activeGames[0];

  // --- CONFETTI PARTICLE SYSTEM ---
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; color: string; size: number; delay: number }>>([]);

  const triggerConfetti = () => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    const newParticles = Array.from({ length: 35 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 90 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6,
      delay: Math.random() * 0.3
    }));
    setConfetti(newParticles);
    setTimeout(() => setConfetti([]), 2500);
  };

  // --- STATE FOR GAME 1 & 6: JODOH ---
  const [jodohSelectedLeft, setJodohSelectedLeft] = useState<string | null>(null);
  const [jodohMatchedIds, setJodohMatchedIds] = useState<string[]>([]);
  const [shuffledRight, setShuffledRight] = useState<Array<{ id: string; kanan: string }>>([]);
  const [wrongJodohLeft, setWrongJodohLeft] = useState<string | null>(null);
  const [wrongJodohRight, setWrongJodohRight] = useState<string | null>(null);
  const [lastMatchedJodohId, setLastMatchedJodohId] = useState<string | null>(null);

  // --- STATE FOR GAME 2 & 7: KLIK ---
  const [clickedCards, setClickedCards] = useState<{ [key: number]: boolean }>({});

  // --- STATE FOR GAME 3 & 8: URUT ---
  const [currentUrutList, setCurrentUrutList] = useState<string[]>([]);
  const [urutChecked, setUrutChecked] = useState<boolean | null>(null);

  // --- STATE FOR GAME 4 & 9: KUMPUL ---
  const [collectedIndices, setCollectedIndices] = useState<number[]>([]);
  const [wrongCollectedIndices, setWrongCollectedIndices] = useState<number[]>([]);

  // --- STATE FOR GAME 5 & 10: SAMBUNG ---
  const [selectedSebabIdx, setSelectedSebabIdx] = useState<number | null>(null);
  const [sambungMatchedSebab, setSambungMatchedSebab] = useState<number[]>([]);
  const [sambungMatchedAkibat, setSambungMatchedAkibat] = useState<string[]>([]);
  const [shuffledAkibat, setShuffledAkibat] = useState<string[]>([]);
  const [wrongSambungSebab, setWrongSambungSebab] = useState<number | null>(null);
  const [wrongSambungAkibat, setWrongSambungAkibat] = useState<string | null>(null);
  const [lastMatchedSambungAkibat, setLastMatchedSambungAkibat] = useState<string | null>(null);

  // Initialize game state when switching active game
  useEffect(() => {
    resetCurrentGame();
  }, [activeGameIdx]);

  const resetCurrentGame = () => {
    const g = currentGame || activeGames[safeIdx] || dataBermain[0];
    if (!g) return;

    if (g.tipe === 'jodoh' && g.pasangan) {
      setJodohSelectedLeft(null);
      setJodohMatchedIds([]);
      setWrongJodohLeft(null);
      setWrongJodohRight(null);
      setLastMatchedJodohId(null);
      const rightItems = g.pasangan.map(p => ({ id: p.id, kanan: p.kanan }));
      setShuffledRight([...rightItems].sort(() => Math.random() - 0.5));
    } else if (g.tipe === 'klik') {
      setClickedCards({});
    } else if (g.tipe === 'urut' && g.urutanBenar) {
      setUrutChecked(null);
      setCurrentUrutList([...g.urutanBenar].sort(() => Math.random() - 0.5));
    } else if (g.tipe === 'kumpul') {
      setCollectedIndices([]);
      setWrongCollectedIndices([]);
    } else if (g.tipe === 'sambung' && g.rantaiLogika) {
      setSelectedSebabIdx(null);
      setSambungMatchedSebab([]);
      setSambungMatchedAkibat([]);
      setWrongSambungSebab(null);
      setWrongSambungAkibat(null);
      setLastMatchedSambungAkibat(null);
      setShuffledAkibat(g.rantaiLogika.map(r => r.akibat).sort(() => Math.random() - 0.5));
    }
  };

  const markGameComplete = () => {
    sound.playFanfare();
    triggerConfetti();

    // Award 3 Stars and calculated Level Score
    const starsAwarded = 3;
    const scoreEarned = 250 + (activeGameIdx + 1) * 50;

    setLevelStars(prev => ({
      ...prev,
      [activeGameIdx]: Math.max(prev[activeGameIdx] || 0, starsAwarded)
    }));

    setLevelScores(prev => ({
      ...prev,
      [activeGameIdx]: Math.max(prev[activeGameIdx] || 0, scoreEarned)
    }));

    setCompletedGames(prev => {
      const next = [...prev];
      next[activeGameIdx] = true;
      return next;
    });

    setShowVictoryModal(true);
    onGameComplete?.(activeGameIdx);
  };

  // -------------------------------------------------------------
  // HANDLERS: JODOH (Tebak Pasangan dengan Shake & Pop Juicy Effects)
  // -------------------------------------------------------------
  const handleJodohLeft = (id: string) => {
    if (jodohMatchedIds.includes(id) || wrongJodohLeft) return;
    sound.playClick();
    setJodohSelectedLeft(id);
    setWrongJodohLeft(null);
    setWrongJodohRight(null);
  };

  const handleJodohRight = (id: string) => {
    if (!jodohSelectedLeft || jodohMatchedIds.includes(id) || wrongJodohRight) return;

    if (jodohSelectedLeft === id) {
      // ✅ JAWABAN BENAR: Pop scale-up + green glow + confetti
      sound.playSuccess();
      const next = [...jodohMatchedIds, id];
      setJodohMatchedIds(next);
      setLastMatchedJodohId(id);
      setJodohSelectedLeft(null);
      triggerConfetti();

      setTimeout(() => setLastMatchedJodohId(null), 800);

      if (currentGame.pasangan && next.length === currentGame.pasangan.length) {
        markGameComplete();
      }
    } else {
      // ❌ JAWABAN SALAH: Shake bergetar horizontal + pendaran merah singkat
      sound.playError();
      const currentLeft = jodohSelectedLeft;
      setWrongJodohLeft(currentLeft);
      setWrongJodohRight(id);

      setTimeout(() => {
        setWrongJodohLeft(null);
        setWrongJodohRight(null);
        setJodohSelectedLeft(null);
      }, 600);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: KLIK
  // -------------------------------------------------------------
  const handleKlikCard = (idx: number, isCorrect: boolean) => {
    if (clickedCards[idx] !== undefined) return;

    setClickedCards(prev => ({ ...prev, [idx]: true }));

    if (isCorrect) {
      sound.playSuccess();
    } else {
      sound.playError();
    }

    if (currentGame.itemKlik) {
      const correctIndices = currentGame.itemKlik
        .map((item, i) => (item.benar ? i : -1))
        .filter(i => i !== -1);

      const updated = { ...clickedCards, [idx]: true };
      const allFound = correctIndices.every(ci => updated[ci] === true);

      if (allFound) {
        markGameComplete();
      }
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: URUT
  // -------------------------------------------------------------
  const moveUrut = (idx: number, direction: number) => {
    sound.playClick();
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= currentUrutList.length) return;

    const list = [...currentUrutList];
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    setCurrentUrutList(list);
    setUrutChecked(null);
  };

  const checkUrut = () => {
    if (!currentGame.urutanBenar) return;
    const isMatched = currentUrutList.every(
      (item, i) => item === currentGame.urutanBenar![i]
    );

    setUrutChecked(isMatched);
    if (isMatched) {
      markGameComplete();
    } else {
      sound.playError();
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: KUMPUL
  // -------------------------------------------------------------
  const handleKumpulItem = (idx: number, isCorrect: boolean) => {
    if (collectedIndices.includes(idx) || wrongCollectedIndices.includes(idx)) return;

    if (isCorrect) {
      sound.playSuccess();
      const next = [...collectedIndices, idx];
      setCollectedIndices(next);

      if (currentGame.itemKumpul) {
        const totalCorrect = currentGame.itemKumpul.filter(item => item.benar).length;
        if (next.length === totalCorrect) {
          markGameComplete();
        }
      }
    } else {
      sound.playError();
      setWrongCollectedIndices(prev => [...prev, idx]);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: SAMBUNG (Logika Rantai)
  // -------------------------------------------------------------
  const handleSambungSebab = (idx: number) => {
    if (sambungMatchedSebab.includes(idx) || wrongSambungSebab !== null) return;
    sound.playClick();
    setSelectedSebabIdx(idx);
    setWrongSambungSebab(null);
    setWrongSambungAkibat(null);
  };

  const handleSambungAkibat = (akibatStr: string) => {
    if (selectedSebabIdx === null || sambungMatchedAkibat.includes(akibatStr) || wrongSambungAkibat !== null) return;
    if (!currentGame.rantaiLogika) return;

    const correctAkibat = currentGame.rantaiLogika[selectedSebabIdx].akibat;

    if (akibatStr === correctAkibat) {
      sound.playSuccess();
      const nextSebab = [...sambungMatchedSebab, selectedSebabIdx];
      const nextAkibat = [...sambungMatchedAkibat, akibatStr];
      setSambungMatchedSebab(nextSebab);
      setSambungMatchedAkibat(nextAkibat);
      setLastMatchedSambungAkibat(akibatStr);
      setSelectedSebabIdx(null);
      triggerConfetti();

      setTimeout(() => setLastMatchedSambungAkibat(null), 800);

      if (nextSebab.length === currentGame.rantaiLogika.length) {
        markGameComplete();
      }
    } else {
      sound.playError();
      const currentSebab = selectedSebabIdx;
      setWrongSambungSebab(currentSebab);
      setWrongSambungAkibat(akibatStr);

      setTimeout(() => {
        setWrongSambungSebab(null);
        setWrongSambungAkibat(null);
        setSelectedSebabIdx(null);
      }, 600);
    }
  };

  const totalDone = completedGames.filter(Boolean).length;
  const isCurrentDone = completedGames[activeGameIdx];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* 🧭 NAVIGATION TAB SWITCHER: MAP vs ARENA 🧭 */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl text-white">
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/90 rounded-xl border border-slate-700/80">
          <button
            type="button"
            id="btn-viewmode-map"
            onClick={() => {
              sound.playClick();
              setViewMode('MAP');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition flex items-center gap-2 ${
              viewMode === 'MAP'
                ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Map size={16} />
            <span>🗺️ Peta Petualangan Level</span>
          </button>

          <button
            type="button"
            id="btn-viewmode-arena"
            onClick={() => {
              sound.playClick();
              setViewMode('ARENA');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition flex items-center gap-2 ${
              viewMode === 'ARENA'
                ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-400/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Gamepad2 size={16} />
            <span>🎮 Arena Permainan</span>
          </button>
        </div>

        <div className="flex items-center gap-3 px-3">
          <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
            <Star size={15} className="fill-current text-amber-400" />
            <span>
              {(Object.values(levelStars) as number[]).reduce((a: number, b: number) => a + (b || 0), 0)} / {activeGames.length * 3} ⭐
            </span>
          </span>

          <span className="text-xs font-bold text-slate-400">
            Level {activeGameIdx + 1} Aktif
          </span>
        </div>
      </div>

      {/* 🗺️ MODE 1: WINDING ADVENTURE LEVEL MAP 🗺️ */}
      {viewMode === 'MAP' ? (
        <div className="space-y-6">
          <GameAdventureMap
            games={activeGames}
            completedGames={completedGames}
            levelStars={levelStars}
            levelScores={levelScores}
            activeLevelIdx={activeGameIdx}
            onSelectLevel={(selectedIdx) => {
              sound.playClick();
              setActiveGameIdx(selectedIdx);
              setViewMode('ARENA');
              window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
            mapTheme={mapTheme}
            onChangeTheme={setMapTheme}
          />

          {/* Quick Level Grid Bar Below Map */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Flame size={16} className="text-teal-600" />
                <span>Pilih Cepat Ringkasan Level ({activeGames.length} Misi)</span>
              </span>
              <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Selesai {totalDone} / {activeGames.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {activeGames.map((g, idx) => {
                const isCurrent = idx === activeGameIdx;
                const isDone = completedGames[idx];
                const badge = getGameIconBadge(g, idx, 16);

                return (
                  <button
                    key={g.id || idx}
                    id={`game-quick-select-${g.id || idx}`}
                    onClick={() => {
                      sound.playClick();
                      setActiveGameIdx(idx);
                      setViewMode('ARENA');
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center relative gap-1 ${
                      isCurrent
                        ? 'bg-teal-600 text-white border-teal-700 shadow-md ring-2 ring-teal-400/50'
                        : isDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-white/20 text-white' : badge.bgClass} transition`}>
                      {badge.icon}
                    </div>
                    <span className="text-[11px] font-black leading-tight">Misi {idx + 1}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${
                      isCurrent ? 'text-teal-100' : isDone ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      {g.tipe}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        
        /* 🎮 MODE 2: ACTIVE GAME LEVEL ARENA 🎮 */
        (() => {
          const animClasses = currentGame ? getAnimationClasses(currentGame.animasi) : '';
          const currentBadge = currentGame ? getGameIconBadge(currentGame, safeIdx, 22) : null;

          return (
            <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 ${animClasses}`}>
              
              {/* Arena Header with Back to Map Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    id="btn-back-to-map"
                    onClick={() => {
                      sound.playClick();
                      setViewMode('MAP');
                    }}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 shrink-0"
                    title="Kembali ke Peta Petualangan Level"
                  >
                    <ChevronLeft size={16} />
                    <span>Peta Level</span>
                  </button>

                  {currentBadge && (
                    <div className={`p-3 rounded-2xl shrink-0 ${currentBadge.bgClass} border ${currentBadge.borderClass}`}>
                      {currentBadge.icon}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-teal-100 text-teal-800 tracking-wider">
                        Misi Level {activeGameIdx + 1} • {currentBadge?.label || currentGame.tipe}
                      </span>
                      {isCurrentDone && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 size={13} /> Selesai ⭐⭐⭐
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                      {currentGame.judul}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
                    <Star size={14} className="fill-amber-400 text-amber-500" />
                    <span>{levelStars[activeGameIdx] || 0} Stars</span>
                  </div>

                  <button
                    id="reset-current-game-btn"
                    onClick={() => {
                      sound.playClick();
                      resetCurrentGame();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Media Display Bagian Atas */}
              <MediaDisplay mediaList={currentGame.mediaList} posisiFilter="atas" />

              {/* Game Instruction */}
              <div className="bg-slate-50 border-l-4 border-teal-600 p-3.5 rounded-r-lg mb-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {currentGame.instruksi}
              </div>

        {/* Confetti Animation Burst */}
        {confetti.length > 0 && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {confetti.map(p => (
              <div
                key={p.id}
                className="absolute top-0 rounded-full animate-bounce"
                style={{
                  left: `${p.left}%`,
                  backgroundColor: p.color,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  animation: `confettiFall 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                  animationDelay: `${p.delay}s`
                }}
              />
            ))}
          </div>
        )}

        {/* -------------------------------------------------------------
            ENGINE 1 & 6: TIPE JODOH (Tebak Pasangan)
        ------------------------------------------------------------- */}
        {currentGame.tipe === 'jodoh' && currentGame.pasangan && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Kolom Kiri: Konsep / Tokoh */}
              <div className="space-y-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 block">
                  Kolom 1: Konsep / Tokoh
                </span>
                {currentGame.pasangan.map((p, idx) => {
                  const isMatched = jodohMatchedIds.includes(p.id);
                  const isSelected = jodohSelectedLeft === p.id;
                  const isWrong = wrongJodohLeft === p.id;
                  const isJustMatched = lastMatchedJodohId === p.id;

                  let styleClass = 'bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-slate-800 game-card-hover';

                  if (isWrong) {
                    styleClass = 'bg-rose-100 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/80 anim-shake shadow-md';
                  } else if (isJustMatched) {
                    styleClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-extrabold ring-2 ring-emerald-500 anim-pop shadow-lg';
                  } else if (isMatched) {
                    styleClass = 'bg-emerald-50/90 border-emerald-400 text-emerald-800 cursor-default opacity-90 shadow-2xs';
                  } else if (isSelected) {
                    styleClass = 'bg-teal-50 border-teal-600 text-teal-950 font-bold ring-2 ring-teal-500 shadow-md scale-[1.03]';
                  }

                  return (
                    <button
                      key={p.id}
                      id={`jodoh-left-${p.id}`}
                      disabled={isMatched}
                      onClick={() => handleJodohLeft(p.id)}
                      style={{ animationDelay: `${idx * 80}ms` }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all anim-bounce-in ${styleClass}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{p.kiri}</span>
                        {isMatched && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Kolom Kanan: Pasangan Konsep */}
              <div className="space-y-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 block">
                  Kolom 2: Definisi / Konsep Pasangan
                </span>
                {shuffledRight.map((p, idx) => {
                  const isMatched = jodohMatchedIds.includes(p.id);
                  const isWrong = wrongJodohRight === p.id;
                  const isJustMatched = lastMatchedJodohId === p.id;

                  let styleClass = 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed';

                  if (isWrong) {
                    styleClass = 'bg-rose-100 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/80 anim-shake shadow-md';
                  } else if (isJustMatched) {
                    styleClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-extrabold ring-2 ring-emerald-500 anim-pop shadow-lg';
                  } else if (isMatched) {
                    styleClass = 'bg-emerald-50/90 border-emerald-400 text-emerald-800 cursor-default opacity-90 shadow-2xs';
                  } else if (jodohSelectedLeft) {
                    styleClass = 'bg-white border-teal-300 hover:bg-teal-50/80 hover:border-teal-500 text-slate-800 cursor-pointer shadow-xs game-card-hover';
                  }

                  return (
                    <button
                      key={p.id}
                      id={`jodoh-right-${p.id}`}
                      disabled={isMatched || !jodohSelectedLeft}
                      onClick={() => handleJodohRight(p.id)}
                      style={{ animationDelay: `${idx * 80 + 40}ms` }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all anim-bounce-in ${styleClass}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{p.kanan}</span>
                        {isMatched && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instruction Cue */}
            <div className="text-center text-xs text-slate-500 mt-3 p-2 bg-teal-50/50 rounded-xl border border-teal-100">
              {jodohSelectedLeft ? (
                <span className="text-teal-800 font-extrabold animate-pulse">
                  👉 Pilihan Anda aktif! Klik pasangan yang tepat di Kolom 2 sebelah kanan.
                </span>
              ) : (
                <span>Klik salah satu item di Kolom 1 sebelah kiri terlebih dahulu.</span>
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            ENGINE 2 & 7: TIPE KLIK
        ------------------------------------------------------------- */}
        {currentGame.tipe === 'klik' && currentGame.itemKlik && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {currentGame.itemKlik.map((item, idx) => {
                const wasClicked = clickedCards[idx] !== undefined;
                let cardStyle = 'bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-slate-800';

                if (wasClicked) {
                  if (item.benar) {
                    cardStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-xs';
                  } else {
                    cardStyle = 'bg-rose-50 border-rose-300 text-rose-900 opacity-70';
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`klik-item-${idx}`}
                    disabled={wasClicked}
                    onClick={() => handleKlikCard(idx, item.benar)}
                    className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold text-center transition-all flex flex-col items-center justify-center min-h-[90px] gap-2 ${cardStyle}`}
                  >
                    <span>{item.teks}</span>
                    {wasClicked && (
                      <span className="text-xs">
                        {item.benar ? '✅ Tepat' : '❌ Pengecoh'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 text-center">
              Target: Temukan semua item yang sesuai dengan kriteria yang diinstruksikan.
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            ENGINE 3 & 8: TIPE URUT
        ------------------------------------------------------------- */}
        {currentGame.tipe === 'urut' && (
          <div className="space-y-4">
            <div className="space-y-2 max-w-2xl mx-auto">
              {currentUrutList.map((teks, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      id={`urut-up-${idx}`}
                      disabled={idx === 0}
                      onClick={() => moveUrut(idx, -1)}
                      className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      id={`urut-down-${idx}`}
                      disabled={idx === currentUrutList.length - 1}
                      onClick={() => moveUrut(idx, 1)}
                      className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 flex-1">
                    {teks}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                id="check-urut-btn"
                onClick={checkUrut}
                className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition"
              >
                Periksa Urutan
              </button>

              {urutChecked !== null && (
                <div className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                  urutChecked ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {urutChecked ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Urutan Tepat & Sempurna!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      <span>Urutan belum tepat. Gunakan tombol panah untuk memindahkannya!</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            ENGINE 4 & 9: TIPE KUMPUL
        ------------------------------------------------------------- */}
        {currentGame.tipe === 'kumpul' && currentGame.itemKumpul && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2.5 justify-center">
              {currentGame.itemKumpul.map((item, idx) => {
                const isCollected = collectedIndices.includes(idx);
                const isWrong = wrongCollectedIndices.includes(idx);

                return (
                  <button
                    key={idx}
                    id={`kumpul-item-${idx}`}
                    disabled={isCollected || isWrong}
                    onClick={() => handleKumpulItem(idx, item.benar)}
                    className={`px-4 py-2.5 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                      isCollected
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs'
                        : isWrong
                        ? 'bg-rose-100 border-rose-300 text-rose-900 opacity-60 line-through'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-teal-500 hover:bg-teal-50/50 shadow-2xs'
                    }`}
                  >
                    {isCollected ? `✓ ${item.teks}` : item.teks}
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center max-w-md mx-auto">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                Koleksi yang Terkumpul:
              </span>
              <span className="text-sm font-extrabold text-teal-700">
                {collectedIndices.length} dari {currentGame.itemKumpul.filter(i => i.benar).length} Karakteristik
              </span>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            ENGINE 5 & 10: TIPE SAMBUNG (Rantai Logika)
        ------------------------------------------------------------- */}
        {currentGame.tipe === 'sambung' && currentGame.rantaiLogika && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Sebab / Aksi */}
              <div className="space-y-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 block">
                  Kolom 1: Sebab / Tindakan Sosiologis
                </span>
                {currentGame.rantaiLogika.map((item, idx) => {
                  const isMatched = sambungMatchedSebab.includes(idx);
                  const isSelected = selectedSebabIdx === idx;
                  const isWrong = wrongSambungSebab === idx;

                  let styleClass = 'bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-slate-800 game-card-hover';

                  if (isWrong) {
                    styleClass = 'bg-rose-100 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/80 anim-shake shadow-md';
                  } else if (isMatched) {
                    styleClass = 'bg-emerald-50/90 border-emerald-400 text-emerald-800 cursor-default opacity-90 shadow-2xs';
                  } else if (isSelected) {
                    styleClass = 'bg-teal-50 border-teal-600 text-teal-950 font-bold ring-2 ring-teal-500 shadow-md scale-[1.03]';
                  }

                  return (
                    <button
                      key={idx}
                      id={`sambung-sebab-${idx}`}
                      disabled={isMatched}
                      onClick={() => handleSambungSebab(idx)}
                      style={{ animationDelay: `${idx * 80}ms` }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all anim-bounce-in ${styleClass}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{item.sebab}</span>
                        {isMatched && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Akibat / Dampak */}
              <div className="space-y-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 block">
                  Kolom 2: Akibat / Dampak Logis
                </span>
                {shuffledAkibat.map((akibatStr, idx) => {
                  const isMatched = sambungMatchedAkibat.includes(akibatStr);
                  const isWrong = wrongSambungAkibat === akibatStr;
                  const isJustMatched = lastMatchedSambungAkibat === akibatStr;

                  let styleClass = 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed';

                  if (isWrong) {
                    styleClass = 'bg-rose-100 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/80 anim-shake shadow-md';
                  } else if (isJustMatched) {
                    styleClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-extrabold ring-2 ring-emerald-500 anim-pop shadow-lg';
                  } else if (isMatched) {
                    styleClass = 'bg-emerald-50/90 border-emerald-400 text-emerald-800 cursor-default opacity-90 shadow-2xs';
                  } else if (selectedSebabIdx !== null) {
                    styleClass = 'bg-white border-teal-300 hover:bg-teal-50/80 hover:border-teal-500 text-slate-800 cursor-pointer shadow-xs game-card-hover';
                  }

                  return (
                    <button
                      key={idx}
                      id={`sambung-akibat-${idx}`}
                      disabled={isMatched || selectedSebabIdx === null}
                      onClick={() => handleSambungAkibat(akibatStr)}
                      style={{ animationDelay: `${idx * 80 + 40}ms` }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all anim-bounce-in ${styleClass}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{akibatStr}</span>
                        {isMatched && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 mt-3 p-2 bg-teal-50/50 rounded-xl border border-teal-100">
              {selectedSebabIdx !== null ? (
                <span className="text-teal-800 font-extrabold animate-pulse">
                  👉 Pilihan sebab aktif! Klik akibat / dampak logis yang timbul di Kolom 2.
                </span>
              ) : (
                <span>Klik sebab di Kolom 1 sebelah kiri terlebih dahulu untuk menghubungkannya.</span>
              )}
            </div>
          </div>
        )}

            {/* Media Display Bagian Bawah */}
            <MediaDisplay mediaList={currentGame.mediaList} posisiFilter="bawah" />

            {/* Bottom Game Nav Step */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                id="prev-game-btn"
                disabled={activeGameIdx === 0}
                onClick={() => {
                  sound.playClick();
                  setActiveGameIdx(activeGameIdx - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>← Game Sebelumnya</span>
                {activeGameIdx > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    G{activeGameIdx}
                  </span>
                )}
              </button>

              <div className="text-xs font-bold text-slate-500 hidden md:block">
                Game {activeGameIdx + 1} dari {activeGames.length}
              </div>

              {activeGameIdx < activeGames.length - 1 ? (
                <button
                  type="button"
                  id="next-game-btn"
                  onClick={() => {
                    sound.playClick();
                    setActiveGameIdx(activeGameIdx + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs sm:text-sm font-black hover:bg-teal-700 flex items-center justify-center gap-2 shadow-md transition"
                >
                  <span>Game Selanjutnya →</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-800/60 text-teal-100">
                    G{activeGameIdx + 2}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  id="next-game-to-berlatih-btn"
                  onClick={() => {
                    sound.playClick();
                    onNavigateTab?.('berlatih');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-black hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-md transition"
                >
                  <span>🏆 Game Terakhir: Lanjut ke Modul Berlatih →</span>
                </button>
              )}
            </div>

            {/* Banner saat Modul Bermain telah diselesaikan dan Modul Berlatih Terbuka */}
            {(isBermainCompleted || completedGames.some(Boolean)) && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-base font-black">
                      Prasyarat Modul Berlatih Terpenuhi!
                    </h3>
                    <p className="text-xs text-purple-100 mt-0.5">
                      Anda telah menuntaskan aktivitas bermain. Kini <strong>Modul Berlatih (Evaluasi 20 Soal)</strong> telah terbuka.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-goto-berlatih-from-bermain"
                  onClick={() => {
                    sound.playClick();
                    onNavigateTab?.('berlatih');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-black text-xs sm:text-sm shadow-md hover:bg-purple-50 transition shrink-0 flex items-center gap-2"
                >
                  <FileCheck2 size={17} className="text-indigo-600" />
                  <span>Lanjut ke Modul Berlatih →</span>
                </button>
              </div>
            )}

          </div>
        );
      })()
      )}

      {/* 🏆 LEVEL VICTORY CELEBRATION MODAL 🏆 */}
      {showVictoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-400/80 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden animate-scale-up">
            
            {/* Top Glowing Orb */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/30 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-teal-500/30 rounded-full blur-xl pointer-events-none" />

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black text-3xl shadow-xl mb-4 animate-bounce">
              🏆
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2 inline-block">
              LEVEL {activeGameIdx + 1} TUNTAS!
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Luar Biasa! Misi Selesai
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Anda berhasil menyelesaikan <strong>"{currentGame.judul}"</strong> dengan sempurna!
            </p>

            {/* 3 Animated Stars */}
            <div className="flex items-center justify-center gap-3 mb-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              {[1, 2, 3].map(s => (
                <Star
                  key={s}
                  size={36}
                  className="text-amber-400 fill-amber-400 animate-pop drop-shadow-md"
                  style={{ animationDelay: `${s * 0.2}s` }}
                />
              ))}
            </div>

            <div className="space-y-3">
              {activeGameIdx < activeGames.length - 1 ? (
                <button
                  type="button"
                  id="btn-victory-next-level"
                  onClick={() => {
                    sound.playClick();
                    setShowVictoryModal(false);
                    setActiveGameIdx(activeGameIdx + 1);
                    setViewMode('ARENA');
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 hover:from-amber-400 hover:to-orange-400 transition"
                >
                  <Gamepad2 size={18} />
                  <span>🎮 LANJUT KE LEVEL {activeGameIdx + 2} →</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-victory-to-berlatih"
                  onClick={() => {
                    sound.playClick();
                    setShowVictoryModal(false);
                    onNavigateTab?.('berlatih');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition"
                >
                  <FileCheck2 size={18} />
                  <span>🏆 SELURUH MISI TUNTAS: LANJUT MODUL BERLATIH →</span>
                </button>
              )}

              <button
                type="button"
                id="btn-victory-back-map"
                onClick={() => {
                  sound.playClick();
                  setShowVictoryModal(false);
                  setViewMode('MAP');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Map size={16} />
                <span>🗺️ Kembali ke Peta Level</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
