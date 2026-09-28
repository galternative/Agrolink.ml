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

const empty = { name: "", role_pt: "", role_en: "", bio_pt: "", bio_en: "", photo: "", order: 0, active: true };

export default function AdminTeam() {
  const { lang, lf } = useLanguage();
  const ta = useAdminT(lang);
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: team = [] } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => (await api.get("/admin/team")).data,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-team"] });
    qc.invalidateQueries({ queryKey: ["team"] });
  };

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name) return toast.error(ta("error"));
    const payload = { ...form, order: Number(form.order) || 0 };
    setSaving(true);
    try {
      if (editing) await api.put(`/admin/team/${editing.id}`, payload);
      else await api.post("/admin/team", payload);
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
      await api.delete(`/admin/team/${deleteTarget.id}`);
      toast.success(ta("deleted"));
      invalidate();
    } catch {
      toast.error(ta("error"));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div data-testid="admin-team-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-extrabold text-[#17231D]">{ta("team")}</h1>
        <Button
          data-testid="admin-team-add-button"
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
              <TableHead>{ta("rolePt")}</TableHead>
              <TableHead>{ta("order")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((m) => (
              <TableRow key={m.id} data-testid="admin-team-row">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {m.photo ? (
                      <img src={m.photo} alt="" loading="lazy" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#063B2A] flex items-center justify-center text-[#5DBB32] text-xs font-bold">
                        {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-sm">{m.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-[#66736B]">{lf(m, "role")}</TableCell>
                <TableCell className="text-sm text-[#66736B]">{m.order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(m); setForm({ ...empty, ...m }); setDialogOpen(true); }} className="rounded-lg text-[#1F8A3B] hover:bg-[#F7F9F5]" data-testid="admin-team-edit-button">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(m)} className="rounded-lg text-red-500 hover:bg-red-50" data-testid="admin-team-delete-button">
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
            <DialogTitle>{editing ? ta("edit") : ta("add")} — {ta("team")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold">{ta("name")} *</Label>
              <Input data-testid="team-form-name" value={form.name} onChange={(e) => setF("name", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("rolePt")}</Label>
              <Input data-testid="team-form-role-pt" value={form.role_pt} onChange={(e) => setF("role_pt", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("roleEn")}</Label>
              <Input value={form.role_en} onChange={(e) => setF("role_en", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("bioPt")}</Label>
              <Textarea rows={3} value={form.bio_pt} onChange={(e) => setF("bio_pt", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("bioEn")}</Label>
              <Textarea rows={3} value={form.bio_en} onChange={(e) => setF("bio_en", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold">{ta("photo")}</Label>
              <Input value={form.photo} onChange={(e) => setF("photo", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-bold">{ta("order")}</Label>
              <Input type="number" value={form.order} onChange={(e) => setF("order", e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={(v) => setF("active", v)} />
              <Label className="text-sm font-semibold">{ta("active")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">{ta("cancel")}</Button>
            <Button data-testid="team-form-save-button" onClick={save} disabled={saving} className="rounded-xl bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold">
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
