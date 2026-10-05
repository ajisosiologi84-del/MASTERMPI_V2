import React, { useState } from 'react';
import { Search, BookOpen, X, Sparkles, Filter, Bookmark, Tag } from 'lucide-react';
import { GlosariumItem } from '../types';
import { GLOSARIUM_DATA } from '../data/mpiData';

interface GlosariumModalProps {
  isOpen: boolean;
  onClose: () => void;
  customList?: GlosariumItem[];
}

export const GlosariumModal: React.FC<GlosariumModalProps> = ({ isOpen, onClose, customList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');

  if (!isOpen) return null;

  const dataList = customList && customList.length > 0 ? customList : GLOSARIUM_DATA;

  // Unique categories
  const categories = ['semua', ...Array.from(new Set(dataList.map(item => item.kategori)))];

  const filteredItems = dataList.filter(item => {
    const matchesSearch = item.istilah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.contoh && item.contoh.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'semua' || item.kategori === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-indigo-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Glosarium Istilah Sosiologi</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase">Kamus MPI</span>
              </h2>
              <p className="text-xs text-indigo-200 font-medium">Panduan konsep dan terminologi penting Kurikulum Merdeka</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 shrink-0">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari istilah, konsep, atau definisi sosiologi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Filter size={14} className="text-slate-400 shrink-0 ml-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <BookOpen size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm text-slate-700">Istilah tidak ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian atau kategori lain.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="pt-3.5 first:pt-0 group transition">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-black text-sm text-indigo-900 group-hover:text-indigo-600 transition flex items-center gap-1.5">
                    <Bookmark size={14} className="text-indigo-500 shrink-0" />
                    <span>{item.istilah}</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold shrink-0 flex items-center gap-1">
                    <Tag size={10} />
                    <span>{item.kategori}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {item.definisi}
                </p>
                {item.contoh && (
                  <div className="mt-2 text-[11px] text-slate-600 flex items-start gap-1.5 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                    <Sparkles size={13} className="text-amber-500 shrink-0 mt-0.5" />
                    <span><strong className="text-amber-900">Contoh Konkret:</strong> {item.contoh}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Menampilkan <strong>{filteredItems.length}</strong> istilah sosiologi</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-xs shadow-xs"
          >
            Tutup Glosarium
          </button>
        </div>

      </div>
    </div>
  );
};
