import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="signals" element={<div className="p-6"><h1 className="text-2xl font-bold">Trading Signals</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="risk" element={<div className="p-6"><h1 className="text-2xl font-bold">Risk Management</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="performance" element={<div className="p-6"><h1 className="text-2xl font-bold">Performance Analytics</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="strategies" element={<div className="p-6"><h1 className="text-2xl font-bold">Strategy Manager</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="health" element={<div className="p-6"><h1 className="text-2xl font-bold">System Health</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="profile" element={<div className="p-6"><h1 className="text-2xl font-bold">Profile</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
