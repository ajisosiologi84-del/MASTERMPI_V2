import { GamificationState, AvatarItem, BadgeItem } from '../types';
import { sound } from './audio';

const STORAGE_KEY = 'MPI_GAMIFICATION_STATE_V1';

export const AVATARS_CATALOG: AvatarItem[] = [
  { id: 'siswa_biasa', name: 'Siswa Penjelajah', emoji: '🧑‍🎓', price: 0, unlockedByDefault: true, description: 'Siswa Sosiologi penuh rasa ingin tahu.' },
  { id: 'sosiolog_detektif', name: 'Sosiolog Detektif', emoji: '🕵️‍♂️', price: 150, description: 'Pengamat fenomena sosial yang teliti.' },
  { id: 'profesor_sosial', name: 'Profesor Sosiologi', emoji: '👨‍🏫', price: 300, description: 'Master Teori Struktural Fungsional.' },
  { id: 'pakar_antropologi', name: 'Pakar Kebudayaan', emoji: '🥷', price: 450, description: 'Ahli interaksi & keberagaman sosial.' },
  { id: 'astronot_sosial', name: 'Sosiolog Antariksa', emoji: '👩‍🚀', price: 600, description: 'Menjelajahi dinamika dunia hingga luar angkasa!' },
  { id: 'raja_sosiologi', name: 'Cendekiawan Utama', emoji: '👑', price: 1000, description: 'Gelar kehormatan untuk lulusan evaluasi terbaik.' }
];

export const BADGES_CATALOG: BadgeItem[] = [
  { id: 'materi_pertama', title: 'Langkah Awal Sosiolog', icon: '📖', description: 'Menyelesaikan Bab Materi Sosiologi pertama.' },
  { id: 'game_master', title: 'Pakar Game Sosiologi', icon: '🎮', description: 'Menyelesaikan 3 Tantangan Game Interaktif.' },
  { id: 'star_collector', title: 'Bintang Cendekiawan', icon: '⭐', description: 'Mengumpulkan minimal 10 Bintang Petualangan.' },
  { id: 'quiz_master', title: 'Juara Asesmen HOTS', icon: '🏆', description: 'Lulus Asesmen Evaluasi dengan nilai di atas KKM.' },
  { id: 'streak_3d', title: 'Semangat Beruntun', icon: '🔥', description: 'Aktif belajar selama 3 hari berturut-turut.' },
  { id: 'rich_sosiolog', title: 'Pengumpul Koin', icon: '🪙', description: 'Memiliki minimal 500 Koin Sosiologi.' }
];

export const DEFAULT_GAMIFICATION_STATE: GamificationState = {
  hearts: 5,
  maxHearts: 5,
  coins: 250,
  xp: 100,
  level: 1,
  levelTitle: 'Sosiolog Pemula',
  streakDays: 1,
  lastCheckInDate: new Date().toISOString().split('T')[0],
  completedNodes: [],
  nodeStars: {},
  nodeHighScores: {},
  unlockedBadges: ['materi_pertama'],
  activeAvatarId: 'siswa_biasa',
  activeMapTheme: 'valley',
  unlockedAvatars: ['siswa_biasa'],
  unlockedThemes: ['valley'],
  lastSpinDate: ''
};

export function loadGamificationState(): GamificationState {
  if (typeof window === 'undefined') return DEFAULT_GAMIFICATION_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_GAMIFICATION_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_GAMIFICATION_STATE, ...parsed };
  } catch (e) {
    return DEFAULT_GAMIFICATION_STATE;
  }
}

export function saveGamificationState(state: GamificationState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save gamification state:', e);
  }
}

export function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number } {
  if (xp < 200) return { level: 1, title: 'Sosiolog Pemula', nextLevelXp: 200 };
  if (xp < 500) return { level: 2, title: 'Pengamat Masyarakat', nextLevelXp: 500 };
  if (xp < 900) return { level: 3, title: 'Analis Dinamika Sosial', nextLevelXp: 900 };
  if (xp < 1400) return { level: 4, title: 'Cendekiawan Sosiologi', nextLevelXp: 1400 };
  if (xp < 2000) return { level: 5, title: 'Master Riset Sosiologi', nextLevelXp: 2000 };
  return { level: 6, title: 'Mahaguru Sosiologi SMA', nextLevelXp: 3000 };
}
