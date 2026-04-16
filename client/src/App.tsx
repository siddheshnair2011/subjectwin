import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NewAnalysis from "./pages/NewAnalysis";
import AnalysisDetail from "./pages/AnalysisDetail";
import BrandProfile from "./pages/BrandProfile";
import Storefront from "./pages/Storefront";
import ConnectDashboard from "./pages/ConnectDashboard";
import Settings from "./pages/Settings";
import Upgrade from "./pages/Upgrade";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/dashboard/brand-profile"} component={BrandProfile} />
      <Route path={"/dashboard/new-analysis"} component={NewAnalysis} />
      <Route path={"/dashboard/analysis/:id"} component={AnalysisDetail} />
      <Route path={"/dashboard/connect"} component={ConnectDashboard} />
      <Route path={"/dashboard/settings"} component={Settings} />
      <Route path={"/dashboard/upgrade"} component={Upgrade} />
      <Route path={"/storefront"} component={Storefront} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
