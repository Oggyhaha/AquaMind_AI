import React, { useEffect, useState } from 'react';
import { Cpu, Globe, Activity, CheckCircle2, ShieldCheck, Waves } from 'lucide-react';

export interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2500; // 2.5 seconds duration

    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const currentProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(currentProgress);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        // Fade out transition
        setIsFadingOut(true);
        const fadeTimer = setTimeout(() => {
          setIsFinished(true);
          onComplete();
        }, 400); // 400ms fade transition
        return () => clearTimeout(fadeTimer);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [onComplete]);

  // Determine current status message and icon based on progress percentage
  const getStatusInfo = () => {
    if (progress < 25) {
      return {
        text: 'Initializing AI Agents...',
        icon: <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />,
      };
    } else if (progress < 55) {
      return {
        text: 'Loading GIS Telemetry...',
        icon: <Globe className="w-4 h-4 text-sky-400 animate-spin-slow" />,
      };
    } else if (progress < 85) {
      return {
        text: 'Connecting to Water Grid...',
        icon: <Activity className="w-4 h-4 text-blue-400 animate-pulse" />,
      };
    } else {
      return {
        text: 'Ready.',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      };
    }
  };

  if (isFinished) {
    return null;
  }

  const statusInfo = getStatusInfo();
  const roundedProgress = Math.round(progress);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-slate-100 overflow-hidden transition-opacity duration-400 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Inline styles for custom keyframe animations */}
      <style>{`
        @keyframes float-droplet-1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.08); }
        }
        @keyframes float-droplet-2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(25px) scale(0.92); }
        }
        @keyframes float-droplet-3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(15px); }
        }
        @keyframes float-droplet-4 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(18px) translateX(-12px); }
        }
        @keyframes logo-glow-pulse {
          0%, 100% {
            box-shadow: 0 0 25px rgba(6, 182, 212, 0.4), 0 0 50px rgba(14, 165, 233, 0.2);
          }
          50% {
            box-shadow: 0 0 45px rgba(6, 182, 212, 0.8), 0 0 90px rgba(59, 130, 246, 0.5);
          }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: rotate-slow 6s linear infinite;
        }
        .animate-logo-pulse {
          animation: logo-glow-pulse 2s ease-in-out infinite;
        }
        .animate-droplet-1 {
          animation: float-droplet-1 4s ease-in-out infinite;
        }
        .animate-droplet-2 {
          animation: float-droplet-2 5s ease-in-out infinite 0.5s;
        }
        .animate-droplet-3 {
          animation: float-droplet-3 4.5s ease-in-out infinite 1s;
        }
        .animate-droplet-4 {
          animation: float-droplet-4 5.5s ease-in-out infinite 1.5s;
        }
      `}</style>

      {/* Floating background water droplet particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Droplet 1 - Top Left glowing sphere */}
        <div className="absolute top-[18%] left-[15%] w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl animate-droplet-1" />
        
        {/* Droplet 2 - Bottom Right glowing sphere */}
        <div className="absolute bottom-[20%] right-[15%] w-48 h-48 rounded-full bg-blue-600/15 blur-3xl animate-droplet-2" />
        
        {/* Droplet 3 - Middle Right small water droplet */}
        <div className="absolute top-[35%] right-[22%] w-12 h-12 rounded-full bg-cyan-400/20 blur-md border border-cyan-300/30 flex items-center justify-center animate-droplet-3">
          <div className="w-4 h-4 rounded-full bg-cyan-300/40 blur-xs" />
        </div>

        {/* Droplet 4 - Lower Left small water droplet */}
        <div className="absolute bottom-[30%] left-[20%] w-16 h-16 rounded-full bg-sky-500/15 blur-lg border border-sky-400/20 animate-droplet-4">
          <div className="w-5 h-5 rounded-full bg-sky-200/30 blur-xs m-auto mt-2" />
        </div>

        {/* Concentric subtle grid rings background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-cyan-500/10 pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        
        {/* Branded Logo Container with Pulsing Glow Animation */}
        <div className="relative mb-6 group">
          {/* Animated Glow Backdrop */}
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 opacity-60 blur-xl animate-pulse" />
          
          {/* Main Logo Image */}
          <div className="relative rounded-2xl p-1 bg-slate-900 border border-cyan-500/40 shadow-2xl animate-logo-pulse">
            <img
              src="/logo.jpg"
              alt="AquaMind AI Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-inner"
            />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent drop-shadow-sm mb-1">
          AquaMind AI
        </h1>
        
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-cyan-300/80 uppercase mb-8 flex items-center gap-1.5 justify-center">
          <Waves className="w-3.5 h-3.5 text-cyan-400 inline" />
          Enterprise Water Intelligence OS
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xs sm:max-w-sm mb-4">
          <div className="flex justify-between items-center text-xs font-mono mb-2 px-0.5">
            <span className="text-slate-400 font-medium">System Initialization</span>
            <span className="text-cyan-400 font-bold">{roundedProgress}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-cyan-500/30 shadow-inner relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 rounded-full transition-all duration-75 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer light effect overlay on progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Rotating Status Message */}
        <div className="h-8 flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-sm">
          {statusInfo.icon}
          <span className="text-xs font-medium text-slate-300 tracking-wide">
            {statusInfo.text}
          </span>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-12 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/70" />
          <span>Encrypted Node Sync • State Water Authority</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
