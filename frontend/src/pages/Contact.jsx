import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reveal } from "@/components/Reveal";
import { Mail, Phone, MessageCircle, MapPin, Send, Loader2 } from "lucide-react";

export default function Contact() {
  const { t, lf, lang } = useLanguage();
  useSEO("contact");
  const [searchParams] = useSearchParams();
  const preselectedProduct = searchParams.get("product") || "";

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/settings")).data,
  });

  // Frontend fallbacks keep the branch contacts visible even when
  // the backend settings endpoint does not yet contain the new details.
  const contactEmail = settings?.email || "agrolink.ml@gmail.com";
  const angolaPhone = settings?.phone_angola || "+244 924 546 980";
  const namibiaPhone = settings?.phone_namibia || "+264 85 379 4593";
  const namibiaPhone2 = settings?.phone_namibia_2 || "+264 813394483";
  const angolaWhatsapp = settings?.whatsapp_angola || "+244 924 546 980";
  const namibiaWhatsapp = settings?.whatsapp_namibia || "+264 85 379 4593";
  const { data: products = [] } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => (await api.get("/products?limit=500")).data,
  });

  const [form, setForm] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    product_interest: "",
    quantity: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedProduct && products.length > 0) {
      const p = products.find((x) => x.slug === preselectedProduct);
      if (p) setForm((f) => ({ ...f, product_interest: lf(p, "name") }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedProduct, products.length]);

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = t("contact.required");
    if (!form.email.trim()) e.email = t("contact.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("contact.invalidEmail");
    if (!form.message.trim() && !form.product_interest.trim()) e.message = t("contact.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post("/enquiries", { ...form, lang });
      toast.success(t("contact.success"));
      setForm({ full_name: "", company: "", email: "", phone: "", country: "", product_interest: "", quantity: "", message: "" });
    } catch {
      toast.error(t("contact.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const waLink = (num) => `https://wa.me/${(num || "").replace(/[^0-9]/g, "")}`;

  return (
    <div>
      <section className="bg-[#063B2A] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs tracking-[0.22em] font-bold text-[#5DBB32] mb-3">{t("contact.label")}</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">{t("contact.title")}</h1>
          <p className="mt-4 text-white/70 max-w-xl">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <Reveal className="lg:col-span-3">
            <form
              data-testid="quote-form"
              onSubmit={submit}
              className="rounded-3xl bg-white border border-[#17231D]/10 p-7 sm:p-10 shadow-[0_10px_40px_rgba(6,59,42,0.08)]"
            >
              <h2 className="text-2xl font-extrabold text-[#17231D]">{t("contact.formTitle")}</h2>
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-semibold text-[#17231D]">{t("contact.fullName")} *</Label>
                  <Input
                    data-testid="quote-form-full-name"
                    value={form.full_name}
                    onChange={(e) => setField("full_name", e.target.value)}
                    className={`mt-1.5 h-11 rounded-xl ${errors.full_name ? "border-red-400" : "border-[#17231D]/12"}`}
                  />
                  {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-[#17231D]">{t("contact.company")}</Label>
                  <Input
                    data-testid="quote-form-company"
                    value={form.company}
                    onChange={(e) => setField("company", e.target.value)}
                    className="mt-1.5 h-11 rounded-xl border-[#17231D]/12"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-[#17231D]">{t("contact.email")} *</Label>
                  <Input
                    data-testid="quote-form-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className={`mt-1.5 h-11 rounded-xl ${errors.email ? "border-red-400" : "border-[#17231D]/12"}`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-[#17231D]">{t("contact.phone")}</Label>
                  <Input
                    data-testid="quote-form-phone"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    className="mt-1.5 h-11 rounded-xl border-[#17231D]/12"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-[#17231D]">{t("contact.country")}</Label>
                  <Input
                    data-testid="quote-form-country"
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                    placeholder={t("contact.countryPlaceholder")}
                    className="mt-1.5 h-11 rounded-xl border-[#17231D]/12"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-[#17231D]">{t("contact.productInterest")}</Label>
                  <Select
                    value={form.product_interest || undefined}
                    onValueChange={(v) => setField("product_interest", v === "__general__" ? t("contact.generalEnquiry") : v)}
                  >
                    <SelectTrigger
                      data-testid="quote-form-product-select"
                      className="mt-1.5 h-11 rounded-xl border-[#17231D]/12"
                    >
                      <SelectValue placeholder={t("contact.selectProduct")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      <SelectItem value="__general__">{t("contact.generalEnquiry")}</SelectItem>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={lf(p, "name")}>
                          {lf(p, "name")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm font-semibold text-[#17231D]">{t("contact.quantity")}</Label>
                  <Input
                    data-testid="quote-form-quantity"
                    value={form.quantity}
                    onChange={(e) => setField("quantity", e.target.value)}
                    placeholder={t("contact.quantityPlaceholder")}
                    className="mt-1.5 h-11 rounded-xl border-[#17231D]/12"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm font-semibold text-[#17231D]">{t("contact.message")}</Label>
                  <Textarea
                    data-testid="quote-form-message"
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    placeholder={t("contact.messagePlaceholder")}
                    rows={5}
                    className={`mt-1.5 rounded-xl ${errors.message ? "border-red-400" : "border-[#17231D]/12"}`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>
              </div>
              <Button
                data-testid="quote-form-submit-button"
                type="submit"
                disabled={submitting}
                className="mt-7 rounded-xl h-12 px-8 bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold text-base w-full sm:w-auto active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("contact.submitting")}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t("contact.submit")}
                  </>
                )}
              </Button>
            </form>
          </Reveal>

          {/* Contact info */}
          <Reveal delay={0.1} className="lg:col-span-2 space-y-5">
            <div className="rounded-3xl bg-[#063B2A] p-8 text-white">
              <h3 className="font-bold text-lg">{t("contact.whatsappTitle")}</h3>
              <div className="mt-5 space-y-3">
                <a
                  data-testid="whatsapp-angola-button"
                  href={waLink(angolaWhatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-[#5DBB32]/30 px-5 py-4 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-[#5DBB32]" />
                  <div>
                    <p className="font-bold text-sm">{t("contact.whatsappAngola")}</p>
                    <p className="text-xs text-white/60">{angolaPhone}</p>
                  </div>
                </a>
                <a
                  data-testid="whatsapp-namibia-2-button"
                  href={waLink(namibiaPhone2)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-[#5DBB32]/30 px-5 py-4 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-[#5DBB32]" />
                  <div>
                    <p className="font-bold text-sm">WhatsApp — Namibia</p>
                    <p className="text-xs text-white/60">{namibiaPhone2}</p>
                  </div>
                </a>
                <a
                  data-testid="whatsapp-namibia-button"
                  href={waLink(namibiaWhatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-[#5DBB32]/30 px-5 py-4 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-[#5DBB32]" />
                  <div>
                    <p className="font-bold text-sm">{t("contact.whatsappNamibia")}</p>
                    <p className="text-xs text-white/60">{namibiaPhone}</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-[#17231D]/10 p-8">
              <h3 className="font-bold text-lg text-[#17231D]">{t("contact.branches")}</h3>
              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F9F5] border border-[#1F8A3B]/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#1F8A3B]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#17231D]">{t("contact.angolaBranch")}</p>
                    <p className="text-sm text-[#66736B] flex items-center gap-1.5 mt-1">
                      <Phone className="w-3.5 h-3.5" />
                      {angolaPhone}
                    </p>
                    <p className="text-xs text-[#66736B] mt-1">
                      Luanda, Angola · Nº Fiscal 5003515893
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F9F5] border border-[#1F8A3B]/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#1F8A3B]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#17231D]">{t("contact.namibiaBranch")}</p>
                    <p className="text-sm text-[#66736B] flex items-center gap-1.5 mt-1">
                      <Phone className="w-3.5 h-3.5" />
                      {namibiaPhone}
                    </p>
                    <p className="text-sm text-[#173F35] mt-1">
                      {namibiaPhone2}
                    </p>
                    <p className="text-xs text-[#66736B] mt-1">
                      Rocky Crest Ext 4, Namibia
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F9F5] border border-[#1F8A3B]/15 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#1F8A3B]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#17231D]">{t("contact.emailTitle")}</p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-sm text-[#1F8A3B] hover:underline mt-1 inline-block"
                      data-testid="contact-email-link"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
