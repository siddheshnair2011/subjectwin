import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Settings() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      toast.success("Logged out successfully");
      navigate("/");
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  if (!isAuthenticated || !user) {
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
          <span className="text-xl font-bold text-foreground">Settings</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12 max-w-2xl">
        <div className="space-y-8">
          {/* Profile Section */}
          <Card className="p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Profile</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  value={user.name || ""}
                  disabled
                  className="w-full bg-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full bg-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Account Type
                </label>
                <div className="p-4 rounded-lg bg-muted border border-border">
                  <p className="text-foreground font-medium capitalize">
                    {user.role === "admin" ? "Administrator" : "User"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Member Since
                </label>
                <div className="p-4 rounded-lg bg-muted border border-border">
                  <p className="text-foreground font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences Section */}
          <Card className="p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Preferences</h2>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-foreground">
                    Email Notifications
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-border"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about analysis results and account updates
                </p>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-foreground">
                    Marketing Emails
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      className="w-4 h-4 rounded border-border"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features and special offers
                </p>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-8 border border-red-200 bg-red-50">
            <h2 className="text-2xl font-bold text-red-900 mb-6">Danger Zone</h2>

            <div className="space-y-4">
              <Button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                variant="destructive"
                className="w-full gap-2"
              >
                {logoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
