import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    Eye,
    Pencil,
    Trash2,
    Pill
} from 'lucide-react';
import { getMedicines, getCategories } from '../../services/pharmacyService';

// ─── Stat Card Component ────────────────────────────────────────────────────
const StatCard = ({ label, value, colorClass }) => (
    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center transition-all hover:shadow-md h-full">
        <span className={`text-[42px] font-black mb-1 ${colorClass} tracking-tighter`}>{value}</span>
        <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.15em] opacity-80">{label}</span>
    </div>
);

// ─── Main Dashboard Page ────────────────────────────────────────────────────
const DashboardHome = () => {
    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medData, catData] = await Promise.all([
                    getMedicines(),
                    getCategories()
                ]);
                setMedicines(medData);
                setCategories(catData);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getCategoryName = (id) => {
        return categories.find(c => c.CategoryId === id)?.CategoryName || 'N/A';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    // Calculate stats
    const totalProducts = medicines.length;
    const inStock = medicines.filter(m => m.RemainingQuantity > 20).length;
    const lowStock = medicines.filter(m => m.RemainingQuantity > 0 && m.RemainingQuantity <= 20).length;
    const outOfStock = medicines.filter(m => m.RemainingQuantity === 0).length;

    // Filtered list
    const filteredMedicines = medicines.filter(m =>
        m.MedicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.MedicineCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto px-4">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mt-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#10b981] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 transform -rotate-6">
                        <Pill className="text-white" size={26} strokeWidth={3} />
                    </div>
                    <h1 className="text-[28px] font-black text-slate-800 tracking-tight uppercase">Quản lí thuốc</h1>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-grow lg:min-w-[450px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm tên thuốc, mã thuốc..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all outline-none font-bold text-sm placeholder:text-slate-300 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-blue-50 text-[#447dec] rounded-2xl hover:bg-[#447dec] hover:text-white transition-all shadow-sm border border-blue-100/50">
                        <Filter size={22} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Tổng sản phẩm" value={totalProducts} colorClass="text-[#447dec]" />
                <StatCard label="Còn hàng" value={inStock} colorClass="text-[#10b981]" />
                <StatCard label="Sắp hết hàng" value={lowStock} colorClass="text-[#f59e0b]" />
                <StatCard label="Hết hàng" value={outOfStock} colorClass="text-[#ef4444]" />
            </div>

            {/* Actions Bar */}
            <div className="flex justify-end pr-2">
                <button className="flex items-center gap-3 bg-[#447dec] text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] text-[13px] uppercase tracking-wide">
                    <Plus size={20} strokeWidth={4} />
                    <span>Thêm thuốc mới</span>
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-[0.1em]">
                                <th className="px-6 py-5 text-left">Mã</th>
                                <th className="px-4 py-5 text-left">Ảnh</th>
                                <th className="px-4 py-5 text-left w-[35%]">Tên thuốc</th>
                                <th className="px-4 py-5 text-left">Giá bán</th>
                                <th className="px-4 py-5 text-left">Giá gốc</th>
                                <th className="px-4 py-5 text-center">Đơn vị</th>
                                <th className="px-4 py-5 text-center">Số lượng</th>
                                <th className="px-4 py-5 text-center">Trạng thái</th>
                                <th className="px-6 py-5 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredMedicines.map((med) => (
                                <tr key={med.MedicineId} className="hover:bg-slate-50/30 transition-colors group border-b border-slate-50 last:border-0">
                                    <td className="px-6 py-4">
                                        <span className="font-extrabold text-slate-900 text-sm">{med.MedicineCode}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-1.5 flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                                            <img src={med.ImageUrl} alt={med.MedicineName} className="max-w-full max-h-full object-contain" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="font-bold text-slate-800 text-[13px] leading-tight line-clamp-1">{med.MedicineName}</p>
                                            <p className="text-slate-400 text-[10px] font-medium line-clamp-1 opacity-60 italic">{med.ShortDescription}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="font-black text-emerald-500 text-[14px]">{formatPrice(med.SellingPrice)}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-slate-400 text-[13px] font-semibold">{formatPrice(med.OriginalPrice || 0)}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-slate-600 text-[13px] font-bold">{med.Unit}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="font-black text-slate-900 text-[15px]">{med.RemainingQuantity}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex justify-center">
                                            {med.RemainingQuantity === 0 ? (
                                                <span className="px-4 py-1.5 bg-rose-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm shadow-rose-100">Hết hàng</span>
                                            ) : med.RemainingQuantity <= 20 ? (
                                                <span className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm shadow-orange-100">Sắp hết</span>
                                            ) : (
                                                <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm shadow-emerald-100">Sẵn có</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 text-white">
                                            <Link
                                                to={`/medicine=${med.MedicineId}`}
                                                className="w-9 h-9 rounded-xl bg-blue-50 text-[#447dec] flex items-center justify-center hover:bg-[#447dec] hover:text-white transition-all shadow-sm border border-blue-100/50"
                                            >
                                                <Eye size={16} strokeWidth={2.5} />
                                            </Link>
                                            <button className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm border border-orange-100/50">
                                                <Pencil size={16} strokeWidth={2.5} />
                                            </button>
                                            <button className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100/50">
                                                <Trash2 size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredMedicines.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-200" size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Không tìm thấy thuốc</h3>
                        <p className="text-slate-400 text-sm">Vui lòng thử lại với từ khóa khác.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;
