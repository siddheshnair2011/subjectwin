import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

interface StoryFrame {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  visual: React.ReactNode;
  scrollStart: number;
  scrollEnd: number;
}

export default function HeroStory() {
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine which story frame we're in
  useEffect(() => {
    const frameHeight = 150;
    const newFrame = Math.min(Math.floor(scrollY / frameHeight), 5);
    setCurrentFrame(newFrame);
  }, [scrollY]);

  const frames: StoryFrame[] = [
    {
      id: 0,
      title: "Lost at Sea",
      subtitle: "Your emails drift without direction",
      description: "Every subject line feels like a guess. You send campaigns hoping they'll land, but you never know what works.",
      visual: (
        <div className="relative w-full h-64 bg-gradient-to-b from-blue-900/20 to-blue-950/40 rounded-lg overflow-hidden">
          {/* Water waves */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
              <defs>
                <pattern id="waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0,50 Q25,30 50,50 T100,50" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-400" />
                </pattern>
              </defs>
              <rect width="1000" height="400" fill="url(#waves)" />
            </svg>
          </div>

          {/* Boat (email) drifting */}
          <div 
            className="absolute left-1/4 top-1/3 transition-all duration-500"
            style={{ 
              transform: `translateX(${Math.sin(scrollY / 100) * 20}px) translateY(${Math.cos(scrollY / 100) * 10}px)`,
              opacity: currentFrame === 0 ? 1 : 0.3
            }}
          >
            <div className="text-4xl">⛵</div>
          </div>

          {/* Storm clouds */}
          <div className="absolute top-0 right-0 text-6xl opacity-40">☁️</div>
          <div className="absolute top-4 right-20 text-5xl opacity-30">☁️</div>
        </div>
      ),
      scrollStart: 0,
      scrollEnd: 150,
    },
    {
      id: 1,
      title: "Searching for Direction",
      subtitle: "You try ChatGPT, but it's like asking a sailor who's never seen an ocean",
      description: "Generic suggestions that don't understand your audience. No rankings. No predictions. Just guesses.",
      visual: (
        <div className="relative w-full h-64 bg-gradient-to-b from-amber-900/20 to-amber-950/40 rounded-lg overflow-hidden">
          {/* Compass rose */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-300" />
                <line x1="50" y1="10" x2="50" y2="30" stroke="currentColor" strokeWidth="2" className="text-amber-400" />
                <line x1="50" y1="70" x2="50" y2="90" stroke="currentColor" strokeWidth="1" className="text-amber-300" />
                <line x1="10" y1="50" x2="30" y2="50" stroke="currentColor" strokeWidth="1" className="text-amber-300" />
                <line x1="70" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" className="text-amber-300" />
                <text x="50" y="55" textAnchor="middle" className="text-xs font-bold fill-amber-400">?</text>
              </svg>
            </div>
          </div>

          {/* Confused boat */}
          <div 
            className="absolute left-1/3 top-1/2 transition-all duration-500 text-4xl"
            style={{ 
              transform: `rotate(${scrollY * 2}deg)`,
              opacity: currentFrame === 1 ? 1 : 0.3
            }}
          >
            ⛵
          </div>

          {/* Floating question marks */}
          <div className="absolute top-1/4 right-1/4 text-3xl opacity-30 animate-bounce">❓</div>
          <div className="absolute bottom-1/4 left-1/4 text-2xl opacity-20 animate-bounce" style={{ animationDelay: "0.5s" }}>❓</div>
        </div>
      ),
      scrollStart: 150,
      scrollEnd: 300,
    },
    {
      id: 2,
      title: "The Lighthouse Appears",
      subtitle: "SubjectWin emerges from the fog",
      description: "A purpose-built guide designed specifically for email optimization. It understands your audience, your brand, and what actually drives opens.",
      visual: (
        <div className="relative w-full h-64 bg-gradient-to-b from-purple-900/20 to-purple-950/40 rounded-lg overflow-hidden">
          {/* Fog effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent opacity-60" />

          {/* Lighthouse beam */}
          <div 
            className="absolute right-1/4 top-0 w-1 h-full bg-gradient-to-b from-yellow-300 via-yellow-200 to-transparent opacity-70 blur-sm"
            style={{ 
              transform: `scaleY(${0.5 + Math.sin(scrollY / 50) * 0.3})`,
              opacity: currentFrame === 2 ? 0.8 : 0.2
            }}
          />

          {/* Lighthouse */}
          <div className="absolute right-1/4 top-1/4 -translate-x-1/2">
            <div className="text-6xl">🔦</div>
          </div>

          {/* Boat moving toward light */}
          <div 
            className="absolute left-0 top-1/2 transition-all duration-500 text-4xl"
            style={{ 
              transform: `translateX(${currentFrame >= 2 ? 200 : 0}px)`,
              opacity: currentFrame === 2 ? 1 : 0.3
            }}
          >
            ⛵
          </div>

          {/* Stars appearing */}
          <div className="absolute top-1/4 left-1/4 text-xl opacity-40">✨</div>
          <div className="absolute top-1/3 right-1/3 text-lg opacity-30">✨</div>
        </div>
      ),
      scrollStart: 300,
      scrollEnd: 450,
    },
    {
      id: 3,
      title: "Following the Light",
      subtitle: "You input your campaign context and brand profile",
      description: "SubjectWin learns about your audience, tone, and campaign type. It's building a complete picture of what will resonate.",
      visual: (
        <div className="relative w-full h-64 bg-gradient-to-b from-indigo-900/20 to-indigo-950/40 rounded-lg overflow-hidden">
          {/* Water with light reflection */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-transparent to-indigo-400 blur-xl" />
          </div>

          {/* Boat approaching lighthouse */}
          <div 
            className="absolute left-1/3 top-1/2 text-4xl transition-all duration-500"
            style={{ 
              transform: `translateX(${currentFrame >= 3 ? 100 : 0}px)`,
              opacity: currentFrame === 3 ? 1 : 0.3
            }}
          >
            ⛵
          </div>

          {/* Lighthouse with glow */}
          <div className="absolute right-1/4 top-1/4 -translate-x-1/2">
            <div className="absolute inset-0 w-12 h-12 bg-yellow-300 rounded-full blur-2xl opacity-40" />
            <div className="text-6xl relative z-10">🔦</div>
          </div>

          {/* Data visualization - floating nodes */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-indigo-300 opacity-60" />
          <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-indigo-300 opacity-60" />
          <div className="absolute top-1/2 left-2/5 w-2 h-2 rounded-full bg-indigo-300 opacity-60" />
          <div className="absolute top-2/3 left-1/3 w-2 h-2 rounded-full bg-indigo-300 opacity-60" />

          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <line x1="25%" y1="25%" x2="35%" y2="35%" stroke="currentColor" strokeWidth="1" className="text-indigo-300" />
            <line x1="35%" y1="35%" x2="40%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-indigo-300" />
            <line x1="40%" y1="50%" x2="35%" y2="65%" stroke="currentColor" strokeWidth="1" className="text-indigo-300" />
          </svg>
        </div>
      ),
      scrollStart: 450,
      scrollEnd: 600,
    },
    {
      id: 4,
      title: "The AI Reveals the Path",
      subtitle: "10 ranked subject lines with predicted lift scores",
      description: "SubjectWin generates variants ranked by predicted open-rate lift. Each one explained. No black boxes. Pure clarity.",
      visual: (
        <div className="relative w-full h-64 bg-gradient-to-b from-cyan-900/20 to-cyan-950/40 rounded-lg overflow-hidden">
          {/* Glowing path */}
          <div className="absolute inset-0 opacity-40">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
              <path 
                d="M100,300 Q250,200 400,150 T700,100" 
                stroke="currentColor" 
                strokeWidth="3" 
                fill="none" 
                className="text-cyan-300"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (currentFrame >= 4 ? 500 : 0)}
                style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
              />
            </svg>
          </div>

          {/* Boat at destination */}
          <div 
            className="absolute left-1/2 top-1/3 text-4xl transition-all duration-500"
            style={{ 
              transform: `translateX(${currentFrame >= 4 ? 150 : 0}px)`,
              opacity: currentFrame === 4 ? 1 : 0.3
            }}
          >
            ⛵
          </div>

          {/* Destination - treasure/success */}
          <div className="absolute right-1/4 top-1/4 text-6xl animate-pulse">💎</div>

          {/* Sparkles around destination */}
          <div className="absolute right-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute -top-8 -left-8 text-2xl">✨</div>
            <div className="absolute -top-4 -right-8 text-2xl">✨</div>
            <div className="absolute -bottom-4 -right-4 text-2xl">✨</div>
          </div>
        </div>
      ),
      scrollStart: 600,
      scrollEnd: 750,
    },
    {
      id: 5,
      title: "Safe Harbor",
      subtitle: "You've arrived. Your emails now convert.",
      description: "Track results, compare predictions with reality, and improve with every campaign. You're no longer lost at sea.",
      visual: (
        <div className="relative w-full h-64 bg-gradient-to-b from-emerald-900/20 to-emerald-950/40 rounded-lg overflow-hidden">
          {/* Calm water */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
              <path d="M0,200 Q250,180 500,200 T1000,200" stroke="currentColor" strokeWidth="2" fill="none" className="text-emerald-400" />
              <path d="M0,220 Q250,200 500,220 T1000,220" stroke="currentColor" strokeWidth="2" fill="none" className="text-emerald-400" opacity="0.5" />
            </svg>
          </div>

          {/* Boat at rest */}
          <div className="absolute left-1/3 top-1/2 text-4xl">⛵</div>

          {/* Harbor elements */}
          <div className="absolute right-1/4 top-1/4 text-6xl">🏝️</div>
          <div className="absolute right-1/3 top-1/3 text-5xl">🏠</div>

          {/* Success indicators */}
          <div className="absolute top-1/4 left-1/4 flex items-center gap-2">
            <div className="text-2xl">📈</div>
            <div className="text-xs font-bold text-emerald-300">+4.8%</div>
          </div>
          <div className="absolute bottom-1/4 left-1/3 flex items-center gap-2">
            <div className="text-2xl">✅</div>
            <div className="text-xs font-bold text-emerald-300">Accurate</div>
          </div>

          {/* Sunrise/celebration */}
          <div className="absolute top-0 right-1/4 text-6xl opacity-60">🌅</div>
        </div>
      ),
      scrollStart: 750,
      scrollEnd: 900,
    },
  ];

  const progress = Math.min(scrollY / 900, 1);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20 -z-10" />

      <div className="container max-w-5xl mx-auto">
        {/* Story Navigation */}
        <div className="mb-16">
          {/* Progress bar */}
          <div className="h-1 bg-muted rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-gradient-to-r from-accent via-accent to-accent/50 transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Story frames */}
          <div className="space-y-12">
            {frames.map((frame, idx) => (
              <div
                key={frame.id}
                className={`transition-all duration-500 ${
                  currentFrame >= idx ? "opacity-100" : "opacity-40"
                }`}
                style={{
                  transform: currentFrame >= idx ? "translateY(0)" : "translateY(20px)",
                }}
              >
                {/* Frame visual */}
                <div className="mb-6">
                  {frame.visual}
                </div>

                {/* Frame text */}
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {frame.title}
                  </h2>
                  <p className="text-lg text-accent font-semibold">
                    {frame.subtitle}
                  </p>
                  <p className="text-muted-foreground max-w-2xl">
                    {frame.description}
                  </p>
                </div>

                {/* Frame divider */}
                {idx < frames.length - 1 && (
                  <div className="mt-8 flex items-center justify-center">
                    <div className="h-8 w-0.5 bg-gradient-to-b from-accent to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className={`text-center space-y-6 transition-all duration-500 ${
          currentFrame >= 5 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Your Journey Starts Here</span>
          </div>

          <h3 className="text-3xl font-bold text-foreground">
            Ready to navigate email success?
          </h3>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Start with SubjectWin free. No credit card required. 2 analyses per month to prove the value.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href={isAuthenticated ? "/dashboard/new-analysis" : getLoginUrl()}>
              <Button size="lg" className="gap-2">
                Begin Your Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline">
              See the Map
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
