import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { RevealStagger, RevealItem, Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { Tractor, Building2, Truck, BarChart3, Sprout, ArrowRight } from "lucide-react";

const SOLUTION_IMAGES = [
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1518889767729-1db630b9253b?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
];

export default function Solutions() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  useSEO("solutions");

  const icons = [Tractor, Building2, Truck, BarChart3, Sprout];

  return (
    <div>
      <section className="bg-[#063B2A] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs tracking-[0.22em] font-bold text-[#5DBB32] mb-3">{t("solutions.label")}</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
            {t("solutions.title")}
          </h1>
          <p className="mt-4 text-white/70 max-w-xl">{t("solutions.subtitle")}</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t("solutions.items").map((item, i) => {
              const Icon = icons[i];
              return (
                <RevealItem key={i}>
                  <div
                    data-testid="solutions-page-card"
                    className="group rounded-2xl bg-white border border-[#17231D]/10 overflow-hidden shadow-[0_6px_24px_rgba(6,59,42,0.06)] hover:shadow-[0_18px_60px_rgba(6,59,42,0.12)] transition-shadow duration-200"
                  >
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img
                        src={SOLUTION_IMAGES[i]}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#063B2A]/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-[#17231D]">{item.title}</h3>
                      <p className="mt-2 text-sm text-[#66736B] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("process.label")} title={t("process.title")} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-5 relative">
            <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#1F8A3B]/15 via-[#1F8A3B]/50 to-[#1F8A3B]/15" />
            {t("process.steps").map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="relative flex md:flex-col md:items-center md:text-center gap-5 md:gap-0">
                  <div className="relative z-10 w-14 h-14 shrink-0 rounded-2xl bg-[#F7F9F5] border border-[#1F8A3B]/30 flex items-center justify-center">
                    <span className="text-[#1F8A3B] font-extrabold">{step.num}</span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C9972B]" />
                  </div>
                  <div className="md:mt-5">
                    <h3 className="font-bold text-[#17231D] text-lg">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-[#66736B] leading-relaxed max-w-[240px] md:mx-auto">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Button
              data-testid="solutions-cta-button"
              onClick={() => navigate("/contact")}
              className="rounded-xl h-12 px-8 bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold text-base"
            >
              {t("nav.requestQuote")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
