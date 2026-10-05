import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import { CTASection } from "@/components/CTASection";
import {
  Sprout,
  Wheat,
  Link2,
  ArrowRight,
  Target,
  Eye,
  Gem,
  Handshake,
  ShieldCheck,
  LineChart,
  Headset,
  Puzzle,
  Users,
  Beef,
  Egg,
  Package,
  Tractor,
  Globe2,
  Coffee,
  TreePine,
  Sun,
  CheckCircle2,
} from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=srgb&fm=jpg&q=80&w=1920";
const ABOUT_IMG =
  "https://images.unsplash.com/photo-1567471894556-0d81c2936777?crop=entropy&cs=srgb&fm=jpg&q=85&w=900";
const NETWORK_IMG =
  "https://images.unsplash.com/photo-1518889767729-1db630b9253b?crop=entropy&cs=srgb&fm=jpg&q=80&w=1600";

const STATIC_PARTNERS = [
  { name: "Grupo Chicoil", logo: "/Grupochicoil.png" },
  { name: "Agrolink Partner", logo: "/file_000000000ac8820eb8e69889b95b4bcc.png" },
  { name: "Agrolink Partner", logo: "/file_000000004344820eb7a438ccd6c6c646.png" },
  { name: "Agrolink Partner", logo: "/Cafecazengo.png" },
];

const SECTOR_IMAGES = [
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1563281577-a7be47e20db9?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "https://images.unsplash.com/photo-1518889767729-1db630b9253b?crop=entropy&cs=srgb&fm=jpg&q=75&w=800",
  "/Zengo.png",
  "/Wood.jpg",
  "/Solars.jpeg",
];

const LeafPattern = () => (
  <svg
    className="absolute top-0 right-0 w-[420px] h-[420px] opacity-[0.08] pointer-events-none hidden lg:block"
    viewBox="0 0 200 200"
    fill="none"
  >
    <path d="M100 10 C 140 50, 160 90, 100 190 C 40 90, 60 50, 100 10 Z" stroke="#5DBB32" strokeWidth="1.5" />
    <path d="M100 30 C 130 60, 145 95, 100 170 C 55 95, 70 60, 100 30 Z" stroke="#5DBB32" strokeWidth="1" />
    <path d="M100 30 L 100 170" stroke="#5DBB32" strokeWidth="1" />
  </svg>
);

