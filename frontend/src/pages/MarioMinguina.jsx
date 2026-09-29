import React from "react";
import { ArrowLeft, BriefcaseBusiness, Globe2, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { Reveal } from "@/components/Reveal";

export default function MarioMinguina() {
  const { lang } = useLanguage();
  useSEO("mario");

  const pt = lang === "pt";

  return (
    <main className="bg-[#F7F9F5] min-h-screen">
      <section className="bg-[#063B2A] relative overflow-hidden grain">
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-[#1F8A3B]/25 blur-3xl" />
        <div className="absolute -left-32 bottom-0 w-80 h-80 rounded-full bg-[#5DBB32]/10 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {pt ? "Voltar ao início" : "Back to home"}
          </Link>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 lg:gap-16 items-center">
            <Reveal>
              <div className="rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl bg-white/10">
                <img
                  src="/IMG-20260929-WA0013.jpg"
                  alt="Mário Minguino — CEO da AgroLink.ml"
                  className="w-full aspect-[4/5] object-cover"
                  loading="eager"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-xs tracking-[0.22em] font-bold text-[#5DBB32] mb-3">
                {pt ? "LIDERANÇA · AGROLINK.ML" : "LEADERSHIP · AGROLINK.ML"}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Mário <span className="text-[#C9972B]">Minguino</span>
              </h1>
              <p className="mt-3 text-xl font-semibold text-[#5DBB32]">
                {pt ? "CEO da AgroLink.ml" : "CEO of AgroLink.ml"}
              </p>
              <p className="mt-6 text-white/70 text-lg leading-relaxed max-w-2xl">
                {pt
                  ? "Mais de 30 anos de experiência empresarial, com uma trajetória construída entre a África do Sul, Angola e agora o desenvolvimento do agronegócio através da AgroLink.ml."
                  : "More than 30 years of business experience, with a career built across South Africa, Angola and now the development of agribusiness through AgroLink.ml."}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: BriefcaseBusiness,
                value: "30+",
                label: pt ? "Anos no mercado" : "Years in business",
              },
              {
                icon: Globe2,
                value: "2+",
                label: pt ? "Mercados de experiência" : "Markets of experience",
              },
              {
                icon: Leaf,
                value: "AgroLink",
                label: pt ? "Foco atual" : "Current focus",
              },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-2xl bg-white border border-[#17231D]/10 p-6 shadow-[0_6px_24px_rgba(6,59,42,0.05)]">
                <Icon className="w-5 h-5 text-[#1F8A3B]" />
                <p className="mt-4 text-2xl font-extrabold text-[#063B2A]">{value}</p>
                <p className="mt-1 text-sm text-[#66736B]">{label}</p>
              </div>
            ))}
          </div>

          <article className="rounded-3xl bg-white border border-[#17231D]/10 shadow-[0_10px_40px_rgba(6,59,42,0.06)] p-7 sm:p-10 lg:p-14">
            <p className="text-xs tracking-[0.22em] font-bold text-[#1F8A3B] mb-3">
              {pt ? "A TRAJETÓRIA" : "THE JOURNEY"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17231D]">
              {pt ? "Experiência que impulsiona o próximo capítulo" : "Experience driving the next chapter"}
            </h2>

            {pt ? (
              <div className="mt-7 space-y-5 text-[#66736B] leading-relaxed text-base sm:text-lg">
                <p>
                  Sou Mário Minguino, CEO da AgroLink.ml. Estou no mercado há mais de 30 anos. Ao longo da minha trajetória, tive a oportunidade de atuar como empresário na África do Sul e também prestar consultoria a diversos empresários em Angola, adquirindo uma vasta experiência no mundo dos negócios.
                </p>
                <p>
                  Hoje, estou seriamente dedicado ao projeto da AgroLink.ml e ao desenvolvimento do agronegócio. Este é um grande projeto para mim, um projeto no qual acredito profundamente e que representa uma nova etapa importante da minha trajetória empresarial.
                </p>
                <p>
                  Estamos empenhados em construir algo sólido, sustentável e com impacto real no setor do agronegócio.
                </p>
                <p className="font-semibold text-[#063B2A]">Muito obrigado.</p>
              </div>
            ) : (
              <div className="mt-7 space-y-5 text-[#66736B] leading-relaxed text-base sm:text-lg">
                <p>
                  I am Mário Minguino, CEO of AgroLink.ml. I have been in business for more than 30 years. Throughout my career, I have had the opportunity to work as an entrepreneur in South Africa and provide consulting services to several business owners in Angola, gaining extensive experience in the business world.
                </p>
                <p>
                  Today, I am seriously dedicated to the AgroLink.ml project and to the development of agribusiness. This is a major project for me, one I deeply believe in and one that represents an important new chapter in my business journey.
                </p>
                <p>
                  We are committed to building something solid, sustainable and capable of creating real impact in the agribusiness sector.
                </p>
                <p className="font-semibold text-[#063B2A]">Thank you.</p>
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
