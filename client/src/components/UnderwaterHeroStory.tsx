import { useEffect, useState, useRef, useMemo } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

interface UnderwaterFrame {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  bgColor: string;
  lightColor: string;
  waterDepth: number;
  scrollStart: number;
  scrollEnd: number;
}

// Animated particle component for underwater effect
function Particle({ 
  x, 
  y, 
  size, 
  opacity, 
  duration 
}: { 
  x: number; 
  y: number; 
  size: number; 
  opacity: number; 
  duration: number 
}) {
  return (
    <div
      className="absolute rounded-full bg-white/30 blur-sm"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        animation: `float ${duration}s infinite ease-in-out`,
      }}
    />
  );
}

// Animated fish/creature
function SwimmingCreature({ 
  scrollProgress, 
  direction = "right" 
}: { 
  scrollProgress: number; 
  direction?: "left" | "right" 
}) {
  const offset = direction === "right" ? scrollProgress * 200 : -scrollProgress * 200;
  const wobble = Math.sin(scrollProgress * Math.PI * 4) * 20;

  return (
    <div
      className="absolute text-6xl transition-all duration-300"
      style={{
        transform: `translateX(${offset}px) translateY(${wobble}px) ${direction === "left" ? "scaleX(-1)" : ""}`,
      }}
    >
      🐠
    </div>
  );
}

