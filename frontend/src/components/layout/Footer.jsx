import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { Mail, Phone, MessageCircle } from "lucide-react";

export const Footer = () => {
  const { t, lang, setLang } = useLanguage();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/settings")).data,
  });

  // Frontend fallbacks so branch contacts remain visible even if
  // the backend settings endpoint does not contain these values yet.
  const contactEmail = settings?.email || "agrolink.ml@gmail.com";
  const angolaPhone = settings?.phone_angola || "+244 924 546 980";
  const namibiaPhone = settings?.phone_namibia || "+264 85 379 4593";
  const angolaWhatsapp = settings?.whatsapp_angola || "+244 924 546 980";

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/products", label: t("nav.products") },
    { to: "/solutions", label: t("nav.solutions") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer data-testid="site-footer" className="bg-[#063B2A] text-[#F7F9F5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-3 w-fit">
              <img src="/agrolink-logo.png" alt="AgroLink.ml" className="h-12 w-auto" />
            </div>
            <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-xs">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#5DBB32] mb-4">{t("footer.navigation")}</h4>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    data-testid={`footer-link-${l.to === "/" ? "home" : l.to.slice(1)}`}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#5DBB32] mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 text-[#C9972B] shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors" data-testid="footer-email">
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 text-[#C9972B] shrink-0" />
                <span>
                  <span className="block text-xs text-white/50">{t("contact.angolaBranch")}</span>
                  {angolaPhone}
                  <span className="block text-xs text-white/50 mt-0.5">Luanda, Angola · Nº Fiscal 5003515893</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 text-[#C9972B] shrink-0" />
                <span>
                  <span className="block text-xs text-white/50">{t("contact.namibiaBranch")}</span>
                  {namibiaPhone}
                  <span className="block text-xs text-white/50 mt-0.5">Rocky Crest, Namibia</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 mt-0.5 text-[#C9972B] shrink-0" />
                <a
                  href={`https://wa.me/${angolaWhatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp — Angola
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 mt-0.5 text-[#C9972B] shrink-0" />
                <a
                  href={`https://wa.me/${namibiaPhone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp — Namibia
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#5DBB32] mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <span className="cursor-default">{t("footer.privacy")}</span>
              </li>
              <li>
                <span className="cursor-default">{t("footer.terms")}</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-bold tracking-wider uppercase text-[#5DBB32] mb-3">{t("footer.language")}</h4>
              <div className="flex items-center rounded-full border border-white/20 p-0.5 w-fit text-xs font-bold">
                {["en", "pt"].map((l) => (
                  <button
                    key={l}
                    data-testid={`footer-language-${l}`}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      lang === l ? "bg-[#5DBB32] text-[#063B2A]" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} AgroLink.ml. {t("footer.rights")}</p>
          <Link to="/admin/login" data-testid="footer-admin-link" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            {t("misc.adminLogin")}
          </Link>
        </div>
      </div>
    </footer>
  );
};
