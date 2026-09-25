import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Landing from "./pages/Landing.tsx";
import Templates from "./pages/Templates.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import Pricing from "./pages/Pricing.tsx";
import Account from "./pages/Account.tsx";
import Contact from "./pages/Contact.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import Refund from "./pages/Refund.tsx";
import AdminPayments from "./pages/AdminPayments.tsx";
import AdminContacts from "./pages/AdminContacts.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import AdminSubscriptions from "./pages/AdminSubscriptions.tsx";
import AdminLeads from "./pages/AdminLeads.tsx";
import AdminOverview from "./pages/AdminOverview.tsx";
import AdminPaymentSettings from "./pages/AdminPaymentSettings.tsx";
import SolutionPage from "./pages/SolutionPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/app" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/account" element={<Account />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/id-card-maker-for-photographers" element={<SolutionPage kind="photographers" />} />
            <Route path="/id-card-software-for-print-shops" element={<SolutionPage kind="print-shops" />} />
            <Route path="/bulk-id-card-maker-from-excel" element={<SolutionPage kind="excel" />} />
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/payment-settings" element={<AdminPaymentSettings />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
