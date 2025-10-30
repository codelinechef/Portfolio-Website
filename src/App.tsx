import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "./contexts/ThemeContext";
import { AudioProvider } from "./contexts/AudioContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { SmoothScroll } from "./components/SmoothScroll";
import Index from "./pages/Index";
import RedZone from "./pages/RedZone";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { initAnalytics } from "./utils/analytics";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          <ThemeProvider>
            <AudioProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <SmoothScroll>
                  <BrowserRouter basename={import.meta.env.BASE_URL}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/fyi" element={<RedZone />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </SmoothScroll>
              </TooltipProvider>
            </AudioProvider>
          </ThemeProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
