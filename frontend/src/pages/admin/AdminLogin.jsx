import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api, setToken } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminT } from "@/pages/admin/adminI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const ta = useAdminT(lang);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.token);
      navigate("/admin");
    } catch {
      toast.error(ta("loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#063B2A] flex items-center justify-center px-4 relative overflow-hidden grain">
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl p-4 w-fit mx-auto">
            <img src="/agrolink-logo.png" alt="AgroLink.ml" className="h-14 w-auto" />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-white">{ta("loginTitle")}</h1>
          <p className="mt-2 text-sm text-white/60">{ta("loginSubtitle")}</p>
        </div>
        <form
          data-testid="admin-login-form"
          onSubmit={submit}
          className="rounded-3xl bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.3)]"
        >
          <div>
            <Label className="text-sm font-semibold text-[#17231D]">{ta("email")}</Label>
            <Input
              data-testid="admin-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 h-11 rounded-xl border-[#17231D]/12"
            />
          </div>
          <div className="mt-4">
            <Label className="text-sm font-semibold text-[#17231D]">{ta("password")}</Label>
            <Input
              data-testid="admin-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5 h-11 rounded-xl border-[#17231D]/12"
            />
          </div>
          <Button
            data-testid="admin-login-submit"
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl h-11 bg-[#1F8A3B] hover:bg-[#167233] text-white font-semibold"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
            {ta("login")}
          </Button>
        </form>
      </div>
    </div>
  );
}
