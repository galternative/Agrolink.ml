import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const LanguageToggle = ({ className = "" }) => {
  const { lang, setLang } = useLanguage();
  return (
    <div
      data-testid="nav-language-toggle"
      className={`relative flex items-center rounded-full border border-[#17231D]/12 bg-white p-0.5 text-xs font-bold ${className}`}
    >
      {["en", "pt"].map((l) => (
        <button
          key={l}
          data-testid={`language-toggle-${l}`}
          onClick={() => setLang(l)}
          aria-label={l === "en" ? "English" : "Português"}
          className={`relative z-10 px-3 py-1.5 rounded-full transition-colors duration-200 ${
            lang === l ? "bg-[#063B2A] text-white" : "text-[#66736B] hover:text-[#063B2A]"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export const Header = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: t("nav.home"), end: true },
    { to: "/about", label: t("nav.about") },
    { to: "/products", label: t("nav.products") },
    { to: "/solutions", label: t("nav.solutions") },
    { to: "/agribusiness", label: t("nav.agribusiness") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-[0_4px_24px_rgba(6,59,42,0.08)] border-b border-[#17231D]/8" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>
          <Link to="/" data-testid="header-logo-link" className="flex items-center gap-2 shrink-0">
            <img
              src="/agrolink-logo.png"
              alt="AgroLink.ml"
              className={`w-auto transition-all duration-300 ${scrolled ? "h-10" : "h-12"}`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                data-testid={`nav-link-${l.to === "/" ? "home" : l.to.slice(1)}`}
                className={({ isActive }) =>
                  `relative text-sm font-semibold transition-colors duration-200 nav-underline ${
                    isActive ? "text-[#1F8A3B]" : "text-[#17231D] hover:text-[#1F8A3B]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle />
            <Button
              data-testid="nav-request-quote-button"
              onClick={() => navigate("/contact")}
              className="rounded-xl h-10 px-5 bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold active:scale-[0.98]"
            >
              {t("nav.requestQuote")}
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <LanguageToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  data-testid="mobile-menu-button"
                  variant="outline"
                  size="icon"
                  aria-label="Menu"
                  className="rounded-xl border-[#17231D]/12"
                >
                  <Menu className="w-5 h-5 text-[#063B2A]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white p-0">
                <div className="p-6 border-b border-[#17231D]/8">
                  <img src="/agrolink-logo.png" alt="AgroLink.ml" className="h-10 w-auto" />
                </div>
                <nav className="flex flex-col p-4">
                  {links.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      end={l.end}
                      onClick={() => setOpen(false)}
                      data-testid={`mobile-nav-link-${l.to === "/" ? "home" : l.to.slice(1)}`}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                          isActive ? "bg-[#F7F9F5] text-[#1F8A3B]" : "text-[#17231D] hover:bg-[#F7F9F5]"
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                  <Button
                    data-testid="mobile-request-quote-button"
                    onClick={() => {
                      setOpen(false);
                      navigate("/contact");
                    }}
                    className="mt-4 rounded-xl h-11 bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold"
                  >
                    {t("nav.requestQuote")}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
