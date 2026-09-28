import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const ProductCard = ({ product, category }) => {
  const { t, lf } = useLanguage();
  const navigate = useNavigate();
  const image = product.images?.[0];

  return (
    <div
      data-testid="product-card"
      className="group rounded-2xl bg-white border border-[#17231D]/10 overflow-hidden shadow-[0_6px_24px_rgba(6,59,42,0.07)] hover:shadow-[0_18px_60px_rgba(6,59,42,0.14)] transition-shadow duration-200 flex flex-col"
    >
      <Link to={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-[#F7F9F5]">
        {image ? (
          <img
            src={image}
            alt={lf(product, "name")}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#66736B] text-sm">AgroLink</div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-[#C9972B] text-[#063B2A] text-[11px] font-bold px-3 py-1">
            ★
          </span>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        {category && (
          <Badge variant="secondary" className="w-fit mb-2 bg-[#F7F9F5] text-[#1F8A3B] border border-[#1F8A3B]/15 font-semibold">
            {lf(category, "name")}
          </Badge>
        )}
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-bold text-[#17231D] text-lg leading-snug hover:text-[#1F8A3B] transition-colors">
            {lf(product, "name")}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-[#66736B] leading-relaxed line-clamp-2 flex-1">
          {lf(product, "short_desc")}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Button
            data-testid="product-card-view-button"
            size="sm"
            className="rounded-xl bg-[#1F8A3B] hover:bg-[#167233] text-white flex-1"
            onClick={() => navigate(`/products/${product.slug}`)}
          >
            {t("products.viewProduct")}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button
            data-testid="product-card-request-quote-button"
            size="sm"
            variant="outline"
            className="rounded-xl border-[#17231D]/15 text-[#063B2A] hover:bg-[#F7F9F5] flex-1"
            onClick={() => navigate(`/contact?product=${encodeURIComponent(product.slug)}`)}
          >
            {t("products.requestQuote")}
          </Button>
        </div>
      </div>
    </div>
  );
};
