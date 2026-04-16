import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Download } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function OrderConfirmation() {
  const [, navigate] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session ID from URL params
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");
    setSessionId(id);

    // Redirect if no session ID
    if (!id) {
      navigate("/storefront");
    }
  }, [navigate]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center gap-4 h-16">
          <Link href="/storefront">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <span className="text-xl font-bold text-foreground">Order Confirmation</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12 max-w-2xl">
        <Card className="p-12 border border-border text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            Order Confirmed!
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been successfully processed.
          </p>

          <div className="bg-muted p-6 rounded-lg mb-8 text-left">
            <p className="text-sm font-semibold text-foreground mb-2">Order Details</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Session ID:</span>
                <span className="font-mono text-foreground">{sessionId.slice(0, 20)}...</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="text-foreground">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your email address with order details and download links.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/storefront" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full gap-2">
                <Download className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Need help? <a href="#" className="text-accent hover:underline">Contact support</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
