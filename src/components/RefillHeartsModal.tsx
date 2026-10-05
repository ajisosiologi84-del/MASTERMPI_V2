import React, { useState } from 'react';
import { X, Heart, Sparkles, HelpCircle, CheckCircle2, Coins, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface RefillHeartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onRefillByCoins: () => void;
  onRefillByQuiz: () => void;
}

export const RefillHeartsModal: React.FC<RefillHeartsModalProps> = ({
  isOpen,
  onClose,
  coins,
  onRefillByCoins,
  onRefillByQuiz,
}) => {
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const miniReflectionQuestion = {
    tanya: "Apa yang dimaksud dengan Kelompok Sosial menurut perspektif Sosiologi?",
    opsi: [
      "Kumpulan individu yang tidak saling mengenal satu sama lain.",
      "Kumpulan individu yang memiliki kesadaran bersama, norma, dan interaksi yang terstruktur.",
      "Antrean orang di halte bus tanpa adanya interaksi atau tujuan bersama."
    ],
    kunci: 1
  };

  const handleAnswerQuiz = (idx: number) => {
    setSelectedOpt(idx);
    if (idx === miniReflectionQuestion.kunci) {
      setIsCorrect(true);
      sound.playVictory();
      setTimeout(() => {
        onRefillByQuiz();
        setActiveQuiz(false);
        setSelectedOpt(null);
        setIsCorrect(null);
      }, 1500);
    } else {
      setIsCorrect(false);
      sound.playError();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative overflow-hidden text-center">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-400/40 text-rose-400 flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg">
          ❤️
        </div>

        <h2 className="text-xl font-black text-white mb-1">
          Isi Ulang Nyawa Belajar (Hearts)
        </h2>
        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          Nyawa diperlukan untuk menyelesaikan tantangan game & asesmen kuis Sosiologi.
        </p>

        {!activeQuiz ? (
          <div className="space-y-3">
            {/* Option 1: Refill with Quiz */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveQuiz(true);
              }}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:brightness-110 shadow-lg transition flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
                  💡
                </div>
                <div>
                  <h3 className="font-extrabold text-xs">Jawab 1 Kuis Refleksi Gratis</h3>
                  <p className="text-[11px] text-emerald-100">Dapatkan +3 Nyawa gratis dengan menjawab kuis sosiologi singkat.</p>
                </div>
              </div>
            </button>

            {/* Option 2: Refill with Coins */}
            <button
              onClick={() => {
                if (coins >= 50) {
                  sound.playVictory();
                  onRefillByCoins();
                } else {
                  sound.playError();
                }
              }}
              disabled={coins < 50}
              className={`w-full p-4 rounded-2xl border transition flex items-center justify-between text-left ${
                coins >= 50
                  ? 'bg-amber-500/20 border-amber-400/60 hover:bg-amber-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
                  🪙
                </div>
                <div>
                  <h3 className="font-extrabold text-xs">Tukar 50 Koin Sosiologi</h3>
                  <p className="text-[11px] text-slate-300">Langsung isi penuh 5 Nyawa sekaligus (Saldo: {coins} Koin).</p>
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* Mini Refleksi Quiz */
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
            <h3 className="font-extrabold text-xs text-emerald-400 flex items-center gap-1.5">
              <HelpCircle size={16} />
              <span>Kuis Refleksi Isi Ulang Nyawa:</span>
            </h3>
            <p className="text-xs font-bold text-white leading-relaxed">{miniReflectionQuestion.tanya}</p>

            <div className="space-y-2 pt-1">
              {miniReflectionQuestion.opsi.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerQuiz(idx)}
                  className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition ${
                    selectedOpt === idx
                      ? isCorrect
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                        : 'bg-rose-500/20 border-rose-400 text-rose-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-black mr-2">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {isCorrect === true && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold text-center animate-bounce-in">
                🎉 Benar! Nyawa Berhasil Diisi +3 ❤️
              </div>
            )}

            {isCorrect === false && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400 text-rose-300 text-xs font-bold text-center">
                ❌ Belum tepat! Coba pilih jawaban yang paling sesuai.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
