import React from 'react';
import { parseVideoUrl } from '../utils/videoHelper';
import { Play, Video, Youtube, ExternalLink, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  title?: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title = 'Video Pembelajaran Interaktif',
  className = ''
}) => {
  if (!videoUrl || !videoUrl.trim()) return null;

  const videoInfo = parseVideoUrl(videoUrl);

  if (!videoInfo.isValid) {
    return (
      <div className={`p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3 ${className}`}>
        <AlertCircle size={18} className="text-amber-600 shrink-0" />
        <div>
          <span className="font-bold block">Tautan Video Tidak Valid</span>
          <span className="text-amber-700">Gunakan URL YouTube (misal: https://www.youtube.com/watch?v=...) atau link file MP4 langsung.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden ${className}`}>
      {/* Header bar for video player */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800/80 flex items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 shrink-0">
            {videoInfo.type === 'youtube' ? <Youtube size={16} /> : <Video size={16} />}
          </div>
          <span className="text-xs font-black truncate text-slate-100">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {videoInfo.type === 'youtube' && (
            <a
              href={videoInfo.rawUrl || videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition flex items-center gap-1 shadow-xs shrink-0"
              title="Buka langsung di aplikasi YouTube jika iframe dibatasi oleh kebijakan keamanan browser"
            >
              <span>Buka YouTube</span>
              <ExternalLink size={12} />
            </a>
          )}
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0 flex items-center gap-1">
            <Play size={10} className="fill-current text-rose-500" />
            <span>{videoInfo.type.toUpperCase()} 16:9</span>
          </span>
        </div>
      </div>

      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        {videoInfo.isDirectVideo ? (
          <video
            controls
            preload="metadata"
            className="w-full h-full object-contain rounded-b-2xl"
          >
            <source src={videoInfo.embedUrl} type="video/mp4" />
            <source src={videoInfo.embedUrl} type="video/webm" />
            Browser Anda tidak mendukung pemutar video MP4 langsung.
          </video>
        ) : (
          <iframe
            src={videoInfo.embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 rounded-b-2xl"
          />
        )}
      </div>
    </div>
  );
};
