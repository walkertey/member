import { LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function ManagementEntry() {
  const [location] = useLocation();
  if (location === "/manage" || location === "/members" || location === "/reports" || location === "/settings" || location === "/permissions") return null;

  return (
    <Link
      href="/manage"
      aria-label="Open Raymond management center"
      className="fixed bottom-5 right-4 z-40 flex min-h-12 items-center gap-2 rounded-full border border-[#F2D188]/55 bg-[#082744]/95 px-4 py-3 text-sm font-bold text-[#F2D188] shadow-[0_10px_30px_rgba(0,0,0,0.42),0_0_18px_rgba(235,203,131,0.2)] backdrop-blur-md transition active:scale-95"
    >
      <LayoutDashboard className="h-5 w-5" />
      Manage
    </Link>
  );
}
