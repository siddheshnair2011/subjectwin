import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, Loader2, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export default function BillingHistory() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: billingData, isLoading } = trpc.billing.getHistory.useQuery();
  const { data: subscriptionData } = trpc.billing.getSubscriptionDetails.useQuery();

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
          <span className="text-xl font-bold text-foreground">Billing History</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Current Subscription */}
          {subscriptionData?.subscription && (
            <Card className="p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Current Subscription</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Plan</p>
                  <p className="text-lg font-bold text-foreground capitalize">
                    {subscriptionData.subscription.plan}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Status</p>
                  <p className="text-lg font-bold text-green-600 capitalize">
                    {subscriptionData.subscription.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Current Period</p>
                  <p className="text-sm text-foreground">
                    {subscriptionData.subscription.currentPeriodStart.toLocaleDateString()} -{" "}
                    {subscriptionData.subscription.currentPeriodEnd.toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Next Billing Date</p>
                  <p className="text-sm text-foreground">
                    {subscriptionData.subscription.nextBillingDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {subscriptionData.subscription.cancelAtPeriodEnd && (
                <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900">Cancellation Scheduled</p>
                    <p className="text-sm text-yellow-800">
                      Your subscription will be cancelled on{" "}
                      {subscriptionData.subscription.nextBillingDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Invoices */}
          <Card className="p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Invoices</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : billingData?.error ? (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">{billingData.error}</p>
              </div>
            ) : billingData?.invoices && billingData.invoices.length > 0 ? (
              <div className="space-y-4">
                {billingData.invoices.map((invoice: any) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        Invoice {invoice.number || invoice.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.date.toLocaleDateString()} • ${(invoice.amount / 100).toFixed(2)}{" "}
                        {invoice.currency.toUpperCase()}
                      </p>
                      {invoice.periodStart && invoice.periodEnd && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Period: {invoice.periodStart.toLocaleDateString()} -{" "}
                          {invoice.periodEnd.toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "draft"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {invoice.status}
                      </span>

                      {invoice.pdfUrl && (
                        <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No invoices yet</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
