import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Plus, BarChart3, Settings, LogOut, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Only query when auth is resolved
  const { data: analyses, isLoading: analysesLoading, error: analysesError } = trpc.campaign.list.useQuery(undefined, {
    enabled: isAuthenticated && !authLoading,
  } as any);
  const { data: subscription, error: subscriptionError } = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated && !authLoading,
  } as any);

  // Show loading state while auth is resolving
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Show error state if queries fail
  if (analysesError || subscriptionError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md border border-red-200 bg-red-50">
          <div className="flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-red-900">Error Loading Dashboard</h2>
              <p className="text-sm text-red-800 mt-1">
                {(analysesError as any)?.message || (subscriptionError as any)?.message || "Failed to load dashboard data"}
              </p>
            </div>
          </div>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/">
              <span className="text-xl font-bold text-foreground cursor-pointer">SubjectWin</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard">
                <span className="text-sm font-medium text-foreground cursor-pointer">Dashboard</span>
              </Link>
              <Link href="/dashboard/brand-profile">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer">Brand Profile</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{subscription?.plan || 'free'} plan</p>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your email subject line analyses and track performance.
            </p>
          </div>
          <Link href="/dashboard/new-analysis">
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Usage Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <p className="text-2xl font-bold text-foreground capitalize">
                  {subscription?.plan || 'free'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Analyses</p>
                <p className="text-2xl font-bold text-foreground">
                  {analyses?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="text-2xl font-bold text-accent">Active</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Settings className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Analyses */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Analyses</h2>

          {analysesLoading ? (
            <Card className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></div>
              <p className="text-muted-foreground">Loading analyses...</p>
            </Card>
          ) : analyses && analyses.length > 0 ? (
            <div className="space-y-4">
              {analyses.map((analysis: any) => (
                <Link key={analysis.id} href={`/dashboard/analysis/${analysis.id}`}>
                  <Card className="p-6 border border-border hover:border-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {analysis.campaignType}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {analysis.campaignContext}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <BarChart3 className="w-5 h-5 text-accent" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border border-border">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-6">No analyses yet</p>
              <Link href="/dashboard/new-analysis">
                <Button>Create Your First Analysis</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
