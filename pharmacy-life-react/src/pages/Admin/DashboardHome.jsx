import React from 'react';
import {
    TrendingUp,
    Users,
    Pill,
    ShoppingCart,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    Calendar
} from 'lucide-react';

// ─── Stat Card Component ────────────────────────────────────────────────────

const StatCard = ({ title, value, change, isPositive, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center text-[${color}] shrink-0`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {change}%
            </div>
        </div>
        <div className="flex flex-col">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800 tracking-tight">{value}</span>
            </div>
        </div>
    </div>
);

// ─── Main Dashboard Page ────────────────────────────────────────────────────

const DashboardHome = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 delay-150">
            {/* Header with Greeting and Date Selection */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Chào buổi sáng, Admin!</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Hệ thống dược phẩm PharmacyLife đang hoạt động ổn định.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 text-slate-600 font-bold text-xs shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
                        <Calendar size={16} className="text-emerald-500" />
                        <span>01 Tháng 03 - 06 Tháng 03, 2026</span>
                    </button>
                    <button className="bg-emerald-500 text-white px-6 py-2.5 rounded-2xl font-bold text-xs shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all cursor-pointer">
                        Xuất Báo Cáo
                    </button>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng doanh thu"
                    value="152,450,000đ"
                    change="12.5"
                    isPositive={true}
                    icon={TrendingUp}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Đơn hàng"
                    value="1,240"
                    change="8.2"
                    isPositive={true}
                    icon={ShoppingCart}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Khách hàng mới"
                    value="156"
                    change="3.4"
                    isPositive={false}
                    icon={Users}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Thuốc sắp hết"
                    value="12 loại"
                    change="0.5"
                    isPositive={false}
                    icon={Package}
                    color="bg-rose-500"
                />
            </div>

            {/* Layout: Main content & side widgets */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Table Area (Dummy) */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Đơn hàng gần đây</h2>
                        <button className="text-emerald-500 font-bold text-xs hover:underline decoration-2 underline-offset-4">Xem tất cả</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                    <th className="pb-4 px-2">Mã đơn</th>
                                    <th className="pb-4 px-2">Khách hàng</th>
                                    <th className="pb-4 px-2">Ngày đặt</th>
                                    <th className="pb-4 px-2">Giá trị</th>
                                    <th className="pb-4 px-2 text-right">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-2 font-mono font-bold text-slate-400 group-hover:text-emerald-500 transition-colors">#ORD-5629{i}</td>
                                        <td className="py-4 px-2 text-slate-800">Khách hàng {i}</td>
                                        <td className="py-4 px-2 text-slate-400 font-bold text-xs">06/03/2026</td>
                                        <td className="py-4 px-2 font-bold text-slate-800">{(500000 + i * 100000).toLocaleString()}đ</td>
                                        <td className="py-4 px-2 text-right">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold">Thành công</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Categories / Side Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight mb-8">Sản phẩm bán chạy</h2>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center p-2 group-hover:bg-emerald-50 transition-all shrink-0">
                                    <Pill className="text-slate-200 group-hover:text-emerald-500 transition-colors" size={24} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm text-slate-800 truncate">Paracetamol 500mg (Hộp {i})</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Kho: 25 Hộp</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-800 text-sm">{i * 12}0</p>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Đã bán</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-10 py-4 bg-slate-50 text-slate-400 text-xs font-bold rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-all uppercase tracking-widest">
                        Xem báo cáo kho chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
