import React from 'react';
import { Heart, Coins, Zap, RotateCw, Gift, ShoppingBag, Plus, Trophy, Flame } from 'lucide-react';
import { GamificationState } from '../types';
import { sound } from '../utils/audio';

interface GamificationHudProps {
  state: GamificationState;
  onOpenRefillHearts: () => void;
  onOpenShop: () => void;
  onOpenSpinWheel: () => void;
}

export const GamificationHud: React.FC<GamificationHudProps> = ({
  state,
  onOpenRefillHearts,
  onOpenShop,
  onOpenSpinWheel,
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        
        {/* Left Section: Hearts & Coins */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Hearts Meter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl px-2.5 py-1 shadow-inner">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: state.maxHearts }).map((_, i) => (
                <span key={i} className="text-xs sm:text-sm animate-pulse-slow">
                  {i < state.hearts ? '❤️' : '🤍'}
                </span>
              ))}
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onOpenRefillHearts();
              }}
              className="w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center font-black text-[11px] ml-1 transition shadow-xs"
              title="Isi Ulang Nyawa Belajar"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Coins Meter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-1 shadow-inner">
            <span className="text-sm">🪙</span>
            <span className="font-mono font-black text-xs text-amber-300 tabular-nums">
              {state.coins.toLocaleString()}
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onOpenShop();
              }}
              className="w-5 h-5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[11px] ml-1 transition shadow-xs"
              title="Buka Toko Koin Sosiologi"
            >
              <Plus size={12} />
            </button>
          </div>

        </div>

        {/* Center Section: XP, Level & Streak */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Streak Indicator */}
          <div className="hidden sm:flex items-center gap-1 bg-amber-500/10 border border-amber-400/30 rounded-2xl px-2.5 py-1 text-amber-300 font-extrabold text-xs">
            <Flame size={14} className="text-amber-400 animate-bounce" />
            <span>{state.streakDays} Hari Streak</span>
          </div>

          {/* XP & Level Badge */}
          <div className="flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-500/40 rounded-2xl px-3 py-1 shadow-inner text-indigo-200">
            <Zap size={14} className="text-amber-400" />
            <span className="font-extrabold text-xs text-white">Lvl {state.level}</span>
            <span className="text-[10px] text-indigo-300 font-medium hidden md:inline">
              ({state.levelTitle})
            </span>
          </div>

        </div>

        {/* Right Section: Action Buttons (Spin, Shop) */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Daily Spin Wheel Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSpinWheel();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
            title="Putar Roda Keberuntungan Harian"
          >
            <RotateCw size={13} className="text-amber-300 animate-spin-slow" />
            <span className="hidden sm:inline">Spin Wheel</span>
          </button>

          {/* Shop & Badges Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-1.5"
            title="Buka Toko Avatar & Badges"
          >
            <ShoppingBag size={13} />
            <span className="hidden sm:inline">Toko</span>
          </button>

        </div>

      </div>
    </div>
  );
};
