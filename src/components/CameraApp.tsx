import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  CameraOff,
  RotateCcw,
  Zap,
  ZapOff,
  Timer,
  Download,
  Share2,
  Trash2,
  X,
  Images,
  ChevronLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// ─── Filters ────────────────────────────────────────────────────────────────

const FILTERS = [
  { name: 'Normal',  css: 'none' },
  { name: 'Vivid',   css: 'saturate(1.8) contrast(1.1)' },
  { name: 'B&W',     css: 'grayscale(1)' },
  { name: 'Sepia',   css: 'sepia(0.8)' },
  { name: 'Faded',   css: 'saturate(0.6) brightness(1.15) contrast(0.9)' },
  { name: 'Vintage', css: 'sepia(0.4) contrast(0.85) brightness(0.85) hue-rotate(10deg)' },
  { name: 'Cool',    css: 'hue-rotate(30deg) saturate(1.15) brightness(1.05)' },
  { name: 'Warm',    css: 'sepia(0.2) saturate(1.4) hue-rotate(-10deg)' },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  filterName: string;
  timestamp: number;
}

type View = 'camera' | 'gallery' | 'preview';
type Permission = 'prompt' | 'granted' | 'denied' | 'unsupported';

// ─── Component ───────────────────────────────────────────────────────────────

