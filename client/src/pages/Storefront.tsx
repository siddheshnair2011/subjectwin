import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Storefront() {
  const { data: products, isLoading } = trpc.connect.storefront.products.useQuery();
  const createCheckout = trpc.connect.storefront.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, "_blank");
        toast.success("Opening checkout...");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create checkout");
    },
  });

  const [selectedQuantities, setSelectedQuantities] = useState<Record<number, number>>({});

  const handleQuantityChange = (productId: number, quantity: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, quantity),
    }));
  };

  const handleBuyNow = (productId: number) => {
    const quantity = selectedQuantities[productId] || 1;
    createCheckout.mutate({
      productId,
      quantity,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <span className="text-xl font-bold text-foreground cursor-pointer">SubjectWin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Discover products from our sellers and support their businesses.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : !products || products.length === 0 ? (
          <Card className="p-12 text-center border border-border">
            <p className="text-muted-foreground mb-4">No products available yet.</p>
            <p className="text-sm text-muted-foreground">
              Check back soon as sellers add their products!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="mb-6 border-t border-b border-border py-4">
                  <p className="text-2xl font-bold text-accent">
                    ${(product.priceInCents / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.currency.toUpperCase()}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={selectedQuantities[product.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(product.id, parseInt(e.target.value) || 1)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <Button
                    onClick={() => handleBuyNow(product.id)}
                    disabled={createCheckout.isPending}
                    className="w-full gap-2"
                  >
                    {createCheckout.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Buy Now
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
