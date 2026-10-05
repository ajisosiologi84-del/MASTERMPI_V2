import React from 'react';
import { Award, Printer, Download, CheckCircle2, Sparkles, X, Share2, ShieldCheck } from 'lucide-react';
import { CertData } from '../types';
import { generateCertificatePdf } from '../utils/pdfGenerator';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certData: CertData;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, certData }) => {
  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    try {
      generateCertificatePdf(certData);
    } catch (e) {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-amber-200 overflow-hidden print:max-w-none print:w-full print:h-screen print:shadow-none print:border-0 print:rounded-none">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-400" />
            <span className="font-bold text-xs tracking-wide">Sertifikat Kelulusan & Apresiasi MPI Digital</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <Download size={14} />
              <span>Download PDF Sertifikat</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Certificate Frame Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 flex items-center justify-center print:p-0 print:bg-white">
          
          <div className="w-full bg-white border-8 border-amber-500/80 p-6 sm:p-10 rounded-2xl shadow-xl relative text-center overflow-hidden print:shadow-none print:border-4 print:p-8">
            
            {/* Elegant Background Watermark & Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-tr-full opacity-40 pointer-events-none" />
            
            {/* Header / Logo Stamp */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-1 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-amber-300 border border-amber-200">
                  <Award size={32} />
                </div>
              </div>
            </div>

            {/* Title */}
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-800 block mb-1">
              Sertifikat Kelulusan Pembelajaran
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight mb-2">
              MEDIA PEMBELAJARAN INTERAKTIF
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
              Sosiologi SMA Fase F • Kurikulum Merdeka
            </p>

            {/* Awarded To */}
            <div className="my-4">
              <p className="text-xs text-slate-600 font-medium italic">Diberikan secara resmi kepada peserta didik:</p>
              <div className="my-2 border-b-2 border-amber-400 inline-block px-8 py-1">
                <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-wide capitalize">
                  {certData.namaSiswa || 'Siswa Berprestasi'}
                </h2>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1">
                NISN: {certData.nisn || '-'} • Kelas: {certData.kelas || 'XI Sosiologi'} • {certData.sekolah || 'SMA'}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed my-4 font-normal">
              Telah menyelesaikan secara tuntas seluruh rangkaian Modul Belajar Materi, Modul Bermain Tantangan Interaktif, serta Lulus Asesmen Evaluasi pada materi:
            </p>

            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 my-3 max-w-md mx-auto">
              <span className="text-xs font-black text-amber-900 block">
                "{certData.mpiJudul || 'Kelompok Sosial di Masyarakat'}"
              </span>
            </div>

            {/* Grade & Score Badge */}
            <div className="flex items-center justify-center gap-6 my-6">
              <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 block">Nilai Asesmen</span>
                <span className="text-xl font-black text-emerald-900">{certData.nilaiAkhir} / 100</span>
              </div>

              <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
                <span className="text-[10px] font-extrabold uppercase text-indigo-700 block">Predikat Kelulusan</span>
                <span className="text-xl font-black text-indigo-900">{certData.predikat || 'SANGAT BAIK'}</span>
              </div>
            </div>

            {/* Date & Signatures */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 items-end text-left">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-1">
                  <ShieldCheck size={16} />
                  <span>Sertifikat Otentik MPI</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Tanggal Lulus: {certData.tanggal}</p>
                <p className="text-[10px] text-slate-500 font-medium">KKTP Minimal: {certData.kkm}</p>
              </div>

              <div className="text-right">
                <p className="text-[11px] font-bold text-slate-800">{certData.sekolah || 'SMA'}</p>
                <div className="h-10 my-1 flex items-center justify-end">
                  <span className="font-serif italic text-indigo-800 text-sm font-bold border-b border-indigo-300 px-3">
                    {certData.namaPengembang || 'Aji Sosiologi'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold">Guru Pengembang MPI</p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer Controls (Hidden on Print) */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs print:hidden">
          <span className="text-slate-500 font-medium hidden sm:inline">
            💡 File Sertifikat Resmi PDF akan diunduh secara otomatis ke perangkat Anda.
          </span>
          <button
            onClick={handleDownloadPdf}
            className="w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition shadow-xs flex items-center justify-center gap-2"
          >
            <Download size={16} />
            <span>Download Sertifikat PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
