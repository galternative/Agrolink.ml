import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const PublicLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F5]">
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
