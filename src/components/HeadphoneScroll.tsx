"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useSpring, useMotionValueEvent } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const TOTAL_FRAMES = 80;
const IMAGE_BASE_PATH = "/images/headphone-sequence/Smoothly_transition_from_202601111258_";
const IMAGE_EXTENSION = ".jpg";
const AUDIO_PATH = "/scroll-audio.mp3";

export default function HeadphoneScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll progress for more fluid animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [duration, setDuration] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // Audio initialization
  useEffect(() => {
    const audio = new Audio(AUDIO_PATH);
    audio.loop = false; // We sync to scroll, so no need for loop
    audio.volume = 0.5;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Handle audio playback on interaction
  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.play().catch(e => console.error("Audio playback blocked", e));
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
    setHasInteracted(true);
  };

  // Start audio on first scroll if not muted and not already playing
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (audioRef.current && !isMuted && duration > 0) {
      // Sync audio time to scroll progress
      const targetTime = latest * duration;

      // Update audio time
      audioRef.current.currentTime = targetTime;

      // Handle play/pause state for smooth scrubbing feel
      if (!isScrolling) {
        setIsScrolling(true);
        audioRef.current.play().catch(() => {
          // Ignore play errors (usually browser blocks)
        });
      }

      // Reset scroll timeout
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        if (audioRef.current) audioRef.current.pause();
      }, 100);
    }

    if (latest > 0 && !hasInteracted) {
      setHasInteracted(true);
    }
  });

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preloadImages = async () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        const index = i.toString().padStart(3, "0");
        img.src = `${IMAGE_BASE_PATH}${index}${IMAGE_EXTENSION}`;
        img.onload = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          if (loadedCount === TOTAL_FRAMES) {
            setImages(loadedImages);
            setIsLoading(false);
          }
        };
        loadedImages[i] = img;
      }
    };

    preloadImages();
  }, []);

  // Update canvas
  useEffect(() => {
    const render = () => {
      if (!canvasRef.current || images.length === 0) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const currentFrame = Math.floor(frameIndex.get());
      const img = images[currentFrame];

      if (img) {
        // Clear canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Immersive "cover" logic
        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;
        const imgWidth = img.width;
        const imgHeight = img.height;

        const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const nw = imgWidth * ratio;
        const nh = imgHeight * ratio;
        const nx = (canvasWidth - nw) / 2;
        const ny = (canvasHeight - nh) / 2;

        ctx.drawImage(img, nx, ny, nw, nh);
      }
    };

    const unsubscribe = frameIndex.on("change", render);
    render();

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
        canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
        render();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [images, frameIndex]);

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
            <motion.div
              className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <p className="mt-6 text-white/40 font-medium tracking-[0.2em] text-[10px] uppercase">
              Initializing Zenith X ({progress}%)
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Sound Toggle */}
        <div className="absolute bottom-10 right-10 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSound}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 transition-colors pointer-events-auto"
          >
            {isMuted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
            <span className="text-[10px] uppercase tracking-widest font-bold text-white">
              {isMuted ? "Sound Off" : "Sound On"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Text Overlays - Apple-like fluid motion */}
      <div className="absolute inset-0 pointer-events-none px-6 md:px-0">
        {/* 0% Scroll */}
        <Section progress={scrollYProgress} range={[0, 0.2]}>
          <motion.div className="text-center w-full max-w-[100vw] px-4 text-white">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-tight">
              Zenith X
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/60 mt-4 md:mt-8 font-light tracking-tight max-w-sm mx-auto">
              A new era of sonic purity.
            </p>
          </motion.div>
        </Section>

        {/* 30% Scroll */}
        <Section progress={scrollYProgress} range={[0.25, 0.45]} align="left">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-xl mb-[25vh] md:mb-0 text-white">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Engineered <br />to disappear.
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-white/50 mt-4 md:mt-10 leading-relaxed font-light">
              We stripped away everything but the sound. Every material serves one purpose: uncompromised fidelity.
            </p>
          </div>
        </Section>

        {/* 60% Scroll */}
        <Section progress={scrollYProgress} range={[0.55, 0.75]} align="right">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-xl text-right mt-[25vh] md:mt-0 text-white">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Internal <br />Mastery.
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-white/50 mt-4 md:mt-10 leading-relaxed font-light">
              Titanium drivers and adaptive noise cancellation work in perfect harmony.
            </p>
          </div>
        </Section>

        {/* 90% Scroll */}
        <Section progress={scrollYProgress} range={[0.85, 1]}>
          <div className="text-center w-full max-w-[100vw] px-4 text-white">
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 md:mb-16 leading-tight">
              The future <br />is here.
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 md:px-12 py-3.5 md:py-5 bg-white text-black font-semibold rounded-full text-sm md:text-lg hover:bg-zinc-200 transition-colors pointer-events-auto"
            >
              Order from $549
            </motion.button>
            <p className="mt-4 md:mt-8 text-white/40 text-[9px] md:text-xs tracking-wider uppercase">Available in Cosmic Black and Silver.</p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  children,
  progress,
  range,
  align = "center"
}: {
  children: React.ReactNode;
  progress: any;
  range: [number, number];
  align?: "left" | "right" | "center";
}) {
  const opacity = useTransform(progress, [range[0], (range[0] + range[1]) / 2, range[1]], [0, 1, 0]);
  const y = useTransform(progress, [range[0], (range[0] + range[1]) / 2, range[1]], [20, 0, -20]);
  const scale = useTransform(progress, [range[0], (range[0] + range[1]) / 2, range[1]], [0.98, 1, 1.02]);

  const alignmentClasses = {
    left: "items-start px-6 sm:pl-10 md:pl-20 lg:pl-32 justify-center pb-[30vh] md:pb-0",
    right: "items-end px-6 sm:pr-10 md:pr-20 lg:pr-32 justify-center pt-[30vh] md:pt-0",
    center: "items-center justify-center",
  };

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`absolute inset-0 flex flex-col ${alignmentClasses[align]}`}
    >
      {children}
    </motion.div>
  );
}
