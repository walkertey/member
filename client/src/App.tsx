import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import Benefits from "./pages/Benefits";
import Home from "./pages/Home";
import Member from "./pages/Member";
import Orders from "./pages/Orders";
import Points from "./pages/Points";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/member" component={Member} />
      <Route path="/orders" component={Orders} />
      <Route path="/points" component={Points} />
      <Route path="/benefits" component={Benefits} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
