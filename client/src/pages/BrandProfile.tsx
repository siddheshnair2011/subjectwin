import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BrandProfile() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: profile, isLoading } = trpc.brand.get.useQuery();

  const [audienceDescription, setAudienceDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [tonePreferences, setTonePreferences] = useState("");

  useEffect(() => {
    if (profile) {
      setAudienceDescription(profile.audienceDescription || "");
      setIndustry(profile.industry || "");
      setTonePreferences(profile.tonePreferences || "");
    }
  }, [profile]);

  const upsertProfile = trpc.brand.upsert.useMutation({
    onSuccess: () => {
      toast.success("Brand profile updated!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertProfile.mutate({
      audienceDescription,
      industry,
      tonePreferences,
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
          <span className="text-xl font-bold text-foreground">Brand Profile</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Configure Your Brand</h2>
            <p className="text-muted-foreground mb-8">
              These settings help us generate subject lines that match your brand voice and audience.
            </p>

            <div className="space-y-6">
              {/* Audience Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Target Audience
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Describe your typical customer (e.g., "D2C ecommerce customers aged 25-40, interested in fashion")
                </p>
                <textarea
                  value={audienceDescription}
                  onChange={(e) => setAudienceDescription(e.target.value)}
                  placeholder="E.g., 'Young professionals, tech-savvy, value sustainability'"
                  className="w-full p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={3}
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Industry
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  What industry does your business operate in?
                </p>
                <Input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="E.g., 'Fashion', 'SaaS', 'E-commerce', 'Healthcare'"
                  className="w-full"
                />
              </div>

              {/* Tone Preferences */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Tone & Voice Preferences
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Describe your preferred communication style (e.g., "Professional but friendly", "Playful and energetic")
                </p>
                <textarea
                  value={tonePreferences}
                  onChange={(e) => setTonePreferences(e.target.value)}
                  placeholder="E.g., 'Friendly, casual, with a touch of humor'"
                  className="w-full p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={upsertProfile.isPending || isLoading}
              className="flex-1 gap-2"
            >
              {upsertProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
