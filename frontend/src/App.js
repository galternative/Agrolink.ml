import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Solutions from "@/pages/Solutions";
import Agribusiness from "@/pages/Agribusiness";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/admin/AdminLogin";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminTeam from "@/pages/admin/AdminTeam";
import AdminPartners from "@/pages/admin/AdminPartners";
import AdminEnquiries from "@/pages/admin/AdminEnquiries";
import AdminSettings from "@/pages/admin/AdminSettings";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/agribusiness" element={<Agribusiness />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </LanguageProvider>
  );
}

export default App;
