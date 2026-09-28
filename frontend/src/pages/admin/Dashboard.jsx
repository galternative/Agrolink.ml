import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminT } from "@/pages/admin/adminI18n";
import { Badge } from "@/components/ui/badge";
import { Package, Inbox, Users, FolderTree } from "lucide-react";

const statusColors = {
  new: "bg-[#5DBB32]/15 text-[#1F8A3B] border-[#5DBB32]/30",
  in_progress: "bg-[#C9972B]/15 text-[#C9972B] border-[#C9972B]/30",
  closed: "bg-[#66736B]/10 text-[#66736B] border-[#66736B]/20",
};

export default function Dashboard() {
  const { lang } = useLanguage();
  const ta = useAdminT(lang);
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get("/admin/stats")).data,
  });

  const cards = [
    { label: ta("totalProducts"), value: stats?.products ?? "—", icon: Package, to: "/admin/products" },
    { label: ta("newEnquiries"), value: stats?.enquiries_new ?? "—", icon: Inbox, to: "/admin/enquiries", accent: true },
    { label: ta("totalEnquiries"), value: stats?.enquiries_total ?? "—", icon: Inbox, to: "/admin/enquiries" },
    { label: ta("teamMembers"), value: stats?.team ?? "—", icon: Users, to: "/admin/team" },
  ];

  const statusLabel = { new: ta("statusNew"), in_progress: ta("statusInProgress"), closed: ta("statusClosed") };

  return (
    <div data-testid="admin-dashboard">
      <h1 className="text-2xl font-extrabold text-[#17231D]">{ta("dashboard")}</h1>
      <p className="text-sm text-[#66736B] mt-1">{ta("welcome")}</p>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Link
            key={i}
            to={c.to}
            data-testid="admin-stat-card"
            className={`rounded-2xl border p-6 transition-shadow hover:shadow-[0_10px_30px_rgba(6,59,42,0.1)] ${
              c.accent ? "bg-[#063B2A] border-[#063B2A]" : "bg-white border-[#17231D]/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-sm font-semibold ${c.accent ? "text-white/70" : "text-[#66736B]"}`}>{c.label}</p>
              <c.icon className={`w-5 h-5 ${c.accent ? "text-[#5DBB32]" : "text-[#1F8A3B]"}`} strokeWidth={1.8} />
            </div>
            <p className={`mt-3 text-3xl font-extrabold ${c.accent ? "text-[#5DBB32]" : "text-[#17231D]"}`}>{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white border border-[#17231D]/10 p-6">
        <h2 className="font-bold text-lg text-[#17231D] mb-4">{ta("recentEnquiries")}</h2>
        {stats?.recent_enquiries?.length ? (
          <div className="divide-y divide-[#17231D]/8">
            {stats.recent_enquiries.map((e) => (
              <div key={e.id} className="py-3 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-sm text-[#17231D]">{e.full_name}</p>
                  <p className="text-xs text-[#66736B]">{e.product_interest || e.email}</p>
                </div>
                <Badge className={`border font-semibold hover:bg-transparent ${statusColors[e.status] || ""}`}>
                  {statusLabel[e.status] || e.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#66736B]">{ta("noData")}</p>
        )}
      </div>
    </div>
  );
}
