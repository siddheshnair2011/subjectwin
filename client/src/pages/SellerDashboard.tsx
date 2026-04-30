import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { DollarSign, TrendingUp, Users, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Link } from "wouter";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Stripe Connect account status
  const connectAccountQuery = trpc.connect.account.get.useQuery();
  const billingQuery = trpc.billing.getSubscriptionDetails.useQuery();

  useEffect(() => {
    if (connectAccountQuery.data !== undefined || connectAccountQuery.error) {
      setIsLoading(false);
    }
  }, [connectAccountQuery.data, connectAccountQuery.error]);

  const connectAccount = connectAccountQuery.data;
  const hasConnectAccount = !!connectAccount;

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your SubjectWin marketplace presence and earnings
        </p>
      </div>

      {/* Stripe Connect Status */}
      <Card>
        <CardHeader>
          <CardTitle>Stripe Connect Account</CardTitle>
          <CardDescription>
            Connect your account to start selling and receiving payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasConnectAccount ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900">No Connect Account</h3>
                    <p className="text-sm text-yellow-800 mt-1">
                      Create a Stripe Connect account to start monetizing your templates and services.
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href="/dashboard/connect/setup">
                  Create Stripe Connect Account
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Account ID</div>
                  <div className="font-mono text-sm break-all">{connectAccount.stripeAccountId}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(connectAccount.onboardingStatus)}
                    <span className="capitalize">{connectAccount.onboardingStatus}</span>
                  </div>
                </div>
              </div>

              {connectAccount.onboardingStatus === "pending" && (
                <Button variant="outline" asChild>
                  <Link href="/dashboard/connect/onboard">
                    Complete Onboarding
                  </Link>
                </Button>
              )}

              {connectAccount.onboardingStatus === "completed" && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900">Ready to Receive Payments</h3>
                      <p className="text-sm text-green-800 mt-1">
                        Your account is fully set up and can receive payments.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              Coming soon: Track your earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              30-day earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next payout: N/A
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monetization Options */}
      <Card>
        <CardHeader>
          <CardTitle>Monetization Options</CardTitle>
          <CardDescription>
            Ways to earn money with SubjectWin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Affiliate Program */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Affiliate Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Earn 20% commission on every referral that signs up for a paid plan
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/affiliate">
                    View Affiliate Details
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Custom Templates */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Custom Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Create and sell custom email templates and subject line packs
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/templates">
                    Manage Templates
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Consulting Services */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  Consulting Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Offer email marketing consulting and optimization services
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/services">
                    Set Up Services
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Revenue Share */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Revenue Share
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Partner with us and earn from platform growth
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/partnerships">
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest sales and payouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No transactions yet. Start monetizing to see activity here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
