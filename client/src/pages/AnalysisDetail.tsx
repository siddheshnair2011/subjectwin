import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Copy, Download, Loader2, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AnalysisDetail() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [params] = useLocation();
  const analysisId = parseInt(params.split("/").pop() || "0");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: analysis, isLoading: analysisLoading } = trpc.campaign.get.useQuery(
    { id: analysisId },
    { enabled: !!analysisId }
  );

  const { data: variants, isLoading: variantsLoading } = trpc.variant.list.useQuery(
    { analysisId },
    { enabled: !!analysisId }
  );

  const { data: outcome } = trpc.outcome.get.useQuery(
    { analysisId },
    { enabled: !!analysisId }
  );

  const selectVariant = trpc.variant.select.useMutation({
    onSuccess: () => {
      toast.success("Variant selected!");
    },
  });

  const uploadOutcome = trpc.outcome.upload.useMutation({
    onSuccess: () => {
      toast.success("Outcome recorded!");
    },
  });

  const [openRate, setOpenRate] = useState("");

  const handleCopySubject = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleExportCSV = () => {
    if (!variants) return;

    const headers = ["Subject Line", "Predicted Lift (%)", "Tone", "Explanation"];
    const rows = variants.map((v) => [
      v.text,
      v.predictedLift?.toString() || "N/A",
      v.tone,
      v.explanation,
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-${analysisId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const handleUploadOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(openRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error("Please enter a valid open rate (0-100)");
      return;
    }
    uploadOutcome.mutate({
      analysisId,
      actualOpenRate: rate,
      provider: "manual",
    });
    setOpenRate("");
  };

  if (!isAuthenticated) {
    return null;
  }

  if (analysisLoading || variantsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container flex items-center gap-4 h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </nav>
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Analysis not found</p>
        </div>
      </div>
    );
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
          <span className="text-xl font-bold text-foreground">Analysis</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12 max-w-4xl">
        {/* Campaign Info */}
        <Card className="p-8 border border-border mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 capitalize">
            {analysis.campaignType}
          </h1>
          <p className="text-muted-foreground mb-4">{analysis.campaignContext}</p>
          <p className="text-sm text-muted-foreground">
            Created {new Date(analysis.createdAt).toLocaleDateString()}
          </p>
        </Card>

        {/* Variants */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Generated Subject Lines</h2>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {variants && variants.length > 0 ? (
            <div className="space-y-4">
              {variants.map((variant) => (
                <Card key={variant.id} className="p-6 border border-border hover:border-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2 text-lg">
                        {variant.text}
                      </h3>
                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-foreground">
                            +{variant.predictedLift}% predicted lift
                          </span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium capitalize">
                          {variant.tone}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{variant.explanation}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopySubject(variant.text)}
                        className="gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                      {!variant.selected && (
                        <Button
                          size="sm"
                          onClick={() => selectVariant.mutate({ variantId: variant.id })}
                          disabled={selectVariant.isPending}
                        >
                          Select
                        </Button>
                      )}
                      {variant.selected && (
                        <div className="px-3 py-2 rounded-lg bg-accent/10 text-accent text-xs font-medium">
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center border border-border">
              <p className="text-muted-foreground">No variants generated yet</p>
            </Card>
          )}
        </div>

        {/* Outcome Tracking */}
        <Card className="p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Post-Send Outcome</h2>

          {outcome ? (
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Actual Open Rate</p>
              <p className="text-3xl font-bold text-foreground mb-4">{outcome.actualOpenRate}%</p>
              <p className="text-xs text-muted-foreground">
                Recorded via {outcome.provider} on {new Date(outcome.createdAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <form onSubmit={handleUploadOutcome} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                After sending this campaign, upload the actual open rate to compare against predictions.
              </p>
              <div className="flex gap-4">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={openRate}
                  onChange={(e) => setOpenRate(e.target.value)}
                  placeholder="Enter open rate (0-100)"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={uploadOutcome.isPending}
                  className="gap-2"
                >
                  {uploadOutcome.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Record Outcome"
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
