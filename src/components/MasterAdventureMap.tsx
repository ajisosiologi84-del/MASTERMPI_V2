import React, { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Flame, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Gamepad2, 
  FileCheck2, 
  Play, 
  RotateCcw,
  Compass,
  Zap,
  Award,
  Crown,
  X
} from 'lucide-react';
import { MateriItem, GameItem, SoalLatih, GamificationState } from '../types';
import { AVATARS_CATALOG } from '../utils/gamificationEngine';
import { sound } from '../utils/audio';

export interface MapNode {
  id: string;
  number: number;
  type: 'materi' | 'game' | 'asesmen';
  title: string;
  subtitle: string;
  rewardCoins: number;
  rewardXp: number;
  originalIndex: number;
  isBoss?: boolean;
}

interface MasterAdventureMapProps {
  materiList: MateriItem[];
  gameList: GameItem[];
  soalList: SoalLatih[];
  gamification: GamificationState;
  onNavigateToNode: (node: MapNode) => void;
  onOpenShop: () => void;
  onOpenSpinWheel: () => void;
}

export const MasterAdventureMap: React.FC<MasterAdventureMapProps> = ({
  materiList,
  gameList,
  soalList,
  gamification,
  onNavigateToNode,
  onOpenShop,
  onOpenSpinWheel,
}) => {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  // Combine all learning milestones into 1 ordered sequential level path!
  const mapNodes: MapNode[] = [];
  let nodeCounter = 1;

  // 1. Add Materi nodes
  materiList.forEach((m, idx) => {
    mapNodes.push({
      id: `materi_${m.id}`,
      number: nodeCounter++,
      type: 'materi',
      title: m.judul,
      subtitle: `Modul Belajar: ${m.kategori}`,
      rewardCoins: 100,
      rewardXp: 50,
      originalIndex: idx,
    });
  });

  // 2. Add Game nodes
  gameList.forEach((g, idx) => {
    mapNodes.push({
      id: `game_${g.id}`,
      number: nodeCounter++,
      type: 'game',
      title: g.judul,
      subtitle: `Tantangan Game Sosiologi`,
      rewardCoins: 150,
      rewardXp: 80,
      originalIndex: idx,
    });
  });

  // 3. Add Boss Asesmen Node
  mapNodes.push({
    id: 'asesmen_boss',
    number: nodeCounter++,
    type: 'asesmen',
    title: 'Evaluasi Final Sosiologi HOTS',
    subtitle: 'Ujian Kelulusan & Klaim Sertifikat',
    rewardCoins: 500,
    rewardXp: 300,
    originalIndex: 0,
    isBoss: true,
  });

  // Calculate coordinates for S-curve trail
  const getNodePosition = (index: number) => {
    const ySpacing = 130;
    const topMargin = 90;
    const y = topMargin + index * ySpacing;
    const angle = (index * Math.PI) / 2.2;
    const x = 50 + Math.sin(angle) * 32; // 18% to 82%
    return { x, y };
  };

  const nodePositions = mapNodes.map((_, i) => getNodePosition(i));
  const totalMapHeight = nodePositions.length * 130 + 180;

  // Generate SVG path for the trail
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

  // Check if a node is unlocked
  const isNodeUnlocked = (idx: number) => {
    if (idx === 0) return true; // first node always unlocked
    const prevNode = mapNodes[idx - 1];
    return gamification.completedNodes.includes(prevNode.id);
  };

  const currentAvatar = AVATARS_CATALOG.find(a => a.id === gamification.activeAvatarId) || AVATARS_CATALOG[0];

  // Theme styling configurations
  const themeStyles = {
    valley: {
      bgGradient: 'from-emerald-900 via-green-800 to-teal-950',
      pathStroke: '#fef08a',
      pathBorder: '#854d0e',
      cardBg: 'bg-emerald-950/90 border-emerald-500/40 text-white',
      nodeActive: 'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-200 text-amber-950 ring-4 ring-amber-400/60 shadow-amber-500/50',
      nodeDone: 'bg-gradient-to-b from-sky-400 to-blue-600 border-sky-200 text-white ring-2 ring-sky-300',
      nodeLocked: 'bg-gradient-to-b from-slate-600 to-slate-800 border-slate-500 text-slate-400 opacity-70',
      decorations: ['🌲', '🏞️', '🌉', '🏕️', '🌻', '🪵', '🍄', '🦅', '🎯', '🌿']
    },
    farm: {
      bgGradient: 'from-amber-900 via-lime-800 to-emerald-950',
      pathStroke: '#fed7aa',
      pathBorder: '#7c2d12',
      cardBg: 'bg-amber-950/90 border-amber-500/40 text-white',
      nodeActive: 'bg-gradient-to-b from-yellow-300 to-amber-500 border-yellow-200 text-amber-950 ring-4 ring-yellow-400/60 shadow-yellow-500/50',
      nodeDone: 'bg-gradient-to-b from-amber-500 to-orange-600 border-amber-200 text-white ring-2 ring-amber-300',
      nodeLocked: 'bg-gradient-to-b from-stone-600 to-stone-800 border-stone-500 text-stone-400 opacity-70',
      decorations: ['🚜', '🌽', '🏡', '🌾', '🍎', '🌻', '🐄', '🧺', '🐥', '🏆']
    },
    space: {
      bgGradient: 'from-slate-950 via-indigo-950 to-purple-950',
      pathStroke: '#38bdf8',
      pathBorder: '#1e1b4b',
      cardBg: 'bg-slate-900/90 border-cyan-500/40 text-white',
      nodeActive: 'bg-gradient-to-b from-cyan-300 to-blue-500 border-cyan-200 text-cyan-950 ring-4 ring-cyan-400/60 shadow-cyan-500/60',
      nodeDone: 'bg-gradient-to-b from-purple-500 to-indigo-600 border-purple-200 text-white ring-2 ring-purple-300',
      nodeLocked: 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 text-slate-500 opacity-60',
      decorations: ['🚀', '🪐', '🛸', '⭐', '☄️', '🌌', '🌍', '🛰️', '✨', '🏆']
    },
    island: {
      bgGradient: 'from-cyan-900 via-teal-800 to-blue-950',
      pathStroke: '#fef08a',
      pathBorder: '#155e75',
      cardBg: 'bg-teal-950/90 border-teal-500/40 text-white',
      nodeActive: 'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-200 text-amber-950 ring-4 ring-amber-400/60 shadow-amber-500/50',
      nodeDone: 'bg-gradient-to-b from-cyan-400 to-blue-600 border-cyan-200 text-white ring-2 ring-cyan-300',
      nodeLocked: 'bg-gradient-to-b from-slate-700 to-slate-900 border-slate-600 text-slate-400 opacity-70',
      decorations: ['🏖️', '🌴', '⛵', '🌊', '🐚', '🦜', '🥥', '🌅', '🌺', '🏆']
    },
    cyber: {
      bgGradient: 'from-fuchsia-950 via-purple-950 to-slate-950',
      pathStroke: '#f43f5e',
      pathBorder: '#701a75',
      cardBg: 'bg-purple-950/90 border-fuchsia-500/40 text-white',
      nodeActive: 'bg-gradient-to-b from-fuchsia-400 to-pink-600 border-fuchsia-200 text-white ring-4 ring-fuchsia-400/60 shadow-fuchsia-500/60',
      nodeDone: 'bg-gradient-to-b from-violet-500 to-indigo-600 border-violet-200 text-white ring-2 ring-violet-300',
      nodeLocked: 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 text-slate-500 opacity-60',
      decorations: ['🏙️', '⚡', '🤖', '🎮', '🛸', '🛰️', '💾', '🌐', '💎', '🏆']
    }
  };

  const theme = themeStyles[gamification.activeMapTheme] || themeStyles.valley;

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 space-y-6 animate-fade-in">
      
      {/* 🌟 BANNER HEADER PETA PETUALANGAN 🌟 */}
      <div className="bg-slate-900/95 text-white rounded-3xl p-5 border border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0 text-2xl">
            {currentAvatar.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider border border-amber-400/30">
                Peta Misi Sosiologi SMA
              </span>
              <span className="text-xs text-slate-400 font-bold">
                {gamification.completedNodes.length} / {mapNodes.length} Misi Terbuka
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Peta Petualangan Belajar Interaktif
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 z-10 w-full md:w-auto">
          <button
            onClick={() => {
              sound.playClick();
              onOpenSpinWheel();
            }}
            className="flex-1 md:flex-none px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} className="animate-spin-slow text-amber-300" />
            <span>Spin Wheel</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="flex-1 md:flex-none px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <span>🛒 Toko & Badges</span>
          </button>
        </div>
      </div>

      {/* 🗺️ CANVAS MAP TRAIL CONTAINER 🗺️ */}
      <div className={`rounded-3xl bg-gradient-to-b ${theme.bgGradient} p-4 sm:p-8 shadow-2xl border-4 border-slate-800/80 relative overflow-hidden`}>
        
        {/* Scrollable Map Body */}
        <div className="relative w-full mx-auto" style={{ height: `${totalMapHeight}px` }}>
          
          {/* SVG Connecting Serpentine Trail */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {/* Thick Border Trail */}
            <path
              d={generateSvgPath()}
              fill="none"
              stroke={theme.pathBorder}
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner Golden Trail */}
            <path
              d={generateSvgPath()}
              fill="none"
              stroke={theme.pathStroke}
              strokeWidth="10"
              strokeDasharray="14, 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse-slow"
            />
          </svg>

          {/* Random Decorative Scenery Icons along path */}
          {nodePositions.map((pos, idx) => {
            const decIcon = theme.decorations[idx % theme.decorations.length];
            const side = idx % 2 === 0 ? pos.x - 22 : pos.x + 22;
            return (
              <div
                key={`dec_${idx}`}
                className="absolute text-2xl sm:text-3xl select-none opacity-80 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition duration-500"
                style={{ left: `${Math.max(8, Math.min(92, side))}%`, top: `${pos.y + 30}px` }}
              >
                {decIcon}
              </div>
            );
          })}

          {/* Interactive Level Nodes */}
          {mapNodes.map((node, idx) => {
            const pos = nodePositions[idx];
            const isUnlocked = isNodeUnlocked(idx);
            const isCompleted = gamification.completedNodes.includes(node.id);
            const stars = gamification.nodeStars[node.id] || (isCompleted ? 3 : 0);
            
            // Find current active node (first unlocked & uncompleted node)
            const isActiveNode = isUnlocked && !isCompleted && (idx === 0 || gamification.completedNodes.includes(mapNodes[idx - 1].id));

            return (
              <div
                key={node.id}
                className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${pos.x}%`, top: `${pos.y}px` }}
              >
                
                {/* Active Student Avatar Marker */}
                {isActiveNode && (
                  <div className="absolute -top-16 flex flex-col items-center animate-bounce z-30 pointer-events-none">
                    <div className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-md border border-amber-200 whitespace-nowrap mb-0.5">
                      {currentAvatar.name}
                    </div>
                    <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-xl shadow-xl">
                      {currentAvatar.emoji}
                    </div>
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-amber-400" />
                  </div>
                )}

                {/* Level Node Circle Button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedNode(node);
                  }}
                  disabled={!isUnlocked}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full font-black flex flex-col items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 ${
                    isCompleted
                      ? theme.nodeDone
                      : isActiveNode
                      ? theme.nodeActive
                      : theme.nodeLocked
                  }`}
                >
                  {/* Node Badge Content */}
                  {node.isBoss ? (
                    <span className="text-2xl sm:text-3xl animate-pulse">👑</span>
                  ) : !isUnlocked ? (
                    <Lock size={22} className="text-slate-400" />
                  ) : (
                    <>
                      <span className="text-xs uppercase font-extrabold tracking-tight opacity-80">
                        {node.type === 'materi' ? 'Bab' : node.type === 'game' ? 'Game' : 'Kuis'}
                      </span>
                      <span className="text-lg sm:text-xl font-black leading-none">
                        {node.number}
                      </span>
                    </>
                  )}

                  {/* Stars Achieved Indicator */}
                  {isUnlocked && (
                    <div className="absolute -bottom-2 flex items-center justify-center gap-0.5 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-700/80 shadow-md">
                      {Array.from({ length: 3 }).map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          size={10}
                          className={sIdx < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
                        />
                      ))}
                    </div>
                  )}
                </button>

                {/* Quiet Label under Node */}
                <span className="mt-2 text-[11px] font-extrabold text-white max-w-[110px] text-center line-clamp-1 bg-slate-950/70 px-2 py-0.5 rounded-lg backdrop-blur-xs border border-slate-800">
                  {node.title}
                </span>

              </div>
            );
          })}

        </div>

      </div>

      {/* 📋 NODE DETAILS PREVIEW MODAL 📋 */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl relative text-center">
            
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
              {selectedNode.type === 'materi' ? '📖' : selectedNode.type === 'game' ? '🎮' : '👑'}
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider border border-amber-400/30 inline-block mb-1">
              {selectedNode.subtitle}
            </span>
            <h2 className="text-lg font-black text-white mb-2">{selectedNode.title}</h2>

            {/* Rewards */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 my-4 flex items-center justify-around text-xs font-bold">
              <span className="text-amber-300 flex items-center gap-1">
                🪙 +{selectedNode.rewardCoins} Koin
              </span>
              <span className="text-indigo-300 flex items-center gap-1">
                ⚡ +{selectedNode.rewardXp} XP
              </span>
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                sound.playVictory();
                onNavigateToNode(selectedNode);
                setSelectedNode(null);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-2"
            >
              <Play size={16} className="fill-slate-950" />
              <span>MULAI PETUALANGAN</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
