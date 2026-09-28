import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminT } from "@/pages/admin/adminI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

const empty = { name_pt: "", name_en: "", slug: "", desc_pt: "", desc_en: "", image: "", order: 0, active: true };
const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function AdminCategories() {
  const { lang, lf } = useLanguage();
  const ta = useAdminT(lang);
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => (await api.get("/admin/categories")).data,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name_pt || !form.name_en) return toast.error(ta("error"));
    const payload = { ...form, slug: form.slug || slugify(form.name_en || form.name_pt), order: Number(form.order) || 0 };
    setSaving(true);
    try {
      if (editing) await api.put(`/admin/categories/${editing.id}`, payload);
      else await api.post("/admin/categories", payload);
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
      await api.delete(`/admin/categories/${deleteTarget.id}`);
      toast.success(ta("deleted"));
      invalidate();
    } catch (err) {
      toast.error(err?.response?.data?.detail || ta("error"));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div data-testid="admin-categories-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-extrabold text-[#17231D]">{ta("categories")}</h1>
        <Button
          data-testid="admin-categories-add-button"
          onClick={() => { setEditing(null); setForm(empty); setDialogOpen(true); }}
          className="rounded-xl bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {ta("add")}
        </Button>
      </div>

      <div className="mt-5 rounded-2xl bg-white border border-[#17231D]/10 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{ta("name")}</TableHead>
              <TableHead>{ta("slug")}</TableHead>
              <TableHead>{ta("order")}</TableHead>
              <TableHead>{ta("statusLabel")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id} data-testid="admin-category-row">
                <TableCell className="font-semibold text-sm">{lf(c, "name")}</TableCell>
                <TableCell className="text-sm text-[#66736B]">{c.slug}</TableCell>
                <TableCell className="text-sm text-[#66736B]">{c.order}</TableCell>
                <TableCell className="text-sm">{c.active ? ta("active") : "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setForm({ ...empty, ...c }); setDialogOpen(true); }} className="rounded-lg text-[#1F8A3B] hover:bg-[#F7F9F5]" data-testid="admin-category-edit-button">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(c)} className="rounded-lg text-red-500 hover:bg-red-50" data-testid="admin-category-delete-button">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? ta("edit") : ta("add")} — {ta("categories")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold">{ta("namePt")} *</Label>
              <Input data-testid="category-form-name-pt" value={form.name_pt} onChange={(e) => setF("name_pt", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("nameEn")} *</Label>
              <Input data-testid="category-form-name-en" value={form.name_en} onChange={(e) => setF("name_en", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("slug")}</Label>
              <Input value={form.slug} onChange={(e) => setF("slug", e.target.value)} placeholder="auto" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("order")}</Label>
              <Input type="number" value={form.order} onChange={(e) => setF("order", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold">{ta("image")}</Label>
              <Input value={form.image} onChange={(e) => setF("image", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("descCatPt")}</Label>
              <Textarea rows={2} value={form.desc_pt} onChange={(e) => setF("desc_pt", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("descCatEn")}</Label>
              <Textarea rows={2} value={form.desc_en} onChange={(e) => setF("desc_en", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={(v) => setF("active", v)} />
              <Label className="text-sm font-semibold">{ta("active")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">{ta("cancel")}</Button>
            <Button data-testid="category-form-save-button" onClick={save} disabled={saving} className="rounded-xl bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold">
              {saving ? ta("saving") : ta("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{ta("confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>{ta("confirmDeleteDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{ta("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} className="rounded-xl bg-red-600 hover:bg-red-700 text-white" data-testid="confirm-delete-category-button">
              {ta("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
