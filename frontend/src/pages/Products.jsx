import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, PackageX } from "lucide-react";

export default function Products() {
  const { t, lf } = useLanguage();
  useSEO("products");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const categoryFilter = searchParams.get("category") || "all";
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories")).data,
  });
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => (await api.get("/products?limit=500")).data,
  });

  const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const filtered = useMemo(() => {
    let list = products;
    if (categoryFilter !== "all") {
      const cat = catBySlug[categoryFilter];
      if (cat) list = list.filter((p) => p.category_id === cat.id);
    }
    if (availabilityFilter !== "all") {
      list = list.filter((p) => p.availability === availabilityFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.name_pt || "").toLowerCase().includes(q) ||
          (p.name_en || "").toLowerCase().includes(q) ||
          (p.short_desc_pt || "").toLowerCase().includes(q) ||
          (p.short_desc_en || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, categoryFilter, availabilityFilter, search, catBySlug]);

  const setCategory = (slug) => {
    if (slug === "all") searchParams.delete("category");
    else searchParams.set("category", slug);
    setSearchParams(searchParams, { replace: true });
  };

  const resetFilters = () => {
    setSearch("");
    setAvailabilityFilter("all");
    setCategory("all");
  };

  return (
    <div>
      {/* Page hero */}
      <section className="bg-[#063B2A] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs tracking-[0.22em] font-bold text-[#5DBB32] mb-3">{t("products.label")}</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">{t("products.pageTitle")}</h1>
          <p className="mt-4 text-white/70 max-w-xl">{t("products.pageSubtitle")}</p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#66736B]" />
              <Input
                data-testid="product-catalog-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("products.searchPlaceholder")}
                className="pl-10 h-11 rounded-xl bg-white border-[#17231D]/12"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                data-testid="category-filter-all"
                onClick={() => setCategory("all")}
                className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors duration-200 ${
                  categoryFilter === "all"
                    ? "bg-[#063B2A] text-white border-[#063B2A]"
                    : "bg-white text-[#17231D] border-[#17231D]/12 hover:border-[#1F8A3B]/40"
                }`}
              >
                {t("products.allCategories")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  data-testid={`category-filter-${cat.slug}`}
                  onClick={() => setCategory(cat.slug)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors duration-200 ${
                    categoryFilter === cat.slug
                      ? "bg-[#063B2A] text-white border-[#063B2A]"
                      : "bg-white text-[#17231D] border-[#17231D]/12 hover:border-[#1F8A3B]/40"
                  }`}
                >
                  {lf(cat, "name")}
                </button>
              ))}
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger
                  data-testid="product-catalog-availability-filter"
                  className="w-[150px] h-10 rounded-full bg-white border-[#17231D]/12 text-sm font-semibold"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("products.availability")}: {t("products.allAvailability")}</SelectItem>
                  <SelectItem value="in_stock">{t("products.inStock")}</SelectItem>
                  <SelectItem value="on_request">{t("products.onRequest")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-sm text-[#66736B] mb-6" data-testid="products-results-count">
            {filtered.length} {t("products.resultsCount")}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-[#17231D]/10 overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-testid="products-empty-state"
              className="rounded-2xl bg-white border border-[#17231D]/10 py-20 flex flex-col items-center text-center px-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F7F9F5] flex items-center justify-center">
                <PackageX className="w-7 h-7 text-[#66736B]" strokeWidth={1.6} />
              </div>
              <p className="mt-4 font-semibold text-[#17231D]">{t("products.noResults")}</p>
              <Button
                data-testid="products-reset-filters-button"
                onClick={resetFilters}
                variant="outline"
                className="mt-5 rounded-xl border-[#1F8A3B]/30 text-[#1F8A3B] hover:bg-[#F7F9F5] font-semibold"
              >
                {t("products.resetFilters")}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} category={catById[p.category_id]} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