export default function UnderwaterHeroStory() {
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use a ref to track the last frame to prevent unnecessary updates
  const lastFrameRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update current frame only when it actually changes
  useEffect(() => {
    const frameHeight = 150;
    const newFrame = Math.min(Math.floor(scrollY / frameHeight), 5);
    
    // Only update state if frame actually changed
    if (newFrame !== lastFrameRef.current) {
      lastFrameRef.current = newFrame;
      setCurrentFrame(newFrame);
    }
  }, [scrollY]);

  const frames: UnderwaterFrame[] = [
    {
      id: 0,
      title: "Lost at Sea",
      subtitle: "Diving into the unknown depths",
      description: "You're swimming blind in the vast ocean. Every subject line feels like a random direction in the darkness.",
      bgColor: "from-blue-950 via-blue-900 to-blue-800",
      lightColor: "blue",
      waterDepth: 0,
      scrollStart: 0,
      scrollEnd: 150,
    },
    {
      id: 1,
      title: "Searching for Direction",
      subtitle: "Confused currents pull you deeper",
      description: "ChatGPT offers generic advice. No context. No rankings. You're spinning in circles, lost in the murky water.",
      bgColor: "from-blue-900 via-slate-900 to-slate-800",
      lightColor: "slate",
      waterDepth: 1,
      scrollStart: 150,
      scrollEnd: 300,
    },
    {
      id: 2,
      title: "The Light Emerges",
      subtitle: "A glimmer breaks through the darkness",
      description: "SubjectWin appears like bioluminescence in the deep. A guide specifically designed for your journey.",
      bgColor: "from-purple-950 via-purple-900 to-blue-900",
      lightColor: "purple",
      waterDepth: 2,
      scrollStart: 300,
      scrollEnd: 450,
    },
    {
      id: 3,
      title: "Swimming Toward the Light",
      subtitle: "The water grows clearer, warmer",
      description: "You share your brand context, audience, and campaign details. SubjectWin learns your ecosystem.",
      bgColor: "from-indigo-950 via-indigo-900 to-blue-900",
      lightColor: "indigo",
      waterDepth: 3,
      scrollStart: 450,
      scrollEnd: 600,
    },
    {
      id: 4,
      title: "Breaking Through",
      subtitle: "The surface is within reach",
      description: "SubjectWin generates 10 ranked variants with predicted lift scores. Each one explained. No mysteries.",
      bgColor: "from-cyan-950 via-cyan-900 to-blue-900",
      lightColor: "cyan",
      waterDepth: 4,
      scrollStart: 600,
      scrollEnd: 750,
    },
    {
      id: 5,
      title: "Into Clear Waters",
      subtitle: "You've reached the sunlit shallows",
      description: "Track results, learn from data, and improve every campaign. You're no longer lost. You're thriving.",
      bgColor: "from-emerald-950 via-teal-900 to-cyan-900",
      lightColor: "emerald",
      waterDepth: 5,
      scrollStart: 750,
      scrollEnd: 900,
    },
  ];

  const currentFrameData = frames[currentFrame];
  const progress = Math.min(scrollY / 900, 1);
  const frameProgress = (scrollY % 150) / 150;

  // Memoize particles to prevent unnecessary recalculations
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: (i * 7 + scrollY * 0.1) % 100,
      y: (i * 6 + scrollY * 0.05) % 100,
      size: 2 + (i % 3),
      opacity: 0.3 + Math.sin(scrollY * 0.01 + i) * 0.2,
      duration: 8 + (i % 4) * 2,
    }));
  }, [scrollY]);

  return (
    <section 
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden bg-gradient-to-b ${currentFrameData.bgColor} transition-all duration-500`}
    >
      {/* Animated background particles (bubbles) */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* Parallax light rays */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div
          className={`absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-${currentFrameData.lightColor}-300 to-transparent blur-xl`}
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div
          className={`absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-${currentFrameData.lightColor}-200 to-transparent blur-xl`}
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />
        <div
          className={`absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-${currentFrameData.lightColor}-300 to-transparent blur-xl`}
          style={{
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        />
      </div>

      {/* Depth fog effect */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 pointer-events-none"
        style={{
          opacity: 0.2 + currentFrame * 0.1,
        }}
      />

      {/* Swimming creatures */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <SwimmingCreature scrollProgress={frameProgress} direction="right" />
        <SwimmingCreature scrollProgress={frameProgress * 0.7} direction="left" />
      </div>

      {/* Content container */}
      <div className="relative z-10 container max-w-5xl mx-auto h-screen flex items-center justify-center px-4">
        <div className="space-y-8 text-center max-w-2xl">
          {/* Progress indicator */}
          <div className="flex justify-center gap-2">
            {frames.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx <= currentFrame
                    ? `bg-${currentFrameData.lightColor}-400 w-8`
                    : "bg-white/20 w-4"
                }`}
              />
            ))}
          </div>

          {/* Animated title */}
          <div
            className="space-y-3 animate-in fade-in duration-700"
            style={{
              opacity: Math.max(0, 1 - Math.abs(frameProgress - 0.5) * 2),
              transform: `translateY(${Math.sin(frameProgress * Math.PI) * 20}px)`,
            }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              {currentFrameData.title}
            </h2>
            <p className={`text-xl text-${currentFrameData.lightColor}-200 font-semibold`}>
              {currentFrameData.subtitle}
            </p>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              {currentFrameData.description}
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center items-center gap-2 text-white/60 text-sm pt-8">
            <div className="animate-bounce">↓</div>
            <span>Scroll to dive deeper</span>
            <div className="animate-bounce" style={{ animationDelay: "0.2s" }}>↓</div>
          </div>
        </div>

        {/* Depth meter on the side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
          <div className="text-white/40 text-sm font-mono">DEPTH</div>
          <div className="h-64 w-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`w-full bg-gradient-to-b from-${currentFrameData.lightColor}-400 to-${currentFrameData.lightColor}-600 transition-all duration-300`}
              style={{
                height: `${(currentFrame / 5) * 100}%`,
              }}
            />
          </div>
          <div className="text-white/40 text-sm font-mono">{currentFrame + 1}/6</div>
        </div>
      </div>

      {/* Final CTA - appears at the end */}
      <div
        className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 pointer-events-none ${
          currentFrame >= 5 ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
      >
        <div className="text-center space-y-6 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span className="text-sm font-medium text-white">You've Arrived</span>
          </div>

          <h3 className="text-4xl font-bold text-white drop-shadow-lg">
            Ready to master email?
          </h3>

          <p className="text-white/80 max-w-xl mx-auto text-lg">
            Start your SubjectWin journey free. No credit card required. 2 analyses per month to prove the value.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href={isAuthenticated ? "/dashboard/new-analysis" : getLoginUrl()}>
              <Button size="lg" className="gap-2 bg-white text-slate-900 hover:bg-white/90">
                Begin Your Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.6;
          }
        }

        @keyframes swim {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(10px) translateY(-5px);
          }
          50% {
            transform: translateX(20px) translateY(0);
          }
          75% {
            transform: translateX(10px) translateY(5px);
          }
        }
      `}</style>
    </section>
  );
}
