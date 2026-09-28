import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminT } from "@/pages/admin/adminI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, Star, X } from "lucide-react";

const emptyProduct = {
  name_pt: "", name_en: "", slug: "", category_id: "", short_desc_pt: "", short_desc_en: "",
  desc_pt: "", desc_en: "", applications_pt: [], applications_en: [], packaging_pt: "", packaging_en: "",
  specifications: [], images: [], featured: false, availability: "in_stock", status: "active",
};

const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function AdminProducts() {
  const { lang, lf } = useLanguage();
  const ta = useAdminT(lang);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => (await api.get("/admin/products")).data,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => (await api.get("/admin/categories")).data,
  });
  const catById = Object.fromEntries(categories.map((c) => [c.id, c]));

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyProduct, category_id: categories[0]?.id || "" });
    setDialogOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...emptyProduct, ...p });
    setDialogOpen(true);
  };

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name_pt || !form.name_en || !form.category_id) {
      toast.error(ta("error"));
      return;
    }
    const payload = { ...form, slug: form.slug || slugify(form.name_en || form.name_pt) };
    setSaving(true);
    try {
      if (editing) await api.put(`/admin/products/${editing.id}`, payload);
      else await api.post("/admin/products", payload);
      toast.success(ta("saved"));
      setDialogOpen(false);
      invalidate();
    } catch (err) {
      toast.error(err?.response?.data?.detail || ta("error"));
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    try {
      await api.delete(`/admin/products/${deleteTarget.id}`);
      toast.success(ta("deleted"));
      invalidate();
    } catch {
      toast.error(ta("error"));
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      !search.trim() ||
      (p.name_pt || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.name_en || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-testid="admin-products-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-extrabold text-[#17231D]">{ta("products")}</h1>
        <Button
          data-testid="admin-products-add-button"
          onClick={openAdd}
          className="rounded-xl bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {ta("add")}
        </Button>
      </div>

      <div className="mt-5 relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#66736B]" />
        <Input
          data-testid="admin-products-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ta("search")}
          className="pl-10 h-10 rounded-xl bg-white border-[#17231D]/12"
        />
      </div>

      <div className="mt-5 rounded-2xl bg-white border border-[#17231D]/10 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{ta("name")}</TableHead>
              <TableHead>{ta("category")}</TableHead>
              <TableHead>{ta("statusLabel")}</TableHead>
              <TableHead>{ta("featured")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} data-testid="admin-product-row">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt="" loading="lazy" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-sm text-[#17231D]">{lf(p, "name")}</p>
                      <p className="text-xs text-[#66736B]">{p.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-[#66736B]">{lf(catById[p.category_id], "name")}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      p.status === "active"
                        ? "bg-[#5DBB32]/15 text-[#1F8A3B] border border-[#5DBB32]/30 hover:bg-[#5DBB32]/15"
                        : "bg-[#66736B]/10 text-[#66736B] border border-[#66736B]/20 hover:bg-[#66736B]/10"
                    }
                  >
                    {p.status === "active" ? ta("active") : ta("draft")}
                  </Badge>
                </TableCell>
                <TableCell>{p.featured && <Star className="w-4 h-4 text-[#C9972B] fill-[#C9972B]" />}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      data-testid="admin-product-edit-button"
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(p)}
                      className="rounded-lg text-[#1F8A3B] hover:bg-[#F7F9F5]"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      data-testid="admin-product-delete-button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(p)}
                      className="rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-[#66736B] py-10">
                  {ta("noData")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#17231D]">
              {editing ? ta("edit") : ta("add")} — {ta("products")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold">{ta("namePt")} *</Label>
              <Input data-testid="product-form-name-pt" value={form.name_pt} onChange={(e) => setF("name_pt", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("nameEn")} *</Label>
              <Input data-testid="product-form-name-en" value={form.name_en} onChange={(e) => setF("name_en", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("slug")}</Label>
              <Input data-testid="product-form-slug" value={form.slug} onChange={(e) => setF("slug", e.target.value)} placeholder="auto" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("category")} *</Label>
              <Select value={form.category_id} onValueChange={(v) => setF("category_id", v)}>
                <SelectTrigger data-testid="product-form-category" className="mt-1 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{lf(c, "name")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("shortDescPt")}</Label>
              <Textarea rows={2} value={form.short_desc_pt} onChange={(e) => setF("short_desc_pt", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("shortDescEn")}</Label>
              <Textarea rows={2} value={form.short_desc_en} onChange={(e) => setF("short_desc_en", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("descPt")}</Label>
              <Textarea rows={3} value={form.desc_pt} onChange={(e) => setF("desc_pt", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("descEn")}</Label>
              <Textarea rows={3} value={form.desc_en} onChange={(e) => setF("desc_en", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("applicationsPt")}</Label>
              <Textarea rows={3} value={(form.applications_pt || []).join("\n")} onChange={(e) => setF("applications_pt", e.target.value.split("\n").filter(Boolean))} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("applicationsEn")}</Label>
              <Textarea rows={3} value={(form.applications_en || []).join("\n")} onChange={(e) => setF("applications_en", e.target.value.split("\n").filter(Boolean))} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("packagingPt")}</Label>
              <Input value={form.packaging_pt} onChange={(e) => setF("packaging_pt", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("packagingEn")}</Label>
              <Input value={form.packaging_en} onChange={(e) => setF("packaging_en", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold">{ta("images")}</Label>
              <Textarea
                data-testid="product-form-images"
                rows={2}
                value={(form.images || []).join("\n")}
                onChange={(e) => setF("images", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
                className="mt-1 rounded-xl"
              />
              {form.images?.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {form.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-14 h-14 rounded-lg object-cover border border-[#17231D]/10" />
                  ))}
                </div>
              )}
            </div>
            {/* Specs editor */}
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold">{ta("specs")}</Label>
              <div className="mt-2 space-y-2">
                {(form.specifications || []).map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input placeholder={ta("specLabelPt")} value={s.label_pt} onChange={(e) => {
                      const specs = [...form.specifications];
                      specs[i] = { ...specs[i], label_pt: e.target.value };
                      setF("specifications", specs);
                    }} className="rounded-xl" />
                    <Input placeholder={ta("specLabelEn")} value={s.label_en} onChange={(e) => {
                      const specs = [...form.specifications];
                      specs[i] = { ...specs[i], label_en: e.target.value };
                      setF("specifications", specs);
                    }} className="rounded-xl" />
                    <Input placeholder={ta("specValue")} value={s.value} onChange={(e) => {
                      const specs = [...form.specifications];
                      specs[i] = { ...specs[i], value: e.target.value };
                      setF("specifications", specs);
                    }} className="rounded-xl" />
                    <Button variant="ghost" size="icon" onClick={() => setF("specifications", form.specifications.filter((_, j) => j !== i))} className="shrink-0 text-red-500">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setF("specifications", [...(form.specifications || []), { label_pt: "", label_en: "", value: "" }])}
                  className="rounded-xl text-[#1F8A3B] border-[#1F8A3B]/30"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {ta("addSpec")}
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("availability")}</Label>
              <Select value={form.availability} onValueChange={(v) => setF("availability", v)}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">{ta("inStock")}</SelectItem>
                  <SelectItem value="on_request">{ta("onRequest")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("statusLabel")}</Label>
              <Select value={form.status} onValueChange={(v) => setF("status", v)}>
                <SelectTrigger data-testid="product-form-status" className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{ta("active")}</SelectItem>
                  <SelectItem value="draft">{ta("draft")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch data-testid="product-form-featured" checked={form.featured} onCheckedChange={(v) => setF("featured", v)} />
              <Label className="text-sm font-semibold">{ta("featured")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
              {ta("cancel")}
            </Button>
            <Button
              data-testid="product-form-save-button"
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold"
            >
              {saving ? ta("saving") : ta("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{ta("confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>{ta("confirmDeleteDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{ta("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              data-testid="confirm-delete-button"
              onClick={doDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              {ta("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
