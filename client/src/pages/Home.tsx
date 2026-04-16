import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, Zap, BarChart3, Lock, Sparkles, TrendingUp, CheckCircle2, Users, Lightbulb, Target, Check, X } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import UnderwaterHeroStory from "@/components/UnderwaterHeroStory";

export default function Home() {
  const { user, isAuthenticated } = useAuth();




  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
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

      {/* Underwater Hero Story Section */}
      <UnderwaterHeroStory />

      {/* Statistics Section */}
      <section className="container py-20 max-w-5xl mx-auto mt-20">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "0ms" }}>
            <div className="text-4xl font-bold text-accent mb-2">3-5%</div>
            <p className="text-muted-foreground">Average lift in open rates</p>
          </div>
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
            <div className="text-4xl font-bold text-accent mb-2">10</div>
            <p className="text-muted-foreground">Ranked subject variants</p>
          </div>
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
            <div className="text-4xl font-bold text-accent mb-2">&lt;30s</div>
            <p className="text-muted-foreground">Generation time</p>
          </div>
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
            <div className="text-4xl font-bold text-accent mb-2">100%</div>
            <p className="text-muted-foreground">Explainable AI</p>
          </div>
        </div>
      </section>

      {/* SubjectWin vs ChatGPT Comparison */}
      <section className="container py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why SubjectWin Beats ChatGPT
          </h2>
          <p className="text-lg text-muted-foreground">
            While ChatGPT is great for general writing, SubjectWin is purpose-built for email subject line optimization.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
                <th className="text-center py-4 px-4 font-semibold text-foreground">SubjectWin</th>
                <th className="text-center py-4 px-4 font-semibold text-foreground">ChatGPT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Predicted Lift Scoring</td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-accent mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Ranked Variants (Best to Worst)</td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-accent mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Brand Context Memory</td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-accent mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Tone Classification</td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-accent mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Outcome Tracking & Accuracy</td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-accent mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">One-Click Export (CSV/Klaviyo)</td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-accent mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Consistency Across Campaigns</td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-accent mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                </td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">Email-Specific Optimization</td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-accent mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <Card className="p-8 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "0ms" }}>
            <h3 className="text-xl font-semibold text-foreground mb-4">ChatGPT Approach</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>Generic AI trained on broad internet data, not email marketing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>No performance metrics—you guess which subject line is best</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>Requires manual copy-paste and context re-entry each time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>No way to track if suggestions actually improved open rates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>Inconsistent results across different prompts and campaigns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>Slow iteration: write prompt → copy result → test → repeat</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 border-2 border-accent bg-accent/5 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
            <h3 className="text-xl font-semibold text-foreground mb-4">SubjectWin Approach</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Purpose-built AI trained specifically on email performance data</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Predicts open-rate lift for each variant—ranked best to worst</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Save brand profile once, reuse across all campaigns</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Upload actual results to compare predictions vs reality</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Consistent, repeatable results tied to your brand voice</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>One-click export to Klaviyo or CSV—ready to send</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why SubjectWin Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Purpose-built for D2C email marketers who want faster, smarter decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card 
            className="p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "0ms" }}
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Generation</h3>
            <p className="text-muted-foreground">
              Generate 10 optimized subject line variants in seconds based on your audience, campaign type, and tone preferences.
            </p>
          </Card>

          <Card 
            className="p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "100ms" }}
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Predicted Lift Scoring</h3>
            <p className="text-muted-foreground">
              Each variant shows predicted open-rate lift with clear reasoning. No black boxes—just actionable insights.
            </p>
          </Card>

          <Card 
            className="p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "200ms" }}
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Outcome Tracking</h3>
            <p className="text-muted-foreground">
              Upload actual open rates and compare predicted vs. real performance. Build confidence over time.
            </p>
          </Card>

          <Card 
            className="p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "300ms" }}
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Brand Context</h3>
            <p className="text-muted-foreground">
              Save your audience profile and tone preferences once. Recommendations stay consistent with your brand voice.
            </p>
          </Card>

          <Card 
            className="p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "400ms" }}
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">One-Click Export</h3>
            <p className="text-muted-foreground">
              Copy subject lines, export as CSV, or send directly to Klaviyo. Fits seamlessly into your workflow.
            </p>
          </Card>

          <Card 
            className="p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "500ms" }}
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Review analysis history, prediction accuracy, and trends by campaign type to improve over time.
            </p>
          </Card>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for Every Marketer
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're a founder, lifecycle marketer, or agency strategist, SubjectWin fits your workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card 
            className="p-8 border border-border hover:border-accent/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "0ms" }}
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Lifecycle Marketer</h3>
            <p className="text-muted-foreground mb-4">
              Own weekly promotions and automated flows. Need a faster way to make confident subject line decisions without adding overhead.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Rank variants by predicted lift
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Compare predicted vs actual
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Export to Klaviyo in seconds
              </li>
            </ul>
          </Card>

          <Card 
            className="p-8 border-2 border-accent bg-accent/5 relative animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "100ms" }}
          >
            <div className="absolute -top-3 left-6 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Most Common
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Founder-Operator</h3>
            <p className="text-muted-foreground mb-4">
              Write or review campaigns personally while managing many responsibilities. Want simple, obviously useful tools tied to revenue.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Save time on subject line debates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Improve opens without testing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                See clear ROI immediately
              </li>
            </ul>
          </Card>

          <Card 
            className="p-8 border border-border hover:border-accent/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "200ms" }}
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Agency Strategist</h3>
            <p className="text-muted-foreground mb-4">
              Manage email programs for multiple brands. Need repeatability, exportability, and cross-client comparison.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Reusable workflow per client
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Track accuracy across campaigns
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Prove value to stakeholders
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How SubjectWin Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to better subject lines.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "0ms" }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Enter Campaign Context</h3>
            <p className="text-muted-foreground">
              Tell us about your campaign type, offer, audience, and brand tone. Optionally provide 1–3 seed subject lines to build from.
            </p>
            <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-accent to-transparent -z-10" style={{ width: "calc(100% + 2rem)" }} />
          </div>

          <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold text-foreground mb-3">AI Generates Variants</h3>
            <p className="text-muted-foreground">
              Our AI creates 10 ranked subject line options, each with predicted lift, tone classification, and a clear explanation of why it may perform well.
            </p>
            <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-accent to-transparent -z-10" style={{ width: "calc(100% + 2rem)" }} />
          </div>

          <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Select & Track</h3>
            <p className="text-muted-foreground">
              Choose your favorite, copy it, or export to CSV. Later, upload actual open rates to compare predictions with reality and improve over time.
            </p>
          </div>
        </div>
      </section>

      {/* Example Results Section */}
      <section className="container py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Example Results
          </h2>
          <p className="text-lg text-muted-foreground">
            See how SubjectWin ranks subject lines for a typical campaign.
          </p>
        </div>

        <Card className="p-8 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Campaign: Spring Sale Promotion</h3>
            <p className="text-sm text-muted-foreground">Audience: Female, 25–45, previous purchasers • Tone: Playful, urgent</p>
          </div>

          <div className="space-y-3">
            {[
              { rank: 1, subject: "🌸 Spring into savings—40% off ends tonight", lift: "+4.8%", tone: "Playful, Urgent" },
              { rank: 2, subject: "Your spring refresh awaits: 40% off sitewide", lift: "+3.9%", tone: "Friendly, Inviting" },
              { rank: 3, subject: "Spring sale: 40% off everything (today only)", lift: "+3.2%", tone: "Direct, Urgent" },
              { rank: 4, subject: "We're blooming with savings for you", lift: "+2.1%", tone: "Playful, Warm" },
              { rank: 5, subject: "40% off spring collection—limited time", lift: "+1.5%", tone: "Direct, Informative" },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-in fade-in slide-in-from-left-4 duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-semibold text-accent">
                  {item.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium truncate">{item.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.tone}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-accent">{item.lift}</p>
                  <p className="text-xs text-muted-foreground">Predicted lift</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Why #1 ranks highest:</span> Combines emoji for visual attention, playful tone matching your brand, urgency ("tonight"), and specific discount. Expected to drive 4.8% higher open rate than a generic subject line.
            </p>
          </div>
        </Card>
      </section>

      {/* Predicted vs Actual Comparison Section */}
      <section className="container py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Track Accuracy Over Time
          </h2>
          <p className="text-lg text-muted-foreground">
            Upload actual results and compare predictions with real performance to build confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Predicted vs Actual Chart */}
          <Card className="p-8 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "0ms" }}>
            <h3 className="text-lg font-semibold text-foreground mb-6">Prediction Accuracy</h3>
            <div className="space-y-4">
              {[
                { campaign: "Spring Sale", predicted: 4.8, actual: 5.1, match: "Accurate" },
                { campaign: "Summer Launch", predicted: 3.2, actual: 3.5, match: "Accurate" },
                { campaign: "Flash Deal", predicted: 2.9, actual: 2.7, match: "Close" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{item.campaign}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">✓ {item.match}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Predicted</span>
                        <span>{item.predicted}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted">
                        <div 
                          className="h-full rounded-full bg-accent/60 transition-all duration-500"
                          style={{ width: `${item.predicted * 20}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Actual</span>
                        <span>{item.actual}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted">
                        <div 
                          className="h-full rounded-full bg-accent transition-all duration-500"
                          style={{ width: `${item.actual * 20}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* CSV Export Demo */}
          <Card className="p-8 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
            <h3 className="text-lg font-semibold text-foreground mb-6">One-Click CSV Export</h3>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs text-muted-foreground overflow-auto max-h-64 mb-4">
              <div className="text-foreground font-semibold mb-2">campaign_analysis_export.csv</div>
              <div>Campaign,Subject Line,Tone,Predicted Lift,Selected</div>
              <div>Spring Sale,Spring into savings 40% off ends tonight,Playful,+4.8%,Yes</div>
              <div>Spring Sale,Your spring refresh awaits,Friendly,+3.9%,No</div>
              <div>Spring Sale,Spring sale 40% off everything,Direct,+3.2%,No</div>
              <div>Summer Launch,Hot summer styles just dropped,Playful,+3.8%,Yes</div>
              <div>Summer Launch,New arrivals Shop the latest,Friendly,+3.1%,No</div>
            </div>
            <div className="space-y-3">
              <Button className="w-full gap-2">
                <ArrowRight className="w-4 h-4" />
                Download CSV
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Import directly into Klaviyo, Mailchimp, or your spreadsheet for analysis.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free. Upgrade when you're ready to scale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <Card 
            className="p-8 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "0ms" }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
            <p className="text-muted-foreground mb-6">Perfect for testing</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent/20"></span>
                2 analyses per month
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent/20"></span>
                Brand profile setup
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent/20"></span>
                CSV export
              </li>
              <li className="flex items-center gap-2 opacity-50">
                <span className="w-4 h-4 rounded-full bg-muted"></span>
                Integrations
              </li>
            </ul>
            <a href={isAuthenticated ? "/dashboard/new-analysis" : getLoginUrl()}>
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </a>
          </Card>

          {/* Growth Tier */}
          <Card 
            className="p-8 border-2 border-accent bg-accent/5 relative animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "100ms" }}
          >
            <div className="absolute -top-3 left-6 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Growth</h3>
            <p className="text-muted-foreground mb-6">For growing D2C brands</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent"></span>
                20 analyses per month
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent"></span>
                Klaviyo integration
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent"></span>
                Predicted vs. actual reporting
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent"></span>
                Priority support
              </li>
            </ul>
            <a href={isAuthenticated ? "/dashboard/upgrade" : getLoginUrl()}>
              <Button className="w-full gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </Card>

          {/* Accelerator Tier */}
          <Card 
            className="p-8 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "200ms" }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-2">Accelerator</h3>
            <p className="text-muted-foreground mb-6">For agencies & power users</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$299</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent/20"></span>
                Unlimited analyses
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent/20"></span>
                Multiple integrations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent/20"></span>
                Advanced analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-accent/20"></span>
                Dedicated support
              </li>
            </ul>
            <a href={isAuthenticated ? "/dashboard/upgrade" : getLoginUrl()}>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </a>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="p-12 bg-accent/5 border-2 border-accent text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to improve your email open rates?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start free today. No credit card required. 2 analyses per month to prove the value.
          </p>
          <a href={isAuthenticated ? "/dashboard/new-analysis" : getLoginUrl()}>
            <Button size="lg" className="gap-2">
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="font-semibold text-foreground">SubjectWin</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 SubjectWin. All rights reserved. | AI-powered email optimization for D2C brands.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
