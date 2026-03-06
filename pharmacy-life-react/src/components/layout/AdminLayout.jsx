import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
    Bell,
    Search,
    Menu,
    User,
    ChevronDown,
    Maximize,
    HelpCircle,
    Settings
} from 'lucide-react';

// ─── Dashboard Header Sub-Component ─────────────────────────────────────────

const DashboardHeader = ({ onMenuClick }) => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-[130] transition-all duration-300">
            {/* Left Area: Mobile Menu Toggle & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer"
                >
                    <Menu size={22} />
                </button>

                <div className="hidden md:flex items-center gap-2 group relative w-full max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm bệnh nhân, đơn hàng, mã thuốc..."
                        className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 rounded-2xl text-[13px] font-medium transition-all duration-300 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Right Area: Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Quick Actions */}
                <div className="hidden sm:flex items-center gap-1 border-r border-slate-100 pr-4 mr-2">
                    <button className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all group">
                        <Maximize size={20} />
                    </button>
                    <button className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all">
                        <HelpCircle size={20} />
                    </button>
                </div>

                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-100 transition-all group">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50 group-hover:scale-125 transition-transform" />
                </button>

                {/* User Dropdown Profile (Simple version) */}
                <div className="flex items-center gap-3 pl-2 sm:pl-4 cursor-pointer group">
                    <div className="hidden sm:flex flex-col items-end leading-none">
                        <span className="text-[13px] font-bold text-slate-800">Admin Pharma</span>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Super Admin</span>
                    </div>
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <img
                            src="https://ui-avatars.com/api/?name=Admin+Pharma&background=10b981&color=fff"
                            alt="Profile"
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-50"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                    </div>
                    <ChevronDown size={14} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
                </div>
            </div>
        </header>
    );
};

// ─── Main Admin Layout Component ────────────────────────────────────────────

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* 1. Left Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-[88px] xl:pl-[280px] transition-all duration-500 ease-in-out">
                {/* Header */}
                <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Page Content (Outlet for routes) */}
                <main className="p-6 sm:p-8 flex-1 animate-in fade-in duration-700">
                    {/* Breadcrumb (Optional but good for UX) */}
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                        <span>Hệ thống</span>
                        <span className="text-slate-200">/</span>
                        <span className="text-emerald-500">Bảng điều khiển</span>
                    </div>

                    <Outlet />

                    {/* Minimal Footer for Dashboard */}
                    <footer className="mt-12 py-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <p>© 2026 PHARMACY LIFE. All Rights Reserved.</p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-emerald-500 transition-colors">Hỗ trợ</a>
                            <a href="#" className="hover:text-emerald-500 transition-colors">Chính sách</a>
                            <a href="#" className="hover:text-emerald-500 transition-colors">Liên hệ</a>
                        </div>
                    </footer>
                </main>
            </div>

            {/* Logic adjust sidebar spacing when it is collapsed or expanded 
          Note: This would be easier if Sidebar state was lifted up, 
          but for now we depend on standard widths for the main area padding.
          To perfectly handle it, we'd use a shared context for SidebarState.
      */}
            <style>{`
        @media (min-width: 1024px) {
          .lg\\:pl-\\[88px\\] { padding-left: 88px; }
        }
        @media (min-width: 1280px) {
          .xl\\:pl-\\[280px\\] { padding-left: 280px; }
        }
      `}</style>
        </div>
    );
};

export default AdminLayout;
