import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Search,
    ShoppingCart,
    Bell,
    User,
    Menu,
    X,
    Pill,
    ChevronDown
} from "lucide-react";
import { useCart } from "../../context/CartContext";

// ─── Sub-Components ─────────────────────────────────────────────────────────

const Logo = () => (
    <Link to="/" className="flex items-center gap-2 group shrink-0">
        <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <Pill className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tight text-slate-800">
                PHARMACY<span className="text-primary-600">LIFE</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Trusted Health</span>
        </div>
    </Link>
);

const NavLink = ({ to, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`text-sm font-bold transition-all duration-200 relative group py-2 px-1 ${isActive ? "text-primary-600" : "text-slate-600 hover:text-primary-500"
                }`}
        >
            {label}
            <span className={`absolute bottom-0 left-0 h-1 bg-primary-500 rounded-full transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                }`} />
        </Link>
    );
};

const SearchBar = ({ value, onChange }) => (
    <div className="relative group w-full max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
        </div>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tìm kiếm thuốc, thực phẩm chức năng..."
            className="block w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border border-transparent focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-400 rounded-2xl text-sm transition-all duration-300 placeholder:text-slate-400 placeholder:font-medium"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="hidden lg:block text-[10px] font-bold text-slate-300 bg-white px-1.5 py-0.5 rounded border border-slate-100">
                ⌘K
            </span>
        </div>
    </div>
);

const ActionIcons = ({ cartCount, toggleMobile }) => (
    <div className="flex items-center gap-1 sm:gap-3">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-primary-600 transition-all duration-200 group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform" />
        </button>

        {/* Cart */}
        <Link
            to="/cart"
            className="relative p-2.5 rounded-2xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-all duration-200 group"
        >
            <ShoppingCart className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm">
                    {cartCount}
                </span>
            )}
        </Link>

        {/* Login Button */}
        <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
            <User className="w-4 h-4" />
            Đăng nhập
        </button>

        {/* Mobile Toggle */}
        <button
            onClick={toggleMobile}
            className="md:hidden p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
        >
            <Menu className="w-6 h-6" />
        </button>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────

const Navbar = () => {
    const { getTotalQuantity } = useCart();
    const cartCount = getTotalQuantity();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Trang chủ", to: "/" },
        { label: "Sản phẩm", to: "/products" },
        { label: "Danh mục", to: "/categories" },
        { label: "Về chúng tôi", to: "/about" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
                        ? "py-3 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-slate-200/50"
                        : "py-5 bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-8">
                        {/* Left Area: Logo + Nav */}
                        <div className="flex items-center gap-10">
                            <Logo />
                            <div className="hidden lg:flex items-center gap-8">
                                {navLinks.map((link) => (
                                    <NavLink key={link.label} {...link} />
                                ))}
                            </div>
                        </div>

                        {/* Center Area: Search (Desktop) */}
                        <div className="hidden md:flex flex-1 justify-center px-4">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>

                        {/* Right Area: Icons + Profile */}
                        <ActionIcons cartCount={cartCount} toggleMobile={() => setIsMobileMenuOpen(true)} />
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
                className={`fixed top-0 right-0 bottom-0 z-[120] w-[280px] bg-white shadow-2xl transition-transform duration-500 ease-out transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <Logo />
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-xl bg-slate-50 text-slate-400"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mb-8 md:hidden">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    </div>

                    <div className="space-y-2 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Điều hướng</p>
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-primary-50 hover:text-primary-600 transition-all font-bold group"
                            >
                                {link.label}
                                <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100">
                        <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3">
                            <User className="w-5 h-5" />
                            Đăng nhập / Đăng ký
                        </button>
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content jump since nav is fixed */}
            <div className="h-[80px] md:h-[90px]" />
        </>
    );
};

export default Navbar;
