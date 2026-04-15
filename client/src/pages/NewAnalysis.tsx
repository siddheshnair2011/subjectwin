import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function NewAnalysis() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const [campaignType, setCampaignType] = useState("");
  const [campaignContext, setCampaignContext] = useState("");
  const [seedSubjects, setSeedSubjects] = useState(["", "", ""]);

  const generateVariants = trpc.variant.generate.useMutation({
    onSuccess: () => {
      toast.success("Subject lines generated!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to generate variants");
    },
  });

  const createCampaign = trpc.campaign.create.useMutation({
    onSuccess: (analysis) => {
      toast.success("Campaign created! Generating subject lines...");
      if (analysis?.id) {
        // Trigger variant generation with seed subjects
        const filledSeeds = seedSubjects.filter((s) => s.trim().length > 0);
        generateVariants.mutate({
          analysisId: analysis.id,
          seedSubjects: filledSeeds,
        });
        // Navigate after a short delay to allow generation to start
        setTimeout(() => {
          navigate(`/dashboard/analysis/${analysis.id}`);
        }, 500);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create campaign");
    },
  });

  const handleSeedSubjectChange = (index: number, value: string) => {
    const newSeeds = [...seedSubjects];
    newSeeds[index] = value;
    setSeedSubjects(newSeeds);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filledSeeds = seedSubjects.filter((s) => s.trim().length > 0);
    if (filledSeeds.length === 0) {
      toast.error("Please enter at least one seed subject line");
      return;
    }

    if (!campaignType.trim()) {
      toast.error("Please select a campaign type");
      return;
    }

    createCampaign.mutate({
      campaignType,
      campaignContext,
      seedSubjects: filledSeeds,
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center gap-4 h-16">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <span className="text-xl font-bold text-foreground">New Analysis</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campaign Type */}
          <Card className="p-8 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Campaign Type</h2>
            <p className="text-sm text-muted-foreground mb-6">
              What type of email campaign are you optimizing?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["promotional", "educational", "re-engagement", "welcome", "abandoned-cart", "upsell"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCampaignType(type)}
                  className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium capitalize ${
                    campaignType === type
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-accent/50"
                  }`}
                >
                  {type.replace("-", " ")}
                </button>
              ))}
            </div>
          </Card>

          {/* Campaign Context */}
          <Card className="p-8 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Campaign Context</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Describe your campaign, offer, or key message (optional but recommended).
            </p>
            <textarea
              value={campaignContext}
              onChange={(e) => setCampaignContext(e.target.value)}
              placeholder="E.g., 'Summer sale with 30% off all items. Target: existing customers. Focus on urgency and exclusivity.'"
              className="w-full p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              rows={4}
            />
          </Card>

          {/* Seed Subject Lines */}
          <Card className="p-8 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Seed Subject Lines</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Provide 1-3 existing or reference subject lines to guide AI optimization.
            </p>
            <div className="space-y-4">
              {seedSubjects.map((seed, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject Line {index + 1}
                  </label>
                  <Input
                    type="text"
                    value={seed}
                    onChange={(e) => handleSeedSubjectChange(index, e.target.value)}
                    placeholder={`E.g., "${
                      index === 0
                        ? "Don't miss out—30% off ends tonight"
                        : index === 1
                        ? "Your exclusive summer sale is here"
                        : "Last chance: 30% off everything"
                    }"`}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
            disabled={createCampaign.isPending || generateVariants.isPending}
            className="flex-1 gap-2"
          >
            {createCampaign.isPending || generateVariants.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {createCampaign.isPending ? "Creating..." : "Generating..."}
              </>
            ) : (
              "Generate Subject Lines"
            )}
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
