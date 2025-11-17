"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Users, Package, BarChart3, LogOut } from "lucide-react";

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-6 border-b">
        <h2 className="font-semibold text-xl">Admin Panel</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavItem href="/admin" icon={<Home />} active={path === "/admin"}>
          Dashboard
        </NavItem>
        <NavItem
          href="/admin/users"
          icon={<Users />}
          active={path.startsWith("/admin/users")}
        >
          Users
        </NavItem>
        <NavItem
          href="/admin/equipments"
          icon={<Package />}
          active={path.startsWith("/admin/equipments")}
        >
          Equipments
        </NavItem>
        <NavItem
          href="/admin/analytics"
          icon={<BarChart3 />}
          active={path.startsWith("/admin/analytics")}
        >
          Analytics
        </NavItem>
      </nav>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
        </Button>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, children, active }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
        active ? "bg-primary text-white" : "hover:bg-accent"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
