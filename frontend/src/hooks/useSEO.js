import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const SEO = {
  pt: {
    home: {
      title: "AgroLink.ml — Conectando o Agronegócio. Criando Oportunidades.",
      desc: "A AgroLink conecta produtos agrícolas, insumos, nutrição animal e oportunidades de mercado em Angola, Namíbia e além.",
    },
    about: { title: "Sobre Nós | AgroLink.ml", desc: "Conheça a AgroLink — o elo de ligação entre produtores, fornecedores e mercados agrícolas." },
    products: { title: "Produtos Agrícolas e Insumos | AgroLink.ml", desc: "Catálogo de insumos agrícolas, ração animal, produtos agrícolas e equipamentos da AgroLink." },
    solutions: { title: "Soluções de Agronegócio | AgroLink.ml", desc: "Soluções para agricultores, agroindústrias, fornecedores, comerciantes e produtores." },
    agribusiness: { title: "Agronegócio | AgroLink.ml", desc: "Ligamos os produtos certos às oportunidades certas em toda a cadeia do agronegócio." },
    contact: { title: "Contacto e Pedido de Cotação | AgroLink.ml", desc: "Fale com a AgroLink — pedidos de cotação, WhatsApp Angola e Namíbia." },
  },
  en: {
    home: {
      title: "AgroLink.ml — Connecting Agriculture. Creating Opportunities.",
      desc: "AgroLink connects agricultural products, inputs, animal nutrition and market opportunities across Angola, Namibia and beyond.",
    },
    about: { title: "About Us | AgroLink.ml", desc: "Meet AgroLink — the connection point between agricultural producers, suppliers and markets." },
    products: { title: "Agricultural Products & Inputs | AgroLink.ml", desc: "AgroLink's catalog of agricultural inputs, animal feed, agricultural products and equipment." },
    solutions: { title: "Agribusiness Solutions | AgroLink.ml", desc: "Solutions for farmers, agribusinesses, suppliers, traders and producers." },
    agribusiness: { title: "Agribusiness | AgroLink.ml", desc: "We connect the right products with the right opportunities across the agribusiness chain." },
    contact: { title: "Contact & Request a Quote | AgroLink.ml", desc: "Talk to AgroLink — quote requests, WhatsApp Angola and Namibia." },
  },
};

export const useSEO = (page, customTitle) => {
  const { lang } = useLanguage();
  useEffect(() => {
    const meta = SEO[lang]?.[page] || SEO.pt.home;
    document.title = customTitle ? `${customTitle} | AgroLink.ml` : meta.title;
    let el = document.querySelector('meta[name="description"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "description");
      document.head.appendChild(el);
    }
    el.setAttribute("content", meta.desc);
  }, [page, lang, customTitle]);
};
