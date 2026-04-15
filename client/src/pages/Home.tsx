import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, Zap, BarChart3, Lock, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "wouter";

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

      {/* Hero Section */}
      <section className="container py-20 md:py-32 max-w-4xl mx-auto">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">AI-Powered Email Optimization</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Predict Email Open Rates
            <span className="block text-accent">Before You Send</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SubjectWin helps D2C ecommerce brands generate, rank, and optimize email subject lines with AI. Increase open rates by 3–5% without waiting for A/B tests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href={isAuthenticated ? "/dashboard/new-analysis" : getLoginUrl()}>
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>

          <div className="pt-8 text-sm text-muted-foreground">
            <p>Free tier: 2 analyses/month • No credit card required</p>
          </div>
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
          <Card className="p-8 border border-border hover:border-accent/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Generation</h3>
            <p className="text-muted-foreground">
              Generate 10 optimized subject line variants in seconds based on your audience, campaign type, and tone preferences.
            </p>
          </Card>

          <Card className="p-8 border border-border hover:border-accent/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Predicted Lift Scoring</h3>
            <p className="text-muted-foreground">
              Each variant shows predicted open-rate lift with clear reasoning. No black boxes—just actionable insights.
            </p>
          </Card>

          <Card className="p-8 border border-border hover:border-accent/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Outcome Tracking</h3>
            <p className="text-muted-foreground">
              Upload actual open rates and compare predicted vs. real performance. Build confidence over time.
            </p>
          </Card>

          <Card className="p-8 border border-border hover:border-accent/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Brand Context</h3>
            <p className="text-muted-foreground">
              Save your audience profile and tone preferences once. Recommendations stay consistent with your brand voice.
            </p>
          </Card>

          <Card className="p-8 border border-border hover:border-accent/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">One-Click Export</h3>
            <p className="text-muted-foreground">
              Copy subject lines, export as CSV, or send directly to Klaviyo. Fits seamlessly into your workflow.
            </p>
          </Card>

          <Card className="p-8 border border-border hover:border-accent/50 transition-colors">
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
          <Card className="p-8 border border-border">
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
          <Card className="p-8 border-2 border-accent bg-accent/5 relative">
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
          <Card className="p-8 border border-border">
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
      <section className="container py-20 max-w-4xl mx-auto">
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
