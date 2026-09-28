import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminT } from "@/pages/admin/adminI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const empty = {
  email: "", phone_angola: "", phone_namibia: "", whatsapp_angola: "", whatsapp_namibia: "",
  address_angola: "", address_namibia: "", facebook: "", instagram: "", linkedin: "",
};

export default function AdminSettings() {
  const { lang } = useLanguage();
  const ta = useAdminT(lang);
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/settings")).data,
  });

  useEffect(() => {
    if (settings) setForm((f) => ({ ...empty, ...settings }));
  }, [settings]);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings", form);
      toast.success(ta("saved"));
      qc.invalidateQueries({ queryKey: ["settings"] });
    } catch {
      toast.error(ta("error"));
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    ["email", ta("email")],
    ["phone_angola", ta("phoneAngola")],
    ["phone_namibia", ta("phoneNamibia")],
    ["whatsapp_angola", ta("whatsappAngola")],
    ["whatsapp_namibia", ta("whatsappNamibia")],
    ["facebook", "Facebook"],
    ["instagram", "Instagram"],
    ["linkedin", "LinkedIn"],
  ];

  return (
    <div data-testid="admin-settings-page" className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-[#17231D]">{ta("settings")}</h1>
      <p className="text-sm text-[#66736B] mt-1">{ta("contactInfo")}</p>

      <div className="mt-6 rounded-2xl bg-white border border-[#17231D]/10 p-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map(([key, label]) => (
            <div key={key} className={key === "email" ? "sm:col-span-2" : ""}>
              <Label className="text-xs font-bold">{label}</Label>
              <Input
                data-testid={`settings-${key.replace(/_/g, "-")}`}
                value={form[key] || ""}
                onChange={(e) => setF(key, e.target.value)}
                className="mt-1 rounded-xl"
              />
            </div>
          ))}
        </div>
        <Button
          data-testid="settings-save-button"
          onClick={save}
          disabled={saving}
          className="mt-6 rounded-xl bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold"
        >
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {saving ? ta("saving") : ta("save")}
        </Button>
      </div>
    </div>
  );
}
