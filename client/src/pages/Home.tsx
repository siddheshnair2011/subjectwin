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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* Hero Section with Fixed Background */}
      <div className="relative min-h-screen">
        {/* Fixed Underwater Hero Background */}
        <div className="fixed inset-0 top-16 z-0">
          <UnderwaterHeroStory />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10">
          {/* Statistics Section - Appears as user scrolls */}
          <section className="min-h-screen flex items-center justify-end">
            <div className="pr-8">
              <div className="max-w-sm space-y-4">
                  <div className="animate-in fade-in slide-in-from-right-8 duration-700" style={{ animationDelay: "0ms" }}>
                    <Card className="p-5 bg-card border-border">
                      <div className="text-3xl font-bold text-accent mb-1">3-5%</div>
                      <p className="text-sm text-muted-foreground">Average lift in open rates</p>
                    </Card>
                  </div>
                  <div className="animate-in fade-in slide-in-from-right-8 duration-700" style={{ animationDelay: "100ms" }}>
                    <Card className="p-5 bg-card border-border">
                      <div className="text-3xl font-bold text-accent mb-1">10</div>
                      <p className="text-sm text-muted-foreground">Ranked subject variants</p>
                    </Card>
                  </div>
                  <div className="animate-in fade-in slide-in-from-right-8 duration-700" style={{ animationDelay: "200ms" }}>
                    <Card className="p-5 bg-card border-border">
                      <div className="text-3xl font-bold text-accent mb-1">&lt;30s</div>
                      <p className="text-sm text-muted-foreground">Generation time</p>
                    </Card>
                  </div>
                  <div className="animate-in fade-in slide-in-from-right-8 duration-700" style={{ animationDelay: "300ms" }}>
                    <Card className="p-5 bg-card border-border">
                      <div className="text-3xl font-bold text-accent mb-1">100%</div>
                      <p className="text-sm text-muted-foreground">Explainable AI</p>
                    </Card>
                  </div>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="min-h-screen bg-background/95 backdrop-blur-sm py-20">
            <div className="container max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Built for Every Email Marketer
                </h2>
                <p className="text-lg text-muted-foreground">
                  Whether you're optimizing lifecycle campaigns or running agency operations, SubjectWin scales with you.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Lifecycle Marketer",
                    description: "Optimize welcome, re-engagement, and win-back campaigns with brand-aware subject lines.",
                    icon: TrendingUp,
                  },
                  {
                    title: "Founder-Operator",
                    description: "Get instant subject line variants with predicted lift scores—no AI expertise needed.",
                    icon: Lightbulb,
                  },
                  {
                    title: "Agency Strategist",
                    description: "Manage multiple client campaigns and track performance trends across accounts.",
                    icon: Users,
                  },
                ].map((useCase, idx) => (
                  <Card key={idx} className="p-6 bg-card/95 backdrop-blur-sm border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                    <useCase.icon className="w-8 h-8 text-accent mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">{useCase.title}</h3>
                    <p className="text-muted-foreground">{useCase.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="min-h-screen bg-background py-20">
            <div className="container max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Three Steps to Better Subject Lines
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Set Your Brand Profile",
                    description: "Tell us about your audience, industry, and tone preferences. SubjectWin learns your brand voice.",
                  },
                  {
                    step: "2",
                    title: "Provide Campaign Context",
                    description: "Share your campaign type, offer details, and 1-3 seed subject lines as inspiration.",
                  },
                  {
                    step: "3",
                    title: "Get Ranked Variants",
                    description: "Receive 10 AI-generated variants ranked by predicted lift, with tone and explanation for each.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                    <Card className="p-6 bg-card/95 backdrop-blur-sm border-border/50 h-full">
                      <div className="text-3xl font-bold text-accent mb-4">{item.step}</div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Example Results Section */}
          <section className="min-h-screen bg-background/95 backdrop-blur-sm py-20">
            <div className="container max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Example: Spring Sale Campaign
                </h2>
                <p className="text-lg text-muted-foreground">
                  Here's how SubjectWin ranked 5 variants for a lifestyle brand's spring sale.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { rank: 1, subject: "Spring Sale: Up to 40% Off Everything", lift: 8.2, tone: "Promotional" },
                  { rank: 2, subject: "Refresh Your Spring Wardrobe (40% Off)", lift: 6.5, tone: "Lifestyle" },
                  { rank: 3, subject: "Limited Time: Spring Collection Sale", lift: 5.1, tone: "Urgency" },
                  { rank: 4, subject: "Your Spring Style Awaits", lift: 3.8, tone: "Aspirational" },
                  { rank: 5, subject: "Spring Clearance Event Starts Now", lift: 2.3, tone: "Informational" },
                ].map((item, idx) => (
                  <Card key={idx} className="p-4 bg-card/95 backdrop-blur-sm border-border/50 animate-in fade-in slide-in-from-left-8 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-accent">#{item.rank}</span>
                          <span className="text-foreground font-medium">{item.subject}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Predicted Lift: <span className="text-accent font-semibold">{item.lift}%</span></span>
                          <span>Tone: <span className="text-accent font-semibold">{item.tone}</span></span>
                        </div>
                      </div>
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${(item.lift / 10) * 100}%` }} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Why SubjectWin vs ChatGPT */}
          <section className="min-h-screen bg-background py-20">
            <div className="container max-w-5xl mx-auto">
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
                      <th className="text-left py-4 px-4 font-bold text-foreground">Feature</th>
                      <th className="text-center py-4 px-4 font-bold text-foreground">ChatGPT</th>
                      <th className="text-center py-4 px-4 font-bold text-accent">SubjectWin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Purpose-Built for Email", chatgpt: false, subjectwin: true },
                      { feature: "Predicted Lift Scores", chatgpt: false, subjectwin: true },
                      { feature: "Brand Context Awareness", chatgpt: false, subjectwin: true },
                      { feature: "Ranked Variants", chatgpt: false, subjectwin: true },
                      { feature: "Tone Classification", chatgpt: false, subjectwin: true },
                      { feature: "Performance Tracking", chatgpt: false, subjectwin: true },
                      { feature: "Explainable AI", chatgpt: false, subjectwin: true },
                      { feature: "One-Click Copy", chatgpt: false, subjectwin: true },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-border/50">
                        <td className="py-4 px-4 text-foreground">{row.feature}</td>
                        <td className="py-4 px-4 text-center">
                          {row.chatgpt ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {row.subjectwin ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-16">
                {[
                  {
                    title: "ChatGPT",
                    limitations: [
                      "Generic suggestions without ranking",
                      "No understanding of email best practices",
                      "No performance prediction",
                      "Requires manual iteration",
                      "No brand context retention",
                    ],
                  },
                  {
                    title: "SubjectWin",
                    benefits: [
                      "Purpose-built for email marketing",
                      "AI trained on email performance data",
                      "Predicted lift for each variant",
                      "Instant, ranked results",
                      "Learns your brand over time",
                    ],
                  },
                ].map((section, idx) => (
                  <Card key={idx} className="p-8 bg-card/95 backdrop-blur-sm border-border/50">
                    <h3 className="text-2xl font-bold text-foreground mb-6">{section.title}</h3>
                    <ul className="space-y-3">
                      {(section.limitations || section.benefits).map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          {section.limitations ? (
                            <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                          ) : (
                            <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="min-h-screen bg-background/95 backdrop-blur-sm py-20">
            <div className="container max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-lg text-muted-foreground">
                  Start free, upgrade when you're ready to scale.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Free",
                    price: "$0",
                    period: "forever",
                    analyses: "2 analyses/month",
                    features: ["2 analyses per month", "Basic brand profile", "CSV export", "Community support"],
                    cta: "Get Started",
                    highlighted: false,
                  },
                  {
                    name: "Growth",
                    price: "$99",
                    period: "/month",
                    analyses: "50 analyses/month",
                    features: ["50 analyses per month", "Advanced brand profiles", "Performance tracking", "Priority support", "API access"],
                    cta: "Start Free Trial",
                    highlighted: true,
                  },
                  {
                    name: "Accelerator",
                    price: "$299",
                    period: "/month",
                    analyses: "Unlimited",
                    features: ["Unlimited analyses", "Team collaboration", "Advanced analytics", "Dedicated support", "Custom integrations"],
                    cta: "Contact Sales",
                    highlighted: false,
                  },
                ].map((plan, idx) => (
                  <Card key={idx} className={`p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${plan.highlighted ? "bg-accent/10 border-accent/50 ring-2 ring-accent/20" : "bg-card/95 border-border/50"}`} style={{ animationDelay: `${idx * 100}ms` }}>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-accent">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.period}</span>
                    </div>
                    <div className="mb-6 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-semibold text-foreground">{plan.analyses}</p>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="text-muted-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-background py-20 border-t border-border">
            <div className="container max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Optimize Your Email Subject Lines?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join marketers who are already improving open rates with SubjectWin.
              </p>
              <a href={getLoginUrl()}>
                <Button size="lg" className="gap-2">
                  Start Free Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-background/50 border-t border-border py-12">
            <div className="container max-w-5xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="font-bold text-foreground">SubjectWin</span>
                  </div>
                  <p className="text-sm text-muted-foreground">AI-powered email subject line optimization.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Product</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-accent transition">Features</a></li>
                    <li><a href="#" className="hover:text-accent transition">Pricing</a></li>
                    <li><a href="#" className="hover:text-accent transition">FAQ</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Company</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-accent transition">About</a></li>
                    <li><a href="#" className="hover:text-accent transition">Blog</a></li>
                    <li><a href="#" className="hover:text-accent transition">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-accent transition">Privacy</a></li>
                    <li><a href="#" className="hover:text-accent transition">Terms</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                <p>&copy; 2026 SubjectWin. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