export default function Home() {
  const { t, lf } = useLanguage();
  const navigate = useNavigate();
  useSEO("home");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories")).data,
  });
  const { data: featured = [] } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => (await api.get("/products?featured=true&limit=8")).data,
  });
  const { data: partners = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => (await api.get("/partners")).data,
  });

  const catById = Object.fromEntries(categories.map((c) => [c.id, c]));

  const vpIcons = [Sprout, Wheat, Package, Link2];
  const whyIcons = [Handshake, ShieldCheck, LineChart, Headset, Puzzle, Users];
  const sectorIcons = [Wheat, Beef, Egg, Package, Sprout, Globe2, Coffee, TreePine, Sun];

  // The existing sector items come from the i18n system. The new sectors
  // use the current language as well, so their title/description never
  // remain hard-coded in English when the user switches to Portuguese.
  const { lang } = useLanguage();
  const newSectorItems = lang === "pt"
    ? [
        {
          title: "Madeira",
          desc: "Soluções de fornecimento e aquisição de madeira para construção, indústria e outros mercados.",
        },
        {
          title: "Painéis Solares",
          desc: "Soluções de fornecimento de painéis solares para projetos de energia e necessidades comerciais.",
        },
      ]
    : [
        {
          title: "Wood",
          desc: "Wood sourcing and supply solutions for construction, industry and other markets.",
        },
        {
          title: "Solar Panels",
          desc: "Solar panel sourcing and supply solutions for energy projects and commercial needs.",
        },
      ];

  const sectorItems = [
    ...t("sectors.items"),
    {
      title: lang === "pt" ? "Café" : "Coffee",
      desc: lang === "pt"
        ? "Soluções de produção, aquisição e fornecimento de café, conectando produtores aos mercados regionais e internacionais."
        : "Coffee production, sourcing and supply solutions connecting producers with regional and international markets.",
    },
    ...newSectorItems,
  ];

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#063B2A]">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-45" fetchpriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#063B2A]/95 via-[#063B2A]/75 to-[#063B2A]/40" />
        </div>
        <LeafPattern />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-36">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#5DBB32]/40 bg-[#5DBB32]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#5DBB32] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9972B]" />
              {t("hero.badge")}
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              {t("hero.title1")}
              <br />
              <span className="text-[#5DBB32]">{t("hero.title2")}</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed max-w-xl">{t("hero.subtitle")}</p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button
                data-testid="hero-secondary-cta"
                onClick={() => navigate("/products")}
                className="rounded-xl h-12 px-7 bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold text-base active:scale-[0.98]"
              >
                {t("hero.ctaProducts")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                data-testid="hero-primary-cta"
                onClick={() => navigate("/contact")}
                className="rounded-xl h-12 px-7 bg-[#C9972B] hover:bg-[#b88722] text-[#063B2A] font-bold text-base active:scale-[0.98]"
              >
                {t("hero.ctaQuote")}
              </Button>
            </div>
            <p className="mt-10 flex items-center gap-2 text-xs font-semibold tracking-wide text-white/50 uppercase">
              <CheckCircle2 className="w-4 h-4 text-[#5DBB32]" />
              {t("hero.trust")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= VALUE PROPS ================= */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("valueProps.label")} title={t("valueProps.title")} />
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t("valueProps.items").map((item, i) => {
              const Icon = vpIcons[i];
              return (
                <RevealItem key={i}>
                  <div
                    data-testid="value-prop-card"
                    className="h-full rounded-2xl bg-white border border-[#17231D]/10 p-7 shadow-[0_6px_24px_rgba(6,59,42,0.06)] hover:shadow-[0_18px_60px_rgba(6,59,42,0.12)] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#F7F9F5] border border-[#1F8A3B]/15 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#1F8A3B]" strokeWidth={1.8} />
                    </div>
                    <h3 className="mt-5 font-bold text-[#17231D] text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm text-[#66736B] leading-relaxed">{item.desc}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] max-w-md">
                <img src={ABOUT_IMG} alt="AgroLink" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-2 sm:right-6 rounded-2xl bg-[#063B2A] text-white px-6 py-5 shadow-[0_18px_60px_rgba(6,59,42,0.25)]">
                <div className="flex gap-8">
                  {t("about.stats").map((s, i) => (
                    <div key={i}>
                      <p className="text-2xl font-extrabold text-[#5DBB32]">{s.value}</p>
                      <p className="text-[11px] text-white/60 font-medium max-w-[90px] leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs tracking-[0.22em] font-bold text-[#1F8A3B] mb-3">{t("about.label")}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17231D]">{t("about.title")}</h2>
            <p className="mt-5 text-[#66736B] leading-relaxed">{t("about.p1")}</p>
            <p className="mt-4 text-[#66736B] leading-relaxed">{t("about.p2")}</p>
            <div className="mt-7 flex flex-wrap items-center gap-2" data-testid="value-chain-strip">
              {t("about.chain").map((step, i, arr) => (
                <React.Fragment key={step}>
                  <span className="rounded-full bg-[#F7F9F5] border border-[#1F8A3B]/20 px-4 py-1.5 text-xs font-bold text-[#063B2A]">
                    {step}
                  </span>
                  {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-[#C9972B]" />}
                </React.Fragment>
              ))}
            </div>
            <Button
              data-testid="about-learn-more-button"
              onClick={() => navigate("/about")}
              variant="outline"
              className="mt-8 rounded-xl h-11 px-6 border-[#1F8A3B]/30 text-[#1F8A3B] hover:bg-[#F7F9F5] hover:text-[#167233] font-semibold"
            >
              {t("about.learnMore")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Reveal>
        </div>
      </section>

      {/* ================= MISSION / VISION / VALUES ================= */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("mvv.label")} title={t("mvv.title")} />
          <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Target, title: t("mvv.mission"), text: t("mvv.missionText") },
              { icon: Eye, title: t("mvv.vision"), text: t("mvv.visionText") },
              { icon: Gem, title: t("mvv.values"), list: t("mvv.valuesList") },
            ].map((card, i) => (
              <RevealItem key={i}>
                <div
                  data-testid="mvv-card"
                  className="h-full rounded-2xl bg-white border border-[#17231D]/10 p-8 shadow-[0_6px_24px_rgba(6,59,42,0.06)]"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#063B2A] flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-[#5DBB32]" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 font-bold text-xl text-[#17231D]">{card.title}</h3>
                  {card.text && <p className="mt-3 text-sm text-[#66736B] leading-relaxed">{card.text}</p>}
                  {card.list && (
                    <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                      {card.list.map((v) => (
                        <li key={v} className="flex items-center gap-2 text-sm text-[#66736B]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9972B] shrink-0" />
                          {v}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* ================= PRODUCT CATEGORIES ================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("products.label")} title={t("products.title")} subtitle={t("products.subtitle")} />
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <RevealItem key={cat.id}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  data-testid="category-card"
                  className="group block rounded-2xl overflow-hidden relative aspect-[4/5] shadow-[0_6px_24px_rgba(6,59,42,0.08)]"
                >
                  <img
                    src={cat.image}
                    alt={lf(cat, "name")}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#063B2A]/95 via-[#063B2A]/35 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <h3 className="font-bold text-white text-lg leading-snug">{lf(cat, "name")}</h3>
                    <p className="mt-1.5 text-xs text-white/70 leading-relaxed line-clamp-2">{lf(cat, "desc")}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#5DBB32] group-hover:gap-2.5 transition-all">
                      {t("misc.seeMore")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealStagger>

          {featured.length > 0 && (
            <>
              <Reveal className="mt-16 mb-8 flex items-end justify-between">
                <h3 className="text-2xl font-extrabold text-[#17231D]">{t("products.featured")}</h3>
                <Button
                  data-testid="view-all-products-button"
                  variant="ghost"
                  onClick={() => navigate("/products")}
                  className="text-[#1F8A3B] hover:text-[#167233] hover:bg-[#F7F9F5] font-semibold rounded-xl"
                >
                  {t("products.viewAll")}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featured.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} category={catById[p.category_id]} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= SOLUTIONS ================= */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("solutions.label")} title={t("solutions.title")} subtitle={t("solutions.subtitle")} />
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {t("solutions.items").map((item, i) => (
              <RevealItem key={i}>
                <div
                  data-testid="solution-card"
                  className="h-full rounded-2xl bg-white border border-[#17231D]/10 p-6 shadow-[0_6px_24px_rgba(6,59,42,0.06)] hover:border-[#1F8A3B]/30 transition-colors duration-200"
                >
                  <span className="text-xs font-extrabold text-[#C9972B]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-bold text-[#17231D]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#66736B] leading-relaxed">{item.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16 sm:py-24 bg-[#063B2A] relative overflow-hidden grain">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <SectionHeader label={t("process.label")} title={t("process.title")} light />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-5 relative">
            <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#5DBB32]/20 via-[#5DBB32]/60 to-[#5DBB32]/20" />
            {t("process.steps").map((step, i) => (
              <Reveal key={i} delay={i * 0.1} data-testid="how-it-works-step">
                <div className="relative flex md:flex-col md:items-center md:text-center gap-5 md:gap-0">
                  <div className="relative z-10 w-14 h-14 shrink-0 rounded-2xl bg-[#0a4c37] border border-[#5DBB32]/40 flex items-center justify-center">
                    <span className="text-[#5DBB32] font-extrabold">{step.num}</span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C9972B]" />
                  </div>
                  <div className="md:mt-5">
                    <h3 className="font-bold text-white text-lg">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-white/60 leading-relaxed max-w-[240px] md:mx-auto">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY AGROLINK ================= */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("why.label")} title={t("why.title")} />
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t("why.items").map((item, i) => {
              const Icon = whyIcons[i];
              return (
                <RevealItem key={i}>
                  <div
                    data-testid="why-card"
                    className="h-full rounded-2xl bg-white border border-[#17231D]/10 p-7 shadow-[0_6px_24px_rgba(6,59,42,0.06)] hover:shadow-[0_18px_60px_rgba(6,59,42,0.12)] hover:-translate-y-0.5 transition-all duration-200 flex gap-5"
                  >
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-[#F7F9F5] border border-[#1F8A3B]/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#1F8A3B]" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#17231D]">{item.title}</h3>
                      <p className="mt-1.5 text-sm text-[#66736B] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      {/* ================= SECTORS ================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("sectors.label")} title={t("sectors.title")} />
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sectorItems.map((item, i) => {
              const Icon = sectorIcons[i];
              return (
                <RevealItem key={i}>
                  <div
                    data-testid="sector-card"
                    className="group relative rounded-2xl overflow-hidden aspect-[16/10] shadow-[0_6px_24px_rgba(6,59,42,0.08)]"
                  >
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
                        <p className="mt-1 text-xs text-white/70 leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-12 transition-all duration-300">
                          {item.desc}
                        </p>
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

      {/* ================= PARTNERS ================= */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("partners.label")} title={t("partners.title")} subtitle={t("partners.subtitle")} />
          <Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="partners-grid">
              {[...STATIC_PARTNERS, ...partners].map((p, i) => (
                <div
                  key={p.id || `static-partner-${i}`}
                  data-testid="partner-logo"
                  className="rounded-2xl bg-white border border-[#17231D]/10 h-24 flex items-center justify-center p-4 transition-all duration-300 hover:shadow-md"
                >
                  {p.logo ? (
                    <img
                      src={p.logo}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className={`max-h-14 max-w-[90%] object-contain ${i === 0 ? "scale-125" : ""}`}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#66736B]">{p.name}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button
                data-testid="become-partner-button"
                variant="outline"
                onClick={() => navigate("/contact")}
                className="rounded-xl h-11 px-6 border-[#1F8A3B]/30 text-[#1F8A3B] hover:bg-white font-semibold"
              >
                {t("partners.cta")}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= NETWORK / AGRIBUSINESS ================= */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={NETWORK_IMG} alt="" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#063B2A]/88" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("network.label")} title={t("network.title")} subtitle={t("network.subtitle")} light />
          <Reveal>
            <div
              data-testid="network-graphic"
              className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0"
            >
              {t("network.nodes").map((node, i, arr) => (
                <React.Fragment key={node}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                    className="rounded-2xl bg-white/10 backdrop-blur-sm border border-[#5DBB32]/30 px-6 py-4 text-white font-bold text-sm"
                  >
                    {node}
                  </motion.div>
                  {i < arr.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 + 0.1 }}
                      className="md:mx-2 rotate-90 md:rotate-0"
                    >
                      <ArrowRight className="w-5 h-5 text-[#C9972B]" />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <CTASection />
    </div>
  );
}
