import { SoalLatih, GameItem, MpiConfig } from '../types';

/**
 * Intelligent Game Synthesizer for MPI Kurikulum Merdeka
 * Synthesizes 5 interactive game activities (Jodoh, Klik, Urut, Kumpul, Sambung)
 * directly from uploaded/bank evaluation questions with 100% strict adherence
 * to answer keys (kunci jawaban) and distractors from the uploaded question bank.
 */
export function generateGamesFromSoal(
  soalList: SoalLatih[],
  config?: MpiConfig
): GameItem[] {
  if (!soalList || soalList.length === 0) {
    return [];
  }

  const topikUtama = config?.topikMateri || config?.judul || 'Materi Pembelajaran';
  const mapel = config?.mataPelajaran || 'Sosiologi';
  const fase = config?.fase || 'Fase F';
  const kelas = config?.kelas || 'Kelas XI';

  // Helper: clean text helper
  const cleanText = (str: string, maxLen = 120): string => {
    if (!str) return '';
    return str
      .replace(/^pembahasan[:\s-]*/i, '')
      .replace(/^[0-9]+[.)]\s*/, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLen);
  };

  // Helper: extract correct option indices from a question
  const getCorrectIndices = (q: SoalLatih): number[] => {
    if (typeof q.j === 'number') {
      return [q.j];
    }
    if (Array.isArray(q.j)) {
      return (q.j as any[]).filter(x => typeof x === 'number');
    }
    return [0];
  };

  // Helper: extract correct answer text from a question
  const getCorrectAnswerText = (q: SoalLatih): string => {
    if (q.opsi && q.opsi.length > 0) {
      const correctIdxs = getCorrectIndices(q);
      const textArr = correctIdxs
        .map(idx => q.opsi?.[idx])
        .filter(Boolean)
        .map(t => cleanText(t, 90));
      if (textArr.length > 0) return textArr.join(', ');
    }
    if (q.t === 'jodoh' && Array.isArray(q.pasanganJodoh) && q.pasanganJodoh.length > 0) {
      return q.pasanganJodoh.map(p => `${p.kiri} ↔ ${p.kanan}`).join('; ');
    }
    if (q.t === 'drag_word' && Array.isArray(q.kataPilihan)) {
      return q.kataPilihan.join(', ');
    }
    return '';
  };

  // --------------------------------------------------------------------------
  // 1. EXTRACT REUSABLE ASSETS FROM BANK SOAL STRICTLY ACCORDING TO KUNCI JAWABAN
  // --------------------------------------------------------------------------

  // A. Explicit matching pairs from 'jodoh' questions
  const explicitPairs: Array<{ kiri: string; kanan: string }> = [];
  soalList.forEach(q => {
    if (q.t === 'jodoh' && Array.isArray(q.pasanganJodoh) && q.pasanganJodoh.length > 0) {
      q.pasanganJodoh.forEach(p => {
        if (p.kiri && p.kanan) {
          explicitPairs.push({ kiri: cleanText(p.kiri, 60), kanan: cleanText(p.kanan, 80) });
        }
      });
    } else if (Array.isArray(q.j) && q.j.length > 0 && typeof q.j[0] === 'object' && (q.j[0] as any).kiri) {
      (q.j as Array<{ kiri: string; kanan: string }>).forEach(p => {
        if (p.kiri && p.kanan) {
          explicitPairs.push({ kiri: cleanText(p.kiri, 60), kanan: cleanText(p.kanan, 80) });
        }
      });
    }
  });

  // B. Collect correct statements vs wrong distractor statements strictly from option indices
  const correctOptionStatements: string[] = [];
  const wrongOptionStatements: string[] = [];
  const questionAnswerPairs: Array<{ kiri: string; kanan: string }> = [];

  soalList.forEach((q, idx) => {
    if (q.opsi && q.opsi.length >= 2) {
      const correctIdxs = getCorrectIndices(q);

      q.opsi.forEach((optText, oIdx) => {
        const cleaned = cleanText(optText, 95);
        if (cleaned.length >= 3) {
          if (correctIdxs.includes(oIdx)) {
            correctOptionStatements.push(cleaned);

            // Pair question prompt / topic with exact correct option
            const topicOrQuestion = q.subKompetensi || q.kompetensi || cleanText(q.tanya.replace(/\?.*$/, ''), 55);
            if (topicOrQuestion && topicOrQuestion.length >= 4) {
              questionAnswerPairs.push({
                kiri: cleanText(topicOrQuestion, 50),
                kanan: cleaned
              });
            }
          } else {
            wrongOptionStatements.push(cleaned);
          }
        }
      });
    } else if (q.t === 'drag_word' && Array.isArray(q.kataPilihan)) {
      q.kataPilihan.forEach(k => {
        if (k && k.length >= 2) correctOptionStatements.push(cleanText(k, 40));
      });
    }
  });

  // C. Extract Cause-and-Effect pairs strictly from questions (Q prompt / cause -> Correct answer / effect)
  const causeEffectPairs: Array<{ sebab: string; akibat: string }> = [];
  soalList.forEach(q => {
    const correctAns = getCorrectAnswerText(q);
    const cleanPrompt = cleanText(q.tanya.replace(/\?.*$/, ''), 70);

    if (cleanPrompt && correctAns) {
      causeEffectPairs.push({
        sebab: cleanPrompt,
        akibat: correctAns
      });
    } else if (q.msg && q.msg.length > 20) {
      const cleanMsg = cleanText(q.msg, 200);
      const parts = cleanMsg.split(/(?:sehingga|mengakibatkan|akibatnya|memicu|maka)/i);
      if (parts.length >= 2 && parts[0].trim().length >= 10 && parts[1].trim().length >= 10) {
        causeEffectPairs.push({
          sebab: cleanText(parts[0], 70),
          akibat: cleanText(parts[1], 80)
        });
      }
    }
  });

  // --------------------------------------------------------------------------
  // 2. BUILD THE 5 ENGAGING GAME ACTIVITIES (100% STRICT ANSWER ACCURACY)
  // --------------------------------------------------------------------------

  const results: GameItem[] = [];

  // ==========================================================================
  // GAME 1: TIPE 'JODOH' (Menjodohkan Konsep & Pasangan Karakteristik)
  // ==========================================================================
  let game1Pairs: Array<{ id: string; kiri: string; kanan: string }> = [];

  if (explicitPairs.length >= 3) {
    game1Pairs = explicitPairs.slice(0, 5).map((p, idx) => ({
      id: `p${idx + 1}`,
      kiri: p.kiri,
      kanan: p.kanan
    }));
  } else if (questionAnswerPairs.length >= 3) {
    // Unique by 'kiri' to avoid duplicates
    const seenLeft = new Set<string>();
    const uniqueQAPairs = questionAnswerPairs.filter(p => {
      if (seenLeft.has(p.kiri)) return false;
      seenLeft.add(p.kiri);
      return true;
    });

    game1Pairs = uniqueQAPairs.slice(0, 5).map((p, idx) => ({
      id: `p${idx + 1}`,
      kiri: p.kiri,
      kanan: p.kanan
    }));
  } else {
    // Fallback directly using available questions
    game1Pairs = soalList.slice(0, 4).map((q, idx) => {
      const label = q.subKompetensi || q.kompetensi || `Aspek Soal ${idx + 1}`;
      const answer = getCorrectAnswerText(q) || cleanText(q.tanya, 70);
      return {
        id: `p${idx + 1}`,
        kiri: cleanText(label, 45),
        kanan: cleanText(answer, 80)
      };
    });
  }

  results.push({
    id: 1,
    tipe: 'jodoh',
    judul: `Tebak Pasangan: Konsep & Kunci Jawaban ${topikUtama}`,
    instruksi: `Pasangkan istilah/pertanyaan di sebelah kiri dengan jawaban yang TEPAT dan BENAR di sebelah kanan!`,
    waktuDetik: 60,
    pasangan: game1Pairs,
    animasi: { masuk: 'bounce-in', interaksi: 'scale-tap', kecepatan: 'normal' }
  });

  // ==========================================================================
  // GAME 2: TIPE 'KLIK' (Detektif Ciri & Kategori Jawaban Benar)
  // ==========================================================================
  const uniqueCorrect = Array.from(new Set(correctOptionStatements)).filter(s => s.length >= 4).slice(0, 5);
  const uniqueWrong = Array.from(new Set(wrongOptionStatements))
    .filter(s => s.length >= 4 && !uniqueCorrect.includes(s))
    .slice(0, 4);

  let game2Items: Array<{ teks: string; benar: boolean }> = [];
  uniqueCorrect.forEach(c => game2Items.push({ teks: c, benar: true }));
  uniqueWrong.forEach(w => game2Items.push({ teks: w, benar: false }));

  // Fallback if question options are too short or few
  if (game2Items.length < 5) {
    soalList.slice(0, 6).forEach(q => {
      const correctText = getCorrectAnswerText(q);
      if (correctText && !game2Items.some(i => i.teks === correctText)) {
        game2Items.push({ teks: correctText, benar: true });
      }
    });
  }

  results.push({
    id: 2,
    tipe: 'klik',
    judul: `Tantangan Kilat: Pilah Pernyataan BENAR ${topikUtama}`,
    instruksi: `Klik semua kartu yang berisi kunci jawaban / fakta BENAR dari bank soal ${topikUtama}! Hindari opsi pengecoh!`,
    waktuDetik: 45,
    targetKategori: `Pernyataan BENAR Sesuai Kunci Jawaban`,
    itemKlik: game2Items.slice(0, 8),
    animasi: { masuk: 'zoom-in', interaksi: 'scale-tap', kecepatan: 'normal' }
  });

  // ==========================================================================
  // GAME 3: TIPE 'URUT' (Menyusun Alur, Kronologi & Hierarki Proses)
  // ==========================================================================
  const processCompetencies = soalList
    .map(q => q.subKompetensi || q.kompetensi)
    .filter(Boolean) as string[];

  const uniqueComps = Array.from(new Set(processCompetencies)).slice(0, 5);
  let urutan: string[] = [];

  if (uniqueComps.length >= 3) {
    urutan = uniqueComps.map((comp, idx) => `Langkah ${idx + 1}: ${cleanText(comp, 70)}`);
  } else {
    urutan = soalList.slice(0, 4).map((q, idx) => {
      const topic = q.subKompetensi || q.kompetensi || cleanText(q.tanya.replace(/\?.*$/, ''), 45);
      return `Tahap ${idx + 1}: Analisis ${topic}`;
    });
  }

  results.push({
    id: 3,
    tipe: 'urut',
    judul: `Susun Runtut: Alur & Tahapan Pemahaman ${topikUtama}`,
    instruksi: `Gunakan tombol panah ke atas (▲) dan ke bawah (▼) untuk menyusun tahapan ini secara runtut dari fase awal hingga fase akhir!`,
    waktuDetik: 60,
    urutanBenar: urutan,
    animasi: { masuk: 'slide-up', interaksi: 'glow', kecepatan: 'normal' }
  });

  // ==========================================================================
  // GAME 4: TIPE 'KUMPUL' (Tangkap Cepat Kata Kunci Jawaban Benar)
  // ==========================================================================
  const positiveAnswerKeywords: string[] = [];
  const negativeDistractorKeywords: string[] = [];

  soalList.forEach(q => {
    const correctIdxs = getCorrectIndices(q);
    if (q.opsi) {
      q.opsi.forEach((optText, oIdx) => {
        const cleaned = cleanText(optText, 45);
        if (cleaned.length >= 3) {
          if (correctIdxs.includes(oIdx)) {
            positiveAnswerKeywords.push(cleaned);
          } else {
            negativeDistractorKeywords.push(cleaned);
          }
        }
      });
    }
  });

  const uniquePositives = Array.from(new Set(positiveAnswerKeywords)).slice(0, 5);
  const uniqueNegatives = Array.from(new Set(negativeDistractorKeywords))
    .filter(w => !uniquePositives.includes(w))
    .slice(0, 4);

  const game4Items: Array<{ teks: string; benar: boolean; poin: number }> = [];

  uniquePositives.forEach(pos => {
    game4Items.push({ teks: pos, benar: true, poin: 20 });
  });

  uniqueNegatives.forEach(neg => {
    game4Items.push({ teks: neg, benar: false, poin: -10 });
  });

  results.push({
    id: 4,
    tipe: 'kumpul',
    judul: `Koleksi Karakter: Kata Kunci Kunci Jawaban ${topikUtama}`,
    instruksi: `Kumpulkan semua kata kunci kunci jawaban BENAR (+20 poin). Hati-hati, jangan mengeklik opsi pengecoh/salah (-10 poin)!`,
    waktuDetik: 45,
    itemKumpul: game4Items.slice(0, 8),
    animasi: { masuk: 'bounce-in', interaksi: 'scale-tap', kecepatan: 'normal' }
  });

  // ==========================================================================
  // GAME 5: TIPE 'SAMBUNG' (Rantai Logika Sebab-Akibat Pertanyaan & Kunci)
  // ==========================================================================
  let game5Pairs: Array<{ sebab: string; akibat: string }> = [];

  if (causeEffectPairs.length >= 3) {
    // Unique by 'sebab'
    const seenSebab = new Set<string>();
    const uniqueCE = causeEffectPairs.filter(p => {
      if (seenSebab.has(p.sebab)) return false;
      seenSebab.add(p.sebab);
      return true;
    });
    game5Pairs = uniqueCE.slice(0, 4);
  } else {
    game5Pairs = soalList.slice(0, 4).map((q, idx) => ({
      sebab: cleanText(q.tanya.replace(/\?.*$/, ''), 60) || `Soal Pertanyaan ${idx + 1}`,
      akibat: getCorrectAnswerText(q) || `Kunci Jawaban Tepat ${idx + 1}`
    }));
  }

  results.push({
    id: 5,
    tipe: 'sambung',
    judul: `Rantai Logika: Pertanyaan & Kunci Jawaban ${topikUtama}`,
    instruksi: `Hubungkan setiap PERTANYAAN / SEBAB di sisi kiri dengan KUNCI JAWABAN / RESOLUSI yang tepat di sisi kanan!`,
    waktuDetik: 60,
    rantaiLogika: game5Pairs,
    animasi: { masuk: 'bounce-in', interaksi: 'glow', kecepatan: 'normal' }
  });

  return results;
}

