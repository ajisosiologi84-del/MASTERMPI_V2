import jsPDF from 'jspdf';
import { MpiConfig, SoalLatih, CertData, LkpdItem } from '../types';

export interface StudentScoreData {
  namaSiswa: string;
  nomorInduk: string;
  kelas: string;
  sekolah: string;
  score: number;
  kkm: number;
  totalSoal: number;
  totalBenar: number;
  totalSalah: number;
  answers: { [key: number]: any };
  isAnswerCorrect: (index: number) => boolean;
  tanggal: string;
}

export function generateCertificatePdf(certData: CertData) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pw = doc.internal.pageSize.getWidth(); // ~297 mm
  const ph = doc.internal.pageSize.getHeight(); // ~210 mm

  // Outer Decorative Borders
  doc.setLineWidth(1.5);
  doc.setDrawColor(217, 119, 6); // Amber-600
  doc.rect(8, 8, pw - 16, ph - 16, 'S');

  doc.setLineWidth(0.5);
  doc.setDrawColor(245, 158, 11); // Amber-500
  doc.rect(11, 11, pw - 22, ph - 22, 'S');

  // Background subtle corner fills
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.triangle(11, 11, 35, 11, 11, 35, 'F');
  doc.triangle(pw - 11, 11, pw - 35, 11, pw - 11, 35, 'F');
  doc.triangle(11, ph - 11, 35, ph - 11, 11, ph - 35, 'F');
  doc.triangle(pw - 11, ph - 11, pw - 35, ph - 11, pw - 11, ph - 35, 'F');

  let y = 26;

  // Top Header Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text('SERTIFIKAT KELULUSAN & APRESIASI BELAJAR DIGITAL', pw / 2, y, { align: 'center' });

  y += 10;
  doc.setFont('serif', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text('MEDIA PEMBELAJARAN INTERAKTIF (MPI)', pw / 2, y, { align: 'center' });

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Kurikulum Merdeka • Sosiologi SMA Fase F', pw / 2, y, { align: 'center' });

  y += 12;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Diberikan secara resmi kepada peserta didik:', pw / 2, y, { align: 'center' });

  y += 11;
  // Student Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 27, 75); // Indigo-950
  doc.text(certData.namaSiswa || 'Siswa Berprestasi', pw / 2, y, { align: 'center' });

  // Underline
  const nameWidth = Math.min(180, Math.max(90, (certData.namaSiswa || 'Siswa').length * 6));
  doc.setLineWidth(0.8);
  doc.setDrawColor(245, 158, 11);
  doc.line((pw - nameWidth) / 2, y + 2, (pw + nameWidth) / 2, y + 2);

  y += 9;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`NISN: ${certData.nisn || '-'}   •   Kelas: ${certData.kelas || 'XI Sosiologi'}   •   Sekolah: ${certData.sekolah || 'SMA'}`, pw / 2, y, { align: 'center' });

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Telah menyelesaikan secara tuntas seluruh Modul Materi, Game Interaktif, dan Asesmen Evaluasi pada topik:', pw / 2, y, { align: 'center' });

  y += 8;
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(252, 211, 77);
  doc.roundedRect(pw / 2 - 80, y - 5, 160, 10, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(146, 64, 14);
  doc.text(`"${certData.mpiJudul || 'Kelompok Sosial di Masyarakat'}"`, pw / 2, y, { align: 'center' });

  y += 16;
  // Score Box
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(pw / 2 - 65, y - 5, 60, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(4, 120, 87);
  doc.text('NILAI ASESMEN', pw / 2 - 35, y, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`${certData.nilaiAkhir} / 100`, pw / 2 - 35, y + 6, { align: 'center' });

  // Predikat Box
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(pw / 2 + 5, y - 5, 60, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(67, 56, 202);
  doc.text('PREDIKAT KELULUSAN', pw / 2 + 35, y, { align: 'center' });
  doc.setFontSize(11);
  doc.text(certData.predikat || 'SANGAT BAIK', pw / 2 + 35, y + 6, { align: 'center' });

  y += 24;
  // Footer Signatures
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Tanggal Lulus: ${certData.tanggal}`, 30, y);
  doc.text(`Kriteria Minimum (KKTP): ${certData.kkm}`, 30, y + 5);

  doc.text(`${certData.sekolah || 'SMA'}, ${certData.tanggal}`, pw - 75, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Guru Pengembang MPI', pw - 75, y + 5);

  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(pw - 75, y + 18, pw - 25, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(certData.namaPengembang || 'Pendidik', pw - 75, y + 23);

  const sanitized = (certData.namaSiswa || 'Siswa').toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`Sertifikat_MPI_${sanitized}.pdf`);
}

export function generateLkpdPdf(
  lkpd: LkpdItem,
  studentInfo: { nama: string; nisn: string; kelas: string },
  answers: { [key: string]: string },
  namaKelompok: string,
  anggotaKelompok: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pw = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(6, 95, 70); // Emerald-800
  doc.rect(0, 0, pw, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('LEMBAR KERJA PESERTA DIDIK (LKPD INTERAKTIF)', pw / 2, 10, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('Kurikulum Merdeka • Sosiologi SMA Fase F', pw / 2, 16, { align: 'center' });
  doc.text(lkpd.judul, pw / 2, 21, { align: 'center' });

  let y = 33;

  // Box Identitas Kelompok
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, pw - 28, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70);
  doc.text('IDENTITAS KELOMPOK / SISWA:', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(`Nama Kelompok  : ${namaKelompok || '-'}` , 18, y + 11);
  doc.text(`Anggota / Siswa   : ${anggotaKelompok || studentInfo.nama || '-'}` , 18, y + 17);

  const rightX = 125;
  doc.text(`Kelas / FASE       : ${studentInfo.kelas || 'XI Sosiologi'}` , rightX, y + 11);
  doc.text(`Tanggal Kerja     : ${new Date().toLocaleDateString('id-ID')}` , rightX, y + 17);

  y += 28;

  // Petunjuk
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(252, 211, 77);
  doc.roundedRect(14, y, pw - 28, 12, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14);
  doc.text('Petunjuk Pengerjaan:', 18, y + 4.5);
  doc.setFont('helvetica', 'normal');
  const petunjukLines = doc.splitTextToSize(lkpd.petunjuk, pw - 42);
  doc.text(petunjukLines, 18, y + 8.5);

  y += 17;

  // Studi Kasus Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70);
  doc.text('STUDI KASUS SOSIOLOGI:', 14, y);

  y += 3;
  const kasusLines = doc.splitTextToSize(lkpd.kasusStudi, pw - 36);
  const kasusBoxHeight = Math.max(16, kasusLines.length * 4 + 6);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pw - 28, kasusBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(kasusLines, 18, y + 5);

  y += kasusBoxHeight + 8;

  // Questions & Written Answers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('HASIL DISKUSI & ANALISIS PERTANYAAN:', 14, y);
  y += 5;

  lkpd.pertanyaan.forEach((qText, qIdx) => {
    const ansKey = `${lkpd.id}_${qIdx}`;
    const studentAns = answers[ansKey] || '(Belum diisi oleh siswa)';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70);
    const qLines = doc.splitTextToSize(`${qIdx + 1}. ${qText}`, pw - 28);
    doc.text(qLines, 14, y);
    y += qLines.length * 4 + 2;

    const ansLines = doc.splitTextToSize(studentAns, pw - 36);
    const ansBoxHeight = Math.max(14, ansLines.length * 4 + 6);

    // Check page overflow
    if (y + ansBoxHeight > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(209, 250, 229);
    doc.roundedRect(14, y, pw - 28, ansBoxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(ansLines, 18, y + 5);

    y += ansBoxHeight + 6;
  });

  const sanitized = (namaKelompok || studentInfo.nama || 'Kelompok').toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`LKPD_Sosiologi_${sanitized}.pdf`);
}

export function generateScorePdf(
  config: MpiConfig,
  soalList: SoalLatih[],
  studentData: StudentScoreData
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const isLulus = studentData.score >= studentData.kkm;

  // Header Banner / Kop Resmi
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('LAPORAN HASIL EVALUASI MEDIA PEMBELAJARAN INTERAKTIF (MPI)', pageWidth / 2, 11, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Kurikulum Merdeka • ${config.mataPelajaran} (${config.fase} - ${config.kelas})`, pageWidth / 2, 18, { align: 'center' });
  doc.text(`Judul MPI: "${config.judul}"`, pageWidth / 2, 23, { align: 'center' });

  let y = 36;

  // 1. Box Identitas Peserta Didik & Media
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('I. IDENTITAS PESERTA DIDIK & KARYA MPI', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  // Left column
  doc.text(`Nama Siswa`, 18, y + 13);
  doc.text(`:  ${studentData.namaSiswa || 'Peserta Didik'}`, 48, y + 13);

  doc.text(`NIS / No. Absen`, 18, y + 19);
  doc.text(`:  ${studentData.nomorInduk || '-'} / ${studentData.kelas || config.kelas}`, 48, y + 19);

  doc.text(`Sekolah / Instansi`, 18, y + 25);
  doc.text(`:  ${studentData.sekolah || config.sekolah || 'SMA/SMK'}`, 48, y + 25);

  // Right column
  const rightX = 115;
  doc.text(`Tanggal Tes`, rightX, y + 13);
  doc.text(`:  ${studentData.tanggal}`, rightX + 28, y + 13);

  doc.text(`Mata Pelajaran`, rightX, y + 19);
  doc.text(`:  ${config.mataPelajaran}`, rightX + 28, y + 19);

  doc.text(`Pengembang MPI`, rightX, y + 25);
  doc.text(`:  ${config.namaPengembang || config.penyusun}`, rightX + 28, y + 25);

  y += 36;

  // 2. Box Hasil Skor & Status Kelulusan
  const scoreBoxColor = isLulus ? [16, 185, 129] : [239, 68, 68]; // Emerald vs Rose
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(isLulus ? 236 : 254, isLulus ? 253 : 242, isLulus ? 245 : 242);
  doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('II. REKAPITULASI HASIL EVALUASI BELAJAR', 18, y + 6);

  // Big Score Badge
  doc.setFillColor(scoreBoxColor[0], scoreBoxColor[1], scoreBoxColor[2]);
  doc.roundedRect(pageWidth - 55, y + 4, 37, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${studentData.score}`, pageWidth - 36.5, y + 14, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text(`SKOR AKHIR`, pageWidth - 36.5, y + 20, { align: 'center' });

  // Stats
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Kriteria Ketercapaian (KKM) :  ${studentData.kkm}`, 18, y + 13);
  doc.text(`Jawaban Benar / Total Soal    :  ${studentData.totalBenar} dari ${studentData.totalSoal} Soal`, 18, y + 18);
  
  const akurasi = Math.round((studentData.totalBenar / studentData.totalSoal) * 100);
  doc.text(`Akurasi Pengerjaan              :  ${akurasi}%`, 18, y + 23);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isLulus ? 4 : 185, isLulus ? 120 : 28, isLulus ? 87 : 28);
  doc.text(`STATUS: ${isLulus ? 'TUNTAS KRITERIA KETERCAPAIAN (LULUS)' : 'BELUM TUNTAS (PERLU PENGAYAAN / REMEDIAL)'}`, 80, y + 13);

  y += 34;

  // 3. Tabel Rincian Analisis Butir Soal
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('III. TABEL RINCIAN ANALISIS BUTIR SOAL ASESMEN HOTS', 14, y);
  y += 4;

  // Table Header
  doc.setFillColor(51, 65, 85);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');

  doc.text('NO', 16, y + 4.5);
  doc.text('BENTUK SOAL', 25, y + 4.5);
  doc.text('KOMPETENSI / POKOK BAHASAN', 52, y + 4.5);
  doc.text('STATUS', 145, y + 4.5);
  doc.text('SKOR', 175, y + 4.5);

  y += 7;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  soalList.forEach((q, idx) => {
    const isCorrect = studentData.isAnswerCorrect(idx);
    const rowBg = idx % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(14, y, pageWidth - 28, 6.5, 'F');

    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, 6.5, 'S');

    doc.setTextColor(30, 41, 59);
    doc.text(`${idx + 1}`, 17, y + 4.5);

    const bentukLabel = q.t === 'pg' ? 'Pilihan Ganda' :
                        q.t === 'pg_kompleks' ? 'PG Kompleks' :
                        q.t === 'jodoh' ? 'Menjodohkan' : 'Isian Rumpang';
    doc.text(bentukLabel, 25, y + 4.5);

    const kompetensiText = q.kompetensi || q.subKompetensi || q.tanya.substring(0, 45) + '...';
    doc.text(kompetensiText.length > 55 ? kompetensiText.substring(0, 52) + '...' : kompetensiText, 52, y + 4.5);

    if (isCorrect) {
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text('BENAR (✓)', 145, y + 4.5);
      doc.text('10 Poin', 175, y + 4.5);
    } else {
      doc.setTextColor(239, 68, 68);
      doc.setFont('helvetica', 'bold');
      doc.text('SALAH (✕)', 145, y + 4.5);
      doc.text('0 Poin', 175, y + 4.5);
    }

    doc.setFont('helvetica', 'normal');
    y += 6.5;
  });

  y += 6;

  // 4. Catatan dan Rekomendasi Refleksi
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'FD');
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Catatan & Rekomendasi Pendidik:', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const rekomendasi = isLulus 
    ? `Peserta didik telah menguasai kompetensi dasar dengan predikat sangat baik. Disarankan untuk melanjutkan ke materi pengayaan dan studi kasus kontekstual tingkat lanjut.`
    : `Peserta didik disarankan melakukan refleksi pada konsep yang belum tuntas melalui Modul Materi dan menyelesaikan kembali soal latihan pada sesi remedial terbimbing.`;
  doc.text(doc.splitTextToSize(rekomendasi, pageWidth - 40), 18, y + 10);

  y += 28;

  // 5. Kolom Tanda Tangan
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  const signLeftX = 25;
  const signRightX = 135;

  doc.text('Mengetahui,', signLeftX, y);
  doc.text('Orang Tua / Wali Murid', signLeftX, y + 4.5);

  doc.text(`${studentData.sekolah || config.sekolah || 'Tempat'}, ${studentData.tanggal}`, signRightX, y);
  doc.text('Guru Mata Pelajaran / Pengembang', signRightX, y + 4.5);

  y += 20;

  doc.line(signLeftX, y, signLeftX + 45, y);
  doc.line(signRightX, y, signRightX + 48, y);

  doc.text('( .................................................. )', signLeftX, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`${config.namaPengembang || config.penyusun || 'Pendidik'}`, signRightX, y + 4.5);

  // Download PDF
  const sanitizedName = (studentData.namaSiswa || 'Siswa').toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`Rekap_Nilai_${sanitizedName}_MPI.pdf`);
}

