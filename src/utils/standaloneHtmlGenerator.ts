import { CONFIG, MATERI, dataBermain, dtLatih } from '../data/mpiData';
import { MpiConfig, MateriItem, GameItem, SoalLatih } from '../types';

export function generateStandaloneMpiHtml(
  customConfig?: MpiConfig,
  customMateri?: MateriItem[],
  customBermain?: GameItem[],
  customLatih?: SoalLatih[]
): string {
  const activeConfig: MpiConfig = customConfig || CONFIG;
  const activeMateri: MateriItem[] = customMateri || MATERI;
  const activeBermain: GameItem[] = customBermain || dataBermain;
  const rawLatih: SoalLatih[] = customLatih || dtLatih;
  const filteredLatih = rawLatih.filter(q => q.aktifUntukBerlatih !== false);
  const activeLatih: SoalLatih[] = filteredLatih.length > 0 ? filteredLatih : rawLatih;
  const fotoProfilUrl = activeConfig.fotoProfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const configJson = JSON.stringify(activeConfig, null, 2);
  const materiJson = JSON.stringify(activeMateri, null, 2);
  const dataBermainJson = JSON.stringify(activeBermain, null, 2);
  const dtLatihJson = JSON.stringify(activeLatih, null, 2);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="#1e3a8a">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>${activeConfig.judul} - ${activeConfig.mataPelajaran} (${activeConfig.fase})</title>
  <style>
    /* ==========================================================================
       CSS BASE & TEMPLATE MPI OFFLINE KURIKULUM MERDEKA
       100% Offline Ready - Responsif Maksimal untuk Android & iPhone
       ========================================================================== */
    :root {
      --primary: #1e3a8a;
      --primary-light: #3b82f6;
      --primary-dark: #172554;
      --secondary: #0d9488;
      --accent: #f59e0b;
      --success: #16a34a;
      --danger: #dc2626;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --radius: 14px;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* HEADER */
    header {
      background: linear-gradient(135deg, var(--primary-dark), var(--primary));
      color: white;
      padding: 1.25rem 1.5rem;
      box-shadow: var(--shadow);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .brand-title {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 0.875rem;
      color: #cbd5e1;
      font-weight: 500;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-sound {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 9999px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: background 0.2s;
    }

    .btn-sound:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    /* NAV TABS */
    nav.nav-tabs {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      position: sticky;
      top: 68px;
      z-index: 40;
    }

    .tab-btn {
      background: transparent;
      border: none;
      padding: 0.65rem 1.25rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-muted);
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background-color: #eff6ff;
      color: var(--primary);
    }

    .tab-btn:hover:not(.active) {
      background-color: #f1f5f9;
      color: var(--text);
    }

    .tab-btn.tab-locked {
      opacity: 0.72;
      color: #64748b;
    }

    .tab-lock-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 800;
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
    }

    .tab-done-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 800;
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }

    .prereq-ribbon {
      background: #0f172a;
      color: #e2e8f0;
      padding: 0.55rem 1.25rem;
      font-size: 0.8rem;
      border-bottom: 1px solid #1e293b;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
    }

    .prereq-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .prereq-modal-box {
      background: #ffffff;
      border-radius: 24px;
      max-width: 460px;
      width: 100%;
      padding: 1.75rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1.5px solid #fde68a;
      animation: fadeIn 0.25s ease;
    }

    /* MAIN CONTENT */
    main {
      max-width: 1100px;
      width: 100%;
      margin: 1.5rem auto;
      padding: 0 1rem;
      flex: 1;
    }

    .section-view {
      display: none;
      animation: fadeIn 0.3s ease;
    }

    .section-view.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* CARDS & CONTAINERS */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: var(--shadow);
      margin-bottom: 1.5rem;
    }

    /* MATERI STYLES */
    .materi-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 860px) {
      .materi-grid {
        grid-template-columns: 1fr;
      }
    }

    .submateri-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .submateri-btn {
      text-align: left;
      padding: 0.85rem 1rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text);
      cursor: pointer;
      transition: all 0.15s;
    }

    .submateri-btn.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .submateri-btn.locked {
      background: #f1f5f9;
      color: #94a3b8;
      border-color: #e2e8f0;
      opacity: 0.75;
      cursor: not-allowed;
    }

    .submateri-btn.completed {
      border-left: 4px solid var(--success);
    }

    .materi-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }

    .materi-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--primary-dark);
      margin-bottom: 0.75rem;
    }

    .materi-box {
      background: #f8fafc;
      border-left: 4px solid var(--primary-light);
      padding: 1rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.25rem;
      font-size: 0.95rem;
    }

    .poin-kunci {
      margin: 1rem 0;
      padding-left: 1.25rem;
    }

    .poin-kunci li {
      margin-bottom: 0.5rem;
      color: #334155;
    }

    .mini-kuis-box {
      background: #fefce8;
      border: 1px solid #fef08a;
      border-radius: 8px;
      padding: 1.25rem;
      margin-top: 1.5rem;
    }

    .mini-kuis-opsi {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .mini-btn {
      text-align: left;
      padding: 0.6rem 0.85rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.15s;
    }

    .mini-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    /* GAME MODULE STYLES */
    .game-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }

    .game-num-btn {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: white;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      transition: all 0.15s;
    }

    .game-num-btn.active {
      background: var(--secondary);
      color: white;
      border-color: var(--secondary);
    }

    .game-num-btn.done {
      background: #ecfdf5;
      color: #047857;
      border-color: #a7f3d0;
    }

    .game-container {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
    }

    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
    }

    .game-type-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #f1f5f9;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #475569;
    }

    /* Jodoh Game */
    .jodoh-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .item-selectable {
      padding: 0.85rem 1rem;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s, background-color 0.2s;
      user-select: none;
    }

    .item-selectable:hover {
      border-color: var(--secondary);
      background: #f0fdf4;
      transform: translateY(-4px) scale(1.03);
      box-shadow: 0 10px 20px -5px rgba(13, 148, 136, 0.2);
    }

    .item-selectable.selected {
      border-color: var(--secondary);
      background: #ccfbf1;
      color: #0f766e;
      font-weight: 800;
      transform: scale(1.04);
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.3);
    }

    .item-selectable.matched {
      border-color: var(--success);
      background: #dcfce7;
      color: #166534;
      font-weight: 800;
      cursor: default;
    }

    .shake-wrong {
      animation: animShakeOffline 0.5s ease-in-out !important;
      border-color: #ef4444 !important;
      background: #fee2e2 !important;
      color: #991b1b !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.4) !important;
    }

    .pop-green {
      animation: animPopOffline 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      border-color: #10b981 !important;
      background: #dcfce7 !important;
      color: #065f46 !important;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.4) !important;
    }

    @keyframes animShakeOffline {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }

    @keyframes animPopOffline {
      0% { transform: scale(0.92); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    /* Klik Game */
    .klik-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .item-klik-card {
      padding: 1rem;
      border: 2px solid var(--border);
      border-radius: 8px;
      background: #fafafa;
      cursor: pointer;
      text-align: center;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.15s;
    }

    .item-klik-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }

    .item-klik-card.clicked-correct {
      background: #dcfce7;
      border-color: var(--success);
      color: #15803d;
    }

    .item-klik-card.clicked-wrong {
      background: #fee2e2;
      border-color: var(--danger);
      color: #b91c1c;
    }

    /* Urut Game */
    .urut-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .urut-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
    }

    .urut-ctrls {
      display: flex;
      gap: 0.25rem;
    }

    .btn-reorder {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 800;
    }

    /* Kumpul Game */
    .kumpul-zone {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin: 1rem 0;
    }

    .kumpul-item {
      padding: 0.65rem 1rem;
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 9999px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .kumpul-item.collected {
      background: #dcfce7;
      border-color: var(--success);
      color: #15803d;
      border-style: solid;
    }

    .kumpul-item.pengecoh-clicked {
      background: #fee2e2;
      border-color: var(--danger);
      color: #b91c1c;
      border-style: solid;
    }

    /* EVALUASI / BERLATIH STYLES */
    .latih-progress-bar {
      display: flex;
      gap: 0.35rem;
      margin-bottom: 1.25rem;
    }

    .latih-step {
      flex: 1;
      height: 6px;
      background: #e2e8f0;
      border-radius: 9999px;
    }

    .latih-step.active {
      background: var(--primary);
    }

    .latih-step.correct {
      background: var(--success);
    }

    .latih-step.incorrect {
      background: var(--danger);
    }

    .stimulus-box {
      background: #f8fafc;
      border-left: 4px solid var(--secondary);
      padding: 1rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.25rem;
      font-size: 0.95rem;
      color: #334155;
    }

    .soal-tanya {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text);
    }

    .opsi-list {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-bottom: 1.5rem;
    }

    .opsi-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .opsi-item:hover {
      border-color: var(--primary-light);
      background: #f8fafc;
    }

    .opsi-item.selected {
      border-color: var(--primary);
      background: #eff6ff;
      font-weight: 600;
    }

    .opsi-item.ans-correct {
      border-color: var(--success);
      background: #dcfce7;
      color: #14532d;
    }

    .opsi-item.ans-wrong {
      border-color: var(--danger);
      background: #fee2e2;
      color: #7f1d1d;
    }

    .opsi-marker {
      width: 26px;
      height: 26px;
      border-radius: 9999px;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .opsi-item.selected .opsi-marker {
      background: var(--primary);
      color: white;
    }

    .pembahasan-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 1.25rem;
      margin-top: 1rem;
      font-size: 0.95rem;
      color: #166534;
      animation: fadeIn 0.3s;
    }

    .btn-action {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;
    }

    .btn-action:hover {
      background: var(--primary-dark);
    }

    .btn-action:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    /* MODAL EXPORT & DIALOG */
    .report-card {
      text-align: center;
      padding: 2.5rem 1.5rem;
    }

    .score-circle {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 16px rgba(30, 58, 138, 0.25);
    }

    .score-number {
      font-size: 2.75rem;
      font-weight: 800;
      line-height: 1;
    }

    .score-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    /* MULTIMEDIA & ANIMASI OFFLINE STYLES */
    .mpi-media-container {
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .mpi-media-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.85rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .mpi-media-img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      display: block;
      margin: 0 auto;
    }
    .mpi-media-caption {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
      text-align: center;
      font-style: italic;
    }
    .mpi-media-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      margin: 0.5rem 0;
    }
    .mpi-media-table th, .mpi-media-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    .mpi-media-table th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #1e293b;
    }
    .mpi-media-audio {
      width: 100%;
      margin-top: 0.5rem;
    }
    .mpi-media-video {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 6px;
      border: 0;
    }

    /* ANIMASI KEYFRAMES & UTILITIES */
    @keyframes mpiFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes mpiSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes mpiBounceIn { 0% { opacity: 0; transform: scale(0.9); } 60% { opacity: 1; transform: scale(1.03); } 100% { transform: scale(1); } }
    @keyframes mpiPulseSlow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
    @keyframes mpiEqBar { 0%, 100% { height: 4px; } 50% { height: 16px; } }

    .anim-fade-in { animation: mpiFadeIn 0.4s ease-out both; }
    .anim-slide-up { animation: mpiSlideUp 0.4s ease-out both; }
    .anim-bounce-in { animation: mpiBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    .anim-zoom-in { animation: mpiBounceIn 0.4s ease-out both; }
    .anim-pulse { animation: mpiPulseSlow 3s infinite ease-in-out; }
    .anim-hover-lift:hover { transform: translateY(-3px); transition: transform 0.2s ease; }
    .anim-scale-tap:active { transform: scale(0.97); }

    /* OFFLINE MUSIC MODAL */
    .music-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 100000;
      background: rgba(2, 6, 23, 0.82);
      backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .music-modal-card {
      background: #ffffff;
      border-radius: 24px;
      max-width: 500px;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0,0,0,0.5);
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
    }
    .music-track-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.6rem;
      margin: 0.75rem 0;
    }
    @media (max-width: 480px) {
      .music-track-grid {
        grid-template-columns: 1fr;
      }
    }
    .music-track-btn {
      padding: 0.75rem;
      border-radius: 14px;
      border: 1.5px solid #e2e8f0;
      background: #ffffff;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .music-track-btn:hover {
      border-color: #0d9488;
      background: #f0fdfa;
    }
    .music-track-btn.active {
      border-color: #0d9488;
      background: #ccfbf1;
      box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.3);
    }

    /* =========================================================================
       GAMIFICATION HUD BAR & REFILL HEARTS MODAL STYLES
       ========================================================================= */
    .gamify-hud-bar {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-bottom: 1px solid #1e293b;
      padding: 0.45rem 1rem;
      color: white;
      position: sticky;
      top: 0;
      z-index: 45;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    .gamify-hud-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .gamify-hud-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(2, 6, 23, 0.75);
      border: 1px solid #334155;
      border-radius: 9999px;
      padding: 0.25rem 0.65rem;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.4);
      font-size: 0.78rem;
    }
    .gamify-hud-pill.streak {
      border-color: rgba(245, 158, 11, 0.35);
      background: rgba(245, 158, 11, 0.1);
    }
    .gamify-hud-pill.level {
      border-color: rgba(99, 102, 241, 0.4);
      background: rgba(49, 46, 129, 0.6);
    }
    .hud-plus-btn {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: none;
      font-size: 11px;
      font-weight: 900;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-left: 2px;
      transition: all 0.2s;
    }
    .hud-plus-btn.rose {
      background: #f43f5e;
      color: white;
    }
    .hud-plus-btn.rose:hover {
      background: #fb7185;
      transform: scale(1.1);
    }
    .hud-plus-btn.amber {
      background: #f59e0b;
      color: #0f172a;
    }
    .hud-plus-btn.amber:hover {
      background: #fbbf24;
      transform: scale(1.1);
    }
    .btn-hud-action {
      padding: 0.35rem 0.75rem;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 800;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.2s;
    }
    .btn-hud-action.purple {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: white;
      box-shadow: 0 2px 6px rgba(124,58,237,0.3);
    }
    .btn-hud-action.purple:hover {
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      transform: translateY(-1px);
    }
    .btn-hud-action.amber {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      box-shadow: 0 2px 6px rgba(245,158,11,0.3);
    }
    .btn-hud-action.amber:hover {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      transform: translateY(-1px);
    }

    /* Refill Hearts Modal */
    .refill-hearts-card {
      background: #0f172a;
      border: 2px solid rgba(244, 63, 94, 0.8);
      border-radius: 24px;
      max-width: 440px;
      width: 100%;
      padding: 1.75rem;
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
    }

    /* =========================================================================
       DASBOR HUB INTERAKTIF & GAMIFIKASI TABLET UI STYLES
       ========================================================================= */
    .dashboard-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      border-radius: 18px;
      padding: 0.85rem 1.25rem;
      margin-bottom: 1.25rem;
      border: 1px solid #1e293b;
      box-shadow: var(--shadow);
      color: white;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .dash-title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .dash-icon-box {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: #f59e0b;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 900;
      flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(245,158,11,0.3);
    }
    .dash-frame-toggle-box {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #1e293b;
      padding: 4px;
      border-radius: 12px;
      border: 1px solid #334155;
    }
    .btn-frame-toggle {
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
    }
    .btn-frame-toggle.active {
      background: #f59e0b;
      color: #0f172a;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .dashboard-container {
      width: 100%;
      margin: 0 auto;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .dashboard-container.frame-tablet {
      max-width: 940px;
      padding: 2.25rem 1.25rem 1.75rem;
      background: #020617;
      border: 12px solid #1e293b;
      border-radius: 42px;
      box-shadow: 0 25px 60px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08);
      position: relative;
    }
    .tablet-notch {
      position: absolute;
      top: 9px;
      left: 50%;
      transform: translateX(-50%);
      width: 96px;
      height: 14px;
      background: #0f172a;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border: 1px solid #334155;
      z-index: 25;
    }
    .tablet-lens {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #475569;
    }
    .tablet-sensor {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #3b82f6;
      animation: mpiPulseSlow 2s infinite ease-in-out;
    }
    .dashboard-canvas {
      background: linear-gradient(180deg, #fffbeb 0%, #ffffff 20%, #f8fafc 100%);
      border: 1.5px solid #fde68a;
      border-radius: 28px;
      padding: 1.75rem;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      box-sizing: border-box;
    }
    @media (max-width: 640px) {
      .dashboard-canvas {
        padding: 1rem;
        gap: 1rem;
      }
      .dashboard-container.frame-tablet {
        border-width: 6px;
        border-radius: 28px;
        padding: 1.75rem 0.5rem 1rem;
      }
    }

    /* Section 1: Profile & Quick Nav */
    .dash-profile-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1.25rem;
      border-bottom: 1.5px solid #fef3c7;
      flex-wrap: wrap;
    }
    .dash-student-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .dash-avatar-btn {
      width: 58px;
      height: 58px;
      border-radius: 18px;
      background: linear-gradient(135deg, #f59e0b, #ea580c);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      box-shadow: 0 8px 16px -4px rgba(245, 158, 11, 0.4);
      border: 2.5px solid #ffffff;
      cursor: pointer;
      position: relative;
      flex-shrink: 0;
      transition: transform 0.2s;
    }
    .dash-avatar-btn:hover {
      transform: scale(1.06);
    }
    .dash-avatar-badge {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #10b981;
      border: 2px solid white;
      color: white;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
    }
    .dash-quick-btns {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .dash-quick-btn {
      padding: 0.55rem 0.9rem;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .dash-quick-btn.blue {
      background: #eff6ff;
      color: #1d4ed8;
      border-color: #bfdbfe;
    }
    .dash-quick-btn.blue:hover {
      background: #dbeafe;
    }
    .dash-quick-btn.teal {
      background: #f0fdfa;
      color: #0f766e;
      border-color: #99f6e4;
    }
    .dash-quick-btn.teal:hover {
      background: #ccfbf1;
    }
    .dash-quick-btn.indigo {
      background: #eef2ff;
      color: #4338ca;
      border-color: #c7d2fe;
    }
    .dash-quick-btn.indigo:hover {
      background: #e0e7ff;
    }

    /* Section 2: Progress Tracker Card */
    .dash-tracker-card {
      background: linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #d97706 100%);
      color: #0f172a;
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 12px 25px -8px rgba(234,88,12,0.4);
      position: relative;
      overflow: hidden;
      flex-wrap: wrap;
    }
    .dash-tracker-glow {
      position: absolute;
      right: -30px;
      bottom: -30px;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      filter: blur(20px);
      pointer-events: none;
    }
    .dash-gauge-box {
      background: rgba(15, 23, 42, 0.92);
      color: white;
      border-radius: 16px;
      padding: 0.9rem 1.25rem;
      border: 1px solid rgba(253, 230, 138, 0.4);
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
      flex-shrink: 0;
    }
    .dash-gauge-svg {
      width: 64px;
      height: 64px;
      transform: rotate(-90deg);
      flex-shrink: 0;
    }

    /* Section 3: Central Gamified Adventure Map */
    .master-map-container {
      background: #0f172a;
      border-radius: 24px;
      border: 2px solid #1e293b;
      overflow: hidden;
      box-shadow: 0 15px 35px -10px rgba(0,0,0,0.4);
    }
    .map-header-bar {
      background: #1e293b;
      padding: 1rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .map-header-left {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .map-avatar-pawn {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 10px rgba(245,158,11,0.3);
      border: 2px solid #fef08a;
      flex-shrink: 0;
    }
    .map-header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-map-action {
      padding: 0.55rem 1rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 800;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
    }
    .btn-map-action.purple {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: white;
      box-shadow: 0 4px 10px rgba(124,58,237,0.3);
    }
    .btn-map-action.purple:hover {
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
    }
    .btn-map-action.amber {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      font-weight: 900;
      box-shadow: 0 4px 10px rgba(245,158,11,0.3);
    }
    .btn-map-action.amber:hover {
      background: #fbbf24;
    }
    .map-canvas-viewport {
      position: relative;
      width: 100%;
      overflow: hidden;
      min-height: 780px;
      background: radial-gradient(circle at 50% 10%, #064e3b 0%, #022c22 100%);
      transition: background 0.4s;
    }
    .map-svg-trail {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .map-node-item {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      z-index: 10;
      transition: transform 0.2s ease;
    }
    .map-node-item:hover {
      transform: translate(-50%, -50%) scale(1.12);
    }
    .map-node-btn {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 3.5px solid;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      position: relative;
      cursor: pointer;
      outline: none;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
    }
    .map-node-btn:hover {
      transform: scale(1.1);
    }
    .map-node-btn.node-active {
      background: linear-gradient(135deg, #fde047, #f59e0b);
      border-color: #fef08a;
      color: #0f172a;
      box-shadow: 0 0 25px rgba(251,191,36,0.85);
      animation: mpiPulseSlow 2s infinite ease-in-out;
    }
    .map-node-btn.node-done {
      background: linear-gradient(135deg, #38bdf8, #2563eb);
      border-color: #bae6fd;
      color: white;
      box-shadow: 0 4px 15px rgba(37,99,235,0.45);
    }
    .map-node-btn.node-locked {
      background: linear-gradient(135deg, #475569, #1e293b);
      border-color: #64748b;
      color: #94a3b8;
      opacity: 0.72;
    }
    .map-node-btn.node-boss {
      width: 82px;
      height: 82px;
      background: linear-gradient(135deg, #ef4444, #991b1b);
      border-color: #fca5a5;
      color: #fef08a;
      box-shadow: 0 0 30px rgba(239,68,68,0.8);
    }
    .map-node-label {
      margin-top: 6px;
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.72rem;
      font-weight: 800;
      background: rgba(15, 23, 42, 0.92);
      color: #f8fafc;
      border: 1px solid rgba(255, 255, 255, 0.2);
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .map-active-avatar-marker {
      position: absolute;
      top: -46px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: mpiBounceIn 0.5s ease;
      pointer-events: none;
      z-index: 20;
    }
    .map-avatar-bubble {
      background: #fef08a;
      color: #854d0e;
      font-size: 0.68rem;
      font-weight: 900;
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      border: 1px solid #fde047;
    }

    /* Section 4: Resource Library Showcase */
    .dash-resource-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    @media (max-width: 768px) {
      .dash-resource-grid {
        grid-template-columns: 1fr;
      }
    }
    .dash-resource-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transition: all 0.2s;
    }
    .dash-resource-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow);
    }
    .dash-resource-banner {
      height: 110px;
      border-radius: 12px;
      padding: 0.75rem;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .dash-resource-banner.b1 { background: linear-gradient(135deg, #2563eb, #4f46e5); }
    .dash-resource-banner.b2 { background: linear-gradient(135deg, #f59e0b, #ea580c); }
    .dash-resource-banner.b3 { background: linear-gradient(135deg, #0d9488, #059669); }

    /* Modals for Gamification */
    .gamify-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 100000;
      background: rgba(2, 6, 23, 0.82);
      backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .gamify-modal-box {
      background: white;
      border-radius: 24px;
      max-width: 520px;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0,0,0,0.6);
      border: 1px solid var(--border);
      animation: mpiBounceIn 0.35s ease;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }

    /* GERBANG MASUK SISWA & ANIMASI IDENTITAS KARYA */
    .gate-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, #090d16 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      overflow-y: auto;
      transition: opacity 0.35s ease, visibility 0.35s ease, transform 0.35s ease;
    }
    .gate-overlay.gate-hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: scale(1.02);
    }
    .gate-card {
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
      max-width: 640px;
      width: 100%;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      margin: auto;
      max-height: 92dvh;
      display: flex;
      flex-direction: column;
    }
    @media (max-width: 640px) {
      .gate-overlay {
        padding: 0.5rem;
      }
      .gate-card {
        border-radius: 20px;
        max-height: 94dvh;
      }
      .gate-header-blue {
        padding: 1.25rem 1rem !important;
      }
      .gate-header-dark {
        padding: 1.1rem 1rem !important;
      }
      .gate-input {
        font-size: 16px !important; /* Mencegah auto-zoom di iOS Safari */
        padding: 0.85rem 1rem !important;
      }
      header {
        padding: 0.6rem 0.75rem !important;
      }
      .header-title {
        font-size: 0.95rem !important;
      }
      .nav-tabs {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding: 0.4rem 0.5rem !important;
      }
      .tab-btn {
        padding: 0.45rem 0.75rem !important;
        font-size: 0.8rem !important;
        white-space: nowrap;
      }
      .jodoh-grid {
        grid-template-columns: 1fr !important;
        gap: 0.75rem !important;
      }
    }
    .gate-header-blue {
      background: linear-gradient(135deg, #1d4ed8, #4338ca, #1e1b4b);
      color: white;
      padding: 1.75rem 2rem;
      text-align: center;
      flex-shrink: 0;
    }
    .gate-header-dark {
      background: linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a);
      color: white;
      padding: 1.4rem 1.75rem;
      border-bottom: 1px solid #1e293b;
      flex-shrink: 0;
    }
    .gate-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .gate-input-group {
      margin-bottom: 1.25rem;
      text-align: left;
    }
    .gate-input-label {
      display: block;
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #334155;
      margin-bottom: 0.4rem;
    }
    .gate-input {
      width: 100%;
      padding: 0.85rem 1rem;
      border-radius: 12px;
      border: 1.5px solid #cbd5e1;
      font-size: 16px; /* 16px to prevent iOS zoom */
      font-weight: 600;
      color: #0f172a;
      outline: none;
      transition: all 0.2s;
      box-sizing: border-box;
      background: #f8fafc;
    }
    .gate-input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
    .identitas-items-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin: 1rem 0;
      text-align: left;
    }
    @media (max-width: 640px) {
      .identitas-items-grid {
        grid-template-columns: 1fr;
      }
    }
    .identitas-row {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      padding: 0.75rem 0.9rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
    }
    .identitas-row.col-span-2 {
      grid-column: 1 / -1;
    }
    .identitas-row.highlight-blue {
      background: #eff6ff;
      border-color: #bfdbfe;
    }
    .identitas-row.highlight-amber {
      background: #fffbeb;
      border-color: #fde68a;
    }
    .identitas-row.highlight-emerald {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }
    .identitas-num-badge {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 900;
      font-size: 0.78rem;
      flex-shrink: 0;
    }
    .identitas-meta-title {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      display: block;
      margin-bottom: 0.15rem;
    }
    .identitas-meta-val {
      font-size: 0.88rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      display: block;
    }
    .identitas-foto-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
    }
    .identitas-foto-img {
      width: 72px;
      height: 72px;
      border-radius: 16px;
      object-fit: cover;
      border: 2.5px solid #10b981;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);
      background: #ffffff;
      flex-shrink: 0;
    }
    .btn-student {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      border-radius: 8px;
      border: 1px solid #3b82f6;
      background: #1e293b;
      color: #93c5fd;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-student:hover {
      background: #2563eb;
      color: #ffffff;
    }
    .btn-teacher {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      border-radius: 8px;
      border: 1px solid rgba(245, 158, 11, 0.4);
      background: rgba(245, 158, 11, 0.15);
      color: #fde68a;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-teacher:hover {
      background: #d97706;
      color: #ffffff;
      border-color: #f59e0b;
    }

    /* STEP 3: Mau melakukan apa hari ini? */
    .gate-step3-card {
      background: #f8fafc !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 32px !important;
      max-width: 980px !important;
      padding: 2.25rem 2.5rem;
      width: 100%;
      box-sizing: border-box;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
    }
    @media (max-width: 640px) {
      .gate-step3-card {
        padding: 1.5rem 1.25rem !important;
        border-radius: 24px !important;
      }
    }
    .modules-choice-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin: 1.75rem 0 1rem;
    }
    @media (max-width: 768px) {
      .modules-choice-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
    }
    .module-card-choice {
      border: 2px solid #f1f5f9;
      border-radius: 28px;
      padding: 2rem 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      cursor: pointer;
      min-height: 360px;
      background: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      outline: none;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    }
    .module-card-choice:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 35px -10px rgba(0,0,0,0.12);
    }
    .module-card-choice:active {
      transform: scale(0.98);
    }
    .module-card-choice.card-belajar:hover {
      border-color: #60a5fa;
    }
    .module-card-choice.card-bermain:hover {
      border-color: #fb7185;
    }
    .module-card-choice.card-berlatih:hover {
      border-color: #fbbf24;
    }

    /* Modern Circular Icon Orb */
    .module-orb-wrapper {
      position: relative;
      margin-top: 0.5rem;
    }
    .module-orb-glow {
      position: absolute;
      inset: -6px;
      border-radius: 9999px;
      opacity: 0.2;
      filter: blur(8px);
      transition: opacity 0.3s;
    }
    .module-card-choice:hover .module-orb-glow {
      opacity: 0.45;
    }
    .module-card-circle {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 20px -5px rgba(0,0,0,0.15);
      transition: transform 0.3s ease;
      flex-shrink: 0;
      position: relative;
    }
    .module-card-choice:hover .module-card-circle {
      transform: scale(1.06);
    }
    .module-card-inner-circle {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .module-icon-box {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }
    .module-card-choice:hover .module-icon-box {
      transform: scale(1.08) rotate(3deg);
    }

    .module-card-title {
      font-size: 1.75rem;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin: 0.75rem 0 0.25rem;
      transition: color 0.2s;
    }
    .module-card-choice.card-belajar:hover .module-card-title {
      color: #2563eb;
    }
    .module-card-choice.card-bermain:hover .module-card-title {
      color: #e11d48;
    }
    .module-card-choice.card-berlatih:hover .module-card-title {
      color: #d97706;
    }

    .module-card-desc {
      font-size: 0.78rem;
      color: #64748b;
      margin-bottom: 1rem;
      font-weight: 500;
    }

    .module-card-pill {
      background: #f1f5f9;
      color: #334155;
      padding: 0.65rem 1.25rem;
      border-radius: 16px;
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.01em;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
    }
    .module-card-choice.card-belajar:hover .module-card-pill {
      background: #eff6ff;
      color: #1d4ed8;
      border-color: #bfdbfe;
    }
    .module-card-choice.card-bermain:hover .module-card-pill {
      background: #fff1f2;
      color: #be123c;
      border-color: #fecdd3;
    }
    .module-card-choice.card-berlatih:hover .module-card-pill {
      background: #fffbeb;
      color: #b45309;
      border-color: #fde68a;
    }

    .module-badge-status {
      position: absolute;
      top: 14px;
      right: 14px;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    @media print {
      header, .nav-tabs, .btn-action, button, .header-controls, .gate-overlay { display: none !important; }
      body { background: white !important; color: black !important; }
      .section-view { display: block !important; }
      .report-card { box-shadow: none !important; border: 1px solid #ccc !important; }
    }
  </style>
</head>
<body>

  <!-- =========================================================================
       GERBANG MASUK SISWA (INPUT IDENTITAS SISWA)
       ========================================================================= -->
  <div id="gateOverlay" class="gate-overlay">
    
    <!-- MODAL 1: ISIAN NAMA DAN KELAS SISWA (MINIMALIS & ELEGAN) -->
    <div id="gateStep1" class="gate-card anim-bounce-in">
      <div class="gate-header-blue" style="background: linear-gradient(135deg, #1e3a8a, #2563eb, #3b82f6); border-bottom: 1px solid rgba(255,255,255,0.15); padding: 2rem 1.5rem 1.5rem; position: relative;">
        <button 
          type="button" 
          id="btnCloseGateStep1" 
          onclick="closeStudentModal()" 
          style="display: none; position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.2); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-weight: 900; font-size: 0.95rem; line-height: 1;"
          title="Tutup &amp; Kembali"
        >
          ✕
        </button>
        <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(255,255,255,0.15); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 800; color: #dbeafe; margin-bottom: 0.5rem;">
          <span>👤</span> IDENTITAS PESERTA DIDIK
        </div>
        <h1 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.35rem; letter-spacing: -0.02em; color: #ffffff;">
          Masukkan Identitas Siswa
        </h1>
        <p style="font-size: 0.88rem; color: #dbeafe; margin: 0 auto; max-width: 440px; font-weight: 500;">
          Silakan isi nama lengkap dan kelas Anda untuk memulai pembelajaran
        </p>
      </div>

      <div style="padding: 1.75rem 2rem;">
        <div id="gateAlertBox" style="display: none; padding: 0.75rem 1rem; border-radius: 12px; background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; font-size: 0.85rem; font-weight: 700; text-align: center; margin-bottom: 1.25rem;"></div>

        <form id="formGateSiswa" action="javascript:void(0);" onsubmit="handleGateStep1Submit(event); return false;">
          <div class="gate-input-group">
            <label class="gate-input-label" for="inputGateNama">
              👤 Nama Lengkap Siswa
            </label>
            <input 
              type="text" 
              id="inputGateNama" 
              class="gate-input" 
              placeholder="Ketik nama lengkap Anda di sini..." 
              autocomplete="name" 
              onkeydown="if(event.key==='Enter'){event.preventDefault();handleGateStep1Submit(event);}"
            />
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem; font-size: 0.75rem;">
              <span style="color: #64748b;">Nama otomatis dicetak di sertifikat &amp; rapor evaluasi.</span>
              <button 
                type="button" 
                onclick="setQuickStudentName(event)" 
                style="background: none; border: none; color: #2563eb; font-weight: 800; cursor: pointer; text-decoration: underline; padding: 0;"
              >
                Isi "Peserta Didik"
              </button>
            </div>
          </div>

          <div class="gate-input-group">
            <label class="gate-input-label" for="inputGateKelas">
              🎓 Kelas / Rombel Siswa
            </label>
            <input 
              type="text" 
              id="inputGateKelas" 
              class="gate-input" 
              placeholder="Contoh: ${activeConfig.kelas} IPS 1" 
              value="${activeConfig.kelas}" 
              onkeydown="if(event.key==='Enter'){event.preventDefault();handleGateStep1Submit(event);}"
            />
          </div>

          <div style="margin-top: 1.75rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <button 
              type="button" 
              onclick="handleGateStep1Submit(event)" 
              id="btnGateLanjut" 
              class="btn-action anim-hover-lift" 
              style="width: 100%; justify-content: center; padding: 1rem 1.5rem; font-size: 1.05rem; font-weight: 800; border-radius: 14px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; box-shadow: 0 10px 20px -5px rgba(37,99,235,0.4); cursor: pointer; border: none;"
            >
              🚀 Mulai Pembelajaran Sekarang →
            </button>

            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <button 
                type="button" 
                onclick="handleGateStep1ToStep3()" 
                style="flex: 1; min-width: 140px; padding: 0.65rem 0.9rem; border-radius: 12px; background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1d4ed8; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s;"
              >
                <span>🎯</span> Pilih Menu Modul
              </button>
              <button 
                type="button" 
                onclick="openTeacherModal()" 
                style="flex: 1; min-width: 140px; padding: 0.65rem 0.9rem; border-radius: 12px; background: #f8fafc; border: 1.5px solid #cbd5e1; color: #334155; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s;"
              >
                <span>🌟</span> Identitas Pendidik
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 2: PILIHAN MODUL ("Mau melakukan apa hari ini?") -->
    <div id="gateStep3" class="gate-card gate-step3-card anim-slide-up" style="display: none;">
      
      <!-- Top Bar: Info Siswa & Tombol Identitas Pendidik -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap;">
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.85rem; border-radius: 9999px; background: #ffffff; border: 1px solid #e2e8f0; font-size: 0.78rem; font-weight: 700; color: #334155; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
          <span>Peserta Didik: <strong id="lblStep3StudentNama" style="color: #0f172a;">-</strong> (<strong id="lblStep3StudentKelas" style="color: #0f172a;">-</strong>)</span>
          <button 
            type="button" 
            onclick="openStudentModal()" 
            style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 0.72rem; font-weight: 800; cursor: pointer; padding: 0.15rem 0.45rem; border-radius: 6px; margin-left: 0.25rem;"
          >
            ✏️ Ubah
          </button>
        </div>
        
        <button 
          type="button" 
          onclick="openTeacherModal()" 
          class="btn-teacher"
          style="background: #fffbeb; border: 1px solid #fde68a; color: #b45309; font-size: 0.8rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; border-radius: 8px;"
        >
          <span>🌟</span> Identitas Pendidik &amp; Pengembang
        </button>
      </div>

      <!-- Headline & Subtitle -->
      <div style="text-align: center; margin-top: 1.5rem;">
        <h1 style="color: #0f172a; font-size: 2.25rem; font-weight: 900; margin: 0; letter-spacing: -0.03em; line-height: 1.2;">
          Mau melakukan apa hari ini?
        </h1>
        <p style="color: #64748b; font-size: 0.95rem; margin: 0.75rem auto 0; max-width: 580px; line-height: 1.5;">
          Mulailah dari <strong style="color: #2563eb; font-weight: 800;">Belajar</strong>, lanjut ke <strong style="color: #e11d48; font-weight: 800;">Bermain</strong>, lalu uji dirimu di <strong style="color: #d97706; font-weight: 800;">Berlatih</strong>.
        </p>
      </div>

      <!-- 3 Kartu Pilihan dengan Icon Lingkaran Kekinian -->
      <div class="modules-choice-grid">
        
        <!-- KARTU 1: BELAJAR (Materi Pembelajaran) -->
        <button 
          type="button" 
          id="btnSelectBelajar" 
          onclick="selectModuleAndEnter('materi')" 
          class="module-card-choice card-belajar"
        >
          <div class="module-badge-status" style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;">
            <span>✓</span> Terbuka
          </div>

          <div class="module-orb-wrapper">
            <div class="module-orb-glow" style="background: linear-gradient(135deg, #06b6d4, #2563eb);"></div>
            <div class="module-card-circle" style="background: linear-gradient(135deg, #2563eb, #06b6d4, #3b82f6);">
              <div class="module-card-inner-circle">
                <div class="module-icon-box" style="background: #eff6ff;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="module-card-title">Belajar</div>
            <div class="module-card-desc">Pelajari konsep & modul materi</div>
          </div>

          <div class="module-card-pill">
            Materi Pembelajaran
          </div>
        </button>

        <!-- KARTU 2: BERMAIN (Permainan Interaktif) -->
        <button 
          type="button" 
          id="btnSelectBermain" 
          onclick="selectModuleAndEnter('bermain')" 
          class="module-card-choice card-bermain"
        >
          <div class="module-badge-status" id="badgeCardBermain" style="background: #fef3c7; color: #b45309; border: 1px solid #fde68a;">
            <span id="badgeIconBermain">🔒</span> <span id="badgeTextBermain">Terkunci</span>
          </div>

          <div class="module-orb-wrapper">
            <div class="module-orb-glow" style="background: linear-gradient(135deg, #f43f5e, #e11d48);"></div>
            <div class="module-card-circle" style="background: linear-gradient(135deg, #e11d48, #f43f5e, #fb7185);">
              <div class="module-card-inner-circle">
                <div class="module-icon-box" style="background: #fff1f2;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="6" y1="12" x2="10" y2="12"/>
                    <line x1="8" y1="10" x2="8" y2="14"/>
                    <line x1="15" y1="13" x2="15.01" y2="13"/>
                    <line x1="18" y1="11" x2="18.01" y2="11"/>
                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="module-card-title">Bermain</div>
            <div class="module-card-desc">Uji pemahaman lewat mini-games</div>
          </div>

          <div class="module-card-pill" id="pillCardBermain">
            ${activeBermain.length} Permainan Interaktif
          </div>
        </button>

        <!-- KARTU 3: BERLATIH (Soal Evaluasi) -->
        <button 
          type="button" 
          id="btnSelectBerlatih" 
          onclick="selectModuleAndEnter('latih')" 
          class="module-card-choice card-berlatih"
        >
          <div class="module-badge-status" id="badgeCardBerlatih" style="background: #fef3c7; color: #b45309; border: 1px solid #fde68a;">
            <span id="badgeIconBerlatih">🔒</span> <span id="badgeTextBerlatih">Terkunci</span>
          </div>

          <div class="module-orb-wrapper">
            <div class="module-orb-glow" style="background: linear-gradient(135deg, #f59e0b, #d97706);"></div>
            <div class="module-card-circle" style="background: linear-gradient(135deg, #d97706, #f59e0b, #fbbf24);">
              <div class="module-card-inner-circle">
                <div class="module-icon-box" style="background: #fffbeb;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="module-card-title">Berlatih</div>
            <div class="module-card-desc">Evaluasi capaian &amp; cetak kartu hasil</div>
          </div>

          <div class="module-card-pill" id="pillCardBerlatih">
            ${activeLatih.length} Soal Evaluasi
          </div>
        </button>

      </div>

      <!-- Footer Info & Direct Start Button -->
      <div style="text-align: center; margin-top: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
          <button 
            type="button" 
            onclick="selectModuleAndEnter('dashboard')" 
            style="padding: 0.85rem 2rem; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #ea580c); color: #0f172a; font-weight: 900; font-size: 0.95rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(245,158,11,0.35); display: inline-flex; align-items: center; gap: 0.5rem;"
          >
            <span>🧭</span> Buka Dasbor Interaktif &amp; Peta Petualangan →
          </button>
          <button 
            type="button" 
            onclick="selectModuleAndEnter('materi')" 
            style="padding: 0.85rem 1.5rem; border-radius: 14px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; font-weight: 800; font-size: 0.95rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.35); display: inline-flex; align-items: center; gap: 0.5rem;"
          >
            <span>🚀</span> Modul Belajar
          </button>
        </div>
        <span style="font-size: 0.78rem; color: #64748b;">
          💡 Masuk ke Dasbor Hub untuk melihat Peta Petualangan atau pilih modul belajar langsung.
        </span>
      </div>

    </div>

  </div>

  <!-- =========================================================================
       MODAL TERPISAH: IDENTITAS PENDIDIK & PENGEMBANG KARYA (@ajisosiologi 2026)
       ========================================================================= -->
  <div id="modalTeacherOverlay" class="music-modal-overlay" style="display: none;">
    <div class="gate-card anim-slide-up" style="max-height: 90vh; display: flex; flex-direction: column; max-width: 720px; width: 100%; border-radius: 24px; overflow: hidden; background: #ffffff;">
      
      <!-- Modal Header -->
      <div class="gate-header-dark" style="padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">🌟</span>
            <h2 style="font-size: 1.15rem; font-weight: 900; margin: 0; color: #ffffff;">
              Identitas Pendidik &amp; Pengembang Karya
            </h2>
          </div>
          <p style="font-size: 0.78rem; color: #94a3b8; margin: 0.25rem 0 0;">
            Media Pembelajaran Interaktif (MPI) • Dikembangkan oleh <strong style="color: #38bdf8;">@ajisosiologi 2026</strong>
          </p>
        </div>
        <button 
          type="button" 
          onclick="closeTeacherModal()" 
          style="background: rgba(255,255,255,0.15); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: 900; font-size: 1rem; display: flex; align-items: center; justify-content: center;"
          title="Tutup"
        >
          ✕
        </button>
      </div>

      <!-- Content (Scrollable 8 Poin Identitas Karya) -->
      <div style="padding: 1.25rem 1.5rem; overflow-y: auto; flex: 1;">
        
        <div class="identitas-items-grid">
          
          <!-- 1. NAMA (Judul Karya MPI) -->
          <div class="identitas-row col-span-2 highlight-blue">
            <div class="identitas-num-badge" style="background: #2563eb;">1</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #1e40af;">1. NAMA (Judul Karya MPI) :</span>
              <span class="identitas-meta-val" style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">
                ${activeConfig.judul}
              </span>
            </div>
          </div>

          <!-- 2. Mata Pelajaran -->
          <div class="identitas-row">
            <div class="identitas-num-badge" style="background: #4f46e5;">2</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #64748b;">2. Mata Pelajaran :</span>
              <span class="identitas-meta-val">${activeConfig.mataPelajaran}</span>
            </div>
          </div>

          <!-- 3. Kelas/Fase -->
          <div class="identitas-row">
            <div class="identitas-num-badge" style="background: #4f46e5;">3</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #64748b;">3. Kelas/Fase :</span>
              <span class="identitas-meta-val">${activeConfig.kelas} / ${activeConfig.fase}</span>
            </div>
          </div>

          <!-- 4. Topik Materi / Elemen / Materi -->
          <div class="identitas-row col-span-2">
            <div class="identitas-num-badge" style="background: #4f46e5;">4</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #64748b;">4. Topik Materi / Elemen / Materi :</span>
              <span class="identitas-meta-val">${activeConfig.topikMateri || activeConfig.judul}</span>
            </div>
          </div>

          <!-- 5. Tujuan Pembelajaran / Sub-elemen / Submateri -->
          <div class="identitas-row col-span-2 highlight-amber">
            <div class="identitas-num-badge" style="background: #d97706;">5</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #92400e;">5. Tujuan Pembelajaran / Sub-elemen / Submateri :</span>
              <p style="margin: 0.2rem 0 0; font-size: 0.85rem; color: #334155; line-height: 1.5; font-weight: 500;">
                ${activeConfig.tujuanPembelajaran || 'Peserta didik mampu memahami, menganalisis konsep materi secara komprehensif, dan menyelesaikan tantangan asesmen evaluasi.'}
              </p>
            </div>
          </div>

          <!-- 6. Nama Pengembang -->
          <div class="identitas-row">
            <div class="identitas-num-badge" style="background: #059669;">6</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #64748b;">6. Nama Pengembang :</span>
              <span class="identitas-meta-val" style="font-weight: 800; color: #0f172a;">
                ${activeConfig.namaPengembang || activeConfig.penyusun || '@ajisosiologi 2026'}
              </span>
            </div>
          </div>

          <!-- 7. Asal Sekolah -->
          <div class="identitas-row">
            <div class="identitas-num-badge" style="background: #059669;">7</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #64748b;">7. Asal Sekolah :</span>
              <span class="identitas-meta-val">${activeConfig.sekolah || activeConfig.instansi || 'SMA Unggulan'}</span>
            </div>
          </div>

          <!-- 8. FOTO PROFIL PENGEMBANG -->
          <div class="identitas-row col-span-2 highlight-emerald">
            <div class="identitas-num-badge" style="background: #059669;">8</div>
            <div class="identitas-foto-card">
              <img 
                src="${fotoProfilUrl}" 
                alt="Foto Profil Pengembang" 
                class="identitas-foto-img" 
                onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'" 
              />
              <div style="min-width: 0; flex: 1;">
                <span class="identitas-meta-title" style="color: #065f46;">8. FOTO PROFIL PENGEMBANG :</span>
                <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">
                  ${activeConfig.namaPengembang || activeConfig.penyusun || '@ajisosiologi 2026'}
                </div>
                ${activeConfig.jabatan ? `<div style="font-size: 0.8rem; color: #059669; font-weight: 700;">${activeConfig.jabatan}</div>` : ''}
                <div style="font-size: 0.8rem; color: #475569;">
                  ${activeConfig.sekolah || activeConfig.instansi || 'Pendidik'}
                  ${activeConfig.nip ? ` • NIP: ${activeConfig.nip}` : ''}
                </div>
                ${(activeConfig.mediaSosial || activeConfig.kontak) ? `<div style="font-size: 0.78rem; color: #0d9488; font-weight: 600; margin-top: 0.2rem;">${[activeConfig.mediaSosial, activeConfig.kontak].filter(Boolean).join(' • ')}</div>` : ''}
              </div>
            </div>
          </div>

        </div>

        <div style="margin-top: 1.25rem;">
          <button 
            type="button" 
            onclick="closeTeacherModal()" 
            class="btn-action anim-hover-lift" 
            style="width: 100%; justify-content: center; padding: 0.85rem 1.5rem; font-size: 1rem; font-weight: 800; border-radius: 12px; background: #0f172a; color: white;"
          >
            Tutup
          </button>
        </div>

      </div>

    </div>
  </div>

  <!-- HEADER -->
  <header>
    <div class="header-container">
      <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #020617, #0f172a); border: 1.5px solid rgba(56, 189, 248, 0.6); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(6, 182, 212, 0.4); flex-shrink: 0; position: relative;">
          <svg viewBox="0 0 100 100" style="width: 82%; height: 82%;" fill="none">
            <path d="M 16 26 C 16 22 20 18 24 18 L 26 18 C 30 18 34 22 34 26 L 34 76 C 34 80 30 84 26 84 L 24 84 C 20 84 16 80 16 76 Z" fill="#38bdf8" />
            <path d="M 66 26 C 66 22 70 18 74 18 L 76 18 C 80 18 84 22 84 26 L 84 76 C 84 80 80 84 76 84 L 74 84 C 70 84 66 80 66 76 Z" fill="#38bdf8" />
            <path d="M 26 22 L 50 60 L 42 66 L 22 32 Z" fill="#06b6d4" />
            <path d="M 74 22 L 50 60 L 58 66 L 78 32 Z" fill="#6366f1" />
            <polygon points="50,14 58,26 42,26" fill="#fbbf24" />
            <circle cx="50" cy="62" r="6" fill="#34d399" />
            <path d="M 78 8 L 71 18 H 76 L 73 26 L 81 15 H 76 L 78 8 Z" fill="#fbbf24" />
          </svg>
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <div class="brand-title">${activeConfig.judul}</div>
            <span style="background: rgba(6,182,212,0.25); color: #67e8f9; border: 1px solid rgba(6,182,212,0.4); font-size: 0.65rem; font-weight: 900; padding: 0.15rem 0.5rem; border-radius: 9999px; text-transform: uppercase;">⚡ MASTERMPI</span>
            <span style="background: rgba(245,158,11,0.2); color: #fde68a; border: 1px solid rgba(245,158,11,0.3); font-size: 0.62rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 9999px;">@ajisosiologi 2026</span>
          </div>
          <div class="brand-subtitle">${activeConfig.mataPelajaran} • ${activeConfig.fase} (${activeConfig.kelas}) • Smart MPI &amp; Gamification Engine</div>
        </div>
      </div>
      <div class="header-controls">
        <button id="btnHeaderStudent" onclick="openStudentModal()" class="btn-student" title="Klik untuk mengubah Identitas Peserta Didik">
          👤 <span id="hdrStudentName">Peserta Didik</span> (<span id="hdrStudentClass">${activeConfig.kelas}</span>)
        </button>
        <button id="btnHeaderTeacher" onclick="openTeacherModal()" class="btn-teacher" title="Klik untuk melihat Identitas Pendidik &amp; Pengembang Karya">
          🌟 <span>Identitas Pendidik</span>
        </button>
        <div style="display: inline-flex; align-items: center; gap: 0.25rem;">
          <button id="btnMusicToggle" class="btn-sound" title="Putar / Hentikan Musik Latar Belakang (BGM)">🎵 Musik: AKTIF</button>
          <button id="btnMusicSettings" onclick="openMusicModal()" class="btn-sound" style="padding: 0.4rem 0.55rem; font-size: 0.85rem;" title="Buka Pengaturan Musik, Suasana &amp; Volume">⚙️</button>
        </div>
        <button id="btnSoundToggle" class="btn-sound" title="Aktifkan/Nonaktifkan Efek Suara">🔊 Suara: AKTIF</button>
      </div>
    </div>
  </header>

  <!-- GAMIFICATION HUD BAR (HEARTS, COINS, STREAK, LEVEL, ACTIONS) -->
  <div class="gamify-hud-bar" id="gamifyHudBar">
    <div class="gamify-hud-inner">
      <!-- Left: Hearts & Coins -->
      <div style="display:flex; align-items:center; gap:0.6rem;">
        <!-- Hearts Meter -->
        <div class="gamify-hud-pill">
          <div id="hudHeartsList" style="display:flex; align-items:center; gap:2px; font-size:0.85rem;">
            <span>❤️</span><span>❤️</span><span>❤️</span><span>❤️</span><span>❤️</span>
          </div>
          <button type="button" onclick="openRefillHearts()" class="hud-plus-btn rose" title="Isi Ulang Nyawa Belajar">+</button>
        </div>

        <!-- Coins Meter -->
        <div class="gamify-hud-pill">
          <span>🪙</span>
          <span id="hudCoinsVal" style="font-weight:900; color:#fde047; font-size:0.85rem; font-family:monospace;">250</span>
          <button type="button" onclick="openShopModal()" class="hud-plus-btn amber" title="Buka Toko Koin & Badges">+</button>
        </div>
      </div>

      <!-- Center: Streak & Level -->
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <div class="gamify-hud-pill streak" id="hudStreakPill">
          <span>🔥</span>
          <span style="font-size:0.75rem; font-weight:800; color:#fbbf24;">1 Hari Streak</span>
        </div>

        <div class="gamify-hud-pill level">
          <span style="color:#fbbf24;">⚡</span>
          <span id="hudLevelVal" style="font-size:0.75rem; font-weight:900; color:#ffffff;">Lvl 1</span>
          <span id="hudLevelTitle" style="font-size:0.7rem; color:#a5b4fc; font-weight:600;">(Penjelajah)</span>
        </div>
      </div>

      <!-- Right: Action Buttons -->
      <div style="display:flex; align-items:center; gap:0.4rem;">
        <button type="button" onclick="openSpinWheel()" class="btn-hud-action purple" title="Putar Roda Keberuntungan Harian">
          <span>🔄</span> <span>Spin Wheel</span>
        </button>
        <button type="button" onclick="openShopModal()" class="btn-hud-action amber" title="Buka Toko Koin & Avatar">
          <span>🛍️</span> <span>Toko &amp; Badges</span>
        </button>
      </div>
    </div>
  </div>

  <!-- PREREQUISITE PROGRESS RIBBON -->
  <div class="prereq-ribbon" id="prereqRibbon">
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.68rem; font-weight: 900; padding: 0.15rem 0.45rem; border-radius: 4px; text-transform: uppercase;">
        Alur Wajib MPI
      </span>
      <span style="color: #94a3b8; font-size: 0.78rem;">
        1. Modul Belajar (Kuis Mini) ➔ 2. Modul Bermain ➔ 3. Modul Berlatih
      </span>
    </div>
    <div style="display: flex; align-items: center; gap: 0.85rem; font-size: 0.78rem;" id="ribbonStatusContainer">
      <div id="ribbonMateriStatus">📖 Materi: <strong id="ribbonMateriCount">0/${activeMateri.length} Bab</strong></div>
      <span style="color: #475569;">•</span>
      <div id="ribbonBermainStatus">🎮 Bermain: <strong id="ribbonBermainText" style="color: #fbbf24;">🔒 Terkunci</strong></div>
      <span style="color: #475569;">•</span>
      <div id="ribbonBerlatihStatus">📝 Berlatih: <strong id="ribbonBerlatihText" style="color: #fbbf24;">🔒 Terkunci</strong></div>
    </div>
  </div>

  <!-- NAVIGATION TABS -->
  <nav class="nav-tabs" id="navTabsContainer">
    <button class="tab-btn active" id="tabBtnDashboard" onclick="switchTab('dashboard')">
      🧭 0. Dasbor Hub
    </button>
    <button class="tab-btn" id="tabBtnMateri" onclick="switchTab('materi')">
      📖 1. Modul Materi <span id="tabMateriBadge" class="tab-done-badge" style="display:none;">✓ Selesai</span>
    </button>
    <button class="tab-btn tab-locked" id="tabBtnBermain" onclick="switchTab('bermain')">
      <span id="tabBermainLockIcon">🔒</span> 2. Modul Bermain <span id="tabBermainBadge" class="tab-lock-badge">Terkunci</span>
    </button>
    <button class="tab-btn tab-locked" id="tabBtnBerlatih" onclick="switchTab('berlatih')">
      <span id="tabBerlatihLockIcon">🔒</span> 3. Modul Berlatih <span id="tabBerlatihBadge" class="tab-lock-badge">Terkunci</span>
    </button>
  </nav>

  <!-- PREREQUISITE ALERT DIALOG MODAL -->
  <div class="prereq-modal-overlay" id="prereqModalOverlay">
    <div class="prereq-modal-box">
      <div style="width: 56px; height: 56px; border-radius: 16px; background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.75rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);">
        🔒
      </div>
      <h3 id="prereqModalTitle" style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 0.5rem;">
        Modul Masih Terkunci!
      </h3>
      <p id="prereqModalDesc" style="font-size: 0.875rem; color: #475569; line-height: 1.5; margin: 0 0 1.25rem;">
        Sesuai alur MPI, selesaikan prasyarat terlebih dahulu.
      </p>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <button type="button" id="prereqActionBtn" onclick="handlePrereqAction()" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: #2563eb; color: #ffffff; font-size: 0.875rem; font-weight: 800; border: none; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
          Buka Modul Prasyarat
        </button>
        <button type="button" onclick="closePrereqModal()" style="width: 100%; padding: 0.6rem 1rem; border-radius: 12px; background: transparent; color: #64748b; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer;">
          Tutup
        </button>
      </div>
    </div>
  </div>

  <!-- MAIN CONTAINER -->
  <main>
    <!-- TAB 0: DASBOR HUB INTERAKTIF -->
    <section id="view-dashboard" class="section-view active">
      
      <!-- Top Bar: Frame Mode Controls -->
      <div class="dashboard-top-bar">
        <div class="dash-title-group">
          <div class="dash-icon-box">🧭</div>
          <div>
            <h2 style="font-size: 0.95rem; font-weight: 900; color: white; margin: 0; line-height: 1.2;">
              Dasbor Interaktif Hub Sosiologi
            </h2>
            <p style="font-size: 0.72rem; color: #94a3b8; margin: 0.15rem 0 0;">
              Tampilan UI/UX Gamifikasi Tablet untuk Pembelajaran MPI
            </p>
          </div>
        </div>

        <div class="dash-frame-toggle-box">
          <button type="button" class="btn-frame-toggle active" id="btnFrameFull" onclick="setFrameMode('full')">
            💻 <span>Layar Penuh</span>
          </button>
          <button type="button" class="btn-frame-toggle" id="btnFrameTablet" onclick="setFrameMode('tablet')">
            📱 <span>Frame Tablet UI</span>
          </button>
        </div>
      </div>

      <!-- DASHBOARD CONTAINER (FULL OR TABLET MOCKUP) -->
      <div id="dashContainer" class="dashboard-container frame-full">
        
        <!-- Tablet Camera Notch Mockup -->
        <div id="tabletNotch" class="tablet-notch" style="display: none;">
          <div class="tablet-lens"></div>
          <div class="tablet-sensor"></div>
        </div>

        <!-- INNER DASHBOARD CANVAS -->
        <div class="dashboard-canvas">
          
          <!-- 🌟 1. PROFILE & QUICK MODULE SHORTCUTS 🌟 -->
          <div class="dash-profile-bar">
            
            <div class="dash-student-group">
              <button type="button" class="dash-avatar-btn" onclick="openStudentModal()" title="Klik untuk ubah identitas siswa">
                <span id="dashAvatarIcon">👤</span>
                <span class="dash-avatar-badge">✓</span>
              </button>

              <div>
                <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem;">
                  <span style="font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background: #fef3c7; color: #92400e; padding: 0.15rem 0.5rem; border-radius: 9999px; border: 1px solid #fde68a;">
                    Siswa Aktif MPI
                  </span>
                  <span id="dashStudentClass" style="font-size: 0.75rem; font-weight: 800; color: #64748b;">
                    ${activeConfig.kelas}
                  </span>
                </div>
                <h1 style="font-size: 1.45rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.02em; display: flex; align-items: center; gap: 0.4rem;">
                  <span>Selamat Datang, <span id="dashStudentName">Peserta Didik</span>!</span>
                  <span style="color: #f59e0b;">✨</span>
                </h1>
                <p style="font-size: 0.78rem; color: #475569; margin: 0.2rem 0 0; font-weight: 600;">
                  ${activeConfig.judul} • ${activeConfig.mataPelajaran} (${activeConfig.fase})
                </p>
              </div>
            </div>

            <div class="dash-quick-btns">
              <button type="button" class="dash-quick-btn blue" onclick="switchTab('materi')" id="dashQuickMateri">
                📖 <span>Modul Materi (0/${activeMateri.length})</span>
              </button>
              <button type="button" class="dash-quick-btn teal" onclick="switchTab('bermain')" id="dashQuickGame">
                🎮 <span>Modul Game (0/${activeBermain.length}) 🔒</span>
              </button>
              <button type="button" class="dash-quick-btn indigo" onclick="switchTab('berlatih')" id="dashQuickLatih">
                📝 <span>Bank Soal (${activeLatih.length} HOTS) 🔒</span>
              </button>
            </div>

          </div>

          <!-- 📈 2. PROGRESS TRACKER CARD 📈 -->
          <div class="dash-tracker-card">
            <div class="dash-tracker-glow"></div>

            <div style="position: relative; z-index: 2; max-width: 460px;">
              <span style="font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; background: rgba(15,23,42,0.3); color: #fef08a; padding: 0.2rem 0.6rem; border-radius: 9999px; border: 1px solid rgba(254,240,138,0.4); display: inline-block; margin-bottom: 0.4rem;">
                Progress Tracker Pembelajaran
              </span>
              <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0; line-height: 1.25;">
                Progres Kelengkapan Misi MPI Sosiologi
              </h3>
              <p style="font-size: 0.8rem; color: #1e293b; margin: 0.35rem 0 0; font-weight: 600; line-height: 1.4;">
                Selesaikan Modul Materi &amp; Kuis Mini untuk membuka Modul Bermain Game Peta Petualangan dan Bank Soal Evaluasi.
              </p>
            </div>

            <div class="dash-gauge-box">
              <svg class="dash-gauge-svg" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="24" stroke="#334155" stroke-width="5" fill="none" />
                <circle id="dashGaugeCircle" cx="30" cy="30" r="24" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" fill="none" stroke-dasharray="150.8" stroke-dashoffset="150.8" style="transition: stroke-dashoffset 1s ease-out;" />
              </svg>
              <div>
                <span style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #fde047; display: block;">
                  Capaian Total
                </span>
                <span id="dashGaugeLabel" style="font-size: 1.1rem; font-weight: 900; color: white; display: block; line-height: 1.2;">
                  0% Selesai
                </span>
                <span style="font-size: 0.72rem; color: #94a3b8; display: block; margin-top: 2px;">
                  Target KKM: <strong style="color: #fbbf24;">${activeConfig.kkm} PTS</strong>
                </span>
              </div>
            </div>

          </div>

          <!-- 🗺️ 3. CENTRAL MASTER GAMIFIED ADVENTURE MAP 🗺️ -->
          <div class="master-map-container" id="masterMapSection">
            
            <div class="map-header-bar">
              <div class="map-header-left">
                <div class="map-avatar-pawn" id="mapTopAvatarIcon">
                  🎒
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.2rem;">
                    <span style="font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(245,158,11,0.2); color: #fde047; padding: 0.15rem 0.5rem; border-radius: 9999px; border: 1px solid rgba(245,158,11,0.4);">
                      Peta Misi Sosiologi SMA
                    </span>
                    <span id="mapOpenCount" style="font-size: 0.75rem; font-weight: 700; color: #cbd5e1;">
                      1 / ${activeMateri.length + activeBermain.length + 1} Misi Terbuka
                    </span>
                  </div>
                  <h3 style="font-size: 1.2rem; font-weight: 900; color: white; margin: 0;">
                    Peta Petualangan Belajar Interaktif
                  </h3>
                </div>
              </div>

              <div class="map-header-actions">
                <button type="button" class="btn-map-action purple" onclick="openSpinWheel()">
                  <span style="font-size: 1rem;">🔄</span>
                  <span>Spin Wheel</span>
                </button>
                <button type="button" class="btn-map-action amber" onclick="openShopModal()">
                  <span style="font-size: 1rem;">🛒</span>
                  <span>Toko &amp; Badges</span>
                </button>
              </div>
            </div>

            <!-- Canvas Viewport with Trail & Nodes -->
            <div id="mapViewport" class="map-canvas-viewport">
              <!-- Dynamically populated by renderMasterAdventureMap() -->
            </div>

          </div>

          <!-- 📚 4. RESOURCE LIBRARY & TOPIC SHOWCASE CARDS 📚 -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <div>
                <span style="font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; background: #fef3c7; color: #92400e; padding: 0.15rem 0.5rem; border-radius: 9999px; border: 1px solid #fde68a;">
                  Resource Library &amp; Media Showcase
                </span>
                <h4 style="font-size: 1.1rem; font-weight: 900; color: #0f172a; margin: 0.2rem 0 0;">
                  Koleksi Visual Infografis &amp; Studi Kasus
                </h4>
              </div>
              <button type="button" onclick="switchTab('materi')" style="background: none; border: none; color: #b45309; font-size: 0.78rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                <span>Lihat Seluruh Media</span> <span>➔</span>
              </button>
            </div>

            <div class="dash-resource-grid">
              
              <div class="dash-resource-card">
                <div class="dash-resource-banner b1">
                  <span style="font-size: 0.68rem; font-weight: 900; text-transform: uppercase; background: rgba(255,255,255,0.25); padding: 0.15rem 0.5rem; border-radius: 6px; width: max-content;">
                    Infografis Teori
                  </span>
                  <div style="font-size: 0.95rem; font-weight: 900; line-height: 1.3;">
                    Syarat Kelompok Sosial (Soerjono Soekanto)
                  </div>
                </div>
                <p style="font-size: 0.78rem; color: #64748b; margin: 0; line-height: 1.4;">
                  5 Indikator utama kesadaran keanggotaan (we-feeling), pola interaksi, dan struktur norma sosial.
                </p>
              </div>

              <div class="dash-resource-card">
                <div class="dash-resource-banner b2">
                  <span style="font-size: 0.68rem; font-weight: 900; text-transform: uppercase; background: rgba(255,255,255,0.25); padding: 0.15rem 0.5rem; border-radius: 6px; width: max-content;">
                    Komparasi Visual
                  </span>
                  <div style="font-size: 0.95rem; font-weight: 900; line-height: 1.3;">
                    Paguyuban (Gemeinschaft) vs Patembayan (Gesellschaft)
                  </div>
                </div>
                <p style="font-size: 0.78rem; color: #64748b; margin: 0; line-height: 1.4;">
                  Perbandingan ikatan batin gotong royong keluarga vs relasi kontraktual perkotaan modern.
                </p>
              </div>

              <div class="dash-resource-card">
                <div class="dash-resource-banner b3">
                  <span style="font-size: 0.68rem; font-weight: 900; text-transform: uppercase; background: rgba(255,255,255,0.25); padding: 0.15rem 0.5rem; border-radius: 6px; width: max-content;">
                    Game Interaktif
                  </span>
                  <div style="font-size: 0.95rem; font-weight: 900; line-height: 1.3;">
                    Game Tebak Jodoh &amp; Pilah Ciri Sosiologi
                  </div>
                </div>
                <p style="font-size: 0.78rem; color: #64748b; margin: 0; line-height: 1.4;">
                  Aktivitas gamifikasi 10 level untuk mengasah ingatan dan analisis materi kelompok sosial.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>

    <!-- TAB 1: MODUL MATERI -->
    <section id="view-materi" class="section-view">
      <div class="materi-grid">
        <div class="submateri-list" id="submateriList"></div>
        <div class="card" id="materiDetailBox"></div>
      </div>
    </section>

    <!-- TAB 2: MODUL BERMAIN -->
    <section id="view-bermain" class="section-view">
      <div class="card">
        <div class="game-nav" id="gameNavContainer"></div>
        <div class="game-container" id="gameCanvas"></div>
      </div>
    </section>

    <!-- TAB 3: MODUL BERLATIH -->
    <section id="view-berlatih" class="section-view">
      <div class="card" id="latihContainer"></div>
    </section>
  </main>

  <!-- FOOTER IDENTITAS PENGEMBANG -->
  <footer style="margin-top: auto; padding: 1.25rem 1.5rem; background: #ffffff; border-top: 1px solid #e2e8f0; font-size: 0.85rem; color: #64748b;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem;">
      <div>
        <strong style="color: #0f172a;">${activeConfig.judul}</strong> • ${activeConfig.mataPelajaran} (${activeConfig.kelas} / ${activeConfig.fase})
        ${activeConfig.topikMateri ? `<br><span style="font-size: 0.8rem; color: #475569;">Topik: ${activeConfig.topikMateri}</span>` : ''}
        <div style="margin-top: 0.35rem; font-size: 0.75rem; color: #94a3b8;">
          Generator: <strong style="color: #2563eb;">MASTERMPI</strong> (Smart MPI &amp; Gamification Engine) • <em>@ajisosiologi 2026</em>
        </div>
      </div>
      <div style="text-align: right;">
        <span>Pendidik / Pengembang Karya: <strong style="color: #0f172a;">${activeConfig.namaPengembang || activeConfig.penyusun || 'Pendidik Kreatif'}</strong></span>
        ${activeConfig.jabatan ? `<br><span style="font-size: 0.8rem; color: #475569;">Jabatan: ${activeConfig.jabatan}</span>` : ''}
        ${activeConfig.nip ? ` • <span style="font-size: 0.8rem; color: #475569;">NIP: ${activeConfig.nip}</span>` : ''}
        ${activeConfig.sekolah ? `<br><span>Instansi: ${activeConfig.sekolah}</span>` : ''}
        ${activeConfig.kontak ? `<br><span style="font-size: 0.8rem; color: #0284c7;">Kontak: ${activeConfig.kontak}</span>` : ''}
        <div style="margin-top: 0.4rem;">
          <button 
            type="button" 
            onclick="openTeacherModal()" 
            style="font-size: 0.78rem; font-weight: 800; color: #2563eb; background: none; border: none; cursor: pointer; text-decoration: underline; padding: 0;"
          >
            🌟 Lihat Identitas Lengkap Pendidik &amp; Pengembang
          </button>
        </div>
      </div>
    </div>
  </footer>

  <!-- MODAL NODE PREVIEW PETUALANGAN -->
  <div id="nodePreviewModal" class="gamify-modal-overlay">
    <div class="gamify-modal-box">
      <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="font-size: 1.35rem;" id="prevNodeIcon">🧭</span>
          <div>
            <span id="prevNodeBadge" style="font-size: 0.65rem; font-weight: 900; text-transform: uppercase; background: rgba(245,158,11,0.25); color: #fde047; padding: 0.15rem 0.5rem; border-radius: 9999px; border: 1px solid rgba(245,158,11,0.4);">
              Modul Belajar Materi
            </span>
            <h3 id="prevNodeTitle" style="font-size: 1.1rem; font-weight: 900; margin: 0.2rem 0 0; color: white;">
              Bab 1: Konsep Kelompok Sosial
            </h3>
          </div>
        </div>
        <button type="button" onclick="closeNodePreview()" style="background: rgba(255,255,255,0.15); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: 900; font-size: 1rem;">
          ✕
        </button>
      </div>

      <div style="padding: 1.5rem; overflow-y: auto;">
        <p id="prevNodeDesc" style="font-size: 0.85rem; color: #475569; margin: 0 0 1.25rem; line-height: 1.5;">
          Pelajari konsep utama dan selesaikan tantangan kuis refleksi interaktif.
        </p>

        <!-- Rewards preview -->
        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 1rem; display: flex; justify-content: space-around; align-items: center; margin-bottom: 1.5rem;">
          <div style="text-align: center;">
            <span style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; display: block;">Hadiah Koin</span>
            <span id="prevNodeCoins" style="font-size: 1.1rem; font-weight: 900; color: #d97706;">+100 Koin</span>
          </div>
          <div style="width: 1px; height: 30px; background: #cbd5e1;"></div>
          <div style="text-align: center;">
            <span style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; display: block;">Bonus XP</span>
            <span id="prevNodeXp" style="font-size: 1.1rem; font-weight: 900; color: #2563eb;">+50 XP</span>
          </div>
        </div>

        <button type="button" id="btnStartAdventure" onclick="startSelectedAdventure()" style="width: 100%; padding: 0.95rem 1.5rem; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #ea580c); color: #0f172a; font-weight: 900; font-size: 1rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(245,158,11,0.4); display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.2s;">
          🚀 <span>Mulai Petualangan Sekarang →</span>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL SPIN WHEEL OFFLINE -->
  <div id="spinWheelModal" class="gamify-modal-overlay">
    <div class="gamify-modal-box" style="max-width: 440px;">
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="font-size: 1.35rem;">🎡</span>
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 900; margin: 0; color: white;">Roda Keberuntungan (Spin Wheel)</h3>
            <p style="font-size: 0.72rem; color: #e0e7ff; margin: 0.15rem 0 0;">Putar setiap hari untuk koin, nyawa &amp; XP gratis!</p>
          </div>
        </div>
        <button type="button" onclick="closeSpinWheel()" style="background: rgba(255,255,255,0.15); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: 900; font-size: 1rem;">
          ✕
        </button>
      </div>

      <div style="padding: 1.5rem; text-align: center; display: flex; flex-direction: column; align-items: center;">
        
        <!-- Wheel Graphic Wrapper -->
        <div style="position: relative; width: 260px; height: 260px; margin: 0.5rem auto 1rem;">
          <!-- Top Arrow Pointer -->
          <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 24px solid #ef4444; z-index: 20; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));"></div>

          <!-- Rotating Wheel SVG -->
          <div id="spinWheelCanvas" style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 6px solid #1e293b; box-shadow: 0 10px 25px rgba(0,0,0,0.25); transform: rotate(0deg);">
            <!-- SVG wheel rendered via drawWheelSvg() -->
          </div>

          <!-- Center Button -->
          <button type="button" id="btnDoSpin" onclick="spinTheWheel()" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 62px; height: 62px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); border: 4px solid #ffffff; color: #0f172a; font-weight: 900; font-size: 0.85rem; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 15;">
            SPIN!
          </button>
        </div>

        <div id="spinResultBox" style="display: none; padding: 0.75rem 1rem; border-radius: 12px; background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #065f46; font-size: 0.9rem; font-weight: 800; margin-top: 0.5rem; width: 100%; box-sizing: border-box;">
        </div>

        <button type="button" onclick="spinTheWheel()" style="margin-top: 1rem; width: 100%; padding: 0.85rem 1.5rem; border-radius: 14px; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; font-weight: 900; font-size: 0.95rem; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(124,58,237,0.35);">
          🎲 Putar Roda Keberuntungan Sekarang
        </button>

      </div>
    </div>
  </div>

  <!-- MODAL TOKO AVATAR, TEMA & BADGES -->
  <div id="shopModalOverlay" class="gamify-modal-overlay">
    <div class="gamify-modal-box" style="max-width: 600px;">
      
      <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="font-size: 1.35rem;">🛒</span>
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 900; margin: 0; color: white;">Toko Sosiologi &amp; Lencana Prestasi</h3>
            <p style="font-size: 0.72rem; color: #94a3b8; margin: 0.15rem 0 0;">Kustomisasi avatar, suasana peta, dan koleksi badges</p>
          </div>
        </div>
        <button type="button" onclick="closeShopModal()" style="background: rgba(255,255,255,0.15); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: 900; font-size: 1rem;">
          ✕
        </button>
      </div>

      <!-- Shop Tabs -->
      <div style="display: flex; background: #f1f5f9; padding: 0.5rem 1rem; gap: 0.5rem; border-bottom: 1px solid #e2e8f0;">
        <button type="button" id="tabShopAvatar" onclick="switchShopTab('avatar')" style="flex: 1; padding: 0.5rem; border-radius: 10px; font-size: 0.8rem; font-weight: 800; border: none; cursor: pointer; background: white; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          👤 Karakter Avatar
        </button>
        <button type="button" id="tabShopTheme" onclick="switchShopTab('theme')" style="flex: 1; padding: 0.5rem; border-radius: 10px; font-size: 0.8rem; font-weight: 800; border: none; cursor: pointer; background: transparent; color: #64748b;">
          🎨 Tema Peta
        </button>
        <button type="button" id="tabShopBadges" onclick="switchShopTab('badges')" style="flex: 1; padding: 0.5rem; border-radius: 10px; font-size: 0.8rem; font-weight: 800; border: none; cursor: pointer; background: transparent; color: #64748b;">
          🏅 Lencana (Badges)
        </button>
      </div>

      <!-- Shop Content Area -->
      <div id="shopContentArea" style="padding: 1.25rem 1.5rem; overflow-y: auto; max-height: 60vh;">
        <!-- Populated dynamically by renderShopContent() -->
      </div>

      <div style="padding: 0.85rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end;">
        <button type="button" onclick="closeShopModal()" style="padding: 0.55rem 1.25rem; border-radius: 10px; background: #0f172a; color: white; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer;">
          Selesai
        </button>
      </div>

    </div>
  </div>

  <!-- MODAL ISI ULANG NYAWA (REFILL HEARTS) -->
  <div id="refillHeartsModal" class="gamify-modal-overlay">
    <div class="refill-hearts-card">
      <button type="button" onclick="closeRefillHearts()" style="position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.1); border: none; color: white; cursor: pointer; font-size: 1rem; font-weight: 900;">
        ✕
      </button>
      <div style="width: 56px; height: 56px; border-radius: 20px; background: rgba(244,63,94,0.2); border: 1.5px solid rgba(244,63,94,0.4); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 0.75rem;">
        ❤️
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 900; margin: 0; color: white;">
        Isi Ulang Nyawa Belajar
      </h3>
      <p style="font-size: 0.8rem; color: #cbd5e1; margin: 0.35rem 0 1.25rem; line-height: 1.4;">
        Nyawa diperlukan saat mengeksplorasi modul kuis dan tantangan gamifikasi sosiologi.
      </p>

      <div id="refillQuizBox" style="display: none; background: #1e293b; border-radius: 16px; padding: 1rem; margin-bottom: 1rem; text-align: left;">
        <div style="font-size: 0.85rem; font-weight: 800; color: #fde047; margin-bottom: 0.5rem;">
          ⚡ Kuis Kilat Refleksi:
        </div>
        <p id="refillQuizQuestion" style="font-size: 0.85rem; color: white; margin-bottom: 0.75rem;">
          Apa ciri utama dari Paguyuban (Gemeinschaft)?
        </p>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;" id="refillQuizOptions">
          <button type="button" onclick="checkRefillQuiz(0)" style="padding: 0.5rem 0.75rem; border-radius: 10px; border: 1px solid #475569; background: #0f172a; color: white; text-align: left; font-size: 0.8rem; cursor: pointer;">
            A. Hubungan kontraktual jangka pendek
          </button>
          <button type="button" onclick="checkRefillQuiz(1)" style="padding: 0.5rem 0.75rem; border-radius: 10px; border: 1px solid #475569; background: #0f172a; color: white; text-align: left; font-size: 0.8rem; cursor: pointer;">
            B. Ikatan batin yang mendalam, intim, dan alami
          </button>
          <button type="button" onclick="checkRefillQuiz(2)" style="padding: 0.5rem 0.75rem; border-radius: 10px; border: 1px solid #475569; background: #0f172a; color: white; text-align: left; font-size: 0.8rem; cursor: pointer;">
            C. Berdasarkan pembagian kerja spesialisasi industri
          </button>
        </div>
        <div id="refillQuizMsg" style="margin-top: 0.5rem; font-size: 0.8rem; font-weight: 800; display: none;"></div>
      </div>

      <div id="refillOptionsList" style="display: flex; flex-direction: column; gap: 0.75rem;">
        <button type="button" onclick="startRefillQuiz()" style="padding: 0.85rem 1rem; border-radius: 16px; background: linear-gradient(135deg, #059669, #0d9488); border: none; color: white; cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 10px rgba(5,150,105,0.3);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">💡</span>
            <div>
              <div style="font-size: 0.85rem; font-weight: 900;">Jawab 1 Kuis Refleksi</div>
              <div style="font-size: 0.72rem; color: #a7f3d0;">Dapatkan +3 Nyawa Gratis</div>
            </div>
          </div>
          <span style="font-size: 0.8rem; font-weight: 900; background: rgba(255,255,255,0.2); padding: 0.25rem 0.6rem; border-radius: 9999px;">GRATIS</span>
        </button>

        <button type="button" onclick="refillHeartsWithCoins()" style="padding: 0.85rem 1rem; border-radius: 16px; background: linear-gradient(135deg, #d97706, #b45309); border: none; color: white; cursor: pointer; text-align: left; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 10px rgba(217,119,6,0.3);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">🪙</span>
            <div>
              <div style="font-size: 0.85rem; font-weight: 900;">Tukar 100 Koin</div>
              <div style="font-size: 0.72rem; color: #fde68a;">Isi Penuh Menjadi 5 Nyawa</div>
            </div>
          </div>
          <span style="font-size: 0.8rem; font-weight: 900; background: rgba(0,0,0,0.3); padding: 0.25rem 0.6rem; border-radius: 9999px; color: #fde047;">100 Koin</span>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL PENGATURAN MUSIK OFFLINE (BGM ENGINE) -->
  <div id="musicModalOverlay" class="music-modal-overlay">
    <div class="music-modal-card anim-bounce-in">
      
      <!-- Modal Header -->
      <div style="background: linear-gradient(135deg, #0f172a, #134e4a); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(20, 184, 166, 0.25); border: 1px solid rgba(45, 212, 191, 0.4); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
            🎵
          </div>
          <div>
            <h3 style="font-size: 1.05rem; font-weight: 800; margin: 0; color: #ffffff;">Pengaturan Musik Latar</h3>
            <p style="font-size: 0.72rem; color: #99f6e4; margin: 0.15rem 0 0;">100% Offline Procedural Synthesizer &amp; Audio</p>
          </div>
        </div>
        <button 
          type="button" 
          onclick="closeMusicModal()" 
          style="background: rgba(255,255,255,0.15); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: 900; font-size: 1rem; display: flex; align-items: center; justify-content: center;"
        >
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div style="padding: 1.25rem 1.5rem; overflow-y: auto; max-height: 75vh;">
        
        <!-- Status & Playback Control Card -->
        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 1rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div id="modalEqIcon" style="display: flex; align-items: flex-end; gap: 3px; height: 22px; padding: 2px;">
              <span class="eq-bar" style="width: 4px; height: 8px; background: #0d9488; border-radius: 2px;"></span>
              <span class="eq-bar" style="width: 4px; height: 16px; background: #0d9488; border-radius: 2px;"></span>
              <span class="eq-bar" style="width: 4px; height: 12px; background: #0d9488; border-radius: 2px;"></span>
              <span class="eq-bar" style="width: 4px; height: 18px; background: #0d9488; border-radius: 2px;"></span>
            </div>
            <div>
              <div id="modalBgmStatusText" style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">Memutar Musik</div>
              <div id="modalBgmTrackDesc" style="font-size: 0.75rem; color: #64748b;">Lo-Fi Chill Belajar</div>
            </div>
          </div>

          <button 
            type="button" 
            id="modalBtnTogglePlay" 
            onclick="bgm.toggle()" 
            style="padding: 0.6rem 1.2rem; border-radius: 12px; border: none; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; background: #0d9488; color: white; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);"
          >
            ⏸ Jeda
          </button>
        </div>

        <!-- Volume Slider -->
        <div style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #334155;">Volume Musik</label>
            <span id="modalVolumeLabel" style="font-size: 0.8rem; font-weight: 800; color: #0d9488;">35%</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button 
              type="button" 
              onclick="bgm.toggleMute()" 
              id="modalBtnMute" 
              style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1rem;"
            >
              🔊
            </button>
            <input 
              type="range" 
              id="modalVolumeSlider" 
              min="0" 
              max="100" 
              value="35" 
              oninput="bgm.setVolume(this.value / 100)" 
              style="flex: 1; accent-color: #0d9488; cursor: pointer;"
            />
          </div>
        </div>

        <!-- Track Selection Presets -->
        <div style="margin-bottom: 1.25rem;">
          <label style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #334155; display: block; margin-bottom: 0.5rem;">
            Pilihan Suasana Musik (Synthesizer)
          </label>
          
          <div class="music-track-grid">
            <!-- Track 1: Lo-Fi -->
            <button type="button" class="music-track-btn" id="btnTrack_lofi" onclick="bgm.setTrack('lofi')">
              <span style="font-size: 1.25rem;">☕</span>
              <div style="min-width: 0; text-align: left;">
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a;">Lo-Fi Chill</div>
                <div style="font-size: 0.68rem; color: #64748b;">Rileks &amp; Fokus Belajar</div>
              </div>
            </button>

            <!-- Track 2: Cheerful -->
            <button type="button" class="music-track-btn" id="btnTrack_cheerful" onclick="bgm.setTrack('cheerful')">
              <span style="font-size: 1.25rem;">☀️</span>
              <div style="min-width: 0; text-align: left;">
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a;">Semangat Ceria</div>
                <div style="font-size: 0.68rem; color: #64748b;">Inspiratif &amp; Optimis</div>
              </div>
            </button>

            <!-- Track 3: Acoustic -->
            <button type="button" class="music-track-btn" id="btnTrack_acoustic" onclick="bgm.setTrack('acoustic')">
              <span style="font-size: 1.25rem;">🌿</span>
              <div style="min-width: 0; text-align: left;">
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a;">Harmoni Tenang</div>
                <div style="font-size: 0.68rem; color: #64748b;">Akustik Piano &amp; Hangat</div>
              </div>
            </button>

            <!-- Track 4: Synthwave Arcade -->
            <button type="button" class="music-track-btn" id="btnTrack_synthwave" onclick="bgm.setTrack('synthwave')">
              <span style="font-size: 1.25rem;">🎮</span>
              <div style="min-width: 0; text-align: left;">
                <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a;">8-Bit Retro Arcade</div>
                <div style="font-size: 0.68rem; color: #64748b;">Game Zone Ceria</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Custom Audio Upload Section -->
        <div style="background: #f1f5f9; border: 1.5px dashed #cbd5e1; border-radius: 14px; padding: 0.9rem 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label style="font-size: 0.78rem; font-weight: 800; color: #334155; display: flex; align-items: center; gap: 0.35rem;">
              <span>📁</span> File Audio MP3 Kustom
            </label>
            <span id="modalCustomStatusBadge" style="font-size: 0.68rem; padding: 0.15rem 0.5rem; border-radius: 9999px; background: #e2e8f0; color: #64748b; font-weight: 700;">
              Tidak ada file
            </span>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <input 
              type="file" 
              id="modalCustomFileInput" 
              accept="audio/*" 
              onchange="handleCustomAudioUpload(event)" 
              style="font-size: 0.78rem; width: 100%; color: #475569;"
            />
          </div>
          <p style="font-size: 0.68rem; color: #64748b; margin: 0.35rem 0 0;">
            Dukungan format: MP3, WAV, AAC, OGG. Musik disematkan langsung di dalam browser tanpa internet.
          </p>
        </div>

      </div>

      <!-- Modal Footer -->
      <div style="padding: 0.85rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end;">
        <button 
          type="button" 
          onclick="closeMusicModal()" 
          style="padding: 0.55rem 1.25rem; border-radius: 10px; background: #0f172a; color: white; border: none; font-weight: 700; font-size: 0.85rem; cursor: pointer;"
        >
          Tutup
        </button>
      </div>

    </div>
  </div>

  <script>
    // =========================================================================
    // INJEKSI DATA KONFIGURASI MPI OFFLINE KURIKULUM MERDEKA
    // =========================================================================
    const CONFIG = ${configJson};
    const MATERI = ${materiJson};
    const dataBermain = ${dataBermainJson};
    const dtLatih = ${dtLatihJson};

    // =========================================================================
    // 100% OFFLINE AUDIO SYNTHESIZER & BGM ENGINE (WEB AUDIO API)
    // =========================================================================
    class OfflineAudio {
      constructor() {
        this.ctx = null;
        this.enabled = true;
      }
      init() {
        try {
          if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
          }
        } catch(e){}
      }
      click() {
        if (!this.enabled) return;
        try {
          this.init();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.frequency.setValueAtTime(450, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.04);
        } catch(e){}
      }
      success() {
        if (!this.enabled) return;
        try {
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.08);
          osc.frequency.setValueAtTime(783.99, now + 0.16);
          osc.frequency.setValueAtTime(1046.50, now + 0.24);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.45);
        } catch(e){}
      }
      error() {
        if (!this.enabled) return;
        try {
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(190, now);
          osc.frequency.setValueAtTime(120, now + 0.1);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        } catch(e){}
      }
    }
    const audio = new OfflineAudio();

    class OfflineBgmEngine {
      constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.timer = null;
        this.step = 0;
        this.gainNode = null;
        this.track = CONFIG.bgmTrack || 'lofi';
        this.volume = (typeof CONFIG.bgmVolume === 'number') ? CONFIG.bgmVolume : 0.35;
        this.customAudioUrl = CONFIG.customAudioUrl || '';
        this.customAudioName = CONFIG.customAudioName || '';
        this.customAudioEl = null;
      }

      init() {
        try {
          if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
              this.ctx = new AudioCtx();
              this.gainNode = this.ctx.createGain();
              const currentVol = this.isMuted ? 0 : this.volume * 0.15;
              this.gainNode.gain.setValueAtTime(currentVol, this.ctx.currentTime);
              this.gainNode.connect(this.ctx.destination);
            }
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
          }
        } catch(e){}
      }

      playNote(freq, time, duration, type, peakVol) {
        if (!this.ctx || !this.isPlaying || this.isMuted) return;
        try {
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(this.track === 'synthwave' ? 2200 : 1200, time);

          osc.type = type || 'sine';
          osc.frequency.setValueAtTime(freq, time);

          const peak = peakVol || 0.08;
          noteGain.gain.setValueAtTime(0.0001, time);
          noteGain.gain.exponentialRampToValueAtTime(peak, time + 0.03);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

          osc.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(this.gainNode);

          osc.start(time);
          osc.stop(time + duration);
        } catch(e){}
      }

      start() {
        this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;

        if (this.track === 'custom' && this.customAudioUrl) {
          this.playCustomAudio();
        } else {
          this.schedule();
        }
        this.renderUI();
      }

      stop() {
        this.isPlaying = false;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        if (this.customAudioEl) {
          try {
            this.customAudioEl.pause();
          } catch(e){}
        }
        this.renderUI();
      }

      toggle() {
        this.init();
        if (this.isPlaying) {
          this.stop();
        } else {
          this.start();
        }
      }

      setTrack(trackId) {
        this.track = trackId;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        if (this.customAudioEl) {
          try { this.customAudioEl.pause(); } catch(e){}
        }
        this.step = 0;
        if (this.isPlaying) {
          if (trackId === 'custom' && this.customAudioUrl) {
            this.playCustomAudio();
          } else {
            this.schedule();
          }
        }
        this.renderUI();
      }

      setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.isMuted) this.isMuted = false;
        if (this.gainNode && this.ctx) {
          this.gainNode.gain.setValueAtTime(this.volume * 0.15, this.ctx.currentTime);
        }
        if (this.customAudioEl) {
          this.customAudioEl.volume = this.volume;
        }
        this.renderUI();
      }

      toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.gainNode && this.ctx) {
          const targetVol = this.isMuted ? 0 : this.volume * 0.15;
          this.gainNode.gain.setValueAtTime(targetVol, this.ctx.currentTime);
        }
        if (this.customAudioEl) {
          this.customAudioEl.muted = this.isMuted;
        }
        this.renderUI();
      }

      playCustomAudio() {
        if (!this.customAudioUrl) {
          this.schedule();
          return;
        }
        try {
          if (!this.customAudioEl) {
            this.customAudioEl = new Audio();
            this.customAudioEl.loop = true;
          }
          this.customAudioEl.src = this.customAudioUrl;
          this.customAudioEl.volume = this.isMuted ? 0 : this.volume;
          this.customAudioEl.play().catch(() => {
            // Fallback to synth if autoplay restriction or audio error occurs
            this.schedule();
          });
        } catch(e) {
          this.schedule();
        }
      }

      schedule() {
        if (!this.isPlaying || !this.ctx) return;
        const now = this.ctx.currentTime;

        let beat = 0.32;
        let chords = [];

        if (this.track === 'cheerful') {
          // G -> D -> Em -> C (Semangat Ceria & Inspiratif)
          beat = 0.28;
          chords = [
            { bass: 98.00,  notes: [196.00, 246.94, 293.66, 392.00] }, // G
            { bass: 146.83, notes: [220.00, 293.66, 369.99, 440.00] }, // D
            { bass: 82.41,  notes: [164.81, 196.00, 246.94, 329.63] }, // Em
            { bass: 130.81, notes: [261.63, 329.63, 392.00, 523.25] }, // C
          ];
        } else if (this.track === 'acoustic') {
          // D -> F#m -> G -> A (Harmoni Tenang & Fokus)
          beat = 0.35;
          chords = [
            { bass: 146.83, notes: [220.00, 293.66, 369.99, 440.00] }, // D
            { bass: 92.50,  notes: [185.00, 220.00, 277.18, 369.99] }, // F#m
            { bass: 98.00,  notes: [196.00, 246.94, 293.66, 392.00] }, // G
            { bass: 110.00, notes: [220.00, 277.18, 329.63, 440.00] }, // A
          ];
        } else if (this.track === 'synthwave') {
          // Am -> F -> C -> G (8-Bit Retro Arcade)
          beat = 0.24;
          chords = [
            { bass: 110.00, notes: [220.00, 261.63, 329.63, 440.00] }, // Am
            { bass: 87.31,  notes: [174.61, 220.00, 261.63, 349.23] }, // F
            { bass: 130.81, notes: [261.63, 329.63, 392.00, 523.25] }, // C
            { bass: 98.00,  notes: [196.00, 246.94, 293.66, 392.00] }, // G
          ];
        } else {
          // 'lofi' default: Cmaj7 -> Am7 -> Fmaj7 -> Gsus4 (Lo-Fi Chill Belajar)
          beat = 0.32;
          chords = [
            { bass: 130.81, notes: [261.63, 329.63, 392.00, 493.88] }, // C
            { bass: 110.00, notes: [220.00, 261.63, 329.63, 392.00] }, // Am
            { bass: 87.31,  notes: [174.61, 261.63, 349.23, 440.00] }, // F
            { bass: 98.00,  notes: [196.00, 293.66, 392.00, 493.88] }, // G
          ];
        }

        const chordIdx = Math.floor((this.step / 8) % chords.length);
        const curChord = chords[chordIdx];
        const stepInBar = this.step % 8;

        // Sub bass note
        if (stepInBar === 0) {
          const bassType = this.track === 'synthwave' ? 'square' : 'triangle';
          this.playNote(curChord.bass, now, beat * 3.5, bassType, 0.12);
        }

        // Arpeggio notes
        const note = curChord.notes[stepInBar % curChord.notes.length];
        const noteType = this.track === 'synthwave' ? 'sawtooth' : (this.track === 'acoustic' ? 'triangle' : 'sine');
        this.playNote(note, now, beat * 1.2, noteType, 0.07);

        if (stepInBar === 2 || stepInBar === 5) {
          this.playNote(note * 1.5, now + 0.04, beat * 0.9, 'sine', 0.04);
        }

        this.step++;
        this.timer = setTimeout(() => this.schedule(), beat * 1000);
      }

      getTrackTitle() {
        if (this.track === 'custom') return this.customAudioName || 'Audio Kustom';
        if (this.track === 'cheerful') return 'Semangat Ceria';
        if (this.track === 'acoustic') return 'Harmoni Tenang';
        if (this.track === 'synthwave') return '8-Bit Retro';
        return 'Lo-Fi Chill';
      }

      renderUI() {
        const title = this.getTrackTitle();

        // 1. Update Header Music Button
        const btn = document.getElementById('btnMusicToggle');
        if (btn) {
          if (this.isPlaying && !this.isMuted) {
            btn.innerHTML = '🎵 ' + title + ': AKTIF';
            btn.style.background = 'rgba(13, 148, 136, 0.4)';
            btn.style.borderColor = '#2dd4bf';
          } else {
            btn.innerHTML = '🔇 Musik: MATI';
            btn.style.background = 'rgba(255, 255, 255, 0.15)';
            btn.style.borderColor = 'transparent';
          }
        }

        // 2. Update Modal Elements
        const modalStatusText = document.getElementById('modalBgmStatusText');
        const modalTrackDesc = document.getElementById('modalBgmTrackDesc');
        const modalBtnPlay = document.getElementById('modalBtnTogglePlay');
        const modalVolLabel = document.getElementById('modalVolumeLabel');
        const modalVolSlider = document.getElementById('modalVolumeSlider');
        const modalBtnMute = document.getElementById('modalBtnMute');
        const modalEq = document.getElementById('modalEqIcon');

        if (modalStatusText) {
          modalStatusText.textContent = (this.isPlaying && !this.isMuted) ? 'Memutar Musik' : 'Musik Dijeda';
        }
        if (modalTrackDesc) {
          modalTrackDesc.textContent = title + ' • 100% Offline Engine';
        }
        if (modalBtnPlay) {
          modalBtnPlay.innerHTML = this.isPlaying ? '⏸ Jeda' : '▶ Putar';
          modalBtnPlay.style.background = this.isPlaying ? '#0d9488' : '#2563eb';
        }
        if (modalVolLabel) {
          modalVolLabel.textContent = Math.round(this.volume * 100) + '%';
        }
        if (modalVolSlider) {
          modalVolSlider.value = Math.round(this.volume * 100);
        }
        if (modalBtnMute) {
          modalBtnMute.textContent = (this.isMuted || this.volume === 0) ? '🔇' : '🔊';
        }

        if (modalEq) {
          const bars = modalEq.querySelectorAll('.eq-bar');
          bars.forEach((bar, idx) => {
            if (this.isPlaying && !this.isMuted) {
              bar.style.animation = 'mpiEqBar 0.8s ease-in-out infinite alternate ' + (idx * 0.18) + 's';
            } else {
              bar.style.animation = 'none';
              bar.style.height = '4px';
            }
          });
        }

        // 3. Highlight selected track preset button
        const presetIds = ['lofi', 'cheerful', 'acoustic', 'synthwave'];
        presetIds.forEach(id => {
          const tBtn = document.getElementById('btnTrack_' + id);
          if (tBtn) {
            if (this.track === id) {
              tBtn.classList.add('active');
            } else {
              tBtn.classList.remove('active');
            }
          }
        });

        // 4. Custom status badge
        const customBadge = document.getElementById('modalCustomStatusBadge');
        if (customBadge) {
          if (this.customAudioUrl) {
            customBadge.textContent = '✓ ' + (this.customAudioName || 'Audio Aktif');
            customBadge.style.background = '#dcfce7';
            customBadge.style.color = '#15803d';
          } else {
            customBadge.textContent = 'Tidak ada file';
            customBadge.style.background = '#e2e8f0';
            customBadge.style.color = '#64748b';
          }
        }
      }
    }
    const bgm = new OfflineBgmEngine();

    function openMusicModal() {
      audio.click();
      bgm.init();
      const modal = document.getElementById('musicModalOverlay');
      if (modal) {
        modal.style.display = 'flex';
        bgm.renderUI();
      }
    }

    function closeMusicModal() {
      audio.click();
      const modal = document.getElementById('musicModalOverlay');
      if (modal) modal.style.display = 'none';
    }

    function handleCustomAudioUpload(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      audio.click();
      const reader = new FileReader();
      reader.onload = function(evt) {
        if (evt.target && evt.target.result) {
          bgm.customAudioUrl = evt.target.result;
          bgm.customAudioName = file.name;
          bgm.setTrack('custom');
          audio.success();
        }
      };
      reader.readAsDataURL(file);
    }

    // Auto unlock AudioContext on the first gesture anywhere on the window
    function unlockAudioEngine() {
      try { audio.init(); } catch(e){}
      try { bgm.init(); } catch(e){}
    }
    ['click', 'touchstart', 'keydown', 'mousedown'].forEach(evt => {
      try {
        window.addEventListener(evt, unlockAudioEngine, { once: true });
      } catch(e){}
    });

    // =========================================================================
    // IDENTITAS SISWA & GERBANG MASUK
    // =========================================================================
    var currentStudent = {
      nama: '',
      kelas: CONFIG.kelas || 'Kelas XI'
    };

    var STUDENT_STORAGE_KEY = 'MPI_OFFLINE_STUDENT_STATE_V1';
    function saveStudentState() {
      try {
        localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(currentStudent));
      } catch(e){}
    }
    function loadStudentState() {
      try {
        var raw = localStorage.getItem(STUDENT_STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            if (parsed.nama) currentStudent.nama = parsed.nama;
            if (parsed.kelas) currentStudent.kelas = parsed.kelas;
          }
        }
      } catch(e){}
    }

    function setQuickStudentName(e) {
      if (e) {
        try {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          if (typeof e.stopPropagation === 'function') e.stopPropagation();
        } catch(err){}
      }
      var inputNama = document.getElementById('inputGateNama');
      if (inputNama) {
        inputNama.value = 'Peserta Didik';
        try { inputNama.focus(); } catch(err){}
      }
      currentStudent.nama = 'Peserta Didik';
      try { audio.click(); } catch(err){}
    }

    function handleGateStep1Submit(e) {
      if (e) {
        try {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          if (typeof e.stopPropagation === 'function') e.stopPropagation();
        } catch(err){}
      }
      try {
        var inputNama = document.getElementById('inputGateNama');
        var inputKelas = document.getElementById('inputGateKelas');
        var alertBox = document.getElementById('gateAlertBox');

        var namaVal = (inputNama && inputNama.value ? inputNama.value : '').trim();
        var kelasVal = (inputKelas && inputKelas.value ? inputKelas.value : '').trim();

        // Jika nama dikosongkan, gunakan default "Peserta Didik" agar pembelajaran langsung berjalan lancar
        if (!namaVal) {
          namaVal = 'Peserta Didik';
          if (inputNama) inputNama.value = namaVal;
        }

        if (!kelasVal) {
          kelasVal = CONFIG.kelas || 'Kelas XI';
          if (inputKelas) inputKelas.value = kelasVal;
        }

        if (alertBox) alertBox.style.display = 'none';

        currentStudent.nama = namaVal;
        currentStudent.kelas = kelasVal;
        saveStudentState();

        // Update badges in Step 3 and Header
        var hdrNama = document.getElementById('hdrStudentName');
        var hdrKelas = document.getElementById('hdrStudentClass');
        var s3Nama = document.getElementById('lblStep3StudentNama');
        var s3Kelas = document.getElementById('lblStep3StudentKelas');
        var dashNama = document.getElementById('dashStudentName');
        var dashKelas = document.getElementById('dashStudentClass');

        if (hdrNama) hdrNama.textContent = namaVal;
        if (hdrKelas) hdrKelas.textContent = kelasVal;
        if (s3Nama) s3Nama.textContent = namaVal;
        if (s3Kelas) s3Kelas.textContent = kelasVal;
        if (dashNama) dashNama.textContent = namaVal;
        if (dashKelas) dashKelas.textContent = kelasVal;

        // Tutup overlay langsung agar siswa tidak tertahan di gerbang login!
        var overlay = document.getElementById('gateOverlay');
        if (overlay) {
          overlay.classList.add('gate-hidden');
          overlay.style.display = 'none';
        }
      } catch(err) {
        console.error('Error during gate submit:', err);
        var overlayErr = document.getElementById('gateOverlay');
        if (overlayErr) {
          overlayErr.classList.add('gate-hidden');
          overlayErr.style.display = 'none';
        }
      }

      try { audio.success(); } catch(err){}
      try { updateDashboardUI(); } catch(err){}
      try { renderMasterAdventureMap(); } catch(err){}
      try { switchTab('dashboard'); } catch(err){}
      try { bgm.start(); } catch(err){}
      return false;
    }

    function handleGateStep1ToStep3(e) {
      if (e) {
        try {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          if (typeof e.stopPropagation === 'function') e.stopPropagation();
        } catch(err){}
      }
      try {
        var inputNama = document.getElementById('inputGateNama');
        var inputKelas = document.getElementById('inputGateKelas');
        var alertBox = document.getElementById('gateAlertBox');

        var namaVal = (inputNama && inputNama.value ? inputNama.value : '').trim();
        var kelasVal = (inputKelas && inputKelas.value ? inputKelas.value : '').trim();

        if (!namaVal) {
          namaVal = 'Peserta Didik';
          if (inputNama) inputNama.value = namaVal;
        }

        if (!kelasVal) {
          kelasVal = CONFIG.kelas || 'Kelas XI';
          if (inputKelas) inputKelas.value = kelasVal;
        }

        if (alertBox) alertBox.style.display = 'none';

        currentStudent.nama = namaVal;
        currentStudent.kelas = kelasVal;
        saveStudentState();

        var hdrNama = document.getElementById('hdrStudentName');
        var hdrKelas = document.getElementById('hdrStudentClass');
        var s3Nama = document.getElementById('lblStep3StudentNama');
        var s3Kelas = document.getElementById('lblStep3StudentKelas');

        if (hdrNama) hdrNama.textContent = namaVal;
        if (hdrKelas) hdrKelas.textContent = kelasVal;
        if (s3Nama) s3Nama.textContent = namaVal;
        if (s3Kelas) s3Kelas.textContent = kelasVal;

        var step1 = document.getElementById('gateStep1');
        var step3 = document.getElementById('gateStep3');
        if (step1) step1.style.display = 'none';
        if (step3) {
          step3.style.display = 'block';
          step3.className = 'gate-card gate-step3-card anim-slide-up';
        }
      } catch(err){
        console.error(err);
      }
      try { audio.success(); } catch(err){}
      try { bgm.start(); } catch(err){}
    }

    function openStudentModal() {
      audio.click();
      var overlay = document.getElementById('gateOverlay');
      var step1 = document.getElementById('gateStep1');
      var step3 = document.getElementById('gateStep3');
      var btnClose = document.getElementById('btnCloseGateStep1');

      if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.remove('gate-hidden');
      }
      if (step3) step3.style.display = 'none';
      if (step1) {
        step1.style.display = 'block';
        step1.className = 'gate-card anim-bounce-in';
      }
      if (btnClose) {
        btnClose.style.display = currentStudent.nama ? 'block' : 'none';
      }
      var inp = document.getElementById('inputGateNama');
      if (inp) {
        inp.focus();
        if (currentStudent.nama) inp.value = currentStudent.nama;
      }
    }

    function closeStudentModal() {
      if (!currentStudent.nama) return;
      audio.click();
      var overlay = document.getElementById('gateOverlay');
      if (overlay) {
        overlay.classList.add('gate-hidden');
        overlay.style.display = 'none';
      }
    }

    function openTeacherModal() {
      audio.click();
      var modal = document.getElementById('modalTeacherOverlay');
      if (modal) {
        modal.style.display = 'flex';
      }
    }

    function closeTeacherModal() {
      audio.click();
      var modal = document.getElementById('modalTeacherOverlay');
      if (modal) {
        modal.style.display = 'none';
      }
    }

    // =========================================================================
    // MPI PREREQUISITE & PROGRESS TRACKING STATE
    // =========================================================================
    var completedBabIds = [];
    var completedGamesCount = 0;
    var currentPrereqTarget = 'materi';

    function isMateriAllCompleted() {
      return completedBabIds.length >= MATERI.length;
    }

    function isBermainAllCompleted() {
      return completedGamesCount > 0 || gameProgress.some(Boolean);
    }

    function showPrereqModal(title, desc, targetTab) {
      currentPrereqTarget = targetTab || 'materi';
      var modal = document.getElementById('prereqModalOverlay');
      var titleEl = document.getElementById('prereqModalTitle');
      var descEl = document.getElementById('prereqModalDesc');
      var btnEl = document.getElementById('prereqActionBtn');
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      if (btnEl) {
        btnEl.textContent = currentPrereqTarget === 'materi' 
          ? '📖 Buka Modul Materi' 
          : '🎮 Buka Modul Bermain';
      }
      if (modal) modal.style.display = 'flex';
    }

    function closePrereqModal() {
      var modal = document.getElementById('prereqModalOverlay');
      if (modal) modal.style.display = 'none';
    }

    function handlePrereqAction() {
      closePrereqModal();
      var overlay = document.getElementById('gateOverlay');
      if (overlay) overlay.classList.add('gate-hidden');
      switchTab(currentPrereqTarget);
    }

    function updateMpiProgressUI() {
      var materiDone = isMateriAllCompleted();
      var bermainDone = isBermainAllCompleted();

      // Update Ribbon
      var rCount = document.getElementById('ribbonMateriCount');
      var rBermain = document.getElementById('ribbonBermainText');
      var rBerlatih = document.getElementById('ribbonBerlatihText');
      var tabMatBadge = document.getElementById('tabMateriBadge');
      var tabBerBadge = document.getElementById('tabBermainBadge');
      var tabLatBadge = document.getElementById('tabBerlatihBadge');
      var tabBerBtn = document.getElementById('tabBtnBermain');
      var tabLatBtn = document.getElementById('tabBtnBerlatih');
      var tabBerIcon = document.getElementById('tabBermainLockIcon');
      var tabLatIcon = document.getElementById('tabBerlatihLockIcon');

      if (rCount) rCount.textContent = completedBabIds.length + '/' + MATERI.length + ' Bab';
      if (tabMatBadge) tabMatBadge.style.display = materiDone ? 'inline-flex' : 'none';

      if (rBermain) {
        if (bermainDone) {
          rBermain.innerHTML = '<span style="color:#4ade80;">✓ Selesai</span>';
        } else if (materiDone) {
          rBermain.innerHTML = '<span style="color:#38bdf8;">✨ Terbuka</span>';
        } else {
          rBermain.innerHTML = '<span style="color:#fbbf24;">🔒 Terkunci</span>';
        }
      }

      if (rBerlatih) {
        if (bermainDone) {
          rBerlatih.innerHTML = '<span style="color:#38bdf8;">✨ Terbuka</span>';
        } else {
          rBerlatih.innerHTML = '<span style="color:#fbbf24;">🔒 Terkunci</span>';
        }
      }

      // Tab Bermain button
      if (tabBerBtn) {
        if (materiDone) {
          tabBerBtn.classList.remove('tab-locked');
          if (tabBerIcon) tabBerIcon.textContent = '🎮';
          if (tabBerBadge) {
            tabBerBadge.className = bermainDone ? 'tab-done-badge' : 'tab-done-badge';
            tabBerBadge.textContent = bermainDone ? '✓ Selesai' : 'Terbuka';
          }
        } else {
          tabBerBtn.classList.add('tab-locked');
          if (tabBerIcon) tabBerIcon.textContent = '🔒';
          if (tabBerBadge) {
            tabBerBadge.className = 'tab-lock-badge';
            tabBerBadge.textContent = 'Terkunci';
          }
        }
      }

      // Tab Berlatih button
      if (tabLatBtn) {
        if (bermainDone) {
          tabLatBtn.classList.remove('tab-locked');
          if (tabLatIcon) tabLatIcon.textContent = '📝';
          if (tabLatBadge) {
            tabLatBadge.className = 'tab-done-badge';
            tabLatBadge.textContent = 'Terbuka';
          }
        } else {
          tabLatBtn.classList.add('tab-locked');
          if (tabLatIcon) tabLatIcon.textContent = '🔒';
          if (tabLatBadge) {
            tabLatBadge.className = 'tab-lock-badge';
            tabLatBadge.textContent = 'Terkunci';
          }
        }
      }
    }

    function selectModuleAndEnter(tabId) {
      if (tabId === 'bermain' && !isMateriAllCompleted()) {
        audio.error();
        showPrereqModal(
          'Modul Bermain Terkunci!',
          'Sesuai aturan alur MPI: Prasyarat masuk Modul Bermain harus menyelesaikan seluruh bab pada Modul Materi dan menjawab Kuis Mini Refleksi Cepat (Checkpoint Siswa) dengan benar terlebih dahulu.',
          'materi'
        );
        return;
      }

      if (tabId === 'latih' && (!isMateriAllCompleted() || !isBermainAllCompleted())) {
        audio.error();
        showPrereqModal(
          'Modul Berlatih Terkunci!',
          'Sesuai aturan alur MPI: Prasyarat masuk Modul Berlatih harus menyelesaikan Modul Belajar (Materi) dan Modul Bermain terlebih dahulu sebelum mengerjakan asesmen evaluasi.',
          isMateriAllCompleted() ? 'bermain' : 'materi'
        );
        return;
      }

      audio.success();
      bgm.start();
      var overlay = document.getElementById('gateOverlay');
      if (overlay) {
        overlay.classList.add('gate-hidden');
        overlay.style.display = 'none';
      }
      switchTab(tabId === 'latih' ? 'berlatih' : tabId);
    }

    function enterMpiApplication() {
      audio.success();
      bgm.start();
      var overlay = document.getElementById('gateOverlay');
      if (overlay) {
        overlay.classList.add('gate-hidden');
        overlay.style.display = 'none';
      }
      switchTab('materi');
    }

    function reopenGate() {
      audio.click();
      var overlay = document.getElementById('gateOverlay');
      if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.remove('gate-hidden');
      }
      var step1 = document.getElementById('gateStep1');
      var step3 = document.getElementById('gateStep3');
      if (currentStudent.nama) {
        if (step1) step1.style.display = 'none';
        if (step3) {
          step3.style.display = 'block';
          step3.className = 'gate-card gate-step3-card anim-slide-up';
        }
      } else {
        if (step3) step3.style.display = 'none';
        if (step1) {
          step1.style.display = 'block';
          step1.className = 'gate-card anim-bounce-in';
        }
      }
    }

    var musicBtn = document.getElementById('btnMusicToggle');
    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        bgm.toggle();
      });
    }

    var soundBtn = document.getElementById('btnSoundToggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        audio.enabled = !audio.enabled;
        soundBtn.textContent = audio.enabled ? '🔊 Suara: AKTIF' : '🔇 Suara: MATI';
        if (audio.enabled) audio.click();
      });
    }

    // =========================================================================
    // SISTEM GAMIFIKASI & PETA PETUALANGAN BELAJAR INTERAKTIF
    // =========================================================================
    var AVATARS_CATALOG = [
      { id: 'siswa_biasa', name: 'Siswa Penjelajah', emoji: '🎒', role: 'Pelajar Aktif Sosiologi' },
      { id: 'sosiolog_muda', name: 'Sosiolog Detektif', emoji: '🕵️‍♂️', role: 'Peneliti Fenomena Sosial' },
      { id: 'profesor_sosio', name: 'Profesor Sosiologi', emoji: '👨‍🏫', role: 'Pakar Teori & Struktur Sosial' },
      { id: 'budayawan', name: 'Pakar Kebudayaan', emoji: '🎭', role: 'Ahli Tradisi & Kearifan Lokal' },
      { id: 'astronot_sosio', name: 'Sosiolog Antariksa', emoji: '👨‍🚀', role: 'Penjelajah Galaksi Sosiologi' }
    ];

    var MAP_THEMES = [
      { id: 'valley', name: 'Lembah Hijau', emoji: '🌲', bg: 'radial-gradient(circle at 50% 10%, #064e3b 0%, #022c22 100%)', pathStroke: '#fef08a', pathBorder: '#854d0e', decorations: ['🌲', '🏞️', '🌉', '🏕️', '🌻', '🪵', '🍄', '🦅', '🎯', '🌿'] },
      { id: 'farm', name: 'Ladang Cendekiawan', emoji: '🌾', bg: 'radial-gradient(circle at 50% 10%, #78350f 0%, #451a03 100%)', pathStroke: '#fed7aa', pathBorder: '#7c2d12', decorations: ['🚜', '🌽', '🏡', '🌾', '🍎', '🌻', '🐄', '🧺', '🐥', '🏆'] },
      { id: 'space', name: 'Galaxy Antariksa', emoji: '🚀', bg: 'radial-gradient(circle at 50% 10%, #1e1b4b 0%, #020617 100%)', pathStroke: '#38bdf8', pathBorder: '#1e1b4b', decorations: ['🚀', '🪐', '🛸', '⭐', '☄️', '🌌', '🌍', '🛰️', '✨', '🏆'] },
      { id: 'island', name: 'Pulau Tropis', emoji: '🏝️', bg: 'radial-gradient(circle at 50% 10%, #0e7490 0%, #082f49 100%)', pathStroke: '#fef08a', pathBorder: '#155e75', decorations: ['🏖️', '🌴', '⛵', '🌊', '🐚', '🦜', '🥥', '🌅', '🌺', '🏆'] },
      { id: 'cyber', name: 'Cyberpunk 2077', emoji: '🤖', bg: 'radial-gradient(circle at 50% 10%, #701a75 0%, #0f172a 100%)', pathStroke: '#f43f5e', pathBorder: '#701a75', decorations: ['🏙️', '⚡', '🤖', '🎮', '🛸', '🛰️', '💾', '🌐', '💎', '🏆'] }
    ];

    var BADGES_CATALOG = [
      { id: 'b1', name: 'Penjelajah Pertama', desc: 'Mulai petualangan MPI Sosiologi', icon: '🌟' },
      { id: 'b2', name: 'Kutu Buku Sosiologi', desc: 'Tuntaskan seluruh bab Modul Belajar', icon: '📖' },
      { id: 'b3', name: 'Gamers Cerdas', desc: 'Tuntaskan seluruh modul bermain', icon: '🎮' },
      { id: 'b4', name: 'Master Evaluasi HOTS', desc: 'Selesaikan asesmen evaluasi bank soal', icon: '🎯' },
      { id: 'b5', name: 'Sosiolog Paripurna', desc: 'Raih nilai evaluasi di atas KKM', icon: '🏆' }
    ];

    var gamificationState = {
      coins: 250,
      xp: 120,
      level: 1,
      hearts: 5,
      activeAvatarId: 'siswa_biasa',
      activeMapTheme: 'valley',
      completedNodes: [],
      unlockedBadges: ['b1']
    };

    var GAMIFY_STORAGE_KEY = 'MPI_OFFLINE_GAMIFY_STATE_V1';
    function loadGamificationState() {
      try {
        var raw = localStorage.getItem(GAMIFY_STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            gamificationState = Object.assign(gamificationState, parsed);
          }
        }
      } catch(e){}
    }

    function saveGamificationState() {
      try {
        localStorage.setItem(GAMIFY_STORAGE_KEY, JSON.stringify(gamificationState));
      } catch(e){}
    }

    function getActiveAvatar() {
      for (var i = 0; i < AVATARS_CATALOG.length; i++) {
        if (AVATARS_CATALOG[i].id === gamificationState.activeAvatarId) {
          return AVATARS_CATALOG[i];
        }
      }
      return AVATARS_CATALOG[0];
    }

    // Toggle Frame Mode: Full Screen vs Realistic Tablet Mockup
    var currentFrameMode = 'full';
    function setFrameMode(mode) {
      audio.click();
      currentFrameMode = mode;
      var container = document.getElementById('dashContainer');
      var btnFull = document.getElementById('btnFrameFull');
      var btnTablet = document.getElementById('btnFrameTablet');
      var notch = document.getElementById('tabletNotch');

      if (mode === 'tablet') {
        if (container) container.className = 'dashboard-container frame-tablet';
        if (btnTablet) btnTablet.classList.add('active');
        if (btnFull) btnFull.classList.remove('active');
        if (notch) notch.style.display = 'flex';
      } else {
        if (container) container.className = 'dashboard-container frame-full';
        if (btnFull) btnFull.classList.add('active');
        if (btnTablet) btnTablet.classList.remove('active');
        if (notch) notch.style.display = 'none';
      }
    }

    // Update Dashboard UI Stats & Gauge
    function updateDashboardUI() {
      var sName = document.getElementById('dashStudentName');
      var sClass = document.getElementById('dashStudentClass');
      var sAvatar = document.getElementById('dashAvatarIcon');
      var sTopAvatar = document.getElementById('mapTopAvatarIcon');

      var nameVal = currentStudent.nama || 'Peserta Didik';
      var classVal = currentStudent.kelas || CONFIG.kelas || 'Kelas XI';
      var avatarObj = getActiveAvatar();

      if (sName) sName.textContent = nameVal;
      if (sClass) sClass.textContent = classVal;
      if (sAvatar) sAvatar.textContent = avatarObj.emoji;
      if (sTopAvatar) sTopAvatar.textContent = avatarObj.emoji;

      // Update Quick Action Buttons
      var qMateri = document.getElementById('dashQuickMateri');
      var qGame = document.getElementById('dashQuickGame');
      var qLatih = document.getElementById('dashQuickLatih');

      if (qMateri) qMateri.innerHTML = '📖 <span>Modul Materi (' + completedBabIds.length + '/' + MATERI.length + ')</span>';
      if (qGame) {
        var gDoneCount = gameProgress.filter(Boolean).length;
        var matDone = isMateriAllCompleted();
        qGame.innerHTML = '🎮 <span>Modul Game (' + gDoneCount + '/' + dataBermain.length + ')' + (!matDone ? ' 🔒' : '') + '</span>';
      }
      if (qLatih) {
        var berDone = isBermainAllCompleted();
        var matDone2 = isMateriAllCompleted();
        qLatih.innerHTML = '📝 <span>Bank Soal (' + dtLatih.length + ' HOTS)' + ((!matDone2 || !berDone) ? ' 🔒' : '') + '</span>';
      }

      // Calculate Overall Completion
      var totalMateri = MATERI.length || 1;
      var totalGames = dataBermain.length || 1;
      var materiPct = Math.min(100, Math.round((completedBabIds.length / totalMateri) * 100));
      var gamePct = Math.min(100, Math.round((gameProgress.filter(Boolean).length / totalGames) * 100));
      var overallPct = Math.round((materiPct * 0.4) + (gamePct * 0.4) + (isBermainAllCompleted() ? 20 : 0));

      var gaugeVal = document.getElementById('dashGaugeLabel');
      var gaugeCircle = document.getElementById('dashGaugeCircle');

      if (gaugeCircle) {
        var circ = 150.8;
        var offset = circ - (circ * overallPct) / 100;
        gaugeCircle.style.strokeDashoffset = offset;
      }
      if (gaugeVal) {
        gaugeVal.textContent = overallPct >= 100 ? '🏆 Selesai Tuntas!' : overallPct + '% Selesai';
      }

      var mapOpen = document.getElementById('mapOpenCount');
      if (mapOpen) {
        var openCount = 1 + completedBabIds.length + gameProgress.filter(Boolean).length;
        var totalNodes = MATERI.length + dataBermain.length + 1;
        mapOpen.textContent = Math.min(openCount, totalNodes) + ' / ' + totalNodes + ' Misi Terbuka';
      }

      // Update Top HUD Elements
      var hudHearts = document.getElementById('hudHeartsList');
      if (hudHearts) {
        var hHtml = '';
        for (var hi = 0; hi < 5; hi++) {
          hHtml += '<span>' + (hi < gamificationState.hearts ? '❤️' : '🤍') + '</span>';
        }
        hudHearts.innerHTML = hHtml;
      }
      var hudCoins = document.getElementById('hudCoinsVal');
      if (hudCoins) hudCoins.textContent = gamificationState.coins.toLocaleString('id-ID');
      var hudLvl = document.getElementById('hudLevelVal');
      if (hudLvl) hudLvl.textContent = 'Lvl ' + gamificationState.level;
      var hudLvlTitle = document.getElementById('hudLevelTitle');
      if (hudLvlTitle) {
        var lTitle = gamificationState.level >= 5 ? '(Master Sosiologi)' : gamificationState.level >= 3 ? '(Peneliti Madya)' : '(Penjelajah)';
        hudLvlTitle.textContent = lTitle;
      }
    }

    // Build Master Adventure Map Nodes & SVG Curve
    var allMapNodes = [];
    function buildMapNodesList() {
      allMapNodes = [];
      var counter = 1;
      // 1. Materi Nodes
      MATERI.forEach(function(m, idx) {
        allMapNodes.push({
          id: 'materi_' + idx,
          number: counter++,
          type: 'materi',
          targetIdx: idx,
          title: m.judul,
          typeLabel: 'Modul Belajar (Materi)',
          desc: 'Pelajari konsep ' + m.kategori + ' dan selesaikan kuis mini refleksi.',
          coins: 100,
          xp: 50,
          icon: '📖'
        });
      });
      // 2. Game Nodes
      dataBermain.forEach(function(g, idx) {
        allMapNodes.push({
          id: 'game_' + idx,
          number: counter++,
          type: 'game',
          targetIdx: idx,
          title: g.judul,
          typeLabel: 'Tantangan Game Sosiologi',
          desc: g.instruksi || 'Tantangan mini game sosiologi interaktif.',
          coins: 150,
          xp: 80,
          icon: '🎮'
        });
      });
      // 3. Final Boss Node
      allMapNodes.push({
        id: 'asesmen_boss',
        number: counter++,
        type: 'asesmen',
        targetIdx: 0,
        title: 'Evaluasi Final Sosiologi HOTS',
        typeLabel: 'Evaluasi Final Sosiologi',
        desc: 'Ujian komprehensif seluruh materi untuk mengklaim predikat kelulusan dan nilai rapor MPI.',
        coins: 500,
        xp: 300,
        icon: '🏆',
        isBoss: true
      });
    }

    function renderMasterAdventureMap() {
      buildMapNodesList();
      var viewport = document.getElementById('mapViewport');
      if (!viewport) return;

      var currentTheme = MAP_THEMES[0];
      for (var t = 0; t < MAP_THEMES.length; t++) {
        if (MAP_THEMES[t].id === gamificationState.activeMapTheme) {
          currentTheme = MAP_THEMES[t];
          break;
        }
      }
      viewport.style.background = currentTheme.bg;

      var ySpacing = 130;
      var topMargin = 85;
      var totalHeight = topMargin + (allMapNodes.length * ySpacing) + 70;
      viewport.style.minHeight = totalHeight + 'px';

      // Coordinates
      var coords = [];
      for (var i = 0; i < allMapNodes.length; i++) {
        var y = topMargin + (i * ySpacing);
        var angle = (i * Math.PI) / 2.2;
        var x = 50 + Math.sin(angle) * 32; // 18% to 82%
        coords.push({ x: x, y: y });
      }

      // Generate SVG Trail Path
      var svgPathD = '';
      if (coords.length > 0) {
        svgPathD = 'M ' + (coords[0].x * 10) + ' ' + coords[0].y;
        for (var j = 0; j < coords.length - 1; j++) {
          var p1 = coords[j];
          var p2 = coords[j + 1];
          var midY = (p1.y + p2.y) / 2;
          svgPathD += ' C ' + (p1.x * 10) + ' ' + midY + ', ' + (p2.x * 10) + ' ' + midY + ', ' + (p2.x * 10) + ' ' + p2.y;
        }
      }

      var svgHtml = '<svg class="map-svg-trail" viewBox="0 0 1000 ' + totalHeight + '" preserveAspectRatio="none">' +
        '<path d="' + svgPathD + '" stroke="' + (currentTheme.pathBorder || '#854d0e') + '" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none" />' +
        '<path d="' + svgPathD + '" stroke="' + currentTheme.pathStroke + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="14, 8" fill="none" opacity="0.95" />' +
        '</svg>';

      // Generate Decorative Scenery Icons alongside Trail
      var decHtml = '';
      var decList = currentTheme.decorations || ['🌲', '🏞️', '🌉', '🏕️', '🌻', '🪵', '🍄', '🦅', '🎯', '🌿'];
      for (var d = 0; d < allMapNodes.length; d++) {
        var dPos = coords[d];
        var decIcon = decList[d % decList.length];
        var dSide = d % 2 === 0 ? Math.max(8, dPos.x - 22) : Math.min(92, dPos.x + 22);
        decHtml += '<div style="position:absolute; left:' + dSide + '%; top:' + (dPos.y + 30) + 'px; font-size:1.85rem; transform:translate(-50%,-50%); opacity:0.8; pointer-events:none; user-select:none;">' + decIcon + '</div>';
      }

      // Generate Node HTML
      var nodesHtml = '';
      var activeAvatarObj = getActiveAvatar();
      var hasPlacedAvatar = false;

      for (var k = 0; k < allMapNodes.length; k++) {
        var node = allMapNodes[k];
        var pos = coords[k];

        // Status check
        var isDone = false;
        if (node.type === 'materi') {
          isDone = completedBabIds.indexOf(node.targetIdx) !== -1;
        } else if (node.type === 'game') {
          isDone = Boolean(gameProgress[node.targetIdx]);
        }

        var isUnlocked = false;
        if (k === 0) {
          isUnlocked = true;
        } else {
          var prev = allMapNodes[k - 1];
          if (prev.type === 'materi') {
            isUnlocked = completedBabIds.indexOf(prev.targetIdx) !== -1;
          } else if (prev.type === 'game') {
            isUnlocked = Boolean(gameProgress[prev.targetIdx]);
          }
        }

        var isActiveNode = isUnlocked && !isDone && !hasPlacedAvatar;
        if (isActiveNode) hasPlacedAvatar = true;

        var btnClass = 'map-node-btn';
        if (node.isBoss) btnClass += ' node-boss';
        else if (isDone) btnClass += ' node-done';
        else if (isActiveNode) btnClass += ' node-active';
        else if (isUnlocked) btnClass += ' node-active';
        else btnClass += ' node-locked';

        // Avatar Marker over active node
        var avatarMarkerHtml = '';
        if (isActiveNode) {
          avatarMarkerHtml = '<div class="map-active-avatar-marker" style="position:absolute; top:-66px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; pointer-events:none; z-index:30;">' +
            '<div style="background:#fbbf24; color:#0f172a; font-weight:900; font-size:10px; padding:2px 8px; border-radius:9999px; white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.4); border:1px solid #fde047; margin-bottom:2px;">' + activeAvatarObj.name + '</div>' +
            '<div style="width:44px; height:44px; border-radius:50%; background:#0f172a; border:2.5px solid #fbbf24; display:flex; align-items:center; justify-content:center; font-size:1.45rem; box-shadow:0 6px 14px rgba(0,0,0,0.5);">' + activeAvatarObj.emoji + '</div>' +
            '<div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #fbbf24;"></div>' +
            '</div>';
        }

        // Inner button content
        var btnInnerHtml = '';
        if (node.isBoss) {
          btnInnerHtml = '<span style="font-size:2rem; line-height:1;">👑</span>';
        } else if (!isUnlocked) {
          btnInnerHtml = '<span style="font-size:1.35rem; color:#94a3b8;">🔒</span>';
        } else {
          var typeText = node.type === 'materi' ? 'BAB' : (node.type === 'game' ? 'GAME' : 'KUIS');
          btnInnerHtml = '<span style="font-size:0.62rem; font-weight:900; text-transform:uppercase; letter-spacing:0.02em; opacity:0.85; line-height:1; margin-bottom:2px;">' + typeText + '</span>' +
                         '<span style="font-size:1.35rem; font-weight:900; line-height:1;">' + node.number + '</span>';
        }

        // 3-Star Rating Pill below button
        var starBadgesHtml = '';
        if (isUnlocked) {
          var s1 = isDone ? '⭐' : '★';
          var s2 = isDone ? '⭐' : '★';
          var s3 = isDone ? '⭐' : '★';
          var starColor = isDone ? '#fbbf24' : '#64748b';
          starBadgesHtml = '<div style="position:absolute; bottom:-9px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:2px; background:rgba(15,23,42,0.92); padding:1.5px 7px; border-radius:9999px; border:1px solid rgba(148,163,184,0.3); font-size:9px; color:' + starColor + '; box-shadow:0 2px 5px rgba(0,0,0,0.5); z-index:15;">' +
            s1 + s2 + s3 +
            '</div>';
        }

        // Title Label
        var labelHtml = '<div class="map-node-label" style="margin-top:12px; padding:3px 10px; border-radius:8px; font-size:11px; font-weight:800; background:rgba(15,23,42,0.88); color:white; border:1px solid rgba(51,65,85,0.8); max-width:130px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; box-shadow:0 2px 6px rgba(0,0,0,0.4);">' + node.title + '</div>';

        nodesHtml += '<div class="map-node-item" style="left:' + pos.x + '%; top:' + pos.y + 'px;" data-node-id="' + node.id + '" onclick="openNodePreview(this.dataset.nodeId)">' +
          avatarMarkerHtml +
          '<button type="button" class="' + btnClass + '">' +
            btnInnerHtml +
            starBadgesHtml +
          '</button>' +
          labelHtml +
          '</div>';
      }

      viewport.innerHTML = svgHtml + decHtml + nodesHtml;
    }

    // Node Preview Modal Handlers
    var selectedMapNode = null;
    function openNodePreview(nodeId) {
      audio.click();
      selectedMapNode = null;
      for (var i = 0; i < allMapNodes.length; i++) {
        if (allMapNodes[i].id === nodeId) {
          selectedMapNode = allMapNodes[i];
          break;
        }
      }
      if (!selectedMapNode) return;

      var modal = document.getElementById('nodePreviewModal');
      var badge = document.getElementById('prevNodeBadge');
      var title = document.getElementById('prevNodeTitle');
      var desc = document.getElementById('prevNodeDesc');
      var coins = document.getElementById('prevNodeCoins');
      var xp = document.getElementById('prevNodeXp');
      var icon = document.getElementById('prevNodeIcon');

      if (badge) badge.textContent = selectedMapNode.typeLabel;
      if (title) title.textContent = selectedMapNode.title;
      if (desc) desc.textContent = selectedMapNode.desc;
      if (coins) coins.textContent = '+' + selectedMapNode.coins + ' Koin';
      if (xp) xp.textContent = '+' + selectedMapNode.xp + ' XP';
      if (icon) icon.textContent = selectedMapNode.icon;

      if (modal) modal.style.display = 'flex';
    }

    function closeNodePreview() {
      audio.click();
      var modal = document.getElementById('nodePreviewModal');
      if (modal) modal.style.display = 'none';
      selectedMapNode = null;
    }

    function startSelectedAdventure() {
      if (!selectedMapNode) return;
      var node = selectedMapNode;
      closeNodePreview();

      if (node.type === 'materi') {
        switchTab('materi');
        selectMateri(node.targetIdx);
      } else if (node.type === 'game') {
        if (!isMateriAllCompleted()) {
          showPrereqModal(
            'Modul Bermain Terkunci!',
            'Sesuai aturan alur MPI: Anda harus menyelesaikan seluruh bab Modul Materi terlebih dahulu!',
            'materi'
          );
          return;
        }
        switchTab('bermain');
        selectGame(node.targetIdx);
      } else if (node.type === 'asesmen') {
        if (!isMateriAllCompleted() || !isBermainAllCompleted()) {
          showPrereqModal(
            'Modul Berlatih Terkunci!',
            'Sesuai aturan alur MPI: Anda harus menyelesaikan Modul Belajar (Materi) dan Modul Bermain terlebih dahulu!',
            isMateriAllCompleted() ? 'bermain' : 'materi'
          );
          return;
        }
        switchTab('berlatih');
      }
    }

    // Spin Wheel Functions
    var isSpinningWheel = false;
    var wheelRotationDeg = 0;
    var WHEEL_SEGMENTS = [
      { text: '+50 Koin', type: 'coins', amount: 50, color: '#f59e0b' },
      { text: '+1 Nyawa', type: 'hearts', amount: 1, color: '#ef4444' },
      { text: '+100 XP', type: 'xp', amount: 100, color: '#3b82f6' },
      { text: '+25 Koin', type: 'coins', amount: 25, color: '#10b981' },
      { text: '+200 XP', type: 'xp', amount: 200, color: '#8b5cf6' },
      { text: '+2 Nyawa', type: 'hearts', amount: 2, color: '#ec4899' },
      { text: '+150 Koin', type: 'coins', amount: 150, color: '#f97316' },
      { text: '+50 XP', type: 'xp', amount: 50, color: '#06b6d4' }
    ];

    function drawWheelSvg() {
      var container = document.getElementById('spinWheelCanvas');
      if (!container) return;

      var numSegs = WHEEL_SEGMENTS.length;
      var stepAngle = 360 / numSegs;
      var svgParts = '<svg viewBox="0 0 260 260" width="100%" height="100%">';

      for (var i = 0; i < numSegs; i++) {
        var startA = (i * stepAngle - 90) * Math.PI / 180;
        var endA = ((i + 1) * stepAngle - 90) * Math.PI / 180;
        var x1 = 130 + 130 * Math.cos(startA);
        var y1 = 130 + 130 * Math.sin(startA);
        var x2 = 130 + 130 * Math.cos(endA);
        var y2 = 130 + 130 * Math.sin(endA);

        var seg = WHEEL_SEGMENTS[i];
        svgParts += '<path d="M 130 130 L ' + x1 + ' ' + y1 + ' A 130 130 0 0 1 ' + x2 + ' ' + y2 + ' Z" fill="' + seg.color + '" stroke="#1e293b" stroke-width="2" />';

        // Text label
        var textAngle = (i * stepAngle + stepAngle / 2);
        svgParts += '<g transform="rotate(' + textAngle + ' 130 130)">' +
          '<text x="130" y="45" fill="white" font-size="11" font-weight="900" text-anchor="middle" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.7))">' + seg.text + '</text>' +
          '</g>';
      }

      svgParts += '</svg>';
      container.innerHTML = svgParts;
    }

    function openSpinWheel() {
      audio.click();
      var modal = document.getElementById('spinWheelModal');
      var resultBox = document.getElementById('spinResultBox');
      if (resultBox) resultBox.style.display = 'none';
      if (modal) modal.style.display = 'flex';
      drawWheelSvg();
    }

    function closeSpinWheel() {
      if (isSpinningWheel) return;
      audio.click();
      var modal = document.getElementById('spinWheelModal');
      if (modal) modal.style.display = 'none';
    }

    function spinTheWheel() {
      if (isSpinningWheel) return;
      isSpinningWheel = true;
      audio.click();
      var btn = document.getElementById('btnDoSpin');
      var resultBox = document.getElementById('spinResultBox');
      if (btn) btn.disabled = true;
      if (resultBox) resultBox.style.display = 'none';

      var prizeIdx = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
      var segmentAngle = 360 / WHEEL_SEGMENTS.length;
      var targetAngle = 360 - (prizeIdx * segmentAngle + segmentAngle / 2);
      var extraRounds = 5 + Math.floor(Math.random() * 3);
      wheelRotationDeg += (extraRounds * 360) + targetAngle - (wheelRotationDeg % 360);

      var wheelEl = document.getElementById('spinWheelCanvas');
      if (wheelEl) {
        wheelEl.style.transition = 'transform 3.5s cubic-bezier(0.15, 0.9, 0.25, 1)';
        wheelEl.style.transform = 'rotate(' + wheelRotationDeg + 'deg)';
      }

      var tickInterval = setInterval(function() {
        audio.click();
      }, 250);

      setTimeout(function() {
        clearInterval(tickInterval);
        isSpinningWheel = false;
        if (btn) btn.disabled = false;
        audio.success();
        triggerOfflineConfetti();

        var prize = WHEEL_SEGMENTS[prizeIdx];
        if (prize.type === 'coins') gamificationState.coins += prize.amount;
        if (prize.type === 'xp') gamificationState.xp += prize.amount;
        if (prize.type === 'hearts') gamificationState.hearts = Math.min(5, gamificationState.hearts + prize.amount);
        saveGamificationState();

        if (resultBox) {
          resultBox.style.display = 'block';
          resultBox.innerHTML = '🎉 <strong>Selamat!</strong> Anda Memperoleh <strong>' + prize.text + '</strong>!';
        }
        updateDashboardUI();
      }, 3600);
    }

    // Avatar Shop & Badges Modal Handlers
    var currentShopTab = 'avatar';
    function openShopModal() {
      audio.click();
      var modal = document.getElementById('shopModalOverlay');
      if (modal) modal.style.display = 'flex';
      switchShopTab(currentShopTab);
    }

    function closeShopModal() {
      audio.click();
      var modal = document.getElementById('shopModalOverlay');
      if (modal) modal.style.display = 'none';
    }

    function switchShopTab(tab) {
      audio.click();
      currentShopTab = tab;
      var tabA = document.getElementById('tabShopAvatar');
      var tabT = document.getElementById('tabShopTheme');
      var tabB = document.getElementById('tabShopBadges');

      if (tabA) {
        tabA.style.background = tab === 'avatar' ? 'white' : 'transparent';
        tabA.style.color = tab === 'avatar' ? '#0f172a' : '#64748b';
      }
      if (tabT) {
        tabT.style.background = tab === 'theme' ? 'white' : 'transparent';
        tabT.style.color = tab === 'theme' ? '#0f172a' : '#64748b';
      }
      if (tabB) {
        tabB.style.background = tab === 'badges' ? 'white' : 'transparent';
        tabB.style.color = tab === 'badges' ? '#0f172a' : '#64748b';
      }

      renderShopContent();
    }

    function renderShopContent() {
      var area = document.getElementById('shopContentArea');
      if (!area) return;

      if (currentShopTab === 'avatar') {
        var html = '<div style="display:grid; grid-template-columns:1fr; gap:0.75rem;">';
        AVATARS_CATALOG.forEach(function(av) {
          var isCurrent = av.id === gamificationState.activeAvatarId;
          html += '<div style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1rem; border-radius:16px; border:2px solid ' + (isCurrent ? '#f59e0b' : '#e2e8f0') + '; background:' + (isCurrent ? '#fffbeb' : 'white') + '; gap:1rem;">' +
            '<div style="display:flex; align-items:center; gap:0.85rem;">' +
              '<div style="width:48px; height:48px; border-radius:14px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:1.75rem;">' + av.emoji + '</div>' +
              '<div>' +
                '<h4 style="margin:0; font-size:0.95rem; font-weight:900; color:#0f172a;">' + av.name + '</h4>' +
                '<p style="margin:0.15rem 0 0; font-size:0.75rem; color:#64748b;">' + av.role + '</p>' +
              '</div>' +
            '</div>' +
            (isCurrent 
              ? '<span style="font-size:0.75rem; font-weight:900; color:#15803d; background:#dcfce7; padding:0.35rem 0.75rem; border-radius:9999px;">✓ Terpilih</span>' 
              : '<button type="button" data-avatar-id="' + av.id + '" onclick="selectAvatar(this.dataset.avatarId)" style="padding:0.45rem 1rem; border-radius:10px; background:#0f172a; color:white; font-size:0.78rem; font-weight:800; border:none; cursor:pointer;">Gunakan</button>') +
            '</div>';
        });
        html += '</div>';
        area.innerHTML = html;
      } else if (currentShopTab === 'theme') {
        var html2 = '<div style="display:grid; grid-template-columns:1fr; gap:0.75rem;">';
        MAP_THEMES.forEach(function(th) {
          var isCurrent = th.id === gamificationState.activeMapTheme;
          html2 += '<div style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1rem; border-radius:16px; border:2px solid ' + (isCurrent ? '#f59e0b' : '#e2e8f0') + '; background:' + (isCurrent ? '#fffbeb' : 'white') + '; gap:1rem;">' +
            '<div style="display:flex; align-items:center; gap:0.85rem;">' +
              '<div style="width:48px; height:48px; border-radius:14px; background:' + th.bg + '; display:flex; align-items:center; justify-content:center; font-size:1.5rem; border:1px solid rgba(255,255,255,0.2);">' + th.emoji + '</div>' +
              '<div>' +
                '<h4 style="margin:0; font-size:0.95rem; font-weight:900; color:#0f172a;">' + th.name + '</h4>' +
                '<p style="margin:0.15rem 0 0; font-size:0.75rem; color:#64748b;">Suasana visual peta petualangan</p>' +
              '</div>' +
            '</div>' +
            (isCurrent 
              ? '<span style="font-size:0.75rem; font-weight:900; color:#15803d; background:#dcfce7; padding:0.35rem 0.75rem; border-radius:9999px;">✓ Aktif</span>' 
              : '<button type="button" data-theme-id="' + th.id + '" onclick="selectTheme(this.dataset.themeId)" style="padding:0.45rem 1rem; border-radius:10px; background:#0f172a; color:white; font-size:0.78rem; font-weight:800; border:none; cursor:pointer;">Terapkan</button>') +
            '</div>';
        });
        html2 += '</div>';
        area.innerHTML = html2;
      } else if (currentShopTab === 'badges') {
        var html3 = '<div style="display:grid; grid-template-columns:1fr; gap:0.75rem;">';
        BADGES_CATALOG.forEach(function(bg) {
          var isUnlocked = gamificationState.unlockedBadges.indexOf(bg.id) !== -1;
          html3 += '<div style="display:flex; align-items:center; gap:0.85rem; padding:0.85rem 1rem; border-radius:16px; border:1.5px solid #e2e8f0; background:' + (isUnlocked ? 'white' : '#f8fafc') + '; opacity:' + (isUnlocked ? '1' : '0.7') + ';">' +
            '<div style="width:46px; height:46px; border-radius:14px; background:' + (isUnlocked ? '#fef3c7' : '#e2e8f0') + '; display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0;">' + bg.icon + '</div>' +
            '<div style="flex:1;">' +
              '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                '<h4 style="margin:0; font-size:0.9rem; font-weight:900; color:#0f172a;">' + bg.name + '</h4>' +
                (isUnlocked ? '<span style="font-size:0.7rem; font-weight:800; color:#15803d; background:#dcfce7; padding:0.15rem 0.5rem; border-radius:9999px;">Terbuka ✓</span>' : '<span style="font-size:0.7rem; font-weight:800; color:#94a3b8;">🔒 Terkunci</span>') +
              '</div>' +
              '<p style="margin:0.2rem 0 0; font-size:0.75rem; color:#64748b;">' + bg.desc + '</p>' +
            '</div>' +
            '</div>';
        });
        html3 += '</div>';
        area.innerHTML = html3;
      }
    }

    function selectAvatar(id) {
      audio.success();
      gamificationState.activeAvatarId = id;
      saveGamificationState();
      renderShopContent();
      updateDashboardUI();
      renderMasterAdventureMap();
    }

    function selectTheme(id) {
      audio.success();
      gamificationState.activeMapTheme = id;
      saveGamificationState();
      renderShopContent();
      renderMasterAdventureMap();
    }

    // Refill Hearts Modal Handlers
    function openRefillHearts() {
      audio.click();
      var m = document.getElementById('refillHeartsModal');
      var qBox = document.getElementById('refillQuizBox');
      var oList = document.getElementById('refillOptionsList');
      var msg = document.getElementById('refillQuizMsg');
      if (qBox) qBox.style.display = 'none';
      if (oList) oList.style.display = 'flex';
      if (msg) msg.style.display = 'none';
      if (m) m.style.display = 'flex';
    }

    function closeRefillHearts() {
      audio.click();
      var m = document.getElementById('refillHeartsModal');
      if (m) m.style.display = 'none';
    }

    function startRefillQuiz() {
      audio.click();
      var qBox = document.getElementById('refillQuizBox');
      var oList = document.getElementById('refillOptionsList');
      if (qBox) qBox.style.display = 'block';
      if (oList) oList.style.display = 'none';
    }

    function checkRefillQuiz(optIdx) {
      var msg = document.getElementById('refillQuizMsg');
      if (optIdx === 1) { // Correct answer: Ikatan batin mendalam
        audio.success();
        gamificationState.hearts = Math.min(5, gamificationState.hearts + 3);
        saveGamificationState();
        updateDashboardUI();
        triggerOfflineConfetti();
        if (msg) {
          msg.style.display = 'block';
          msg.style.color = '#10b981';
          msg.innerHTML = '🎉 Jawaban Benar! +3 Nyawa berhasil ditambahkan!';
        }
        setTimeout(function() {
          closeRefillHearts();
        }, 1200);
      } else {
        audio.error();
        if (msg) {
          msg.style.display = 'block';
          msg.style.color = '#ef4444';
          msg.innerHTML = '❌ Jawaban belum tepat. Coba pilih opsi lain!';
        }
      }
    }

    function refillHeartsWithCoins() {
      if (gamificationState.coins < 100) {
        audio.error();
        alert('Koin Anda tidak mencukupi (Perlu 100 Koin). Selesaikan bab materi atau mainkan kuis untuk dapat koin!');
        return;
      }
      audio.success();
      gamificationState.coins -= 100;
      gamificationState.hearts = 5;
      saveGamificationState();
      updateDashboardUI();
      triggerOfflineConfetti();
      closeRefillHearts();
    }

    // Unified Game Completion Handler
    function markGameComplete(gameIdx) {
      if (!gameProgress[gameIdx]) {
        gameProgress[gameIdx] = true;
        completedGamesCount++;
        var gameNodeId = 'game_' + gameIdx;
        if (gamificationState.completedNodes.indexOf(gameNodeId) === -1) {
          gamificationState.completedNodes.push(gameNodeId);
          gamificationState.coins += 150;
          gamificationState.xp += 80;
          gamificationState.level = Math.max(1, Math.floor(gamificationState.xp / 100) + 1);
          if (gamificationState.completedNodes.length >= 2 && gamificationState.unlockedBadges.indexOf('b3') === -1) {
            gamificationState.unlockedBadges.push('b3');
          }
          saveGamificationState();
        }
      }
      renderGameNav();
      updateMpiProgressUI();
      updateDashboardUI();
      renderMasterAdventureMap();
    }

    // =========================================================================
    // NAVIGASI TAB DENGAN ATURAN PRASYARAT MPI
    // =========================================================================
    function switchTab(tabId) {
      if (tabId === 'bermain' && !isMateriAllCompleted()) {
        audio.error();
        showPrereqModal(
          'Modul Bermain Terkunci!',
          'Sesuai aturan alur MPI: Prasyarat masuk Modul Bermain harus menyelesaikan seluruh bab pada Modul Materi dan menjawab Kuis Mini Refleksi Cepat (Checkpoint Siswa) dengan benar.',
          'materi'
        );
        return;
      }

      if (tabId === 'berlatih' && (!isMateriAllCompleted() || !isBermainAllCompleted())) {
        audio.error();
        showPrereqModal(
          'Modul Berlatih Terkunci!',
          'Sesuai aturan alur MPI: Prasyarat masuk Modul Berlatih harus menyelesaikan Modul Belajar (Materi) dan Modul Bermain terlebih dahulu sebelum mengerjakan asesmen evaluasi.',
          isMateriAllCompleted() ? 'bermain' : 'materi'
        );
        return;
      }

      audio.click();
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.section-view').forEach(sec => sec.classList.remove('active'));

      if (tabId === 'dashboard') {
        var btnD = document.getElementById('tabBtnDashboard');
        if (btnD) btnD.classList.add('active');
        var viewD = document.getElementById('view-dashboard');
        if (viewD) viewD.classList.add('active');
        updateDashboardUI();
        renderMasterAdventureMap();
      } else {
        var btnOther = document.getElementById('tabBtn' + (tabId === 'materi' ? 'Materi' : tabId === 'bermain' ? 'Bermain' : 'Berlatih'));
        if (btnOther) btnOther.classList.add('active');
        var viewOther = document.getElementById('view-' + tabId);
        if (viewOther) viewOther.classList.add('active');
      }
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch(e) {
        try { window.scrollTo(0, 0); } catch(err){}
      }
    }

    // =========================================================================
    // MULTIMEDIA & ANIMASI ENGINE OFFLINE
    // =========================================================================
    function getAnimClass(anim) {
      if (!anim) return 'anim-fade-in';
      var classes = [];
      if (anim.masuk === 'fade-in') classes.push('anim-fade-in');
      else if (anim.masuk === 'slide-up') classes.push('anim-slide-up');
      else if (anim.masuk === 'bounce-in') classes.push('anim-bounce-in');
      else if (anim.masuk === 'zoom-in') classes.push('anim-zoom-in');
      else classes.push('anim-fade-in');

      if (anim.interaksi === 'pulse') classes.push('anim-pulse');
      else if (anim.interaksi === 'hover-lift') classes.push('anim-hover-lift');
      else if (anim.interaksi === 'scale-tap') classes.push('anim-scale-tap');

      return classes.join(' ');
    }

    function triggerOfflineConfetti() {
      var container = document.createElement('div');
      container.style.cssText = 'position:fixed; inset:0; pointer-events:none; z-index:9999; overflow:hidden;';
      document.body.appendChild(container);

      var colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
      for (var i = 0; i < 30; i++) {
        var p = document.createElement('div');
        var color = colors[Math.floor(Math.random() * colors.length)];
        var left = Math.random() * 90 + 5;
        var size = Math.random() * 8 + 6;
        var delay = Math.random() * 0.3;

        p.style.cssText = 'position:absolute; top:0; left:' + left + '%; width:' + size + 'px; height:' + size + 'px; background:' + color + '; border-radius:50%; animation:animShakeOffline 0.4s ease, fadeIn 2s forwards; animation-delay:' + delay + 's;';
        container.appendChild(p);
      }

      setTimeout(function() {
        if (container.parentNode) container.parentNode.removeChild(container);
      }, 2200);
    }

    function extractYouTubeId(rawUrl) {
      if (!rawUrl || typeof rawUrl !== 'string') return '';
      var u = rawUrl.trim();
      if (u.indexOf('youtu.be/') !== -1) {
        var p1 = u.split('youtu.be/')[1];
        if (p1) return p1.split('?')[0].split('&')[0].split('#')[0].split('/')[0];
      }
      if (u.indexOf('watch?v=') !== -1) {
        var p2 = u.split('watch?v=')[1];
        if (p2) return p2.split('&')[0].split('#')[0].split('/')[0];
      }
      if (u.indexOf('/embed/') !== -1) {
        var p3 = u.split('/embed/')[1];
        if (p3) return p3.split('?')[0].split('&')[0].split('#')[0].split('/')[0];
      }
      if (u.indexOf('/shorts/') !== -1) {
        var p4 = u.split('/shorts/')[1];
        if (p4) return p4.split('?')[0].split('&')[0].split('#')[0].split('/')[0];
      }
      return '';
    }

    function extractVimeoId(rawUrl) {
      if (!rawUrl || typeof rawUrl !== 'string') return '';
      var u = rawUrl.trim();
      if (u.indexOf('vimeo.com/') !== -1) {
        var segs = u.split('vimeo.com/')[1].split('?')[0].split('/');
        for (var i = segs.length - 1; i >= 0; i--) {
          if (/^\\d+$/.test(segs[i])) return segs[i];
        }
      }
      return '';
    }

    function renderOfflineVideoPlayer(url, title) {
      if (!url || !url.trim()) return '';
      var trimmed = url.trim();
      var ytId = extractYouTubeId(trimmed);
      var vimeoId = extractVimeoId(trimmed);

      var embedHtml = '';
      var rawYtUrl = '';
      if (ytId) {
        rawYtUrl = 'https://www.youtube.com/watch?v=' + ytId;
        embedHtml = '<iframe src="https://www.youtube.com/embed/' + ytId + '?enablejsapi=1" title="' + (title || 'Video') + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:0; border-radius:12px;"></iframe>';
      } else if (vimeoId) {
        embedHtml = '<iframe src="https://player.vimeo.com/video/' + vimeoId + '" title="' + (title || 'Video') + '" allow="autoplay; fullscreen" allowfullscreen style="width:100%; height:100%; border:0; border-radius:12px;"></iframe>';
      } else {
        embedHtml = '<video controls preload="metadata" style="width:100%; height:100%; object-fit:contain; border-radius:12px;"><source src="' + trimmed + '" type="video/mp4">Browser tidak mendukung video MP4 ini.</video>';
      }

      return '<div style="margin: 1.25rem 0; border-radius: 16px; background: #0f172a; padding: 0.75rem; border: 1px solid #1e293b; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);">' +
        '<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 0.5rem; padding: 0 0.25rem; flex-wrap:wrap; gap:0.5rem;">' +
          '<span style="font-size: 0.8rem; font-weight: 800; color: #f8fafc; display:flex; align-items:center; gap: 0.4rem;">🎬 Video Pembelajaran Interaktif: ' + (title || '') + '</span>' +
          '<div style="display:flex; align-items:center; gap:0.5rem;">' +
            (rawYtUrl ? '<a href="' + rawYtUrl + '" target="_blank" style="font-size: 0.7rem; font-weight: 800; color: #ffffff; background: #e11d48; padding: 2px 8px; border-radius: 6px; text-decoration:none;">Buka YouTube ↗</a>' : '') +
            '<span style="font-size: 0.7rem; font-weight: 800; color: #f43f5e; background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.3); padding: 2px 8px; border-radius: 9999px;">16:9 MP4 / YouTube</span>' +
          '</div>' +
        '</div>' +
        '<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; background: #000;">' +
          '<div style="position: absolute; top:0; left:0; width:100%; height:100%;">' + embedHtml + '</div>' +
        '</div>' +
      '</div>';
    }

    function renderOfflineMedia(mediaList, pos) {
      if (!mediaList || !Array.isArray(mediaList) || mediaList.length === 0) return '';
      var filtered = mediaList.filter(function(m) { return (m.posisi || 'atas') === pos; });
      if (filtered.length === 0) return '';

      return '<div class="mpi-media-container">' + filtered.map(function(item) {
        var content = '';
        if (item.tipe === 'gambar' || item.tipe === 'infografis' || item.tipe === 'visual_lainnya') {
          content = '<img src="' + item.url + '" class="mpi-media-img" alt="' + (item.judul || '') + '" onerror="this.style.display=\\\'none\\\'" />';
        } else if (item.tipe === 'tabel' && item.tabelData) {
          var t = item.tabelData;
          content = '<div style="overflow-x:auto;"><table class="mpi-media-table"><thead><tr>' +
            t.headers.map(function(h) { return '<th>' + h + '</th>'; }).join('') +
            '</tr></thead><tbody>' +
            t.rows.map(function(r) { return '<tr>' + r.map(function(c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
            '</tbody></table></div>';
        } else if (item.tipe === 'musik' || item.tipe === 'audio') {
          content = '<audio controls class="mpi-media-audio"><source src="' + item.url + '">Browser tidak mendukung audio.</audio>';
        } else if (item.tipe === 'video') {
          var vUrl = item.url || '';
          var ytId2 = extractYouTubeId(vUrl);
          
          if (ytId2) {
            var embedYt = 'https://www.youtube.com/embed/' + ytId2 + '?enablejsapi=1';
            var rawYt = 'https://www.youtube.com/watch?v=' + ytId2;
            content = '<iframe src="' + embedYt + '" class="mpi-media-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; aspect-ratio:16/9; border:0; border-radius:8px;"></iframe>' +
              '<div style="font-size:0.75rem; color:#64748b; margin-top:5px; text-align:center; display:flex; items-center; justify-center; gap:0.5rem;">' +
                '<span>ℹ️ <em>Pemutaran video YouTube memerlukan sambungan internet.</em></span>' +
                '<a href="' + rawYt + '" target="_blank" style="color:#e11d48; font-weight:bold; text-decoration:underline;">Buka di YouTube ↗</a>' +
              '</div>';
          } else {
            content = '<video controls class="mpi-media-video" style="background:#000; border-radius:8px; width:100%; max-height:400px; object-fit:contain;"><source src="' + vUrl + '" type="video/mp4">Browser Anda tidak mendukung pemutaran berkas video MP4 ini.</video>';
          }
        }

        return '<div class="mpi-media-card">' +
          '<div style="font-weight:700; font-size:0.85rem; color:var(--primary); margin-bottom:4px;">' + (item.judul || 'Media Visual/Tabel') + '</div>' +
          content +
          (item.deskripsi ? '<div class="mpi-media-caption">' + item.deskripsi + '</div>' : '') +
        '</div>';
      }).join('') + '</div>';
    }

    // =========================================================================
    // MODUL 1: MATERI CONTROLLER
    // =========================================================================
    let activeMateriIdx = 0;
    const MATERI_ICONS = ['📖', '👥', '⚖️', '🛡️', '🌐', '💡', '📚', '🔍'];

    function renderMateriSidebar() {
      const el = document.getElementById('submateriList');
      el.innerHTML = MATERI.map((m, idx) => {
        const icon = MATERI_ICONS[idx % MATERI_ICONS.length];
        const isUnlocked = idx === 0 || completedBabIds.indexOf(idx - 1) !== -1;
        const isDone = completedBabIds.indexOf(idx) !== -1;
        const isActive = idx === activeMateriIdx;

        let btnClass = 'submateri-btn';
        if (isActive) btnClass += ' active';
        if (isDone) btnClass += ' completed';
        if (!isUnlocked) btnClass += ' locked';

        const clickAction = isUnlocked 
          ? \`selectMateri(\${idx})\` 
          : \`audio.error(); showPrereqModal('Bab \${idx + 1} Masih Terkunci', 'Sesuai aturan alur pembelajaran MPI: Anda wajib menyelesaikan Bab \${idx} dan menjawab Kuis Mini Refleksi Cepat dengan benar terlebih dahulu!', 'materi')\`;

        return \`
          <button class="\${btnClass}" onclick="\${clickAction}" style="display:flex; align-items:flex-start; gap:0.6rem; text-align:left; width:100%;">
            <span style="font-size:1.25rem; line-height:1; padding-top:2px;">\${!isUnlocked ? '🔒' : icon}</span>
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                <span style="font-size:0.75rem; opacity:0.8; font-weight:700;">Bab \${idx + 1}</span>
                \${isDone ? '<span style="font-size:0.7rem; font-weight:800; color:#16a34a; background:#dcfce7; padding:1px 5px; border-radius:4px;">✓ Selesai</span>' : (!isUnlocked ? '<span style="font-size:0.7rem; font-weight:700; color:#94a3b8;">Terkunci</span>' : '<span style="font-size:0.7rem; font-weight:700; color:#3b82f6;">Aktif</span>')}
              </div>
              <div style="font-weight:600; line-height:1.3; font-size:0.875rem;">\${m.judul}</div>
            </div>
          </button>
        \`;
      }).join('');
    }

    function selectMateri(idx) {
      audio.click();
      activeMateriIdx = idx;
      renderMateriSidebar();
      renderMateriDetail();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function retryCurrentMiniKuis() {
      audio.click();
      var fb = document.getElementById('miniKuisFeedback');
      if (fb) fb.style.display = 'none';
      var box = document.getElementById('materiDetailBox');
      if (box) box.scrollIntoView({ behavior: 'smooth' });
    }

    function renderMateriDetail() {
      const m = MATERI[activeMateriIdx];
      const box = document.getElementById('materiDetailBox');
      const icon = MATERI_ICONS[activeMateriIdx % MATERI_ICONS.length];
      const isDone = completedBabIds.indexOf(activeMateriIdx) !== -1;

      box.className = 'card ' + getAnimClass(m.animasi);
      box.innerHTML = \`
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.6rem; margin-bottom:0.5rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span style="font-size:1.5rem;">\${icon}</span>
            <span class="materi-badge" style="margin:0;">\${m.kategori} • Bab \${activeMateriIdx + 1} dari \${MATERI.length}</span>
          </div>
          \${isDone ? '<span style="display:inline-flex; align-items:center; gap:4px; font-size:0.75rem; font-weight:800; color:#15803d; background:#dcfce7; border:1px solid #bbf7d0; padding:0.25rem 0.6rem; border-radius:9999px;">✓ Bab Ini Telah Tuntas</span>' : ''}
        </div>
        <h2 class="materi-title">\${m.judul}</h2>
        \${renderOfflineMedia(m.mediaList, 'atas')}
        <div class="materi-box">\${m.ringkasan}</div>
        
        <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:0.5rem; color:var(--primary);">Poin Kunci Kurikulum:</h3>
        <ul class="poin-kunci">
          \${m.poinKunci.map(p => \`<li>\${p}</li>\`).join('')}
        </ul>

        \${m.penjelasanLengkap.map(text => \`<p style="margin-bottom:0.75rem; color:#334155;">\${text}</p>\`).join('')}

        \${renderOfflineVideoPlayer(m.videoUrl, m.judul)}

        <div style="background:#f1f5f9; padding:1rem; border-radius:8px; margin:1rem 0;">
          <strong style="color:var(--primary-dark); font-size:0.9rem;">\${m.studiKasus.judul}</strong>
          <p style="font-size:0.875rem; color:#475569; margin-top:0.35rem;">\${m.studiKasus.deskripsi}</p>
        </div>

        \${renderOfflineMedia(m.mediaList, 'bawah')}

        <!-- CHECKPOINT MINI KUIS SISWA WAJIB -->
        <div class="mini-kuis-box" style="border: 2px solid #fef08a; background: #fffbeb; border-radius: 16px; padding: 1.25rem; margin-top: 1.5rem;">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
            <span style="font-size:1.2rem;">⚡</span>
            <strong style="color:#854d0e; font-size:0.95rem;">Kuis Mini Refleksi Cepat (Checkpoint Siswa Wajib)</strong>
          </div>
          <p style="font-size:0.8rem; color:#78350f; margin-bottom:0.75rem;">
            Sesuai aturan alur MPI, jawab kuis refleksi di bawah ini dengan benar untuk membuka bab berikutnya / Modul Bermain.
          </p>
          <div style="font-weight:700; font-size:0.95rem; margin-bottom:0.75rem; color:#1e293b; background:white; padding:0.75rem 1rem; border-radius:10px; border:1px solid #fde68a;">
            \${m.kuisMini.tanya}
          </div>
          <div class="mini-kuis-opsi" id="miniKuisOpsi">
            \${m.kuisMini.opsi.map((op, i) => \`
              <button class="mini-btn" onclick="checkMiniKuis(\${i})" style="text-align:left; font-weight:600; padding:0.6rem 0.85rem; border-radius:8px; margin-bottom:0.4rem; background:white; border:1.5px solid #cbd5e1; cursor:pointer;">
                <span style="display:inline-block; width:22px; font-weight:800; color:var(--primary);">\${String.fromCharCode(65 + i)}.</span> \${op}
              </button>
            \`).join('')}
          </div>
          <div id="miniKuisFeedback" style="margin-top:0.85rem; display:none; padding:1rem; border-radius:12px;"></div>
        </div>
      \`;
    }

    function checkMiniKuis(pilihan) {
      const m = MATERI[activeMateriIdx];
      const fb = document.getElementById('miniKuisFeedback');
      fb.style.display = 'block';

      if (pilihan === m.kuisMini.kunci) {
        if (completedBabIds.indexOf(activeMateriIdx) === -1) {
          completedBabIds.push(activeMateriIdx);
          if (gamificationState.completedNodes.indexOf('materi_' + activeMateriIdx) === -1) {
            gamificationState.completedNodes.push('materi_' + activeMateriIdx);
            gamificationState.coins += 100;
            gamificationState.xp += 50;
            saveGamificationState();
          }
        }
        audio.success();
        updateMpiProgressUI();
        updateDashboardUI();
        renderMateriSidebar();

        const isLastBab = activeMateriIdx >= MATERI.length - 1;
        fb.style.background = '#dcfce7';
        fb.style.border = '1.5px solid #86efac';
        fb.innerHTML = \`
          <div style="display:flex; align-items:flex-start; gap:0.5rem; color:#15803d; font-weight:700; font-size:0.9rem; margin-bottom:0.75rem;">
            <span style="font-size:1.25rem;">✅</span>
            <div>
              <div>Jawaban Benar! Checkpoint Bab \${activeMateriIdx + 1} Tuntas.</div>
              <div style="font-size:0.82rem; font-weight:500; color:#166534; margin-top:0.25rem;">\${m.kuisMini.penjelasan}</div>
            </div>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.5rem;">
            \${!isLastBab ? \`
              <button onclick="selectMateri(\${activeMateriIdx + 1})" style="background:#16a34a; color:white; font-weight:800; font-size:0.85rem; padding:0.6rem 1.1rem; border-radius:8px; border:none; cursor:pointer; box-shadow:0 2px 4px rgba(22,163,74,0.3);">
                ➡️ Lanjut ke Bab Berikutnya (Bab \${activeMateriIdx + 2})
              </button>
            \` : \`
              <button onclick="switchTab('bermain')" style="background:#e11d48; color:white; font-weight:800; font-size:0.85rem; padding:0.6rem 1.1rem; border-radius:8px; border:none; cursor:pointer; box-shadow:0 2px 4px rgba(225,29,72,0.3);">
                🎮 Selamat! Seluruh Bab Tuntas. Buka Modul Bermain
              </button>
            \`}
          </div>
        \`;
      } else {
        audio.error();
        fb.style.background = '#fee2e2';
        fb.style.border = '1.5px solid #fca5a5';

        const hasPrevBab = activeMateriIdx > 0;
        fb.innerHTML = \`
          <div style="display:flex; align-items:flex-start; gap:0.5rem; color:#b91c1c; font-weight:700; font-size:0.9rem; margin-bottom:0.75rem;">
            <span style="font-size:1.25rem;">❌</span>
            <div>
              <div>Jawaban Belum Tepat!</div>
              <div style="font-size:0.82rem; font-weight:500; color:#991b1b; margin-top:0.25rem;">
                Sesuai aturan alur MPI, Anda harus memahami materi sebelum melanjutkan. Silakan telaah uraian materi di atas atau kembali ke Bab Sebelumnya untuk memperkuat pemahaman.
              </div>
            </div>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.5rem;">
            \${hasPrevBab ? \`
              <button onclick="selectMateri(\${activeMateriIdx - 1})" style="background:#dc2626; color:white; font-weight:800; font-size:0.85rem; padding:0.6rem 1.1rem; border-radius:8px; border:none; cursor:pointer; box-shadow:0 2px 4px rgba(220,38,38,0.3); display:inline-flex; align-items:center; gap:0.35rem;">
                🔙 Kembali ke BAB Sebelumnya (Bab \${activeMateriIdx})
              </button>
              <button onclick="retryCurrentMiniKuis()" style="background:#ffffff; color:#dc2626; font-weight:700; font-size:0.85rem; padding:0.6rem 1rem; border-radius:8px; border:1.5px solid #fca5a5; cursor:pointer;">
                🔄 Coba Jawab Lagi
              </button>
            \` : \`
              <button onclick="retryCurrentMiniKuis()" style="background:#dc2626; color:white; font-weight:800; font-size:0.85rem; padding:0.6rem 1.1rem; border-radius:8px; border:none; cursor:pointer; box-shadow:0 2px 4px rgba(220,38,38,0.3);">
                🔄 Pelajari Ulang Bab 1 & Coba Lagi
              </button>
            \`}
          </div>
        \`;
      }
    }

    // =========================================================================
    // MODUL 2: BERMAIN (10 GAME INTERAKTIF)
    // =========================================================================
    let activeGameIdx = 0;
    const gameProgress = new Array(dataBermain.length).fill(false);
    const GAME_ICONS = ['🧩', '🎯', '🔢', '💎', '⚡', '🔀', '🛡️', '🏆', '✨', '🔗'];

    function renderGameNav() {
      const el = document.getElementById('gameNavContainer');
      el.innerHTML = dataBermain.map((g, idx) => {
        const icon = GAME_ICONS[idx % GAME_ICONS.length];
        return \`
          <button class="game-num-btn \${idx === activeGameIdx ? 'active' : ''} \${gameProgress[idx] ? 'done' : ''}" onclick="selectGame(\${idx})" title="Game \${idx + 1}: \${g.tipe}">
            <span style="font-size:0.9rem;">\${icon}</span>
            <span style="font-size:0.75rem; font-weight:700; margin-top:2px;">G\${idx + 1}</span>
          </button>
        \`;
      }).join('');
    }

    function selectGame(idx) {
      audio.click();
      activeGameIdx = idx;
      renderGameNav();
      renderGameContent();
    }

    function renderGameContent() {
      const g = dataBermain[activeGameIdx];
      const canvas = document.getElementById('gameCanvas');
      canvas.className = 'game-container ' + getAnimClass(g.animasi);
      let typeLabel = '';
      if (g.tipe === 'jodoh') typeLabel = 'Menjodohkan Konsep';
      else if (g.tipe === 'klik') typeLabel = 'Tantangan Klik Kilat';
      else if (g.tipe === 'urut') typeLabel = 'Urutkan Tahapan';
      else if (g.tipe === 'kumpul') typeLabel = 'Koleksi Karakter';
      else if (g.tipe === 'sambung') typeLabel = 'Rantai Sebab-Akibat';

      let innerHtml = \`
        <div class="game-header">
          <div>
            <span class="game-type-badge">\${typeLabel} (Aktivitas \${activeGameIdx + 1}/10)</span>
            <h3 style="font-size:1.2rem; font-weight:800; margin-top:0.35rem; color:var(--primary-dark);">\${g.judul}</h3>
          </div>
          <div style="font-size:0.875rem; color:var(--text-muted);">
            Status: \${gameProgress[activeGameIdx] ? '<strong style="color:var(--success);">TUNTAS ⭐</strong>' : 'Belum Selesai'}
          </div>
        </div>
        \${renderOfflineMedia(g.mediaList, 'atas')}
        <p style="font-size:0.95rem; color:#475569; margin-bottom:1.25rem;">\${g.instruksi}</p>
        <div id="gamePlayArea"></div>
        \${renderOfflineMedia(g.mediaList, 'bawah')}

        <!-- Bottom Game Nav Step -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid #e2e8f0;">
          <button 
            type="button" 
            onclick="prevGameStep()" 
            \${activeGameIdx === 0 ? 'disabled' : ''} 
            style="padding:0.55rem 1.1rem; border-radius:8px; border:1px solid #cbd5e1; background:white; color:#334155; font-weight:700; font-size:0.85rem; cursor:\${activeGameIdx === 0 ? 'not-allowed' : 'pointer'}; opacity:\${activeGameIdx === 0 ? '0.4' : '1'}; transition:all 0.2s;"
          >
            ← Game Sebelumnya \${activeGameIdx > 0 ? '(G' + activeGameIdx + ')' : ''}
          </button>

          <div style="font-size:0.8rem; font-weight:700; color:#64748b;">
            Game \${activeGameIdx + 1} dari \${dataBermain.length}
          </div>

          \${activeGameIdx < dataBermain.length - 1 ? \`
            <button 
              type="button" 
              onclick="nextGameStep()" 
              style="padding:0.55rem 1.25rem; border-radius:8px; border:none; background:var(--secondary); color:white; font-weight:800; font-size:0.85rem; cursor:pointer; box-shadow:0 2px 4px rgba(13,148,136,0.3); transition:all 0.2s;"
            >
              Game Selanjutnya (G\${activeGameIdx + 2}) →
            </button>
          \` : \`
            <button 
              type="button" 
              onclick="switchTab('berlatih')" 
              style="padding:0.55rem 1.25rem; border-radius:8px; border:none; background:var(--primary); color:white; font-weight:800; font-size:0.85rem; cursor:pointer; box-shadow:0 2px 4px rgba(79,70,229,0.3); transition:all 0.2s;"
            >
              🏆 Lanjut ke Modul Berlatih →
            </button>
          \`}
        </div>
      \`;
      canvas.innerHTML = innerHtml;

      // Render Sub-engine based on type
      if (g.tipe === 'jodoh') initGameJodoh(g);
      else if (g.tipe === 'klik') initGameKlik(g);
      else if (g.tipe === 'urut') initGameUrut(g);
      else if (g.tipe === 'kumpul') initGameKumpul(g);
      else if (g.tipe === 'sambung') initGameSambung(g);
    }

    function prevGameStep() {
      if (activeGameIdx > 0) {
        selectGame(activeGameIdx - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function nextGameStep() {
      if (activeGameIdx < dataBermain.length - 1) {
        selectGame(activeGameIdx + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // --- GAME ENGINE: JODOH ---
    let jodohSelectedLeft = null;
    let jodohMatches = {};
    function initGameJodoh(g) {
      jodohSelectedLeft = null;
      jodohMatches = {};
      const area = document.getElementById('gamePlayArea');
      const pairs = g.pasangan;
      const shufRight = [...pairs].sort(() => Math.random() - 0.5);

      area.innerHTML = \`
        <div class="jodoh-grid">
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            <strong style="color:var(--text-muted); font-size:0.85rem;">KOLOM KIRI:</strong>
            \${pairs.map(p => \`<div class="item-selectable" id="left_\${p.id}" onclick="clickJodohLeft('\${p.id}')">\${p.kiri}</div>\`).join('')}
          </div>
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            <strong style="color:var(--text-muted); font-size:0.85rem;">KOLOM KANAN:</strong>
            \${shufRight.map(p => \`<div class="item-selectable" id="right_\${p.id}" onclick="clickJodohRight('\${p.id}')">\${p.kanan}</div>\`).join('')}
          </div>
        </div>
        <div id="jodohMsg" style="margin-top:1rem; font-weight:700;"></div>
      \`;
    }

    function clickJodohLeft(id) {
      if (jodohMatches[id]) return;
      audio.click();
      document.querySelectorAll('[id^="left_"]').forEach(el => el.classList.remove('selected'));
      const el = document.getElementById('left_' + id);
      if (el) el.classList.add('selected');
      jodohSelectedLeft = id;
    }

    function clickJodohRight(id) {
      if (!jodohSelectedLeft || jodohMatches[id]) return;
      const g = dataBermain[activeGameIdx];
      const leftEl = document.getElementById('left_' + jodohSelectedLeft);
      const rightEl = document.getElementById('right_' + id);

      if (jodohSelectedLeft === id) {
        audio.success();
        jodohMatches[id] = true;
        if (leftEl) leftEl.className = 'item-selectable matched pop-green';
        if (rightEl) rightEl.className = 'item-selectable matched pop-green';
        jodohSelectedLeft = null;
        triggerOfflineConfetti();

        if (Object.keys(jodohMatches).length === g.pasangan.length) {
          markGameComplete(activeGameIdx);
          document.getElementById('jodohMsg').innerHTML = '<span style="color:var(--success); font-weight:800; display:inline-flex; align-items:center; gap:6px;">🎉 Luar Biasa! Seluruh pasangan Tebak Pasangan berhasil dicocokkan!</span>';
        } else {
          document.getElementById('jodohMsg').innerHTML = '<span style="color:#059669; font-weight:700;">✅ Pasangan Tepat! Lanjutkan ke pasangan berikutnya.</span>';
        }
      } else {
        audio.error();
        if (leftEl) leftEl.classList.add('shake-wrong');
        if (rightEl) rightEl.classList.add('shake-wrong');
        document.getElementById('jodohMsg').innerHTML = '<span style="color:#dc2626; font-weight:800; display:inline-flex; align-items:center; gap:4px;">❌ Jawaban Salah! Pasangan tidak sesuai.</span>';

        setTimeout(function() {
          if (leftEl) {
            leftEl.classList.remove('shake-wrong');
            leftEl.classList.remove('selected');
          }
          if (rightEl) {
            rightEl.classList.remove('shake-wrong');
          }
          jodohSelectedLeft = null;
        }, 600);
      }
    }

    // --- GAME ENGINE: KLIK ---
    function initGameKlik(g) {
      const area = document.getElementById('gamePlayArea');
      area.innerHTML = \`
        <div class="klik-grid">
          \${g.itemKlik.map((item, idx) => \`
            <div class="item-klik-card" id="klik_\${idx}" onclick="handleKlikCard(\${idx})">\${item.teks}</div>
          \`).join('')}
        </div>
        <div id="klikStatusMsg" style="margin-top:1rem; font-weight:700;"></div>
      \`;
    }

    function handleKlikCard(idx) {
      const g = dataBermain[activeGameIdx];
      const item = g.itemKlik[idx];
      const el = document.getElementById('klik_' + idx);
      if (el.classList.contains('clicked-correct') || el.classList.contains('clicked-wrong')) return;

      if (item.benar) {
        audio.success();
        el.classList.add('clicked-correct');
        el.innerHTML += ' ✅';
      } else {
        audio.error();
        el.classList.add('clicked-wrong');
        el.innerHTML += ' ❌';
      }

      // Check if all correct are found
      const correctCount = g.itemKlik.filter(i => i.benar).length;
      const clickedCorrect = document.querySelectorAll('.item-klik-card.clicked-correct').length;
      if (clickedCorrect === correctCount) {
        markGameComplete(activeGameIdx);
        document.getElementById('klikStatusMsg').innerHTML = '<span style="color:var(--success);">🏆 Sempurna! Anda berhasil menemukan seluruh item yang tepat!</span>';
      }
    }

    // --- GAME ENGINE: URUT ---
    let currentUrutan = [];
    function initGameUrut(g) {
      currentUrutan = [...g.urutanBenar].sort(() => Math.random() - 0.5);
      renderUrutView();
    }

    function renderUrutView() {
      const area = document.getElementById('gamePlayArea');
      area.innerHTML = \`
        <div class="urut-list">
          \${currentUrutan.map((teks, idx) => \`
            <div class="urut-item">
              <div class="urut-ctrls">
                <button class="btn-reorder" onclick="moveUrut(\${idx}, -1)" \${idx === 0 ? 'disabled' : ''}>▲</button>
                <button class="btn-reorder" onclick="moveUrut(\${idx}, 1)" \${idx === currentUrutan.length - 1 ? 'disabled' : ''}>▼</button>
              </div>
              <div style="font-weight:600; font-size:0.9rem; flex:1;">\${teks}</div>
            </div>
          \`).join('')}
        </div>
        <div style="margin-top:1.25rem; display:flex; gap:1rem; align-items:center;">
          <button class="btn-action" onclick="checkUrutan()">Periksa Urutan</button>
          <div id="urutFeedback" style="font-weight:700;"></div>
        </div>
      \`;
    }

    function moveUrut(idx, dir) {
      audio.click();
      const target = idx + dir;
      const tmp = currentUrutan[idx];
      currentUrutan[idx] = currentUrutan[target];
      currentUrutan[target] = tmp;
      renderUrutView();
    }

    function checkUrutan() {
      const g = dataBermain[activeGameIdx];
      const isMatch = currentUrutan.every((val, i) => val === g.urutanBenar[i]);
      const fb = document.getElementById('urutFeedback');
      if (isMatch) {
        audio.success();
        markGameComplete(activeGameIdx);
        fb.innerHTML = '<span style="color:var(--success);">🌟 Tepat Sekali! Urutan tahapan sudah sangat logis dan benar!</span>';
      } else {
        audio.error();
        fb.innerHTML = '<span style="color:var(--danger);">⚠️ Urutan belum tepat. Cermati alur tahapannya kembali!</span>';
      }
    }

    // --- GAME ENGINE: KUMPUL ---
    function initGameKumpul(g) {
      const area = document.getElementById('gamePlayArea');
      area.innerHTML = \`
        <div class="kumpul-zone">
          \${g.itemKumpul.map((item, idx) => \`
            <div class="kumpul-item" id="kumpul_\${idx}" onclick="handleKumpulItem(\${idx})">\${item.teks}</div>
          \`).join('')}
        </div>
        <div id="kumpulMsg" style="margin-top:1rem; font-weight:700;"></div>
      \`;
    }

    function handleKumpulItem(idx) {
      const g = dataBermain[activeGameIdx];
      const item = g.itemKumpul[idx];
      const el = document.getElementById('kumpul_' + idx);
      if (el.classList.contains('collected') || el.classList.contains('pengecoh-clicked')) return;

      if (item.benar) {
        audio.success();
        el.classList.add('collected');
      } else {
        audio.error();
        el.classList.add('pengecoh-clicked');
      }

      const totalCorrect = g.itemKumpul.filter(i => i.benar).length;
      const found = document.querySelectorAll('.kumpul-item.collected').length;
      if (found === totalCorrect) {
        markGameComplete(activeGameIdx);
        document.getElementById('kumpulMsg').innerHTML = '<span style="color:var(--success);">🎯 Keren! Seluruh karakteristik yang dicari berhasil terkumpul!</span>';
      }
    }

    // --- GAME ENGINE: SAMBUNG ---
    let sambungMatches = {};
    let selectedSebab = null;
    function initGameSambung(g) {
      sambungMatches = {};
      selectedSebab = null;
      const area = document.getElementById('gamePlayArea');
      const chain = g.rantaiLogika;
      const shufAkibat = [...chain].sort(() => Math.random() - 0.5);

      area.innerHTML = \`
        <div class="jodoh-grid">
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            <strong style="color:var(--text-muted); font-size:0.85rem;">SEBAB / AKSI:</strong>
            \${chain.map((c, i) => \`<div class="item-selectable" id="sebab_\${i}" onclick="selectSebab(\${i})">\${c.sebab}</div>\`).join('')}
          </div>
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            <strong style="color:var(--text-muted); font-size:0.85rem;">AKIBAT / RESOLUSI:</strong>
            \${shufAkibat.map((c, i) => \`<div class="item-selectable" id="akibat_\${i}" onclick="selectAkibat('\${c.akibat}', \${i})">\${c.akibat}</div>\`).join('')}
          </div>
        </div>
        <div id="sambungFeedback" style="margin-top:1rem; font-weight:700;"></div>
      \`;
    }

    function selectSebab(idx) {
      if (sambungMatches[idx]) return;
      audio.click();
      document.querySelectorAll('[id^="sebab_"]').forEach(el => el.classList.remove('selected'));
      document.getElementById('sebab_' + idx).classList.add('selected');
      selectedSebab = idx;
    }

    function selectAkibat(akibatText, elIdx) {
      if (selectedSebab === null) return;
      const g = dataBermain[activeGameIdx];
      const targetAkibat = g.rantaiLogika[selectedSebab].akibat;

      if (akibatText === targetAkibat) {
        audio.success();
        sambungMatches[selectedSebab] = true;
        document.getElementById('sebab_' + selectedSebab).className = 'item-selectable matched';
        document.getElementById('akibat_' + elIdx).className = 'item-selectable matched';
        selectedSebab = null;

        if (Object.keys(sambungMatches).length === g.rantaiLogika.length) {
          markGameComplete(activeGameIdx);
          document.getElementById('sambungFeedback').innerHTML = '<span style="color:var(--success);">✨ Rantai logika tersambung dengan sangat utuh dan tepat!</span>';
        }
      } else {
        audio.error();
        document.getElementById('sambungFeedback').innerHTML = '<span style="color:var(--danger);">⚠️ Akibat belum cocok dengan sebab yang dipilih. Coba telaah lagi!</span>';
      }
    }

    // =========================================================================
    // MODUL 3: BERLATIH (10 SOAL EVALUASI HOTS)
    // =========================================================================
    let currentSoalIdx = 0;
    const userAnswers = new Array(dtLatih.length).fill(null);
    const answerSubmitted = new Array(dtLatih.length).fill(false);

    function renderLatihModule() {
      const container = document.getElementById('latihContainer');
      const q = dtLatih[currentSoalIdx];
      const isDone = answerSubmitted[currentSoalIdx];

      let typeBadge = 'Pilihan Ganda';
      if (q.t === 'pg_kompleks') typeBadge = 'Pilihan Ganda Kompleks (MCMA)';
      else if (q.t === 'jodoh') typeBadge = 'Menjodohkan Konsep';
      else if (q.t === 'drag_word') typeBadge = 'Mengisi Rumpang Kalimat';

      container.className = 'card ' + getAnimClass(q.animasi);
      container.innerHTML = \`
        <div class="latih-progress-bar">
          \${dtLatih.map((soal, i) => {
            let cls = '';
            if (answerSubmitted[i]) {
              cls = checkAnswerCorrectness(i) ? 'correct' : 'incorrect';
            } else if (i === currentSoalIdx) {
              cls = 'active';
            }
            return \`<div class="latih-step \${cls}" onclick="navSoal(\${i})" style="cursor:pointer;" title="Soal \${i+1}"></div>\`;
          }).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <span class="game-type-badge">\${typeBadge} • No. \${q.no} dari \${dtLatih.length}</span>
          <div style="font-weight:700; color:var(--text-muted); font-size:0.85rem;">Soal Asesmen HOTS</div>
        </div>

        \${renderOfflineMedia(q.mediaList, 'atas')}

        \${q.stimulus ? \`<div class="stimulus-box"><strong>WACANA STIMULUS:</strong><br>\${q.stimulus}</div>\` : ''}

        <div class="soal-tanya">\${q.tanya}</div>
        <div id="soalInteractionArea"></div>

        \${isDone ? \`
          <div class="pembahasan-box">
            <strong>💡 KUNCI & PEMBAHASAN MENDALAM:</strong><br>
            \${q.msg}
          </div>
        \` : ''}

        \${renderOfflineMedia(q.mediaList, 'bawah')}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem;">
          <button class="mini-btn" onclick="prevSoal()" \${currentSoalIdx === 0 ? 'disabled' : ''}>← Sebelumnya</button>
          \${!isDone ? \`
            <button class="btn-action" onclick="submitCurrentAnswer()">Kunci Jawaban</button>
          \` : (currentSoalIdx < dtLatih.length - 1 ? \`
            <button class="btn-action" onclick="nextSoal()">Soal Selanjutnya →</button>
          \` : \`
            <button class="btn-action" style="background:var(--success);" onclick="showReportCard()">Lihat Rapor Evaluasi 📊</button>
          \`)}
        </div>
      \`;

      renderSoalInteraction(q, isDone);
    }

    function renderSoalInteraction(q, isDone) {
      const area = document.getElementById('soalInteractionArea');
      const currAns = userAnswers[currentSoalIdx];

      if (q.t === 'pg') {
        const letters = ['A', 'B', 'C', 'D', 'E'];
        area.innerHTML = \`
          <div class="opsi-list">
            \${q.opsi.map((op, idx) => {
              let cls = '';
              if (currAns === idx) cls = 'selected';
              if (isDone) {
                if (idx === q.j) cls = 'ans-correct';
                else if (currAns === idx) cls = 'ans-wrong';
              }
              return \`
                <div class="opsi-item \${cls}" onclick="\${!isDone ? \`selectPgAnswer(\${idx})\` : ''}">
                  <div class="opsi-marker">\${letters[idx]}</div>
                  <div style="font-size:0.95rem;">\${op}</div>
                </div>
              \`;
            }).join('')}
          </div>
        \`;
      } else if (q.t === 'pg_kompleks') {
        const selectedArr = Array.isArray(currAns) ? currAns : [];
        const letters = ['A', 'B', 'C', 'D', 'E'];
        area.innerHTML = \`
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">*Pilihlah satu atau lebih opsi jawaban yang menurut Anda benar:</div>
          <div class="opsi-list">
            \${q.opsi.map((op, idx) => {
              const isSel = selectedArr.includes(idx);
              let cls = isSel ? 'selected' : '';
              if (isDone) {
                if (q.j.includes(idx)) cls = 'ans-correct';
                else if (isSel) cls = 'ans-wrong';
              }
              return \`
                <div class="opsi-item \${cls}" onclick="\${!isDone ? \`toggleMcmaAnswer(\${idx})\` : ''}">
                  <div class="opsi-marker">\${isSel ? '✓' : letters[idx]}</div>
                  <div style="font-size:0.95rem;">\${op}</div>
                </div>
              \`;
            }).join('')}
          </div>
        \`;
      } else if (q.t === 'jodoh') {
        area.innerHTML = \`
          <div style="background:#f8fafc; padding:1rem; border-radius:8px; border:1px solid var(--border);">
            <div style="font-size:0.9rem; margin-bottom:0.75rem; font-weight:600;">Cocokkan pasangan konsep berikut:</div>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              \${q.pasanganJodoh.map((p, idx) => \`
                <div style="background:white; padding:0.75rem; border-radius:6px; border:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:1rem;">
                  <strong style="color:var(--primary); font-size:0.9rem;">\${p.kiri}</strong>
                  <span style="color:#64748b; font-size:0.85rem;">➔</span>
                  <span style="font-size:0.875rem; color:#334155; text-align:right;">\${p.kanan}</span>
                </div>
              \`).join('')}
            </div>
            <div style="margin-top:1rem; font-size:0.85rem; color:#475569;">
              Apakah Anda menyetujui pemetaan pasangan konsep sosiologis di atas?
            </div>
            <div style="margin-top:0.5rem; display:flex; gap:0.5rem;">
              <button class="mini-btn \${currAns === 1 ? 'selected' : ''}" onclick="\${!isDone ? 'userAnswers['+currentSoalIdx+'] = 1; renderLatihModule();' : ''}">Ya, Pasangan Sesuai</button>
              <button class="mini-btn \${currAns === 0 ? 'selected' : ''}" onclick="\${!isDone ? 'userAnswers['+currentSoalIdx+'] = 0; renderLatihModule();' : ''}">Belum Sesuai</button>
            </div>
          </div>
        \`;
      } else if (q.t === 'drag_word') {
        const words = q.kataPilihan || [];
        const answeredWords = Array.isArray(currAns) ? currAns : [];
        area.innerHTML = \`
          <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid var(--border);">
            <div style="font-size:1rem; line-height:1.8; margin-bottom:1rem; color:#1e293b;">
              Kelompok <strong style="color:var(--primary); text-decoration:underline;">\${answeredWords[0] || '[KATA 1]'}</strong> ditandai oleh pergaulan dan kerja sama <strong style="color:var(--primary); text-decoration:underline;">\${answeredWords[1] || '[KATA 2]'}</strong> yang bersifat mendalam, langgeng, dan tatap muka secara langsung, seperti yang ditemukan pada lingkungan <strong style="color:var(--primary); text-decoration:underline;">\${answeredWords[2] || '[KATA 3]'}</strong>.
            </div>
            <div style="font-size:0.85rem; font-weight:700; color:#64748b; margin-bottom:0.5rem;">Pilihan Kata:</div>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
              \${words.map(w => \`
                <button class="mini-btn" onclick="\${!isDone ? \`insertWordAnswer('\${w}')\` : ''}">\${w}</button>
              \`).join('')}
              \${!isDone ? \`<button class="mini-btn" style="color:var(--danger);" onclick="userAnswers[currentSoalIdx] = []; renderLatihModule();">↺ Reset Kata</button>\` : ''}
            </div>
          </div>
        \`;
      }
    }

    function selectPgAnswer(idx) {
      audio.click();
      userAnswers[currentSoalIdx] = idx;
      renderLatihModule();
    }

    function toggleMcmaAnswer(idx) {
      audio.click();
      let arr = Array.isArray(userAnswers[currentSoalIdx]) ? [...userAnswers[currentSoalIdx]] : [];
      if (arr.includes(idx)) arr = arr.filter(i => i !== idx);
      else arr.push(idx);
      userAnswers[currentSoalIdx] = arr;
      renderLatihModule();
    }

    function insertWordAnswer(w) {
      audio.click();
      let arr = Array.isArray(userAnswers[currentSoalIdx]) ? [...userAnswers[currentSoalIdx]] : [];
      if (arr.length < 3 && !arr.includes(w)) {
        arr.push(w);
        userAnswers[currentSoalIdx] = arr;
        renderLatihModule();
      }
    }

    function checkAnswerCorrectness(i) {
      const q = dtLatih[i];
      const ans = userAnswers[i];
      if (ans === null || ans === undefined) return false;

      if (q.t === 'pg') {
        return ans === q.j;
      } else if (q.t === 'pg_kompleks') {
        if (!Array.isArray(ans)) return false;
        const sortedAns = [...ans].sort();
        const sortedKey = [...q.j].sort();
        return JSON.stringify(sortedAns) === JSON.stringify(sortedKey);
      } else if (q.t === 'jodoh') {
        return ans === 1;
      } else if (q.t === 'drag_word') {
        if (!Array.isArray(ans) || ans.length !== q.j.length) return false;
        return ans.every((word, idx) => word === q.j[idx]);
      }
      return false;
    }

    function submitCurrentAnswer() {
      if (userAnswers[currentSoalIdx] === null || userAnswers[currentSoalIdx] === undefined) {
        alert('Mohon pilih atau lengkapi jawaban terlebih dahulu!');
        return;
      }
      answerSubmitted[currentSoalIdx] = true;
      if (checkAnswerCorrectness(currentSoalIdx)) {
        audio.success();
      } else {
        audio.error();
      }
      renderLatihModule();
    }

    function navSoal(idx) {
      audio.click();
      currentSoalIdx = idx;
      renderLatihModule();
    }

    function prevSoal() {
      if (currentSoalIdx > 0) navSoal(currentSoalIdx - 1);
    }

    function nextSoal() {
      if (currentSoalIdx < dtLatih.length - 1) navSoal(currentSoalIdx + 1);
    }

    function showReportCard() {
      audio.success();
      let correctCount = 0;
      for (let i = 0; i < dtLatih.length; i++) {
        if (checkAnswerCorrectness(i)) correctCount++;
      }
      const score = Math.round((correctCount / dtLatih.length) * 100);
      const isLulus = score >= CONFIG.kkm;

      if (gamificationState.completedNodes.indexOf('asesmen_boss') === -1) {
        gamificationState.completedNodes.push('asesmen_boss');
        gamificationState.coins += 500;
        gamificationState.xp += 300;
        if (gamificationState.unlockedBadges.indexOf('b4') === -1) {
          gamificationState.unlockedBadges.push('b4');
        }
        if (isLulus && gamificationState.unlockedBadges.indexOf('b5') === -1) {
          gamificationState.unlockedBadges.push('b5');
        }
        gamificationState.level = Math.max(1, Math.floor(gamificationState.xp / 100) + 1);
        saveGamificationState();
        updateDashboardUI();
        renderMasterAdventureMap();
      }

      let predikat = 'D (Perlu Bimbingan / Remedial)';
      if (score >= 90) predikat = 'A (Sangat Memuaskan)';
      else if (score >= 75) predikat = 'B (Memuaskan)';
      else if (score >= CONFIG.kkm) predikat = 'C (Cukup / Tuntas)';

      let medalSvg = '';
      if (score >= 85) {
        medalSvg = '<div class="anim-bounce-in" style="margin-bottom:1rem; display:inline-block;">' +
          '<div style="width:90px; height:90px; border-radius:50%; background:linear-gradient(135deg, #fbbf24, #f59e0b, #d97706); border:4px solid #fef08a; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#78350f; font-weight:900; box-shadow:0 10px 15px -3px rgba(245, 158, 11, 0.4); margin:0 auto;">' +
            '<span style="font-size:2rem; line-height:1;">🥇</span>' +
            '<span style="font-size:0.65rem; text-transform:uppercase; font-weight:900; letter-spacing:1px; margin-top:2px;">MEDALI EMAS</span>' +
          '</div>' +
        '</div>';
      } else if (isLulus) {
        medalSvg = '<div class="anim-bounce-in" style="margin-bottom:1rem; display:inline-block;">' +
          '<div style="width:90px; height:90px; border-radius:50%; background:linear-gradient(135deg, #2dd4bf, #0d9488, #0f766e); border:4px solid #ccfbf1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#134e4a; font-weight:900; box-shadow:0 10px 15px -3px rgba(13, 148, 136, 0.4); margin:0 auto;">' +
            '<span style="font-size:2rem; line-height:1;">🥈</span>' +
            '<span style="font-size:0.65rem; text-transform:uppercase; font-weight:900; letter-spacing:1px; margin-top:2px;">MEDALI PERAK</span>' +
          '</div>' +
        '</div>';
      } else {
        medalSvg = '<div class="anim-bounce-in" style="margin-bottom:1rem; display:inline-block;">' +
          '<div style="width:90px; height:90px; border-radius:50%; background:linear-gradient(135deg, #f87171, #dc2626, #b91c1c); border:4px solid #fee2e2; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#7f1d1d; font-weight:900; box-shadow:0 10px 15px -3px rgba(220, 38, 38, 0.4); margin:0 auto;">' +
            '<span style="font-size:2rem; line-height:1;">📚</span>' +
            '<span style="font-size:0.65rem; text-transform:uppercase; font-weight:900; letter-spacing:1px; margin-top:2px;">PENDALAMAN</span>' +
          '</div>' +
        '</div>';
      }

      const container = document.getElementById('latihContainer');
      container.innerHTML = \`
        <div class="report-card" style="position:relative;">
          
          <!-- KOP SURAT UNTUK DOKUMEN HASIL CETAK -->
          <div class="print-only" style="display:none; text-align:left; border-bottom:2px solid #0f172a; padding-bottom:1rem; margin-bottom:1.5rem;">
            <h1 style="font-size:1.25rem; font-weight:900; text-transform:uppercase; margin:0; color:#0f172a;">LAPORAN HASIL EVALUASI ASESMEN MPI</h1>
            <p style="font-size:0.85rem; font-weight:700; margin:4px 0 0; color:#334155;">\${CONFIG.mataPelajaran} (\${CONFIG.fase} - \${CONFIG.kelas}) • \${CONFIG.sekolah || 'SMA Kurikulum Merdeka'}</p>
            <p style="font-size:0.75rem; font-style:italic; margin:2px 0 0; color:#64748b;">Judul Media Interaktif: "\${CONFIG.judul}"</p>
          </div>

          \${medalSvg}

          <div class="score-circle anim-bounce-in" style="background:\${isLulus ? 'var(--success)' : 'var(--danger)'};">
            <span class="score-number">\${score}</span>
            <span class="score-label">SKOR NILAI</span>
          </div>

          <h2 style="font-size:1.5rem; font-weight:800; color:var(--text); margin-bottom:0.25rem;">
            \${isLulus ? '🎉 SELAMAT! ANDA TUNTAS KKM' : '📚 PERLU REMEDIAL / PENGUATAN'}
          </h2>

          <div style="display:inline-block; margin-bottom:1.25rem; padding:0.4rem 1rem; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:8px; font-size:0.85rem; font-weight:700; color:#1e293b;">
            Predikat Pencapaian: <strong style="color:var(--primary);">\${predikat}</strong>
          </div>
          
          <!-- Identitas Siswa pada Lembar Rapor Evaluasi -->
          <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:1.25rem; padding:0.75rem 1.25rem; background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; margin-bottom:1.5rem; font-size:0.85rem; color:#334155; text-align:left;">
            <div>Nama Siswa: <strong style="color:#0f172a;">\${currentStudent.nama || 'Peserta Didik'}</strong></div>
            <div>Kelas/Rombel: <strong style="color:#0f172a;">\${currentStudent.kelas || CONFIG.kelas}</strong></div>
            <div>Mata Pelajaran: <strong style="color:#0f172a;">\${CONFIG.mataPelajaran}</strong></div>
            <div>Target KKM: <strong style="color:#0f172a;">\${CONFIG.kkm} Poin</strong></div>
          </div>

          <!-- Table Analisis Butir Soal -->
          <div style="max-width:720px; margin:0 auto 1.5rem; overflow-x:auto;">
            <div style="text-align:left; font-size:0.8rem; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:0.5rem; tracking-wide:1px;">
              Tabel Analisis Rincian Hasil Per-Soal &amp; Kunci Jawaban Resmi:
            </div>
            <table class="mpi-media-table" style="font-size:0.8rem; width:100%; border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="width:40px; text-align:center;">No</th>
                  <th>Bentuk Soal</th>
                  <th>Kompetensi / Pokok Bahasan</th>
                  <th style="width:110px; text-align:center;">Status</th>
                  <th style="width:60px; text-align:center;">Poin</th>
                </tr>
              </thead>
              <tbody>
                \${dtLatih.map((s, idx) => {
                  const correct = checkAnswerCorrectness(idx);
                  const shapeLabel = s.t === 'pg' ? 'Pilihan Ganda' : s.t === 'pg_kompleks' ? 'PG Kompleks' : s.t === 'jodoh' ? 'Menjodohkan' : 'Isian Rumpang';
                  const compText = s.subKompetensi || s.kompetensi || s.tanya.substring(0, 40) + '...';

                  return '<tr>' +
                    '<td style="text-align:center; font-weight:bold;">' + (idx + 1) + '</td>' +
                    '<td style="font-weight:bold; color:var(--primary);">' + shapeLabel + '</td>' +
                    '<td>' + compText + '</td>' +
                    '<td style="text-align:center; font-weight:bold; color:' + (correct ? 'var(--success)' : 'var(--danger)') + ';">' +
                      (correct ? '✓ Benar' : '✗ Salah') +
                    '</td>' +
                    '<td style="text-align:center; font-weight:bold;">' + (correct ? Math.round(100 / dtLatih.length) : '0') + '</td>' +
                  '</tr>';
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- TANDA TANGAN PENILAIAN PRINT -->
          <div class="print-only" style="display:none; margin-top:2.5rem; border-top:1px solid #cbd5e1; padding-top:1.5rem; text-align:left;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; font-size:0.8rem;">
              <div>
                <p style="font-weight:700; margin:0;">Mengetahui,</p>
                <p style="color:#64748b; margin:0 0 3.5rem;">Orang Tua / Wali Murid</p>
                <p style="font-weight:700; border-bottom:1px solid #0f172a; display:inline-block; width:180px; margin:0;">( .................................................. )</p>
              </div>
              <div>
                <p style="font-weight:700; margin:0;">\${CONFIG.sekolah || 'Tempat'}, \${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p style="color:#64748b; margin:0 0 3.5rem;">Guru Mata Pelajaran / Pengembang MPI</p>
                <p style="font-weight:900; border-bottom:1px solid #0f172a; display:inline-block; width:200px; margin:0;">\${CONFIG.namaPengembang || CONFIG.penyusun || 'Pendidik'}</p>
              </div>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem; margin-top:1.5rem;" class="no-print">
            <button class="btn-action" style="background:#0d9488;" onclick="window.print()">
              🖨️ Cetak / Download PDF Rekap Nilai
            </button>
            <button class="btn-action" onclick="resetLatih()">↺ Ulangi Latihan</button>
            <button class="btn-action" style="background:#475569;" onclick="navSoal(0)">🔍 Review Pembahasan</button>
          </div>
        </div>
      \`;
    }

    function resetLatih() {
      audio.click();
      for (let i = 0; i < dtLatih.length; i++) {
        userAnswers[i] = null;
        answerSubmitted[i] = false;
      }
      currentSoalIdx = 0;
      renderLatihModule();
    }

    // =========================================================================
    // INITIALIZATION ON LOAD
    // =========================================================================
    function initMpiApp() {
      try { loadStudentState(); } catch(e){}
      try { loadGamificationState(); } catch(e){}

      // Pre-fill student inputs if previously saved
      var inputNama = document.getElementById('inputGateNama');
      var inputKelas = document.getElementById('inputGateKelas');
      if (inputNama && currentStudent.nama) {
        inputNama.value = currentStudent.nama;
      }
      if (inputKelas && currentStudent.kelas) {
        inputKelas.value = currentStudent.kelas;
      }

      try { renderMateriSidebar(); } catch(e){}
      try { renderMateriDetail(); } catch(e){}
      try { renderGameNav(); } catch(e){}
      try { renderGameContent(); } catch(e){}
      try { renderLatihModule(); } catch(e){}
      try { updateMpiProgressUI(); } catch(e){}
      try { updateDashboardUI(); } catch(e){}
      try { renderMasterAdventureMap(); } catch(e){}
      try { switchTab('dashboard'); } catch(e){}
    }

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', initMpiApp);
    } else {
      initMpiApp();
    }
  </script>
</body>
</html>`;
}

export const generateStandaloneHtml = (params: {
  config?: MpiConfig;
  materi?: MateriItem[];
  bermain?: GameItem[];
  latih?: SoalLatih[];
}): string => {
  return generateStandaloneMpiHtml(
    params.config,
    params.materi,
    params.bermain,
    params.latih
  );
};
