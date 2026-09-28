import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-[#063B2A] px-6 py-14 sm:px-14 sm:py-20 text-center">
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #5DBB32 0, transparent 40%), radial-gradient(circle at 80% 70%, #C9972B 0, transparent 40%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">{t("cta.subtitle")}</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                data-testid="cta-request-quote-button"
                onClick={() => navigate("/contact")}
                className="rounded-xl h-12 px-7 bg-[#C9972B] hover:bg-[#b88722] text-[#063B2A] font-bold text-base active:scale-[0.98]"
              >
                {t("cta.quote")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                data-testid="cta-contact-button"
                onClick={() => navigate("/contact")}
                variant="outline"
                className="rounded-xl h-12 px-7 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white font-semibold text-base"
              >
                {t("cta.contact")}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
