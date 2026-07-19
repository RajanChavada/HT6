import React, { useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { Target, Home as HomeIcon, Plus, Trophy, LogOut, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/create", label: "New Bet", icon: Plus },
  { to: "/feed", label: "Feed", icon: Compass },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-amber-200">
      {/* Top Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 pointer-events-none">
        <Link to="/" className="flex items-center gap-2 group pointer-events-auto">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-[0_4px_10px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight font-display">PeerPot</span>
        </Link>
        
        {/* Mobile Profile Toggle */}
        <div className="md:hidden pointer-events-auto relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white"
          >
            {(user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
          </button>
          
          {showProfileMenu && (
            <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.full_name || "You"}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full text-left px-4 py-2 text-sm text-rose-600 font-semibold hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-32 min-h-screen">
        <Outlet />
      </main>

      {/* Floating Bottom Dock */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <nav className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-2 py-2 flex items-center gap-1 pointer-events-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 overflow-hidden",
                  isActive 
                    ? "bg-[#fdfbf7] text-amber-600" 
                    : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                )
              }
              title={item.label}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-5 h-5 z-10 transition-transform duration-200", isActive ? "-translate-y-1" : "group-hover:scale-110")} />
                  {isActive && (
                    <span className="absolute bottom-2.5 w-1 h-1 rounded-full bg-amber-500 z-10"></span>
                  )}
                  {/* Tooltip on hover for desktop */}
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-2 group-hover:translate-y-0 hidden md:block">
                    {item.label}
                  </div>
                </>
              )}
            </NavLink>
          ))}
          
          <div className="w-[1px] h-8 bg-slate-200 mx-1"></div>
          
          {/* Profile in Dock (Desktop) */}
          <div className="relative group hidden md:block">
            <button className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {(user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
            </button>
            {/* Hover menu for profile */}
            <div className="absolute bottom-full mb-3 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 translate-y-2 group-hover:translate-y-0 origin-bottom-right">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.full_name || "You"}</p>
                <p className="text-xs text-slate-500 truncate font-mono mt-0.5">DEVNET</p>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full text-left px-4 py-2 text-sm text-rose-600 font-semibold hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}