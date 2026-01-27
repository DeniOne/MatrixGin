import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';

interface UniversalVideoPlayerProps {
    src?: string;
    poster?: string;
    isRequired?: boolean;
    onCompleted?: () => void;
    title?: string;
}

export const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
    src,
    poster,
    isRequired = false,
    onCompleted,
    title
}) => {
    const playerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!playerRef.current) return;

        if (!document.fullscreenElement) {
            playerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isPlaying && showControls) {
            timeout = setTimeout(() => setShowControls(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [isPlaying, showControls]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        console.log(`[UniversalVideoPlayer] Active src: ${src}`);
        setError(false);
        setIsWaiting(true);
        setIsPlaying(false);
        setProgress(0);
    }, [src]);

    const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.duration && isFinite(videoRef.current.duration)) {
            const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            if (!isNaN(currentProgress)) {
                setProgress(currentProgress);
            }
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        if (onCompleted) onCompleted();
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = (Number(e.target.value) / 100) * (videoRef.current?.duration || 0);
        if (videoRef.current) videoRef.current.currentTime = time;
        setProgress(Number(e.target.value));
    };

    if (isRequired && !src) {
        return (
            <div className="aspect-video bg-red-50 border-2 border-dashed border-red-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-pulse">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-red-900 mb-2">Нарушение Методологии Обучения</h3>
                <p className="text-red-700 max-w-md">
                    Данный блок требует обязательного видео-дублирования (v2.2-canon).
                    Медиа-файл не найден в каноническом хранилище. Доступ заблокирован.
                </p>
            </div>
        );
    }

    if (!src) return null;

    return (
        <div
            ref={playerRef}
            className={`group relative aspect-video bg-black/5 overflow-hidden shadow-2xl border border-black/5 transition-all duration-300 ${isFullscreen ? 'rounded-0' : 'rounded-3xl'}`}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                muted={isMuted}
                className="w-full h-full object-contain bg-black"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onWaiting={() => setIsWaiting(true)}
                onPlaying={() => setIsWaiting(false)}
                onCanPlay={() => setIsWaiting(false)}
                onClick={togglePlay}
                onError={(e) => {
                    console.error(`[UniversalVideoPlayer] Error loading video: ${src}`, e);
                    setError(true);
                }}
            />

            {/* Buffering Spinner */}
            {isWaiting && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
            )}

            {/* Premium Overlay: Glassmorphism Controls */}
            <div className={`
                absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500
                ${showControls ? 'opacity-100' : 'opacity-0'}
            `}>
                {/* Center Play Button */}
                {!isPlaying && (
                    <button
                        onClick={togglePlay}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-transform shadow-2xl"
                    >
                        <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                    </button>
                )}

                {/* Bottom Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                    {/* Progress Bar */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={isNaN(progress) ? 0 : progress}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:h-2 transition-all"
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                            </button>
                            <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:scale-110 transition-transform">
                                <Volume2 className="w-6 h-6" />
                            </button>
                            <span className="text-white/80 text-sm font-medium tracking-tight">
                                {title || 'Admission Gate Video'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {isRequired && (
                                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-red-600 text-white rounded-sm">
                                    Required
                                </span>
                            )}
                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:scale-110 transition-transform"
                            >
                                <Maximize className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center text-[#030213] p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="font-medium">Ошибка загрузки медиа-потока</p>
                    <button onClick={() => window.location.reload()} className="mt-6 flex items-center text-xs font-medium uppercase tracking-widest text-indigo-600 hover:text-indigo-700">
                        <RotateCcw className="w-4 h-4 mr-2" /> Повторить попытку
                    </button>
                </div>
            )}
        </div>
    );
};
