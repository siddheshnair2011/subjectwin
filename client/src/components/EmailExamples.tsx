import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, TrendingUp, Zap } from "lucide-react";

interface EmailExample {
  category: string;
  original: string;
  optimized: string;
  lift: number;
  tone: string;
  explanation: string;
}

const examples: EmailExample[] = [
  {
    category: "E-commerce",
    original: "New products available",
    optimized: "Last chance: Your exclusive early-access ends tonight",
    lift: 28.5,
    tone: "urgency",
    explanation: "Creates FOMO with time-sensitive language and exclusivity angle",
  },
  {
    category: "SaaS",
    original: "Check out our new features",
    optimized: "3 features that saved our customers 10+ hours this week",
    lift: 35.2,
    tone: "social_proof",
    explanation: "Leads with concrete value and social proof of results",
  },
  {
    category: "Newsletter",
    original: "Weekly update",
    optimized: "The one thing everyone's asking about (+ 4 more insights)",
    lift: 22.8,
    tone: "curiosity",
    explanation: "Curiosity gap combined with promise of multiple valuable insights",
  },
  {
    category: "Promotional",
    original: "50% off sale",
    optimized: "Your VIP code: Save 50% on everything (48 hours only)",
    lift: 31.4,
    tone: "exclusivity",
    explanation: "Personalization and scarcity combine for higher engagement",
  },
  {
    category: "Transactional",
    original: "Your order has shipped",
    optimized: "Your order is on the way! Track it now + get $10 off your next purchase",
    lift: 18.7,
    tone: "personalization",
    explanation: "Adds value and incentive to routine notification",
  },
  {
    category: "Re-engagement",
    original: "We miss you!",
    optimized: "Come back for what's new: See the 5 biggest updates since you left",
    lift: 26.3,
    tone: "curiosity",
    explanation: "Specific value proposition beats generic emotional appeal",
  },
];

export default function EmailExamples() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">See the Difference</h2>
        <p className="text-muted-foreground">
          Real examples of how SubjectWin transforms ordinary subject lines into high-performing ones
        </p>
      </div>

      <div className="grid gap-6">
        {examples.map((example, idx) => (
          <Card key={idx} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{example.category}</CardTitle>
                  <CardDescription>{example.explanation}</CardDescription>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-accent">+{example.lift}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Original</span>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-sm line-through opacity-60">
                    {example.original}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Optimized by SubjectWin</span>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-3 text-sm font-medium">
                    {example.optimized}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="capitalize">
                  {example.tone.replace(/_/g, " ")}
                </Badge>
                <Badge variant="outline">
                  {example.lift}% lift
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">How SubjectWin Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                1
              </div>
              <h4 className="font-semibold">Tell us about your brand</h4>
              <p className="text-sm text-muted-foreground">
                Share your audience, industry, and tone preferences
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                2
              </div>
              <h4 className="font-semibold">Paste your campaign</h4>
              <p className="text-sm text-muted-foreground">
                Upload your current subject lines or campaign context
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                3
              </div>
              <h4 className="font-semibold">Get optimized variants</h4>
              <p className="text-sm text-muted-foreground">
                Receive AI-powered subject lines with predicted lift scores
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
