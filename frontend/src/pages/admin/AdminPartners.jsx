import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminT } from "@/pages/admin/adminI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

const empty = { name: "", logo: "", url: "", order: 0, active: true };

export default function AdminPartners() {
  const { lang } = useLanguage();
  const ta = useAdminT(lang);
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: partners = [] } = useQuery({
    queryKey: ["admin-partners"],
    queryFn: async () => (await api.get("/admin/partners")).data,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-partners"] });
    qc.invalidateQueries({ queryKey: ["partners"] });
  };

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name) return toast.error(ta("error"));
    const payload = { ...form, order: Number(form.order) || 0 };
    setSaving(true);
    try {
      if (editing) await api.put(`/admin/partners/${editing.id}`, payload);
      else await api.post("/admin/partners", payload);
      toast.success(ta("saved"));
      setDialogOpen(false);
      invalidate();
    } catch {
      toast.error(ta("error"));
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    try {
      await api.delete(`/admin/partners/${deleteTarget.id}`);
      toast.success(ta("deleted"));
      invalidate();
    } catch {
      toast.error(ta("error"));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div data-testid="admin-partners-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-extrabold text-[#17231D]">{ta("partners")}</h1>
        <Button
          data-testid="admin-partners-add-button"
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
              <TableHead>{ta("website")}</TableHead>
              <TableHead>{ta("order")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((p) => (
              <TableRow key={p.id} data-testid="admin-partner-row">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {p.logo && <img src={p.logo} alt="" loading="lazy" className="w-9 h-9 rounded-lg object-contain bg-[#F7F9F5] p-1" />}
                    <span className="font-semibold text-sm">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-[#66736B]">{p.url || "—"}</TableCell>
                <TableCell className="text-sm text-[#66736B]">{p.order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setForm({ ...empty, ...p }); setDialogOpen(true); }} className="rounded-lg text-[#1F8A3B] hover:bg-[#F7F9F5]" data-testid="admin-partner-edit-button">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(p)} className="rounded-lg text-red-500 hover:bg-red-50" data-testid="admin-partner-delete-button">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {partners.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-[#66736B] py-10">{ta("noData")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>{editing ? ta("edit") : ta("add")} — {ta("partners")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-xs font-bold">{ta("name")} *</Label>
              <Input data-testid="partner-form-name" value={form.name} onChange={(e) => setF("name", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("logo")}</Label>
              <Input value={form.logo} onChange={(e) => setF("logo", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("website")}</Label>
              <Input value={form.url} onChange={(e) => setF("url", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <Label className="text-xs font-bold">{ta("order")}</Label>
                <Input type="number" value={form.order} onChange={(e) => setF("order", e.target.value)} className="mt-1 rounded-xl" />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <Switch checked={form.active} onCheckedChange={(v) => setF("active", v)} />
                <Label className="text-sm font-semibold">{ta("active")}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">{ta("cancel")}</Button>
            <Button data-testid="partner-form-save-button" onClick={save} disabled={saving} className="rounded-xl bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold">
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
            <AlertDialogAction onClick={doDelete} className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
              {ta("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
