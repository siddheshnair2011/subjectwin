import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ConnectDashboard() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: account, isLoading: accountLoading, refetch: refetchAccount } = 
    trpc.connect.account.get.useQuery();
  const { data: products, isLoading: productsLoading } = 
    trpc.connect.product.list.useQuery();

  const createAccount = trpc.connect.account.create.useMutation({
    onSuccess: () => {
      toast.success("Connect account created! Redirecting to onboarding...");
      refetchAccount();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create account");
    },
  });

  const createOnboardingLink = trpc.connect.account.createOnboardingLink.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, "_blank");
        toast.success("Opening onboarding page...");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create onboarding link");
    },
  });

  const createProduct = trpc.connect.product.create.useMutation({
    onSuccess: () => {
      toast.success("Product created!");
      refetchAccount();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create product");
    },
  });

  const [displayName, setDisplayName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(!account);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");

  // Type-safe account access
  const accountWithStatus = account as any;

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !contactEmail.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    createAccount.mutate({
      displayName,
      contactEmail,
    });
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice.trim()) {
      toast.error("Please fill in required fields");
      return;
    }
    createProduct.mutate({
      name: productName,
      description: productDescription,
      priceInCents: Math.round(parseFloat(productPrice) * 100),
    });
    setProductName("");
    setProductDescription("");
    setProductPrice("");
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
          <span className="text-xl font-bold text-foreground">Seller Dashboard</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12 max-w-4xl">
        {showCreateAccount && !account ? (
          <Card className="p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Create Stripe Connect Account</h2>
            <p className="text-muted-foreground mb-8">
              Set up your seller account to start accepting payments.
            </p>

            <form onSubmit={handleCreateAccount} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Display Name
                </label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your business name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Contact Email
                </label>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full"
                />
              </div>

              <div className="flex gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={createAccount.isPending}
                  className="flex-1 gap-2"
                >
                  {createAccount.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        ) : account ? (
          <div className="space-y-8">
            {/* Account Status */}
            <Card className="p-8 border border-border">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Account Status</h2>
                  <p className="text-muted-foreground">
                    {account.displayName} ({account.contactEmail})
                  </p>
                </div>
                {accountWithStatus?.onboardingComplete ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-foreground mb-1">Onboarding Status</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {account.onboardingStatus}
                  </p>
                </div>

                {accountWithStatus?.requirementsStatus && (
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium text-foreground mb-1">Requirements</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {accountWithStatus?.requirementsStatus}
                    </p>
                  </div>
                )}

                {accountWithStatus?.readyToReceivePayments && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm font-medium text-green-900">
                      ✓ Ready to receive payments
                    </p>
                  </div>
                )}
              </div>

              {!accountWithStatus?.onboardingComplete && (
                <Button
                  onClick={() => createOnboardingLink.mutate()}
                  disabled={createOnboardingLink.isPending}
                  className="w-full gap-2"
                >
                  {createOnboardingLink.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "Complete Onboarding"
                  )}
                </Button>
              )}
            </Card>

            {/* Create Product */}
            {accountWithStatus?.onboardingComplete && (
              <Card className="p-8 border border-border">
                <h3 className="text-xl font-bold text-foreground mb-6">Create Product</h3>

                <form onSubmit={handleCreateProduct} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Product Name *
                    </label>
                    <Input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="E.g., Premium Email Templates"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder="Describe your product"
                      className="w-full p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Price (USD) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.50"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="9.99"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum $0.50 USD
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={createProduct.isPending}
                    className="w-full gap-2"
                  >
                    {createProduct.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Product
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            )}

            {/* Products List */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            ) : products && products.length > 0 ? (
              <Card className="p-8 border border-border">
                <h3 className="text-xl font-bold text-foreground mb-6">Your Products</h3>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{product.name}</h4>
                          {product.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <p className="text-lg font-bold text-accent">
                          ${(product.priceInCents / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}
      </div>
    </div>
  );
}