export default function CameraApp() {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const thumbCanvas = useRef<HTMLCanvasElement | null>(null);

  const [permission,    setPermission]    = useState<Permission>('prompt');
  const [facingMode,    setFacingMode]    = useState<'environment' | 'user'>('environment');
  const [filterIndex,   setFilterIndex]   = useState(0);
  const [photos,        setPhotos]        = useState<CapturedPhoto[]>([]);
  const [view,          setView]          = useState<View>('camera');
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(null);
  const [countdown,     setCountdown]     = useState<number | null>(null);
  const [timerEnabled,  setTimerEnabled]  = useState(false);
  const [flashActive,   setFlashActive]   = useState(false);
  const [eventName,     setEventName]     = useState('');
  const [editingEvent,  setEditingEvent]  = useState(false);
  const [flashFrame,    setFlashFrame]    = useState(false);
  const [thumbDataUrl,  setThumbDataUrl]  = useState<string | null>(null);

  const currentFilter = FILTERS[filterIndex];

  // ── Start camera stream ────────────────────────────────────────────────────
  const startStream = useCallback(async () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width:  { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setPermission('granted');
    } catch (err: any) {
      setPermission(err.name === 'NotFoundError' ? 'unsupported' : 'denied');
    }
  }, [facingMode]);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermission('unsupported');
      return;
    }
    startStream();
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, [startStream]);

  // ── Torch toggle ──────────────────────────────────────────────────────────
  useEffect(() => {
    const track = streamRef.current?.getVideoTracks()[0];
    const caps  = track?.getCapabilities?.() as any;
    if (caps?.torch) {
      track!.applyConstraints({ advanced: [{ torch: flashActive } as any] }).catch(() => {});
    }
  }, [flashActive]);

  // ── Periodic thumbnail for filter strip ───────────────────────────────────
  useEffect(() => {
    if (!thumbCanvas.current) {
      thumbCanvas.current = document.createElement('canvas');
      thumbCanvas.current.width  = 120;
      thumbCanvas.current.height = 120;
    }
    const capture = () => {
      const vid = videoRef.current;
      const ctx = thumbCanvas.current!.getContext('2d')!;
      if (vid && vid.readyState >= 2) {
        ctx.drawImage(vid, 0, 0, 120, 120);
        setThumbDataUrl(thumbCanvas.current!.toDataURL('image/jpeg', 0.6));
      }
    };
    capture();
    const id = setInterval(capture, 2500);
    return () => clearInterval(id);
  }, []);

  // ── Capture photo to canvas ───────────────────────────────────────────────
  const doCapture = useCallback(() => {
    const vid = videoRef.current;
    const cvs = canvasRef.current;
    if (!vid || !cvs) return;

    cvs.width  = vid.videoWidth;
    cvs.height = vid.videoHeight;
    const ctx  = cvs.getContext('2d')!;

    ctx.filter = currentFilter.css === 'none' ? 'none' : currentFilter.css;
    ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
    ctx.filter = 'none';

    // Burn event name onto photo
    if (eventName.trim()) {
      const fontSize = Math.max(24, Math.floor(cvs.width / 22));
      ctx.font         = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign    = 'center';
      ctx.shadowColor  = 'rgba(0,0,0,0.75)';
      ctx.shadowBlur   = 12;
      ctx.fillStyle    = 'white';
      ctx.fillText(
        eventName.trim(),
        cvs.width / 2,
        cvs.height - fontSize * 1.4,
      );
    }

    const dataUrl = cvs.toDataURL('image/jpeg', 0.92);
    setPhotos(prev => [
      {
        id:         crypto.randomUUID(),
        dataUrl,
        filterName: currentFilter.name,
        timestamp:  Date.now(),
      },
      ...prev,
    ]);

    setFlashFrame(true);
    setTimeout(() => setFlashFrame(false), 350);
  }, [currentFilter, eventName]);

  // ── Shutter handler (with optional countdown) ─────────────────────────────
  const handleCapture = useCallback(() => {
    if (countdown !== null) return;
    if (timerEnabled) {
      let n = 3;
      setCountdown(n);
      const iv = setInterval(() => {
        n--;
        if (n <= 0) { clearInterval(iv); setCountdown(null); doCapture(); }
        else          setCountdown(n);
      }, 1000);
    } else {
      doCapture();
    }
  }, [countdown, timerEnabled, doCapture]);

  // ── Share / Download ──────────────────────────────────────────────────────
  const handleShare = async (photo: CapturedPhoto) => {
    try {
      const blob = await (await fetch(photo.dataUrl)).blob();
      const file = new File([blob], `event-photo-${photo.timestamp}.jpg`, { type: 'image/jpeg' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: eventName || 'Event Photo' });
        return;
      }
    } catch { /* fall through to download */ }
    handleDownload(photo);
  };

  const handleDownload = (photo: CapturedPhoto) => {
    const a   = document.createElement('a');
    a.href    = photo.dataUrl;
    a.download = `${eventName || 'event-photo'}-${photo.timestamp}.jpg`;
    a.click();
  };

  const handleDelete = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    setView('gallery');
    setSelectedPhoto(null);
  };

  // ── Permission error screens ───────────────────────────────────────────────
  if (permission === 'unsupported') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center p-8 gap-4">
        <CameraOff size={64} className="text-white/30" />
        <h2 className="text-2xl font-bold">Camera Not Supported</h2>
        <p className="text-white/50 max-w-xs">Your browser or device doesn't support camera access. Try Chrome or Safari on a modern device.</p>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center p-8 gap-4">
        <CameraOff size={64} className="text-red-400" />
        <h2 className="text-2xl font-bold">Camera Access Denied</h2>
        <p className="text-white/50 max-w-xs mb-2">Allow camera access in your browser settings, then try again.</p>
        <button
          onClick={() => { setPermission('prompt'); startStream(); }}
          className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Main app ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden select-none">
      <canvas ref={canvasRef} className="hidden" />

      {/* ════ CAMERA VIEW ════ */}
      {view === 'camera' && (
        <div className="relative h-screen flex flex-col">

          {/* Live video */}
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                filter:    currentFilter.css === 'none' ? undefined : currentFilter.css,
                transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
              }}
            />

            {/* White flash on capture */}
            <AnimatePresence>
              {flashFrame && (
                <motion.div
                  key="flash"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 bg-white pointer-events-none"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-4 pt-safe">
            {/* Event name badge */}
            {editingEvent ? (
              <input
                autoFocus
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                onBlur={() => setEditingEvent(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingEvent(false)}
                placeholder="Event name…"
                className="bg-black/50 backdrop-blur text-white placeholder-white/40 px-3 py-1.5 rounded-lg text-sm border border-white/25 outline-none w-44"
              />
            ) : (
              <button
                onClick={() => setEditingEvent(true)}
                className="bg-black/50 backdrop-blur text-white/80 px-3 py-1.5 rounded-lg text-sm border border-white/20 max-w-[44vw] truncate"
              >
                {eventName || '＋ Event name'}
              </button>
            )}

            {/* Icon controls */}
            <div className="flex gap-2">
              <ControlBtn
                active={timerEnabled}
                onClick={() => setTimerEnabled(v => !v)}
                title="Timer"
              >
                <Timer size={18} />
              </ControlBtn>
              <ControlBtn
                active={flashActive}
                onClick={() => setFlashActive(v => !v)}
                title="Flash"
              >
                {flashActive ? <Zap size={18} /> : <ZapOff size={18} />}
              </ControlBtn>
              <ControlBtn
                onClick={() => setFacingMode(m => m === 'environment' ? 'user' : 'environment')}
                title="Flip camera"
              >
                <RotateCcw size={18} />
              </ControlBtn>
            </div>
          </div>

          {/* Countdown overlay */}
          <AnimatePresence>
            {countdown !== null && (
              <motion.span
                key={countdown}
                initial={{ scale: 1.6, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{   scale: 0.6,  opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex items-center justify-center z-20 text-white font-black drop-shadow-lg pointer-events-none"
                style={{ fontSize: '22vw' }}
              >
                {countdown}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Bottom controls */}
          <div className="relative z-10 mt-auto pb-safe">

            {/* Filter strip */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-4">
              {FILTERS.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => setFilterIndex(i)}
                  className="flex-shrink-0 flex flex-col items-center gap-1"
                >
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl overflow-hidden border-2 transition-all',
                      filterIndex === i
                        ? 'border-white scale-105'
                        : 'border-transparent opacity-60',
                    )}
                  >
                    {thumbDataUrl ? (
                      <img
                        src={thumbDataUrl}
                        alt={f.name}
                        className="w-full h-full object-cover"
                        style={{ filter: f.css === 'none' ? undefined : f.css }}
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      filterIndex === i ? 'text-white' : 'text-white/50',
                    )}
                  >
                    {f.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Shutter row */}
            <div className="flex items-center justify-between px-10">

              {/* Gallery thumbnail */}
              <button
                onClick={() => setView('gallery')}
                className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white/30"
              >
                {photos[0] ? (
                  <img
                    src={photos[0].dataUrl}
                    alt="last photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <Images size={22} className="text-white/30" />
                  </div>
                )}
                {photos.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-black/70 text-white text-[9px] font-bold rounded px-1">
                    {photos.length}
                  </span>
                )}
              </button>

              {/* Shutter button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleCapture}
                disabled={countdown !== null || permission !== 'granted'}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center disabled:opacity-40"
              >
                <div className="w-[62px] h-[62px] rounded-full bg-white" />
              </motion.button>

              {/* Spacer */}
              <div className="w-14 h-14" />
            </div>
          </div>
        </div>
      )}

      {/* ════ GALLERY VIEW ════ */}
      {view === 'gallery' && (
        <div className="min-h-screen flex flex-col">
          <div className="flex items-center justify-between px-4 pt-safe pb-3">
            <span className="font-bold text-lg">
              {eventName || 'Photos'}{photos.length > 0 ? ` (${photos.length})` : ''}
            </span>
            <button
              onClick={() => setView('camera')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          {photos.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/30">
              <Images size={60} />
              <p>No photos yet — go take some!</p>
            </div>
          ) : (
            <div
              className="overflow-y-auto"
              style={{ height: 'calc(100vh - 72px)' }}
            >
              <div className="grid grid-cols-3 gap-0.5">
                {photos.map(photo => (
                  <motion.button
                    key={photo.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { setSelectedPhoto(photo); setView('preview'); }}
                    className="aspect-square overflow-hidden"
                  >
                    <img
                      src={photo.dataUrl}
                      alt="captured"
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════ PHOTO PREVIEW ════ */}
      {view === 'preview' && selectedPhoto && (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-safe pb-3">
            <button
              onClick={() => setView('gallery')}
              className="flex items-center gap-1 text-white/70 text-sm"
            >
              <ChevronLeft size={20} /> Gallery
            </button>
            <span className="text-white/50 text-xs">{selectedPhoto.filterName} filter</span>
            <button
              onClick={() => handleDelete(selectedPhoto.id)}
              className="w-9 h-9 rounded-full bg-red-500/20 flex items-center justify-center text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Photo */}
          <div className="flex-1 flex items-center justify-center px-4">
            <img
              src={selectedPhoto.dataUrl}
              alt="preview"
              className="max-w-full rounded-2xl shadow-2xl"
              style={{ maxHeight: '68vh', objectFit: 'contain' }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 px-6 pb-safe pt-4">
            <button
              onClick={() => handleDownload(selectedPhoto)}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 rounded-2xl py-4 font-semibold text-sm"
            >
              <Download size={18} /> Save
            </button>
            <button
              onClick={() => handleShare(selectedPhoto)}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black rounded-2xl py-4 font-bold text-sm"
            >
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Small helper ────────────────────────────────────────────────────────────

function ControlBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition-colors',
        active ? 'bg-yellow-400 text-black' : 'bg-black/50 text-white',
      )}
    >
      {children}
    </button>
  );
}
