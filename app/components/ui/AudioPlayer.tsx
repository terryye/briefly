"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
    audioUrl?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const audio = audioRef.current;

        const setAudioData = (): void => {
            if (audio && audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };

        const setAudioTime = (): void => {
            if (audio && !isDragging) {
                setCurrentTime(audio.currentTime);
            }
        };

        const handleEnded = (): void => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        if (audio) {
            // Try to set duration immediately if available
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
            }

            // Listen for multiple events that might provide duration
            audio.addEventListener("loadedmetadata", setAudioData);
            audio.addEventListener("loadeddata", setAudioData);
            audio.addEventListener("durationchange", setAudioData);
            audio.addEventListener("timeupdate", setAudioTime);
            audio.addEventListener("ended", handleEnded);

            return () => {
                audio.removeEventListener("loadedmetadata", setAudioData);
                audio.removeEventListener("loadeddata", setAudioData);
                audio.removeEventListener("durationchange", setAudioData);
                audio.removeEventListener("timeupdate", setAudioTime);
                audio.removeEventListener("ended", handleEnded);
            };
        }
    }, [isDragging]);

    const formatTime = (time: number): string => {
        if (isNaN(time)) return "00:00";

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    const handlePlayPause = (): void => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleRewind = (): void => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.currentTime = 0;
        setCurrentTime(0);
    };

    const calculateProgress = (e: React.MouseEvent<HTMLDivElement>): number => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const width = bounds.width;
        return Math.max(0, Math.min(1, x / width));
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        const audio = audioRef.current;
        if (!audio) return;

        const progress = calculateProgress(e);
        const newTime = progress * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        setIsDragging(true);
        handleProgressClick(e);
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent): void => {
            if (!isDragging || !progressRef.current) return;

            const bounds = progressRef.current.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const width = bounds.width;
            const progress = Math.max(0, Math.min(1, x / width));
            const newTime = progress * duration;
            setCurrentTime(newTime);
        },
        [isDragging, duration]
    );

    const handleMouseUp = useCallback((): void => {
        if (isDragging && audioRef.current) {
            audioRef.current.currentTime = currentTime;
        }
        setIsDragging(false);
    }, [isDragging, currentTime]);

    const handleSpeedChange = (speed: number): void => {
        if (audioRef.current) {
            audioRef.current.playbackRate = speed;
            setPlaybackSpeed(speed);
            setShowSpeedMenu(false);
        }
    };
    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const progressPercentage: number = duration
        ? (currentTime / duration) * 100
        : 0;

    return (
        <div className="rounded-xl shadow-sm p-2 max-w-4xl border border-neutral-content/50 w-full">
            <audio ref={audioRef} src={audioUrl} />

            <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                    className="w-12 h-12 flex items-center justify-center text-info  hover:cursor-pointer hover:text-info-content  transition-colors"
                    onClick={handlePlayPause}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                {/* Progress Section */}
                <div className="flex-1 flex items-center gap-4">
                    {/* Progress Bar with Thumb */}
                    <div className="flex-1 flex items-center gap-3">
                        <div
                            ref={progressRef}
                            className="relative flex-1 h-1 bg-primary-content rounded-full cursor-pointer group"
                            onMouseDown={handleMouseDown}
                            onClick={handleProgressClick}
                        >
                            <div
                                className="absolute top-0 left-0 h-full bg-info rounded-full pointer-events-none"
                                style={{ width: `${progressPercentage}%` }}
                            />
                            <div
                                className="absolute top-5/2 -translate-y-1/2 w-4 h-4 bg-info rounded-full shadow-md pointer-events-none"
                                style={{
                                    left: `${progressPercentage}%`,
                                    transform: "translate(-50%, -50%)",
                                }}
                            />
                        </div>
                    </div>

                    {/* Time Display */}
                    <div className="base-content text-sm font-medium tabular-nums">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>

                    {/* Rewind Button */}
                    <button
                        className="w-8 h-8 flex items-center justify-center text-info hover:text-info-content transition-colors"
                        onClick={handleRewind}
                        type="button"
                        aria-label="Restart"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                        </svg>
                    </button>

                    {/* Speed Control */}
                    <div className="relative">
                        <button
                            className="px-3 py-1 text-sm font-medium  text-info hover:text-info-content transition-colors"
                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                            type="button"
                        >
                            {playbackSpeed}x
                        </button>
                        {showSpeedMenu && (
                            <div className="absolute bottom-full mb-2 right-0 rounded-lg shadow-lg border border-info py-1 min-w-[80px] bg-base-100 ">
                                {[0.5, 0.75, 1, 1.25, 1.5].map((speed) => (
                                    <button
                                        key={speed}
                                        className="block w-full px-4 py-2 text-sm text-left text-info hover:text-info-content transition-colors"
                                        onClick={() => handleSpeedChange(speed)}
                                    >
                                        {speed}x
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Options Menu */}
                    <button
                        className="hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                        type="button"
                        aria-label="More options"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
