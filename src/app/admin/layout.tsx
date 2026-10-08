import type { Metadata } from "next";
import AdminOkvir from "@/components/admin/AdminOkvir";

export const metadata: Metadata = {
  title: { default: "Uređivanje stranice", template: "%s | Uređivanje RTV FBiH" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminOkvir>{children}</AdminOkvir>;
}
