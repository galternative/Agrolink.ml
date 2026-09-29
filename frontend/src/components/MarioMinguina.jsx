import React from "react";
import { ArrowLeft, BriefcaseBusiness, Globe2, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { Reveal } from "@/components/Reveal";

export default function MarioMinguina() {
  const { lang } = useLanguage();
  const pt = lang === "pt";
  useSEO("mario");

  const highlights = [
    { icon: BriefcaseBusiness, title: pt ? "30+ anos" : "30+ years", text: pt ? "De experiência no mercado." : "Of market experience." },
    { icon: Globe2, title: pt ? "África do Sul & Angola" : "South Africa & Angola", text: pt ? "Experiência empresarial e de consultoria." : "Entrepreneurial and consulting experience." },
    { icon: Sprout, title: pt ? "Visão para o agronegócio" : "Agribusiness vision", text: pt ? "Compromisso com um setor mais sólido e sustentável." : "Commitment to a stronger, more sustainable sector." },
  ];

  return (
    <main className="min-h-screen bg-[#F7F9F5]">
      <section className="relative overflow-hidden bg-[#063B2A] grain">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(93,187,50,0.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> {pt ? "Voltar ao início" : "Back to home"}
          </Link>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
            <Reveal>
              <div className="mx-auto w-full max-w-md">
                <div className="relative rounded-[2rem] overflow-hidden border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.28)] bg-[#F7F9F5]">
                  <img src="/IMG-20260929-WA0013.jpg" alt="Mário Minguino, CEO da AgroLink.ml" className="w-full aspect-[4/5] object-cover" loading="eager" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#063B2A] via-[#063B2A]/70 to-transparent p-6 pt-20">
                    <p className="text-xs tracking-[0.22em] uppercase font-bold text-[#5DBB32]">CEO</p>
                    <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">Mário Minguino</h1>
                    <p className="text-white/75 mt-1">AgroLink.ml</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div>
                <p className="text-xs tracking-[0.22em] uppercase font-bold text-[#5DBB32]">{pt ? "Liderança AgroLink" : "AgroLink Leadership"}</p>
                <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">{pt ? "Experiência empresarial. Visão para o agronegócio." : "Business experience. A vision for agribusiness."}</h2>
                <p className="mt-6 text-lg leading-relaxed text-white/72 max-w-2xl">{pt ? "À frente da AgroLink.ml, Mário Minguino traz mais de três décadas de experiência empresarial e uma visão dedicada ao desenvolvimento do agronegócio." : "Leading AgroLink.ml, Mário Minguino brings more than three decades of business experience and a vision dedicated to the development of agribusiness."}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-[2rem] bg-white border border-[#17231D]/10 shadow-[0_18px_60px_rgba(6,59,42,0.08)] p-7 sm:p-10 lg:p-14">
              <div className="flex items-center gap-3"><span className="h-px w-10 bg-[#C9972B]" /><p className="text-xs tracking-[0.22em] uppercase font-bold text-[#1F8A3B]">{pt ? "Sobre Mário" : "About Mario"}</p></div>
              {pt ? (
                <div className="mt-7 space-y-5 text-[#66736B] text-base sm:text-lg leading-relaxed">
                  <p>Sou <strong className="text-[#17231D]">Mário Minguino, CEO da Agrolink.ml</strong>.</p>
                  <p>Estou no mercado há mais de 30 anos. Ao longo da minha trajetória, tive a oportunidade de atuar como empresário na África do Sul e também prestar consultoria a diversos empresários em Angola, adquirindo uma vasta experiência no mundo dos negócios.</p>
                  <p>Hoje, estou seriamente dedicado ao projeto da Agrolink.ml e ao desenvolvimento do agronegócio. Este é um grande projeto para mim, um projeto no qual acredito profundamente e que representa uma nova etapa importante da minha trajetória empresarial.</p>
                  <p>Estamos empenhados em construir algo sólido, sustentável e com impacto real no setor do agronegócio.</p>
                  <p className="pt-2 font-semibold text-[#063B2A]">Muito obrigado.</p>
                </div>
              ) : (
                <div className="mt-7 space-y-5 text-[#66736B] text-base sm:text-lg leading-relaxed">
                  <p>I am <strong className="text-[#17231D]">Mário Minguino, CEO of AgroLink.ml</strong>.</p>
                  <p>I have been in business for more than 30 years. Throughout my career, I have had the opportunity to operate as an entrepreneur in South Africa and to provide consulting services to several business owners in Angola, building extensive experience in the business world.</p>
                  <p>Today, I am seriously dedicated to the AgroLink.ml project and to the development of agribusiness. This is a major project for me, one I deeply believe in, and it represents an important new stage in my entrepreneurial journey.</p>
                  <p>We are committed to building something solid, sustainable, and with real impact in the agribusiness sector.</p>
                  <p className="pt-2 font-semibold text-[#063B2A]">Thank you.</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-y border-[#17231D]/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {highlights.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl bg-[#F7F9F5] border border-[#17231D]/8 p-7"><div className="w-11 h-11 rounded-xl bg-[#063B2A] flex items-center justify-center"><Icon className="w-5 h-5 text-[#5DBB32]" strokeWidth={1.8} /></div><h3 className="mt-5 text-xl font-bold text-[#17231D]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#66736B]">{text}</p></div>)}
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#063B2A] text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><p className="text-xs tracking-[0.22em] uppercase font-bold text-[#5DBB32]">AgroLink.ml</p><h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white">{pt ? "Construindo oportunidades através do agronegócio." : "Building opportunities through agribusiness."}</h2><Link to="/contact" className="inline-flex mt-7 items-center justify-center rounded-full bg-[#C9972B] px-6 py-3 text-sm font-bold text-white hover:bg-[#b78622] transition-colors">{pt ? "Fale com a AgroLink" : "Contact AgroLink"}</Link></div>
      </section>
    </main>
  );
}
