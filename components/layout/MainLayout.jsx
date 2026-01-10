"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { createPageUrl, cn } from "@/lib/utils";
import CookieNotice from "@/components/ui/CookieNotice";
import ScrollToTop from "@/components/ui/ScrollToTop";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import ScrollPromotion from "@/components/ui/ScrollPromotion";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = () => {
    signOut();
  };

  const isHomePage = pathname === "/";
  const showUserMenu = !isHomePage && user;

  return (
    <>
      {isHomePage && <AnnouncementBar />}
      {showUserMenu && (
        <div className="bg-black border-b border-white/10 px-6 md:px-12 py-4">
          <div className="max-w-7xl mx-auto flex justify-end items-center gap-6">
            <div className="text-right">
              <p className="text-[#F5EDE4] text-sm font-light">
                {user.name}
              </p>
              <p className="text-[#F5EDE4]/40 text-xs">{user.email}</p>
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <Link
                href={createPageUrl("UserProfile")}
                className="text-[#F5EDE4]/60 hover:text-[#FF5401] transition-colors p-2"
              >
                <User className="w-5 h-5" />
              </Link>
              {user.role === "admin" && (
                <Link
                  href={createPageUrl("AdminDashboard")}
                  className="text-[#F5EDE4]/60 hover:text-[#FF5401] transition-colors text-xs tracking-wider px-3 py-2 border border-[#FF5401] rounded-none"
                >
                  ADMIN
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-[#F5EDE4]/60 hover:text-[#FF5401] transition-colors p-2"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
      {isHomePage && <ScrollPromotion />}
      <ScrollToTop />
      <CookieNotice />
    </>
  );
}