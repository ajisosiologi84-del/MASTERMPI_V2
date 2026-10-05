import React, { useState } from 'react';
import { FileText, Send, Printer, Download, CheckCircle, Sparkles, BookOpen, Users, HelpCircle, Save } from 'lucide-react';
import { LkpdItem } from '../types';
import { LKPD_DATA } from '../data/mpiData';
import { generateLkpdPdf } from '../utils/pdfGenerator';

interface LkpdViewProps {
  customLkpdList?: LkpdItem[];
  studentInfo?: { nama: string; nisn: string; kelas: string };
}

export const LkpdView: React.FC<LkpdViewProps> = ({ customLkpdList, studentInfo }) => {
  const list = customLkpdList && customLkpdList.length > 0 ? customLkpdList : LKPD_DATA;
  const [selectedLkpdIndex, setSelectedLkpdIndex] = useState(0);

  const currentLkpd = list[selectedLkpdIndex] || list[0];

  // State to hold student answers for questions
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [namaKelompok, setNamaKelompok] = useState('');
  const [anggotaKelompok, setAnggotaKelompok] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleAnswerChange = (qIndex: number, val: string) => {
    setAnswers(prev => ({ ...prev, [`${currentLkpd.id}_${qIndex}`]: val }));
    setIsSaved(false);
  };

  const handleSaveLkpd = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportPdf = () => {
    try {
      generateLkpdPdf(
        currentLkpd,
        studentInfo || { nama: '', nisn: '', kelas: '' },
        answers,
        namaKelompok,
        anggotaKelompok
      );
    } catch (e) {
      window.print();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 rounded-3xl shadow-lg border border-emerald-600/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            <FileText size={26} />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider inline-block mb-1">
              Kurikulum Merdeka - Sosiologi
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Lembar Kerja Peserta Didik (LKPD Interaktif)
            </h1>
            <p className="text-xs text-emerald-100 mt-0.5">
              Analisis Studi Kasus Nyata & Diskusi Dinamika Kelompok Sosial
            </p>
          </div>
        </div>

        <button
          onClick={handleExportPdf}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2 shrink-0 print:hidden"
        >
          <Download size={16} />
          <span>Download PDF LKPD</span>
        </button>
      </div>

      {/* Tab Switcher if multiple LKPDs exist */}
      {list.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none print:hidden">
          {list.map((lkpd, idx) => (
            <button
              key={lkpd.id}
              onClick={() => setSelectedLkpdIndex(idx)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition shrink-0 flex items-center gap-2 ${
                selectedLkpdIndex === idx
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FileText size={14} />
              <span>LKPD {idx + 1}: {lkpd.judul.split(':')[0]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main LKPD Sheet Body */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 print:border-0 print:shadow-none print:p-0">
        
        {/* Identitas Kelompok / Siswa */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
              <Users size={14} className="text-emerald-600" />
              <span>Nama Kelompok Diskusi:</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Kelompok 1 - Sosiolog Muda"
              value={namaKelompok}
              onChange={(e) => setNamaKelompok(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
              Anggota Kelompok / Siswa:
            </label>
            <input
              type="text"
              placeholder="Contoh: 1. Andi, 2. Budi, 3. Citra (Kelas XI-1)"
              value={anggotaKelompok}
              onChange={(e) => setAnggotaKelompok(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* LKPD Title & Instructions */}
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-600 shrink-0" />
            <span>{currentLkpd.judul}</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium bg-amber-50 p-3 rounded-xl border border-amber-200/70">
            <strong>📌 Petunjuk Pengerjaan:</strong> {currentLkpd.petunjuk}
          </p>
        </div>

        {/* Case Study Box */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-2">
            <BookOpen size={16} className="text-emerald-700" />
            <span>Studi Kasus Sosiologis untuk Didiskusikan:</span>
          </h3>
          <p className="text-xs text-slate-800 leading-relaxed font-serif italic bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
            "{currentLkpd.kasusStudi}"
          </p>
        </div>

        {/* Questions & Answer Forms */}
        <div className="space-y-6">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <HelpCircle size={18} className="text-emerald-600" />
            <span>Pertanyaan Refleksi & Analisis Sosiologi:</span>
          </h3>

          {currentLkpd.pertanyaan.map((qText, qIdx) => {
            const answerKey = `${currentLkpd.id}_${qIdx}`;
            const currentAnswer = answers[answerKey] || '';

            return (
              <div key={qIdx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <p className="text-xs font-extrabold text-slate-900 leading-relaxed">
                  <span className="text-emerald-700 mr-1.5 font-black">{qIdx + 1}.</span>
                  {qText}
                </p>

                <textarea
                  rows={4}
                  placeholder="Tuliskan hasil diskusi analisis sosiologi kelompok Anda di sini..."
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(qIdx, e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-normal text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <span className="text-xs text-slate-500 font-medium">
            {isSaved ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle size={14} /> Jawaban LKPD Berhasil Disimpan Lokal!
              </span>
            ) : (
              '*Simpan jawaban secara berkala sebelum mencetak.'
            )}
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSaveLkpd}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Save size={16} />
              <span>Simpan Jawaban LKPD</span>
            </button>
            <button
              onClick={handleExportPdf}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Download size={16} />
              <span>Download PDF LKPD</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
