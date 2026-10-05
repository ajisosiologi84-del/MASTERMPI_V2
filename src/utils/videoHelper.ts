export interface VideoInfo {
  type: 'youtube' | 'mp4' | 'vimeo' | 'unknown';
  embedUrl: string;
  rawUrl?: string;
  isDirectVideo: boolean;
  isValid: boolean;
}

/**
 * Utility function to parse YouTube, Vimeo, or direct MP4/video URLs into embeddable format
 */
export function parseVideoUrl(url?: string): VideoInfo {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown', embedUrl: '', isDirectVideo: false, isValid: false };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { type: 'unknown', embedUrl: '', isDirectVideo: false, isValid: false };
  }

  // 1. YouTube detection
  // Standard: youtube.com/watch?v=ID
  // Shortened: youtu.be/ID
  // Embed: youtube.com/embed/ID
  // Shorts: youtube.com/shorts/ID
  const ytRegExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = trimmed.match(ytRegExp);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1`,
      rawUrl: `https://www.youtube.com/watch?v=${videoId}`,
      isDirectVideo: false,
      isValid: true
    };
  }

  // 2. Vimeo detection
  const vimeoRegExp = /(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+)/;
  const vimeoMatch = trimmed.match(vimeoRegExp);

  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isDirectVideo: false,
      isValid: true
    };
  }

  // 3. Direct video file (MP4, WebM, OGG, MOV) or direct video URL
  const directVideoRegExp = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;
  if (directVideoRegExp.test(trimmed) || trimmed.startsWith('data:video/')) {
    return {
      type: 'mp4',
      embedUrl: trimmed,
      isDirectVideo: true,
      isValid: true
    };
  }

  // 4. Fallback if user passes valid http/https URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      type: 'mp4',
      embedUrl: trimmed,
      isDirectVideo: true,
      isValid: true
    };
  }

  return { type: 'unknown', embedUrl: '', isDirectVideo: false, isValid: false };
}
