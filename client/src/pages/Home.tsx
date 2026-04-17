import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Sparkles } from "lucide-react";
import { Link } from "wouter";
import UnderwaterHeroStory from "@/components/UnderwaterHeroStory";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold text-foreground">SubjectWin</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button>Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Render the Underwater Hero Story which includes all content */}
      <UnderwaterHeroStory />
    </div>
  );
}
