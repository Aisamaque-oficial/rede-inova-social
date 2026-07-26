"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Loader2, CameraOff, X } from "lucide-react";

interface FacialNavigationProps {
  onClose: () => void;
}

export default function FacialNavigation({ onClose }: FacialNavigationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameId = useRef<number>(0);
  const lastVideoTime = useRef<number>(-1);
  const lastBlinkTime = useRef<number>(0);

  // Constants for blink detection
  const BLINK_THRESHOLD = 0.22; // EAR threshold
  const BLINK_COOLDOWN = 800; // ms between clicks

  // Cursor state
  const cursorPos = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const baseNosePos = useRef<{ x: number; y: number } | null>(null);

  // Initialize MediaPipe
  useEffect(() => {
    let active = true;

    async function initModel() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        
        if (!active) return;

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });

        if (!active) {
          landmarker.close();
          return;
        }

        faceLandmarkerRef.current = landmarker;
        setIsModelLoading(false);
        startCamera();
      } catch (err: any) {
        console.error("Failed to load FaceLandmarker", err);
        setError("Erro ao carregar o modelo de Inteligência Artificial.");
      }
    }

    initModel();

    return () => {
      active = false;
      stopCamera();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", predictWebcam);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const calculateEAR = (landmarks: any[], eyeIndices: number[]) => {
    const p1 = landmarks[eyeIndices[0]];
    const p2 = landmarks[eyeIndices[1]];
    const p3 = landmarks[eyeIndices[2]];
    const p4 = landmarks[eyeIndices[3]];
    const p5 = landmarks[eyeIndices[4]];
    const p6 = landmarks[eyeIndices[5]];

    const dist = (a: any, b: any) => Math.hypot(a.x - b.x, a.y - b.y);

    const vertical1 = dist(p2, p6);
    const vertical2 = dist(p3, p5);
    const horizontal = dist(p1, p4);

    return (vertical1 + vertical2) / (2.0 * horizontal);
  };

  const simulateClick = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y);
    if (el) {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursorRef.current.style.backgroundColor = "rgba(16, 185, 129, 0.8)";
        setTimeout(() => {
          if (cursorRef.current) {
            cursorRef.current.style.transform = "translate(-50%, -50%) scale(1)";
            cursorRef.current.style.backgroundColor = "rgba(14, 165, 233, 0.8)";
          }
        }, 300);
      }

      const mouseEvents = ['mousedown', 'mouseup', 'click'];
      mouseEvents.forEach((type) => {
        const ev = new MouseEvent(type, {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y
        });
        el.dispatchEvent(ev);
      });
      
      if (el instanceof HTMLElement) {
        el.focus();
      }
    }
  };

  const predictWebcam = () => {
    if (!videoRef.current || !faceLandmarkerRef.current) return;

    const video = videoRef.current;
    let startTimeMs = performance.now();

    if (video.currentTime !== lastVideoTime.current) {
      lastVideoTime.current = video.currentTime;
      const results = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];

        // 1. Rastreamento do Cursor pelo Nariz (Landmark 4)
        const nose = landmarks[4];
        
        if (!baseNosePos.current) {
          baseNosePos.current = { x: nose.x, y: nose.y };
        }

        const sensitivityX = 3.0;
        const sensitivityY = 3.5;
        
        const dx = (baseNosePos.current.x - nose.x) * sensitivityX; 
        const dy = (nose.y - baseNosePos.current.y) * sensitivityY;

        let targetX = (window.innerWidth / 2) + (dx * window.innerWidth);
        let targetY = (window.innerHeight / 2) + (dy * window.innerHeight);

        targetX = Math.max(0, Math.min(window.innerWidth, targetX));
        targetY = Math.max(0, Math.min(window.innerHeight, targetY));

        cursorPos.current.x += (targetX - cursorPos.current.x) * 0.3;
        cursorPos.current.y += (targetY - cursorPos.current.y) * 0.3;

        if (cursorRef.current) {
          cursorRef.current.style.left = `${cursorPos.current.x}px`;
          cursorRef.current.style.top = `${cursorPos.current.y}px`;
        }

        // Auto-scroll
        const edgeMargin = 100;
        const scrollSpeed = 15;
        if (cursorPos.current.y < edgeMargin) {
          window.scrollBy(0, -scrollSpeed);
        } else if (cursorPos.current.y > window.innerHeight - edgeMargin) {
          window.scrollBy(0, scrollSpeed);
        }

        // 2. Detecção de Piscar para Click
        const leftEyeIndices = [33, 160, 158, 133, 153, 144];
        const rightEyeIndices = [362, 385, 387, 263, 373, 380];

        const leftEAR = calculateEAR(landmarks, leftEyeIndices);
        const rightEAR = calculateEAR(landmarks, rightEyeIndices);
        const avgEAR = (leftEAR + rightEAR) / 2.0;

        if (avgEAR < BLINK_THRESHOLD) {
          const now = Date.now();
          if (now - lastBlinkTime.current > BLINK_COOLDOWN) {
            simulateClick(cursorPos.current.x, cursorPos.current.y);
            lastBlinkTime.current = now;
          }
        }
      } else {
        baseNosePos.current = null;
      }
    }

    animationFrameId.current = requestAnimationFrame(predictWebcam);
  };

  const handleRecalibrate = () => {
    baseNosePos.current = null;
  };

  return (
    <>
      <video ref={videoRef} autoPlay playsInline className="hidden" />

      <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm animate-in slide-in-from-bottom-5">
        {isModelLoading ? (
          <>
            <Loader2 className="animate-spin text-primary w-6 h-6" />
            <div className="flex-1">
              <p className="font-bold text-sm">Carregando IA...</p>
              <p className="text-xs text-slate-400">Preparando rastreamento facial</p>
            </div>
          </>
        ) : error ? (
          <>
            <CameraOff className="text-red-500 w-6 h-6" />
            <div className="flex-1">
              <p className="font-bold text-sm text-red-400">Erro</p>
              <p className="text-xs text-slate-400">{error}</p>
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="w-12 h-12 bg-slate-800 rounded-full overflow-hidden flex items-center justify-center border-2 border-primary">
                <video 
                  ref={(ref) => {
                    if (ref && videoRef.current) ref.srcObject = videoRef.current.srcObject;
                  }}
                  autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" 
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
            </div>
            
            <div className="flex-1">
              <p className="font-bold text-sm leading-tight mb-1">Navegação Facial Ativa</p>
              <p className="text-[10px] text-slate-400 leading-tight">
                Mova a cabeça para controlar o cursor.<br/>
                Piscar para clicar.
              </p>
              <button onClick={handleRecalibrate} className="mt-2 text-[10px] text-primary hover:underline font-bold">
                Recalibrar Centro
              </button>
            </div>
          </>
        )}

        <button onClick={onClose} className="absolute -top-2 -right-2 w-7 h-7 bg-slate-700 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      {!isModelLoading && !error && (
        <div
          ref={cursorRef}
          className="fixed z-[10000] w-6 h-6 bg-sky-500/80 rounded-full pointer-events-none transition-transform shadow-[0_0_15px_rgba(14,165,233,0.5)] border-2 border-white/50"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', transition: 'transform 0.1s ease-out, background-color 0.2s' }}
        >
          <div className="absolute inset-0 rounded-full animate-ping bg-sky-400/30" />
        </div>
      )}
    </>
  );
}
