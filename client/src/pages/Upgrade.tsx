import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Free",
    price: 0,
    priceDisplay: "Free",
    description: "Perfect for getting started",
    features: [
      "2 analyses per month",
      "Basic subject line generation",
      "Email support",
      "Community access",
    ],
    cta: "Current Plan",
    ctaDisabled: true,
    priceId: null,
  },
  {
    name: "Growth",
    price: 99,
    priceDisplay: "$99",
    description: "For growing e-commerce brands",
    features: [
      "Unlimited analyses",
      "Advanced AI generation",
      "Prediction accuracy tracking",
      "CSV export",
      "Priority support",
      "API access",
    ],
    cta: "Upgrade to Growth",
    ctaDisabled: false,
    priceId: "price_growth",
  },
  {
    name: "Accelerator",
    price: 299,
    priceDisplay: "$299",
    description: "For enterprise teams",
    features: [
      "Everything in Growth",
      "Team collaboration",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Upgrade to Accelerator",
    ctaDisabled: false,
    priceId: "price_accelerator",
  },
];

export default function Upgrade() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();

  const { data: subscription, isLoading: subscriptionLoading } =
    trpc.subscription.get.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const createCheckout = trpc.checkout.create.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, "_blank");
        toast.success("Opening checkout...");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create checkout session");
    },
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  const currentPlan = subscription?.plan || "free";

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
          <span className="text-xl font-bold text-foreground">Upgrade Plan</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock advanced features to optimize your email campaigns at scale
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.name.toLowerCase();
            const isRecommended = plan.name === "Growth";

            return (
              <Card
                key={plan.name}
                className={`relative p-8 border transition-all ${
                  isRecommended
                    ? "border-accent shadow-lg scale-105"
                    : "border-border hover:shadow-md"
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.priceDisplay}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    if (!plan.priceId) return;
                    createCheckout.mutate({
                      priceId: plan.priceId,
                    });
                  }}
                  disabled={
                    plan.ctaDisabled ||
                    isCurrent ||
                    createCheckout.isPending
                  }
                  className="w-full"
                  variant={isCurrent ? "outline" : "default"}
                >
                  {createCheckout.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : isCurrent ? (
                    "Current Plan"
                  ) : (
                    plan.cta
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </Card>

            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-sm text-muted-foreground">
                We offer a 30-day money-back guarantee if you're not satisfied
                with our service.
              </p>
            </Card>

            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American
                Express) through Stripe.
              </p>
            </Card>

            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. No questions
                asked. You'll retain access until the end of your billing cycle.
              </p>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="p-12 border border-border bg-muted/50">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Need help choosing a plan?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <Button variant="outline">Contact Sales</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
