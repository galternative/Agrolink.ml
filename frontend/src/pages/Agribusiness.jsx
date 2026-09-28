import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTASection } from "@/components/CTASection";
import { ArrowRight, Wheat, Beef, Egg, Package, Sprout, Globe2 } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1518889767729-1db630b9253b?crop=entropy&cs=srgb&fm=jpg&q=80&w=1920";

const SECTOR_IMAGES = [
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1563281577-a7be47e20db9?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1518889767729-1db630b9253b?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
];

export default function Agribusiness() {
  const { t } = useLanguage();
  useSEO("agribusiness");
  const sectorIcons = [Wheat, Beef, Egg, Package, Sprout, Globe2];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#063B2A]">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#063B2A]/95 via-[#063B2A]/80 to-[#063B2A]/50" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <p className="text-xs tracking-[0.22em] font-bold text-[#5DBB32] mb-3">{t("agriPage.heroLabel")}</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
            {t("agriPage.heroTitle")}
          </h1>
          <p className="mt-4 text-white/70 max-w-xl">{t("agriPage.heroSubtitle")}</p>
        </div>
      </section>

      {/* Network */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("network.label")} title={t("network.title")} subtitle={t("network.subtitle")} />
          <Reveal>
            <div
              data-testid="agribusiness-network-graphic"
              className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 rounded-3xl bg-[#063B2A] p-10 sm:p-14"
            >
              {t("network.nodes").map((node, i, arr) => (
                <React.Fragment key={node}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                    className="rounded-2xl bg-white/10 border border-[#5DBB32]/30 px-6 py-4 text-white font-bold text-sm"
                  >
                    {node}
                  </motion.div>
                  {i < arr.length - 1 && (
                    <div className="md:mx-2 rotate-90 md:rotate-0">
                      <ArrowRight className="w-5 h-5 text-[#C9972B]" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("sectors.label")} title={t("sectors.title")} />
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t("sectors.items").map((item, i) => {
              const Icon = sectorIcons[i];
              return (
                <RevealItem key={i}>
                  <div className="group relative rounded-2xl overflow-hidden aspect-[16/10] shadow-[0_6px_24px_rgba(6,59,42,0.08)]">
                    <img
                      src={SECTOR_IMAGES[i]}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#063B2A]/90 via-[#063B2A]/30 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white text-lg">{item.title}</h3>
                        <p className="mt-1 text-xs text-white/70">{item.desc}</p>
                      </div>
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                      </div>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      {/* Why */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("why.label")} title={t("why.title")} />
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t("why.items").map((item, i) => (
              <RevealItem key={i}>
                <div className="h-full rounded-2xl bg-white border border-[#17231D]/10 p-7 shadow-[0_6px_24px_rgba(6,59,42,0.06)]">
                  <span className="text-xs font-extrabold text-[#C9972B]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-bold text-[#17231D]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#66736B] leading-relaxed">{item.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
