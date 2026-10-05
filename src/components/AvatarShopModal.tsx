import React, { useState } from 'react';
import { X, Sparkles, ShoppingBag, Trophy, Palette, Check, Lock, Coins, ShieldCheck, Heart } from 'lucide-react';
import { GamificationState } from '../types';
import { AVATARS_CATALOG, BADGES_CATALOG } from '../utils/gamificationEngine';
import { sound } from '../utils/audio';

interface AvatarShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  gamification: GamificationState;
  onBuyAvatar: (avatarId: string, price: number) => void;
  onSelectAvatar: (avatarId: string) => void;
  onSelectTheme: (theme: 'valley' | 'farm' | 'space' | 'island' | 'cyber') => void;
}

export const AvatarShopModal: React.FC<AvatarShopModalProps> = ({
  isOpen,
  onClose,
  gamification,
  onBuyAvatar,
  onSelectAvatar,
  onSelectTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'theme' | 'badges'>('avatar');

  if (!isOpen) return null;

  const THEMES_LIST = [
    { id: 'valley', name: 'Lembah Hijau Sosiologi', emoji: '🌲', color: 'from-emerald-800 to-teal-900', desc: 'Nuansa alam perbukitan yang hijau dan menyegarkan.' },
    { id: 'farm', name: 'Ladang Cendekiawan', emoji: '🌾', color: 'from-amber-800 to-orange-950', desc: 'Nuansa pedesaan dengan panen ilmu pengetahuan.' },
    { id: 'space', name: 'Galaxy Antariksa Sosial', emoji: '🚀', color: 'from-slate-950 to-indigo-950', desc: 'Menjelajahi fenomena sosial hingga tingkat antariksa.' },
    { id: 'island', name: 'Pulau Tropis Sosiologi', emoji: '🏖️', color: 'from-cyan-800 to-blue-950', desc: 'Keindahan pesisir pantai interaktif.' },
    { id: 'cyber', name: 'Cyberpunk Sosiologi 2077', emoji: '🏙️', color: 'from-purple-900 to-fuchsia-950', desc: 'Dunia teknologi masa depan dan dinamika sosial modern.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-400/70 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col text-white shadow-2xl relative overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">Toko & Koleksi Sosiologi</h2>
              <div className="flex items-center gap-3 text-xs text-amber-300 font-bold">
                <span className="flex items-center gap-1">
                  <Coins size={14} className="text-amber-400" />
                  <span>{gamification.coins} Koin</span>
                </span>
                <span>•</span>
                <span>Level {gamification.level} ({gamification.levelTitle})</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-3 bg-slate-950/60 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 ${
              activeTab === 'avatar'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>🧑‍🎓 Avatar Siswa</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 ${
              activeTab === 'theme'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Palette size={14} />
            <span>Tema Peta</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 ${
              activeTab === 'badges'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Trophy size={14} />
            <span>Lencana ({gamification.unlockedBadges.length}/{BADGES_CATALOG.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: AVATARS */}
          {activeTab === 'avatar' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AVATARS_CATALOG.map((item) => {
                const isUnlocked = gamification.unlockedAvatars.includes(item.id);
                const isActive = gamification.activeAvatarId === item.id;
                const canAfford = gamification.coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition relative flex flex-col justify-between gap-3 ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/50'
                        : isUnlocked
                        ? 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 text-3xl flex items-center justify-center shrink-0 shadow-inner">
                        {item.emoji}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white">{item.name}</h3>
                        <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      {isUnlocked ? (
                        isActive ? (
                          <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                            <Check size={14} /> Terapkan Sekarang
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              sound.playClick();
                              onSelectAvatar(item.id);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition"
                          >
                            Gunakan Avatar
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              sound.playVictory();
                              onBuyAvatar(item.id, item.price);
                            } else {
                              sound.playError();
                            }
                          }}
                          disabled={!canAfford}
                          className={`w-full py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                            canAfford
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Coins size={14} />
                          <span>Beli {item.price} Koin</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: MAP THEMES */}
          {activeTab === 'theme' && (
            <div className="space-y-3">
              {THEMES_LIST.map((theme) => {
                const isActive = gamification.activeMapTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 bg-gradient-to-r ${theme.color} ${
                      isActive ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{theme.emoji}</span>
                      <div>
                        <h3 className="font-extrabold text-sm text-white">{theme.name}</h3>
                        <p className="text-xs text-slate-300 leading-tight">{theme.desc}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        onSelectTheme(theme.id as 'valley' | 'farm' | 'space' | 'island' | 'cyber');
                      }}
                      className={`px-4 py-2 rounded-xl font-black text-xs transition shrink-0 ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      {isActive ? 'Aktif' : 'Pilih Tema'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: BADGES */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGES_CATALOG.map((badge) => {
                const isUnlocked = gamification.unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                      isUnlocked
                        ? 'bg-amber-500/10 border-amber-400/60 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                      isUnlocked ? 'bg-amber-400/20 border border-amber-400/40' : 'bg-slate-800/80 grayscale opacity-50'
                    }`}>
                      {badge.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                        <span>{badge.title}</span>
                        {isUnlocked && <ShieldCheck size={14} className="text-amber-400" />}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
