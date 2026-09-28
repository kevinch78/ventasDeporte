import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HomePage } from './pages/HomePage';

import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { MobileCartBar } from './components/layout/MobileCartBar';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        theme="dark" 
        position="bottom-right"
        toastOptions={{
          className: 'bg-dark-card border border-dark-border text-white font-medium rounded-xl shadow-2xl',
          style: {
            background: '#151A26',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            color: 'white',
          }
        }} 
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/producto/:slug" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido-confirmado" element={<OrderSuccessPage />} />
        <Route path="/envios" element={<ShippingPolicyPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/pedidos" replace />} />
            <Route path="pedidos" element={<AdminOrdersPage />} />
            <Route path="productos" element={<AdminProductsPage />} />
          </Route>
        </Route>
      </Routes>
      <MobileCartBar />
    </BrowserRouter>
  );
}

export default App;
