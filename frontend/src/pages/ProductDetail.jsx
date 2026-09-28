import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, ArrowRight, CheckCircle2, Package, ListChecks, Layers } from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, lf } = useLanguage();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => (await api.get(`/products/${slug}`)).data,
    retry: 1,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories")).data,
  });
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => (await api.get("/products?limit=500")).data,
  });

  useSEO("products", product ? lf(product, "name") : undefined);

  const category = categories.find((c) => c.id === product?.category_id);
  const related = allProducts.filter((p) => p.category_id === product?.category_id && p.id !== product?.id).slice(0, 4);
  const catById = Object.fromEntries(categories.map((c) => [c.id, c]));

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-[4/3] rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center" data-testid="product-not-found">
        <h1 className="text-2xl font-extrabold text-[#17231D]">{t("productDetail.notFound")}</h1>
        <p className="mt-3 text-[#66736B]">{t("productDetail.notFoundDesc")}</p>
        <Button
          onClick={() => navigate("/products")}
          className="mt-6 rounded-xl bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("productDetail.backToProducts")}
        </Button>
      </div>
    );
  }

  const specs = product.specifications || [];
  const applications = lf(product, "applications") || [];

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#66736B] mb-8 flex-wrap" data-testid="product-breadcrumb">
          <Link to="/" className="hover:text-[#1F8A3B] transition-colors">{t("misc.home")}</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#1F8A3B] transition-colors">{t("nav.products")}</Link>
          <span>/</span>
          <span className="text-[#17231D] font-semibold">{lf(product, "name")}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <Reveal>
            <div className="rounded-3xl overflow-hidden bg-white border border-[#17231D]/10 aspect-[4/3]">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={lf(product, "name")}
                  className="w-full h-full object-cover"
                  data-testid="product-detail-image"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#66736B]">AgroLink</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-square bg-white border border-[#17231D]/10">
                    <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </Reveal>

          {/* Info */}
          <Reveal delay={0.08}>
            <div className="flex items-center gap-2 flex-wrap">
              {category && (
                <Badge className="bg-[#F7F9F5] text-[#1F8A3B] border border-[#1F8A3B]/20 font-semibold hover:bg-[#F7F9F5]">
                  {lf(category, "name")}
                </Badge>
              )}
              <Badge
                data-testid="product-availability-badge"
                className={
                  product.availability === "in_stock"
                    ? "bg-[#5DBB32]/15 text-[#1F8A3B] border border-[#5DBB32]/30 font-semibold hover:bg-[#5DBB32]/15"
                    : "bg-[#C9972B]/15 text-[#C9972B] border border-[#C9972B]/30 font-semibold hover:bg-[#C9972B]/15"
                }
              >
                {product.availability === "in_stock" ? t("productDetail.inStock") : t("productDetail.onRequest")}
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17231D]" data-testid="product-detail-name">
              {lf(product, "name")}
            </h1>
            <p className="mt-4 text-[#66736B] leading-relaxed">{lf(product, "desc")}</p>

            {applications.length > 0 && (
              <div className="mt-7">
                <h3 className="flex items-center gap-2 font-bold text-[#17231D]">
                  <ListChecks className="w-4.5 h-4.5 text-[#1F8A3B] w-5 h-5" strokeWidth={1.8} />
                  {t("productDetail.applications")}
                </h3>
                <ul className="mt-3 space-y-2">
                  {applications.map((a, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#66736B]">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#5DBB32] shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lf(product, "packaging") && (
              <div className="mt-6">
                <h3 className="flex items-center gap-2 font-bold text-[#17231D]">
                  <Package className="w-5 h-5 text-[#1F8A3B]" strokeWidth={1.8} />
                  {t("productDetail.packaging")}
                </h3>
                <p className="mt-2 text-sm text-[#66736B]">{lf(product, "packaging")}</p>
              </div>
            )}

            {specs.length > 0 && (
              <div className="mt-6">
                <h3 className="flex items-center gap-2 font-bold text-[#17231D]">
                  <Layers className="w-5 h-5 text-[#1F8A3B]" strokeWidth={1.8} />
                  {t("productDetail.specifications")}
                </h3>
                <div className="mt-3 rounded-2xl border border-[#17231D]/10 overflow-hidden bg-white">
                  {specs.map((s, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-5 py-3 text-sm ${
                        i % 2 === 0 ? "bg-[#F7F9F5]/70" : "bg-white"
                      }`}
                    >
                      <span className="font-semibold text-[#17231D]">{lf(s, "label")}</span>
                      <span className="text-[#66736B]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button
                data-testid="product-detail-request-quote-button"
                onClick={() => navigate(`/contact?product=${encodeURIComponent(product.slug)}`)}
                className="rounded-xl h-12 px-8 bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold text-base active:scale-[0.98]"
              >
                {t("productDetail.requestQuote")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                data-testid="product-detail-back-button"
                variant="outline"
                onClick={() => navigate("/products")}
                className="rounded-xl h-12 px-6 border-[#17231D]/15 text-[#063B2A] hover:bg-white font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("productDetail.backToProducts")}
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-extrabold text-[#17231D] mb-7">{t("productDetail.related")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} category={catById[p.category_id]} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
