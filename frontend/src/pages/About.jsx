import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTASection } from "@/components/CTASection";
import { Target, Eye, Gem, ArrowRight } from "lucide-react";

const STORY_IMG =
  "https://images.unsplash.com/photo-1567471894556-0d81c2936777?crop=entropy&cs=srgb&fm=jpg&q=85&w=900";

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function About() {
  const { t, lf } = useLanguage();
  useSEO("about");

  const { data: team = [] } = useQuery({
    queryKey: ["team"],
    queryFn: async () => (await api.get("/team")).data,
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#063B2A] py-16 sm:py-24 relative overflow-hidden grain">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <p className="text-xs tracking-[0.22em] font-bold text-[#5DBB32] mb-3">{t("aboutPage.heroLabel")}</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
            {t("aboutPage.heroTitle")}
          </h1>
          <p className="mt-4 text-white/70 max-w-xl">{t("aboutPage.heroSubtitle")}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="text-xs tracking-[0.22em] font-bold text-[#1F8A3B] mb-3">{t("aboutPage.storyLabel")}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17231D]">
              {t("aboutPage.storyTitle")}
            </h2>
            <p className="mt-5 text-[#66736B] leading-relaxed">{t("aboutPage.storyP1")}</p>
            <p className="mt-4 text-[#66736B] leading-relaxed">{t("aboutPage.storyP2")}</p>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              {t("about.chain").map((step, i, arr) => (
                <React.Fragment key={step}>
                  <span className="rounded-full bg-white border border-[#1F8A3B]/20 px-4 py-1.5 text-xs font-bold text-[#063B2A]">
                    {step}
                  </span>
                  {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-[#C9972B]" />}
                </React.Fragment>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl overflow-hidden aspect-[4/5] max-w-md lg:ml-auto">
              <img src={STORY_IMG} alt="AgroLink" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* MVV */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("mvv.label")} title={t("mvv.title")} />
          <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Target, title: t("mvv.mission"), text: t("mvv.missionText") },
              { icon: Eye, title: t("mvv.vision"), text: t("mvv.visionText") },
              { icon: Gem, title: t("mvv.values"), list: t("mvv.valuesList") },
            ].map((card, i) => (
              <RevealItem key={i}>
                <div className="h-full rounded-2xl bg-[#F7F9F5] border border-[#17231D]/8 p-8">
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

      {/* Team */}
      <section className="py-16 sm:py-24" data-testid="team-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader label={t("team.label")} title={t("team.title")} subtitle={t("team.subtitle")} />
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <RevealItem key={member.id}>
                <div
                  data-testid="team-member-card"
                  className="rounded-2xl bg-white border border-[#17231D]/10 overflow-hidden shadow-[0_6px_24px_rgba(6,59,42,0.06)] hover:shadow-[0_18px_60px_rgba(6,59,42,0.12)] transition-shadow duration-200"
                >
                  <div className="aspect-[4/3] bg-[#F7F9F5] relative overflow-hidden">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-[#063B2A] flex items-center justify-center">
                          <span className="text-2xl font-extrabold text-[#5DBB32]">{initials(member.name)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-[#17231D]">{member.name}</h3>
                    <p className="text-sm font-semibold text-[#1F8A3B] mt-0.5">{lf(member, "role")}</p>
                    {lf(member, "bio") && (
                      <p className="mt-3 text-sm text-[#66736B] leading-relaxed line-clamp-3">{lf(member, "bio")}</p>
                    )}
                  </div>
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
