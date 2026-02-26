import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/contexts/QueryProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Error Pages
import { ForbiddenPage } from "@/pages/Error/ForbiddenPage";
import { GatewayTimeoutPage } from "@/pages/Error/GatewayTimeoutPage";
import { NotFoundPage } from "@/pages/Error/NotFoundPage";
import { ServerErrorPage } from "@/pages/Error/ServerErrorPage";
import { ServiceUnavailablePage } from "@/pages/Error/ServiceUnavailablePage";
import { UnauthorizedPage } from "@/pages/Error/UnauthorizedPage";

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<div>Home Page - TODO</div>} />

            {/* Auth Routes */}
            <Route path="/login" element={<div>Login Page - TODO</div>} />
            <Route path="/signup" element={<div>Signup Page - TODO</div>} />

            {/* Error Routes */}
            <Route path="/401" element={<UnauthorizedPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="/503" element={<ServiceUnavailablePage />} />
            <Route path="/504" element={<GatewayTimeoutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
