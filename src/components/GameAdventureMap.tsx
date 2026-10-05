import React, { useState } from 'react';
import { GameItem } from '../types';
import { getGameIconBadge } from '../utils/iconHelper';
import { 
  Trophy, 
  Star, 
  Flame, 
  MapPin, 
  Play, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Palette, 
  Compass,
  Rocket,
  TreePine,
  Tractor,
  Award,
  Zap
} from 'lucide-react';

export type MapTheme = 'valley' | 'farm' | 'space';

interface GameAdventureMapProps {
  games: GameItem[];
  completedGames: boolean[];
  levelStars: { [key: number]: number };
  levelScores: { [key: number]: number };
  activeLevelIdx: number;
  onSelectLevel: (idx: number) => void;
  mapTheme: MapTheme;
  onChangeTheme: (theme: MapTheme) => void;
}

export const GameAdventureMap: React.FC<GameAdventureMapProps> = ({
  games,
  completedGames,
  levelStars,
  levelScores,
  activeLevelIdx,
  onSelectLevel,
  mapTheme,
  onChangeTheme,
}) => {
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number | null>(null);

  // Total statistics
  const totalStars = (Object.values(levelStars) as number[]).reduce((acc: number, curr: number) => acc + (curr || 0), 0);
  const maxPossibleStars = games.length * 3;
  const totalPoints = (Object.values(levelScores) as number[]).reduce((acc: number, curr: number) => acc + (curr || 0), 0);
  const totalCompleted = completedGames.filter(Boolean).length;

  // Helper: Get X, Y coordinates for serpentine winding trail (S-curve path)
  const getNodePosition = (index: number) => {
    const ySpacing = 120; // vertical spacing
    const topMargin = 100;
    const y = topMargin + index * ySpacing;
    
    // Winding S-curve: sway X between 20% and 80%
    const angle = (index * Math.PI) / 2.2;
    const x = 50 + Math.sin(angle) * 30; // 20% to 80%
    return { x, y };
  };

  const nodePositions = games.map((_, i) => getNodePosition(i));
  const totalHeight = nodePositions.length * 120 + 160;

  // SVG Path generator for smooth serpentine trail
  const generateSvgPath = () => {
    if (nodePositions.length === 0) return '';
    let d = `M ${nodePositions[0].x}% ${nodePositions[0].y}px`;
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const p1 = nodePositions[i];
      const p2 = nodePositions[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x}% ${midY}px, ${p2.x}% ${midY}px, ${p2.x}% ${p2.y}px`;
    }
    return d;
  };

  // Check if a level is unlocked
  const isLevelUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return completedGames[idx - 1] || false;
  };

  // Theme styling configurations
  const themeStyles = {
    valley: {
      bgGradient: 'from-emerald-800 via-green-600 to-teal-900',
      pathStroke: '#fef08a',
      pathBorder: '#854d0e',
      cardBg: 'bg-emerald-950/90 border-emerald-500/40 text-white',
      nodeActive: 'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-200 text-amber-950 ring-4 ring-amber-400/50 shadow-amber-500/50',
      nodeDone: 'bg-gradient-to-b from-sky-400 to-blue-600 border-sky-200 text-white ring-2 ring-sky-300',
      nodeLocked: 'bg-gradient-to-b from-slate-600 to-slate-800 border-slate-500 text-slate-400 opacity-70',
      decorativeIcons: ['🌲', '🏞️', '🌉', '🏕️', '🌻', '🪵', '🍄', '🏞️', '🦅', '🎯']
    },
    farm: {
      bgGradient: 'from-amber-800 via-lime-700 to-emerald-900',
      pathStroke: '#fed7aa',
      pathBorder: '#7c2d12',
      cardBg: 'bg-amber-950/90 border-amber-500/40 text-white',
      nodeActive: 'bg-gradient-to-b from-yellow-300 to-amber-500 border-yellow-200 text-amber-950 ring-4 ring-yellow-400/50 shadow-yellow-500/50',
      nodeDone: 'bg-gradient-to-b from-amber-500 to-orange-600 border-amber-200 text-white ring-2 ring-amber-300',
      nodeLocked: 'bg-gradient-to-b from-stone-600 to-stone-800 border-stone-500 text-stone-400 opacity-70',
      decorativeIcons: ['🚜', '🌽', '🏡', '🌾', '🍎', '🌻', '🐄', '🧺', '🐥', '🏆']
    },
    space: {
      bgGradient: 'from-slate-950 via-indigo-950 to-purple-950',
      pathStroke: '#38bdf8',
      pathBorder: '#1e1b4b',
      cardBg: 'bg-slate-900/90 border-cyan-500/40 text-white',
      nodeActive: 'bg-gradient-to-b from-cyan-300 to-blue-500 border-cyan-200 text-cyan-950 ring-4 ring-cyan-400/60 shadow-cyan-500/60',
      nodeDone: 'bg-gradient-to-b from-purple-500 to-indigo-600 border-purple-200 text-white ring-2 ring-purple-300',
      nodeLocked: 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 text-slate-500 opacity-60',
      decorativeIcons: ['🚀', '🪐', '🛸', '⭐', '☄️', '🌌', '🌍', '🛰️', '✨', '🏆']
    }
  };

  const currentTheme = themeStyles[mapTheme];

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 animate-fade-in">
      
      {/* 🌟 TOP ADVENTURE HUD BAR 🌟 */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-2xl mb-6 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Title & Level Progress */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
              <Compass size={26} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Peta Petualangan Level
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  {totalCompleted} / {games.length} Level Selesai
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Peta Misi Sosiologi Interaktif
              </h1>
            </div>
          </div>

          {/* Player Stats Widgets: Stars, Points, Gems */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-end">
            
            {/* Stars Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-xs sm:text-sm shadow-inner">
              <Star size={16} className="fill-amber-400 text-amber-300 animate-pulse" />
              <span>{totalStars} / {maxPossibleStars}</span>
            </div>

            {/* Points / Score Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs sm:text-sm shadow-inner">
              <Zap size={16} className="fill-emerald-400 text-emerald-300" />
              <span>{totalPoints.toLocaleString()} PTS</span>
            </div>

            {/* Theme Selector Dropdown / Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => onChangeTheme('valley')}
                title="Tema Lembah Hijau"
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  mapTheme === 'valley' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TreePine size={14} />
                <span className="hidden sm:inline">Lembah</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeTheme('farm')}
                title="Tema Pedesaan Sosiologi"
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  mapTheme === 'farm' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tractor size={14} />
                <span className="hidden sm:inline">Pedesaan</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeTheme('space')}
                title="Tema Kosmos Sci-Fi"
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  mapTheme === 'space' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Rocket size={14} />
                <span className="hidden sm:inline">Space</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 🗺️ WINDING MAP CANVAS AREA 🗺️ */}
      <div 
        className={`relative w-full rounded-3xl border-2 border-slate-700/80 shadow-2xl overflow-hidden bg-gradient-to-b ${currentTheme.bgGradient}`}
        style={{ minHeight: `${totalHeight}px` }}
      >
        
        {/* Background Scenery Grid / Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/40 pointer-events-none" />

        {/* SVG Serpentine Trail Path */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ height: `${totalHeight}px` }}
        >
          {/* Outer thick road glow line */}
          <path
            d={generateSvgPath()}
            fill="none"
            stroke={currentTheme.pathBorder}
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          {/* Inner main trail line */}
          <path
            d={generateSvgPath()}
            fill="none"
            stroke={currentTheme.pathStroke}
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="12 8"
          />
        </svg>

        {/* Decorative Scenery Landmarks Scattered Along the Trail */}
        {nodePositions.map((pos, idx) => {
          const side = idx % 2 === 0 ? 'right' : 'left';
          const icon = currentTheme.decorativeIcons[idx % currentTheme.decorativeIcons.length];
          const decoX = side === 'right' ? Math.min(88, pos.x + 22) : Math.max(8, pos.x - 22);

          return (
            <div
              key={`deco-${idx}`}
              className="absolute pointer-events-none text-2xl sm:text-3xl select-none animate-float drop-shadow-md z-0"
              style={{
                top: `${pos.y - 25}px`,
                left: `${decoX}%`,
                animationDelay: `${idx * 0.4}s`
              }}
            >
              {icon}
            </div>
          );
        })}

        {/* 🔴 LEVEL NODE BUTTONS 🔴 */}
        {games.map((g, idx) => {
          const pos = nodePositions[idx];
          const isUnlocked = isLevelUnlocked(idx);
          const isDone = completedGames[idx];
          const isCurrentActive = idx === activeLevelIdx;
          const starsEarned = levelStars[idx] || (isDone ? 3 : 0);
          const badge = getGameIconBadge(g, idx, 18);

          let nodeStyle = currentTheme.nodeLocked;
          if (isCurrentActive) {
            nodeStyle = currentTheme.nodeActive;
          } else if (isDone || isUnlocked) {
            nodeStyle = currentTheme.nodeDone;
          }

          return (
            <div
              key={g.id || idx}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                top: `${pos.y}px`,
                left: `${pos.x}%`
              }}
            >
              
              {/* Active Player Character Avatar Marker Pin */}
              {isCurrentActive && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-30 pointer-events-none">
                  <div className="px-2.5 py-1 bg-amber-400 text-amber-950 text-[10px] font-black rounded-full shadow-lg border border-white whitespace-nowrap flex items-center gap-1">
                    <MapPin size={12} className="fill-current text-rose-600" />
                    <span>POSISI ANDA</span>
                  </div>
                  <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-amber-400" />
                </div>
              )}

              {/* Node Button */}
              <button
                type="button"
                id={`map-node-btn-${idx + 1}`}
                onClick={() => {
                  if (!isUnlocked) return;
                  setSelectedNodeIdx(idx);
                }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex flex-col items-center justify-center relative transition-transform duration-300 shadow-xl ${
                  isUnlocked ? 'cursor-pointer hover:scale-115 active:scale-95' : 'cursor-not-allowed opacity-75'
                } ${nodeStyle}`}
              >
                
                {/* Level Number */}
                <span className="font-black text-sm sm:text-base leading-none">
                  {idx + 1}
                </span>

                {/* Sub label or icon */}
                <span className="text-[9px] font-bold tracking-tight opacity-90 truncate max-w-[40px]">
                  {g.tipe.toUpperCase()}
                </span>

                {/* Lock Icon if locked */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-slate-300">
                    <Lock size={18} />
                  </div>
                )}

                {/* Stars Badges Below Node */}
                {isUnlocked && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 bg-slate-900/90 px-1.5 py-0.5 rounded-full border border-slate-700 shadow-md whitespace-nowrap">
                    {[1, 2, 3].map(starNum => (
                      <Star
                        key={starNum}
                        size={10}
                        className={
                          starNum <= starsEarned
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600 fill-slate-700'
                        }
                      />
                    ))}
                  </div>
                )}
              </button>

            </div>
          );
        })}

        {/* Bottom Trail Goal Flag */}
        <div 
          className="absolute z-10 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{
            top: `${totalHeight - 70}px`,
            left: `${nodePositions[nodePositions.length - 1]?.x || 50}%`
          }}
        >
          <div className="p-3 rounded-2xl bg-amber-400 text-amber-950 font-black border-2 border-white shadow-2xl flex items-center gap-2 animate-pulse">
            <Trophy size={20} className="fill-current text-amber-700" />
            <span className="text-xs uppercase tracking-wider">PUNCAK MISI SOSIOLOGI</span>
          </div>
        </div>

      </div>

      {/* 🚀 LEVEL PREVIEW LAUNCH MODAL 🚀 */}
      {selectedNodeIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          {(() => {
            const g = games[selectedNodeIdx];
            const isDone = completedGames[selectedNodeIdx];
            const stars = levelStars[selectedNodeIdx] || (isDone ? 3 : 0);
            const score = levelScores[selectedNodeIdx] || 0;
            const badge = getGameIconBadge(g, selectedNodeIdx, 24);

            return (
              <div className="bg-slate-900 border-2 border-slate-700 text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden animate-scale-up">
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedNodeIdx(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                >
                  ✕
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3.5 rounded-2xl ${badge.bgClass} border ${badge.borderClass} shrink-0`}>
                    {badge.icon}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                      Misi Level {selectedNodeIdx + 1} • {g.tipe.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-black text-white leading-snug">
                      {g.judul}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-5 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  {g.instruksi}
                </p>

                {/* Stars & Highscore Summary */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pencapaian Bintang</span>
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          size={18}
                          className={s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Skor Tertinggi</span>
                    <span className="text-sm font-black text-emerald-400">{score.toLocaleString()} PTS</span>
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  type="button"
                  id={`btn-launch-level-${selectedNodeIdx + 1}`}
                  onClick={() => {
                    onSelectLevel(selectedNodeIdx);
                    setSelectedNodeIdx(null);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition transform active:scale-98"
                >
                  <Play size={18} className="fill-current" />
                  <span>🚀 MAIN SEKARANG (LEVEL {selectedNodeIdx + 1})</span>
                </button>

              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
};
