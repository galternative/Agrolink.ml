import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { getToken, clearToken, api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminT } from "@/pages/admin/adminI18n";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  Handshake,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
} from "lucide-react";

const NavItems = ({ ta, onClick }) => {
  const items = [
    { to: "/admin", end: true, icon: LayoutDashboard, label: ta("dashboard") },
    { to: "/admin/products", icon: Package, label: ta("products") },
    { to: "/admin/categories", icon: FolderTree, label: ta("categories") },
    { to: "/admin/team", icon: Users, label: ta("team") },
    { to: "/admin/partners", icon: Handshake, label: ta("partners") },
    { to: "/admin/enquiries", icon: Inbox, label: ta("enquiries") },
    { to: "/admin/settings", icon: Settings, label: ta("settings") },
  ];
  return (
    <nav className="flex flex-col gap-1 px-3">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onClick}
          data-testid={`admin-nav-${item.to === "/admin" ? "dashboard" : item.to.split("/").pop()}`}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              isActive ? "bg-[#1F8A3B] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <item.icon className="w-4.5 h-4.5 w-5 h-5" strokeWidth={1.8} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const ta = useAdminT(lang);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate("/admin/login");
      return;
    }
    api
      .get("/auth/me")
      .then(() => setChecked(true))
      .catch(() => {
        clearToken();
        navigate("/admin/login");
      });
  }, [navigate]);

  const logout = () => {
    clearToken();
    navigate("/admin/login");
  };

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#F7F9F5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1F8A3B]/20 border-t-[#1F8A3B] rounded-full animate-spin" />
      </div>
    );
  }

  const sidebarInner = (
    <>
      <div className="p-5">
        <div className="bg-white rounded-2xl p-2.5 w-fit">
          <img src="/agrolink-logo.png" alt="AgroLink" className="h-9 w-auto" />
        </div>
      </div>
      <NavItems ta={ta} onClick={() => setMobileOpen(false)} />
      <div className="mt-auto p-4 space-y-2">
        <div className="flex items-center rounded-full border border-white/20 p-0.5 w-fit text-xs font-bold mb-2">
          {["en", "pt"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              data-testid={`admin-language-${l}`}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                lang === l ? "bg-[#5DBB32] text-[#063B2A]" : "text-white/60 hover:text-white"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <Link
          to="/"
          data-testid="admin-view-site-link"
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-2"
        >
          <ExternalLink className="w-4 h-4" />
          {ta("viewSite")}
        </Link>
        <button
          data-testid="admin-logout-button"
          onClick={logout}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-2"
        >
          <LogOut className="w-4 h-4" />
          {ta("logout")}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F7F9F5] flex">
      {/* Desktop sidebar */}
      <aside
        data-testid="admin-sidebar"
        className="hidden lg:flex w-64 shrink-0 bg-[#063B2A] flex-col sticky top-0 h-screen"
      >
        {sidebarInner}
      </aside>

      {/* Mobile top bar */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden sticky top-0 z-40 bg-[#063B2A] flex items-center justify-between px-4 py-3">
          <img src="/agrolink-logo.png" alt="AgroLink" className="h-8 w-auto bg-white rounded-lg p-1" />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" data-testid="admin-mobile-menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-[#063B2A] border-0 p-0 flex flex-col">
              {sidebarInner}
            </SheetContent>
          </Sheet>
        </div>
        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
