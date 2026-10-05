import React, { useState } from 'react';
import { X, Sparkles, Trophy, Gift, RotateCw, Heart, Coins, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWinPrize: (type: 'coins' | 'hearts' | 'xp', amount: number, label: string) => void;
  coins: number;
}

interface Prize {
  id: number;
  label: string;
  type: 'coins' | 'hearts' | 'xp';
  amount: number;
  color: string;
  icon: string;
}

const WHEEL_PRIZES: Prize[] = [
  { id: 0, label: '50 Koin', type: 'coins', amount: 50, color: 'bg-amber-500', icon: '🪙' },
  { id: 1, label: '+1 Nyawa', type: 'hearts', amount: 1, color: 'bg-rose-500', icon: '❤️' },
  { id: 2, label: '100 Koin', type: 'coins', amount: 100, color: 'bg-yellow-500', icon: '🪙' },
  { id: 3, label: '150 XP', type: 'xp', amount: 150, color: 'bg-indigo-500', icon: '⚡' },
  { id: 4, label: '200 Koin', type: 'coins', amount: 200, color: 'bg-emerald-500', icon: '💰' },
  { id: 5, label: '+2 Nyawa', type: 'hearts', amount: 2, color: 'bg-pink-500', icon: '💖' },
  { id: 6, label: '300 Koin', type: 'coins', amount: 300, color: 'bg-amber-600', icon: '🌟' },
  { id: 7, label: 'JACKPOT 500', type: 'coins', amount: 500, color: 'bg-purple-600', icon: '👑' },
];

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  onWinPrize,
  coins,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);
    sound.playClick();

    // Randomize rotation (at least 5 full spins + slice index)
    const prizeIdx = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const sliceDeg = 360 / WHEEL_PRIZES.length;
    // Calculate rotation to align the slice at the top pointer (0 deg)
    const extraSpins = 5 * 360;
    const targetDeg = rotationDeg + extraSpins + (360 - (prizeIdx * sliceDeg)) + (sliceDeg / 2);

    setRotationDeg(targetDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = WHEEL_PRIZES[prizeIdx];
      setWonPrize(prize);
      sound.playVictory();
      onWinPrize(prize.type, prize.amount, prize.label);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-400/80 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative overflow-hidden text-center">
        
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSpinning}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Header Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider mb-2">
          <Sparkles size={14} />
          <span>Roda Keberuntungan Sosiologi</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
          Putar Roda & Dapatkan Hadiah!
        </h2>
        <p className="text-xs text-slate-300 mb-6">
          Kumpulkan Koin 🪙, Nyawa Extra ❤️, dan XP ⚡ untuk membantu petualangan belajarmu.
        </p>

        {/* Spin Wheel Visual Container */}
        <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
          
          {/* Top Pointer */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-md" />

          {/* Rotating Wheel Circle */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400/90 shadow-2xl relative overflow-hidden transition-transform ease-out duration-[4000ms]"
            style={{ transform: `rotate(${rotationDeg}deg)` }}
          >
            {WHEEL_PRIZES.map((prize, idx) => {
              const rotateDeg = idx * (360 / WHEEL_PRIZES.length);
              return (
                <div
                  key={prize.id}
                  className={`absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center ${prize.color}`}
                  style={{
                    transform: `rotate(${rotateDeg}deg) skewY(-45deg)`,
                  }}
                >
                  <div
                    className="flex flex-col items-center justify-center text-white font-black text-[11px] select-none"
                    style={{
                      transform: 'skewY(45deg) rotate(22.5deg) translate(28px, -10px)',
                    }}
                  >
                    <span className="text-lg">{prize.icon}</span>
                    <span className="drop-shadow-sm whitespace-nowrap">{prize.amount}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Wheel Hub Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="absolute z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-slate-900 text-slate-950 font-black text-xs shadow-xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition disabled:opacity-80"
          >
            <RotateCw size={18} className={isSpinning ? 'animate-spin' : ''} />
            <span className="text-[10px] uppercase font-extrabold">{isSpinning ? '...' : 'PUTAR'}</span>
          </button>
        </div>

        {/* Won Prize Announcement */}
        {wonPrize && (
          <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-2xl p-3 mb-4 animate-bounce-in text-center">
            <span className="text-xs font-extrabold text-emerald-300 block">
              🎉 SELAMAT! ANDA MENDAPATKAN:
            </span>
            <span className="text-lg font-black text-white flex items-center justify-center gap-2 mt-0.5">
              <span>{wonPrize.icon}</span>
              <span>{wonPrize.label}</span>
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-2"
        >
          <RotateCw size={18} className={isSpinning ? 'animate-spin' : ''} />
          <span>{isSpinning ? 'Sedang Memutar Roda...' : 'Putar Roda Sekarang Gratis!'}</span>
        </button>

      </div>
    </div>
  );
};
