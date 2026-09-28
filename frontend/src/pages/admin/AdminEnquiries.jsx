import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminT } from "@/pages/admin/adminI18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";

const statusColors = {
  new: "bg-[#5DBB32]/15 text-[#1F8A3B] border-[#5DBB32]/30",
  in_progress: "bg-[#C9972B]/15 text-[#C9972B] border-[#C9972B]/30",
  closed: "bg-[#66736B]/10 text-[#66736B] border-[#66736B]/20",
};

export default function AdminEnquiries() {
  const { lang } = useLanguage();
  const ta = useAdminT(lang);
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewing, setViewing] = useState(null);

  const { data: enquiries = [] } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => (await api.get("/admin/enquiries")).data,
  });

  const statusLabel = { new: ta("statusNew"), in_progress: ta("statusInProgress"), closed: ta("statusClosed") };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/enquiries/${id}/status`, { status });
      toast.success(ta("saved"));
      qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch {
      toast.error(ta("error"));
    }
  };

  const doDelete = async (id) => {
    try {
      await api.delete(`/admin/enquiries/${id}`);
      toast.success(ta("deleted"));
      qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch {
      toast.error(ta("error"));
    }
  };

  const filtered = statusFilter === "all" ? enquiries : enquiries.filter((e) => e.status === statusFilter);

  return (
    <div data-testid="admin-enquiries-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-extrabold text-[#17231D]">{ta("enquiries")}</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger data-testid="enquiries-status-filter" className="w-[180px] rounded-xl bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{ta("all")}</SelectItem>
            <SelectItem value="new">{ta("statusNew")}</SelectItem>
            <SelectItem value="in_progress">{ta("statusInProgress")}</SelectItem>
            <SelectItem value="closed">{ta("statusClosed")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 rounded-2xl bg-white border border-[#17231D]/10 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{ta("name")}</TableHead>
              <TableHead>{ta("interest")}</TableHead>
              <TableHead>{ta("country")}</TableHead>
              <TableHead>{ta("date")}</TableHead>
              <TableHead>{ta("statusLabel")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id} data-testid="admin-enquiry-row">
                <TableCell>
                  <p className="font-semibold text-sm">{e.full_name}</p>
                  <p className="text-xs text-[#66736B]">{e.email}</p>
                </TableCell>
                <TableCell className="text-sm text-[#66736B] max-w-[180px] truncate">{e.product_interest || "—"}</TableCell>
                <TableCell className="text-sm text-[#66736B]">{e.country || "—"}</TableCell>
                <TableCell className="text-sm text-[#66736B]">
                  {e.created_at ? new Date(e.created_at).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <Select value={e.status} onValueChange={(v) => updateStatus(e.id, v)}>
                    <SelectTrigger
                      data-testid="enquiry-status-select"
                      className={`w-[150px] h-8 rounded-full text-xs font-bold border ${statusColors[e.status] || ""}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">{ta("statusNew")}</SelectItem>
                      <SelectItem value="in_progress">{ta("statusInProgress")}</SelectItem>
                      <SelectItem value="closed">{ta("statusClosed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button data-testid="enquiry-view-button" variant="ghost" size="icon" onClick={() => setViewing(e)} className="rounded-lg text-[#1F8A3B] hover:bg-[#F7F9F5]">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => doDelete(e.id)} className="rounded-lg text-red-500 hover:bg-red-50" data-testid="enquiry-delete-button">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-[#66736B] py-10">{ta("noData")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg bg-white max-h-[85vh] overflow-y-auto" data-testid="enquiry-detail-dialog">
          <DialogHeader>
            <DialogTitle>{viewing?.full_name}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <Badge className={`border font-semibold ${statusColors[viewing.status] || ""}`}>
                {statusLabel[viewing.status]}
              </Badge>
              {[
                [ta("email"), viewing.email],
                [ta("company"), viewing.company],
                [ta("phone"), viewing.phone],
                [ta("country"), viewing.country],
                [ta("interest"), viewing.product_interest],
                [ta("quantity"), viewing.quantity],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-[#17231D]/8 pb-2">
                  <span className="font-semibold text-[#66736B]">{label}</span>
                  <span className="text-right text-[#17231D]">{value || "—"}</span>
                </div>
              ))}
              <div>
                <p className="font-semibold text-[#66736B] mb-1">{ta("message")}</p>
                <p className="text-[#17231D] whitespace-pre-wrap bg-[#F7F9F5] rounded-xl p-4">{viewing.message || "—"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
