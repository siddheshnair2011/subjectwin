import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Sparkles, Check, Users, Zap, BarChart3, Lock, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";

// Organic Hero Component
function OrganicHero() {
  const { isAuthenticated } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-background via-background to-accent/5 overflow-hidden">
      {/* Organic background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Warm gradient orbs */}
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollProgress * 30}px) scale(${1 + scrollProgress * 0.1})`,
          }}
        />
        <div
          className="absolute top-1/2 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollProgress * -20}px)`,
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollProgress * 40}px)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <div
            className="mb-6"
            style={{
              opacity: Math.min(1, 1 - scrollProgress * 0.5),
              transform: `translateY(${scrollProgress * 20}px)`,
            }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight">
              Your emails deserve better subject lines
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Stop guessing. Start winning. AI-powered subject line optimization that actually understands your brand.
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            style={{
              opacity: Math.min(1, 1 - scrollProgress * 0.3),
              transform: `translateY(${scrollProgress * 15}px)`,
            }}
          >
            {isAuthenticated ? (
              <a href="/dashboard">
                <Button size="lg" className="gap-2">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button size="lg" className="gap-2">
                    Start Free <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </>
            )}
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get 10 optimized subject lines in under 30 seconds",
              },
              {
                icon: Lock,
                title: "Brand Aware",
                description: "Learns your audience, tone, and industry in minutes",
              },
              {
                icon: TrendingUp,
                title: "Proven Results",
                description: "Average 3-5% lift in open rates from day one",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300"
                  style={{
                    opacity: Math.min(1, Math.max(0, 1 - (scrollProgress - 0.2) * 2)),
                    transform: `translateY(${Math.max(0, (scrollProgress - 0.2) * 30)}px)`,
                  }}
                >
                  <Icon className="w-8 h-8 text-accent mb-3 mx-auto" />
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Trust indicators */}
          <div className="text-center text-muted-foreground text-sm">
            <p className="mb-4">Trusted by marketing teams at leading D2C brands</p>
            <div className="flex justify-center gap-8 opacity-60">
              <div className="text-xs font-medium">10K+ Analyses</div>
              <div className="text-xs font-medium">98% Accuracy</div>
              <div className="text-xs font-medium">50+ Industries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 2),
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Scroll to explore</p>
          <div className="w-6 h-10 border border-muted-foreground rounded-full flex items-start justify-center p-2">
            <div
              className="w-1 h-2 bg-muted-foreground rounded-full animate-bounce"
              style={{
                animationDelay: "0s",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold text-foreground">SubjectWin</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button>Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <OrganicHero />

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-accent/2">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to better email performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: 1,
                title: "Tell us about your brand",
                description: "Share your audience, industry, and tone. SubjectWin learns what makes your emails tick.",
                icon: Users,
              },
              {
                step: 2,
                title: "Paste your campaign",
                description: "Give us your campaign context and seed subject line. Our AI does the heavy lifting.",
                icon: Zap,
              },
              {
                step: 3,
                title: "Pick and track",
                description: "Choose your favorite variant, send it, and watch the results roll in. We track everything.",
                icon: BarChart3,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 border-2 border-accent/20">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-accent/50 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why SubjectWin */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why SubjectWin</h2>
            <p className="text-lg text-muted-foreground">Built for real marketers, not AI enthusiasts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Brand-aware optimization",
                description: "Learns your unique voice and audience. Not generic ChatGPT suggestions.",
                icon: Lock,
              },
              {
                title: "Explainable results",
                description: "Understand why each variant works. No black boxes, just clear reasoning.",
                icon: Check,
              },
              {
                title: "Proven performance",
                description: "Backed by real data from thousands of campaigns. 3-5% average lift.",
                icon: BarChart3,
              },
              {
                title: "Built for scale",
                description: "From side hustle to enterprise. Grows with your business.",
                icon: Zap,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300">
                  <Icon className="w-8 h-8 text-accent mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-accent/2">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Simple pricing</h2>
            <p className="text-lg text-muted-foreground">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for getting started",
                features: ["2 analyses per month", "Basic brand profile", "CSV export", "Email support"],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Growth",
                price: "$99",
                description: "For growing teams",
                features: ["50 analyses per month", "Advanced brand profiles", "Outcome tracking", "Priority support"],
                cta: "Upgrade Now",
                highlighted: true,
              },
              {
                name: "Accelerator",
                price: "$299",
                description: "For serious marketers",
                features: ["Unlimited analyses", "Team collaboration", "Advanced analytics", "Dedicated support"],
                cta: "Contact Sales",
                highlighted: false,
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-300 ${
                  plan.highlighted
                    ? "border-accent bg-accent/5 ring-2 ring-accent/20 md:scale-105"
                    : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.price !== "$0" && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <a href={isAuthenticated ? "/dashboard/upgrade" : getLoginUrl()}>
                    <Button
                      className="w-full mb-6"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </a>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to win at email?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of marketing teams already using SubjectWin to optimize their campaigns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
                <Button size="lg" className="gap-2">
                  Start Free Today
                </Button>
              </a>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-foreground mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Security</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition">About</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Cookies</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Social</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition">Twitter</a></li>
                  <li><a href="#" className="hover:text-foreground transition">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-foreground transition">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="font-semibold text-foreground">SubjectWin</span>
              </div>
              <p className="text-sm text-muted-foreground">© 2026 SubjectWin. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
