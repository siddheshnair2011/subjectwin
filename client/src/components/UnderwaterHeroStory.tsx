import { useState, useEffect, useRef, useMemo } from "react";
import { Sparkles, ArrowRight, Mail, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

interface UnderwaterFrame {
  id: number;
  title: string;
  description: string;
  bgGradient: string;
  lightColor: string;
  waterDepth: number;
}

// Color mappings for light rays
const lightColorMap: Record<string, { rgb: string; hex: string }> = {
  blue: { rgb: "59, 130, 246", hex: "#3b82f6" },
  slate: { rgb: "100, 116, 139", hex: "#64748b" },
  purple: { rgb: "147, 51, 234", hex: "#9333ea" },
  indigo: { rgb: "79, 70, 229", hex: "#4f46e5" },
  cyan: { rgb: "34, 211, 238", hex: "#22d3ee" },
  emerald: { rgb: "16, 185, 129", hex: "#10b981" },
};

// Email inbox simulation
function EmailInboxSimulation({ opacity }: { opacity: number }) {
  const emails = [
    { subject: "Welcome to our store", open: false, lift: "?" },
    { subject: "Your order is ready", open: false, lift: "?" },
    { subject: "Limited time offer inside", open: false, lift: "?" },
    { subject: "Check out what's new", open: false, lift: "?" },
  ];

  return (
    <div className="space-y-2" style={{ opacity }}>
      {emails.map((email, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-all"
          style={{
            transform: `translateX(${Math.sin(i) * 10}px)`,
          }}
        >
          <Mail className="w-4 h-4 text-white/40" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/70 truncate">{email.subject}</p>
          </div>
          <span className="text-xs text-white/40 font-mono">{email.lift}</span>
        </div>
      ))}
    </div>
  );
}

// ChatGPT confusion simulation
function ConfusionSimulation({ opacity }: { opacity: number }) {
  const suggestions = [
    "Try something catchy!",
    "Make it exciting",
    "Add urgency",
    "Use emojis maybe?",
    "Be creative!",
  ];

  return (
    <div className="space-y-2" style={{ opacity }}>
      {suggestions.map((suggestion, i) => (
        <div
          key={i}
          className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 animate-pulse"
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{suggestion}</p>
          </div>
        </div>
      ))}
      <div className="text-xs text-red-300 mt-4 italic">No rankings. No context. No data.</div>
    </div>
  );
}

// SubjectWin discovery simulation
function DiscoverySimulation({ opacity }: { opacity: number }) {
  return (
    <div className="space-y-4" style={{ opacity }}>
      <div className="text-center space-y-2">
        <div className="inline-block p-3 rounded-full bg-emerald-500/20 border border-emerald-500/30">
          <Sparkles className="w-6 h-6 text-emerald-300" />
        </div>
        <p className="text-emerald-200 font-semibold">SubjectWin Discovered</p>
        <p className="text-sm text-white/60">Purpose-built for email optimization</p>
      </div>
    </div>
  );
}

// Brand profile input simulation
function BrandProfileSimulation({ opacity }: { opacity: number }) {
  return (
    <div className="space-y-3" style={{ opacity }}>
      <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
        <p className="text-xs text-blue-300 font-mono mb-1">Audience:</p>
        <p className="text-sm text-blue-100">Tech-savvy professionals, 25-45</p>
      </div>
      <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
        <p className="text-xs text-blue-300 font-mono mb-1">Industry:</p>
        <p className="text-sm text-blue-100">SaaS / Technology</p>
      </div>
      <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
        <p className="text-xs text-blue-300 font-mono mb-1">Tone:</p>
        <p className="text-sm text-blue-100">Professional yet conversational</p>
      </div>
    </div>
  );
}

// Variant results simulation
function VariantResultsSimulation({ opacity }: { opacity: number }) {
  const variants = [
    { text: "Spring Sale: 30% Off Tech", lift: "+4.2%" },
    { text: "Limited Time: Save on Your Favorites", lift: "+3.8%" },
    { text: "Exclusive Offer Inside", lift: "+3.1%" },
    { text: "Your Spring Refresh Awaits", lift: "+2.9%" },
    { text: "Don't Miss Out on Spring Deals", lift: "+2.4%" },
  ];

  return (
    <div className="space-y-2" style={{ opacity }}>
      {variants.map((v, i) => (
        <div key={i} className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-cyan-100">{v.text}</p>
            <span className="text-xs font-bold text-cyan-300">{v.lift}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Success simulation
function SuccessSimulation({ opacity }: { opacity: number }) {
  return (
    <div className="space-y-3" style={{ opacity }}>
      <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <p className="text-sm text-emerald-200 font-semibold">Campaign Sent</p>
        </div>
        <p className="text-xs text-emerald-300">50,000 subscribers reached</p>
      </div>
      <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <p className="text-sm text-emerald-200 font-semibold">Results Tracked</p>
        </div>
        <p className="text-xs text-emerald-300">+3.2% actual lift achieved</p>
      </div>
    </div>
  );
}

// Animated particle component
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

export default function UnderwaterHeroStory() {
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const frameHeight = 150;
    const newFrame = Math.min(Math.floor(scrollY / frameHeight), 5);
    
    if (newFrame !== lastFrameRef.current) {
      lastFrameRef.current = newFrame;
      setCurrentFrame(newFrame);
    }
  }, [scrollY]);

  const frames: UnderwaterFrame[] = [
    {
      id: 0,
      title: "Lost at Sea",
      description: "Emails drift without direction. No data. No clarity.",
      bgGradient: "linear-gradient(to bottom, #172554, #1e3a8a, #1e40af)",
      lightColor: "blue",
      waterDepth: 0,
    },
    {
      id: 1,
      title: "Searching for Direction",
      description: "ChatGPT offers generic advice. Confused currents pull you deeper.",
      bgGradient: "linear-gradient(to bottom, #1e3a8a, #1e293b, #0f172a)",
      lightColor: "slate",
      waterDepth: 1,
    },
    {
      id: 2,
      title: "The Light Emerges",
      description: "SubjectWin appears like bioluminescence. A purpose-built guide.",
      bgGradient: "linear-gradient(to bottom, #2d1b4e, #3730a3, #1e3a8a)",
      lightColor: "purple",
      waterDepth: 2,
    },
    {
      id: 3,
      title: "Swimming Toward the Light",
      description: "You share your brand context. SubjectWin learns your ecosystem.",
      bgGradient: "linear-gradient(to bottom, #3730a3, #312e81, #1e3a8a)",
      lightColor: "indigo",
      waterDepth: 3,
    },
    {
      id: 4,
      title: "Breaking Through",
      description: "10 ranked variants with predicted lift. Each one explained.",
      bgGradient: "linear-gradient(to bottom, #164e63, #0e7490, #1e3a8a)",
      lightColor: "cyan",
      waterDepth: 4,
    },
    {
      id: 5,
      title: "Into Clear Waters",
      description: "Track results. Learn from data. Thrive.",
      bgGradient: "linear-gradient(to bottom, #064e3b, #0d9488, #0e7490)",
      lightColor: "emerald",
      waterDepth: 5,
    },
  ];

  const currentFrameData = frames[currentFrame];
  const frameProgress = (scrollY % 150) / 150;

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

  // Simulation component opacity based on frame
  const getSimulationOpacity = (frameId: number) => {
    const diff = Math.abs(currentFrame - frameId);
    return diff === 0 ? 1 : diff === 1 ? 0.3 : 0;
  };

  // Get light color RGB for dynamic styling
  const lightColorRGB = lightColorMap[currentFrameData.lightColor].rgb;

  return (
    <>
      {/* Fixed hero background */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-500 pointer-events-none"
        style={{
          background: currentFrameData.bgGradient,
          height: "100vh",
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <Particle key={p.id} {...p} />
          ))}
        </div>

        {/* Parallax light rays */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "25%",
              width: "4px",
              height: "100%",
              background: `linear-gradient(to bottom, rgba(${lightColorRGB}, 0.3), transparent)`,
              filter: "blur(40px)",
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: "33%",
              width: "4px",
              height: "100%",
              background: `linear-gradient(to bottom, rgba(${lightColorRGB}, 0.2), transparent)`,
              filter: "blur(40px)",
              transform: `translateY(${scrollY * 0.2}px)`,
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

        {/* Hero content - centered in viewport */}
        <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-full h-screen flex items-center justify-center px-4">
            <div className="max-w-2xl w-full space-y-8">
              {/* Progress indicator */}
              <div className="flex justify-center gap-2">
                {frames.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      height: "4px",
                      borderRadius: "9999px",
                      transition: "all 300ms",
                      background: idx <= currentFrame 
                        ? `rgba(${lightColorRGB}, 0.8)` 
                        : "rgba(255, 255, 255, 0.2)",
                      width: idx <= currentFrame ? "32px" : "16px",
                    }}
                  />
                ))}
              </div>

              {/* Title and description */}
              <div className="text-center space-y-4">
                <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                  {currentFrameData.title}
                </h2>
                <p className="text-lg text-white/70">
                  {currentFrameData.description}
                </p>
              </div>

              {/* Visual simulations */}
              <div className="max-w-sm mx-auto">
                <EmailInboxSimulation opacity={getSimulationOpacity(0)} />
                <ConfusionSimulation opacity={getSimulationOpacity(1)} />
                <DiscoverySimulation opacity={getSimulationOpacity(2)} />
                <BrandProfileSimulation opacity={getSimulationOpacity(3)} />
                <VariantResultsSimulation opacity={getSimulationOpacity(4)} />
                <SuccessSimulation opacity={getSimulationOpacity(5)} />
              </div>

              {/* Scroll indicator */}
              <div className="flex justify-center items-center gap-2 text-white/60 text-sm pt-8">
                <div className="animate-bounce">↓</div>
                <span>Scroll to dive deeper</span>
                <div className="animate-bounce" style={{ animationDelay: "0.2s" }}>↓</div>
              </div>
            </div>
          </div>
        </div>

        {/* Depth meter on the side */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4 pointer-events-none">
          <div className="text-white/40 text-sm font-mono">DEPTH</div>
          <div className="h-64 w-1 bg-white/10 rounded-full overflow-hidden">
            <div
              style={{
                width: "100%",
                height: `${(currentFrame / 5) * 100}%`,
                background: `linear-gradient(to bottom, rgba(${lightColorRGB}, 0.8), rgba(${lightColorRGB}, 1))`,
                transition: "all 300ms",
              }}
            />
          </div>
          <div className="text-white/40 text-sm font-mono">{currentFrame + 1}/6</div>
        </div>
      </div>

      {/* Content sections that scroll over the hero */}
      <div ref={containerRef} className="relative z-20 bg-background">
        {/* Spacer to allow scrolling through hero frames */}
        <div className="h-[900px]" />

        {/* Statistics section */}
        <section className="py-20 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">3-5%</div>
                <p className="text-slate-600">Average lift in open rates</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">10</div>
                <p className="text-slate-600">Ranked subject variants</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">&lt;30s</div>
                <p className="text-slate-600">Generation time</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-slate-600">Explainable AI</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of content sections */}
        <section className="py-20 px-4 bg-white">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Why SubjectWin Beats ChatGPT</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-lg mb-3 text-blue-900">SubjectWin</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>✓ Purpose-built for email optimization</li>
                  <li>✓ Understands your brand context</li>
                  <li>✓ Ranks variants by predicted lift</li>
                  <li>✓ Explains every recommendation</li>
                  <li>✓ Tracks actual vs predicted performance</li>
                </ul>
              </div>
              <div className="p-6 rounded-lg bg-red-50 border border-red-200">
                <h3 className="font-bold text-lg mb-3 text-red-900">ChatGPT</h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>✗ Generic writing assistant</li>
                  <li>✗ No brand context awareness</li>
                  <li>✗ No ranking or prioritization</li>
                  <li>✗ No explainability</li>
                  <li>✗ No performance tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 px-4 bg-slate-900 text-white">
          <div className="container max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to master email?</h2>
            <p className="text-lg text-slate-300">
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
        </section>
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
      `}</style>
    </>
  );
}
