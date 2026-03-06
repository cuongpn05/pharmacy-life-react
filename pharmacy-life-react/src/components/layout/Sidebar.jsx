import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Pill,
    ShoppingCart,
    Users,
    BarChart3,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Settings,
    Bell,
    Search,
    X
} from 'lucide-react';

// ─── Menu Configuration ─────────────────────────────────────────────────────

const menuItems = [
    {
        title: 'Tổng quan',
        icon: LayoutDashboard,
        path: '/admin/dashboard',
        color: 'text-blue-500',
        bg: 'bg-blue-50'
    },
    {
        title: 'Kho thuốc',
        icon: Pill,
        path: '/admin/inventory',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50'
    },
    {
        title: 'Đơn hàng',
        icon: ShoppingCart,
        path: '/admin/orders',
        color: 'text-orange-500',
        bg: 'bg-orange-50'
    },
    {
        title: 'Khách hàng',
        icon: Users,
        path: '/admin/customers',
        color: 'text-purple-500',
        bg: 'bg-purple-50'
    },
    {
        title: 'Báo cáo',
        icon: BarChart3,
        path: '/admin/reports',
        color: 'text-rose-500',
        bg: 'bg-rose-50'
    },
];

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SidebarItem = ({ item, isCollapsed, isActive }) => {
    const Icon = item.icon;

    return (
        <Link
            to={item.path}
            className={`group relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 mb-1 ${isActive
                    ? `${item.bg} ${item.color} shadow-sm shadow-black/5`
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <div className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            {!isCollapsed && (
                <span className={`font-bold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                    }`}>
                    {item.title}
                </span>
            )}

            {/* Tooltip for collapsed mode */}
            {isCollapsed && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap border border-white/10 shadow-xl">
                    {item.title}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-white/10" />
                </div>
            )}

            {/* Active Indicator Dot */}
            {isActive && isCollapsed && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-current rounded-full" />
            )}
        </Link>
    );
};

// ─── Main Sidebar Component ─────────────────────────────────────────────────

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    // Handle auto-collapse on smaller screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1280) setIsCollapsed(true);
            else setIsCollapsed(false);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* 1. Mobile Drawer Overlay */}
            <div
                className={`fixed inset-0 z-[140] bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* 2. Main Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 bottom-0 z-[150] bg-white border-r border-slate-100 flex flex-col transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${isCollapsed ? 'w-[88px]' : 'w-[280px]'}`}
            >
                {/* Brand Logo Section */}
                <div className={`p-6 flex items-center transition-all duration-500 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0 transform hover:rotate-12 transition-transform cursor-pointer">
                            <Pill className="text-white" size={24} />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col leading-none animate-in fade-in slide-in-from-left-2 duration-500">
                                <span className="text-[17px] font-black tracking-tight text-slate-800">
                                    PHARMACY<span className="text-emerald-500">LIFE</span>
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">Admin Panel</span>
                            </div>
                        )}
                    </div>

                    {/* Desktop Toggle Button */}
                    {!isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="hidden lg:flex w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 items-center justify-center transition-all animate-in fade-in zoom-in"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden w-8 h-8 rounded-lg bg-slate-50 text-slate-400 items-center justify-center"
                    >
                        <X size={18} />
                    </button>
                </div>

                {isCollapsed && (
                    <div className="px-6 mb-4 flex justify-center lg:block hidden animate-in fade-in zoom-in">
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="w-10 h-10 rounded-xl bg-slate-50 text-emerald-500 hover:bg-emerald-100 flex items-center justify-center transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* Separator / Categories label */}
                {!isCollapsed && (
                    <div className="px-8 mt-4 mb-2">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Danh mục chính</p>
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-2">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            item={item}
                            isCollapsed={isCollapsed}
                            isActive={location.pathname === item.path}
                        />
                    ))}

                    <div className="pt-6">
                        {!isCollapsed && <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] px-4 mb-3">Tùy chọn hệ thống</p>}
                        <SidebarItem
                            item={{ title: 'Cài đặt', icon: Settings, path: '/admin/settings', color: 'text-slate-500', bg: 'bg-slate-100' }}
                            isCollapsed={isCollapsed}
                            isActive={location.pathname === '/admin/settings'}
                        />
                    </div>
                </nav>

                {/* Profile & Logout Section */}
                <div className="mt-auto p-4 border-t border-slate-50 space-y-3">
                    <div className={`flex items-center gap-3 p-2 rounded-2xl bg-slate-50/50 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="relative shrink-0">
                            <img
                                src="https://ui-avatars.com/api/?name=Admin+Pharma&background=10b981&color=fff"
                                alt="Admin"
                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-50"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 animate-in fade-in duration-300">
                                <span className="text-sm font-bold text-slate-800 truncate">Quản trị viên</span>
                                <span className="text-[10px] font-medium text-slate-400 truncate">admin@pharmacylife.vn</span>
                            </div>
                        )}
                    </div>

                    <button className={`w-full group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 text-rose-500 hover:bg-rose-50 ${isCollapsed ? 'justify-center' : ''}`}>
                        <LogOut size={22} strokeWidth={2.5} className="shrink-0 transition-transform group-hover:-translate-x-1" />
                        {!isCollapsed && <span className="font-bold text-sm">Đăng xuất</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
