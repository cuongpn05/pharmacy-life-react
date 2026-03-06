import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
    ChevronLeft,
    CreditCard,
    Truck,
    CheckCircle2,
    ShoppingBag,
    Package,
    ArrowRight,
    Search
} from 'lucide-react';

// Format price helper
const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, clearCart } = useCart();

    // Order successful state
    const [isSuccess, setIsSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        notes: '',
        paymentMethod: 'cod' // default value
    });

    // Form errors state
    const [errors, setErrors] = useState({});

    // Costs
    const subtotal = getTotalPrice();
    const shippingFee = 30000;
    const total = subtotal + shippingFee;

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi khi người dùng nhập lại
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống';

        const phoneRegex = /^[0-9]{10,11}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại không được để trống';
        } else if (!phoneRegex.test(formData.phone.trim())) {
            newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
        }

        if (!formData.address.trim()) newErrors.address = 'Địa chỉ không được để trống';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Simulate API call
            console.log('Đặt hàng với thông tin:', { formData, cartItems, total });

            // On success
            setTimeout(() => {
                setIsSuccess(true);
                clearCart();
                window.scrollTo(0, 0);
            }, 600);
        }
    };

    // Success View
    if (isSuccess) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce-subtle">
                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Cảm ơn bạn đã đặt hàng!</h1>
                <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
                    Đơn hàng của bạn đã được tiếp nhận thành công. PharmacyLife sẽ sớm liên hệ xác nhận và giao hàng cho bạn nhanh nhất có thể.
                </p>

                <div className="bg-white rounded-3xl shadow-card p-10 mb-12 border border-slate-100">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                        <span className="text-slate-500 font-medium tracking-wide uppercase text-xs">Mã đơn hàng</span>
                        <span className="font-mono font-bold text-lg text-primary-600">PHL-{(Math.floor(Math.random() * 900000) + 100000)}</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Khách hàng:</span>
                            <span className="font-semibold text-slate-800">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Số điện thoại:</span>
                            <span className="font-semibold text-slate-800">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between text-sm text-left">
                            <span className="text-slate-500 shrink-0 mr-4">Địa chỉ giao hàng:</span>
                            <span className="font-semibold text-slate-800">{formData.address}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:translate-y-[-2px]"
                    >
                        Về trang chủ
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold transition-all duration-200"
                    >
                        In hóa đơn đơn hàng
                    </button>
                </div>
            </div>
        );
    }

    // Checkout View
    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with back button */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate('/cart')}
                        className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">Thanh toán đơn hàng</h1>
                        <p className="text-slate-500 font-medium">Hoàn tất thông tin của bạn để đặt hàng</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Form Info */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Section 1: Customer Info */}
                        <div className="bg-white rounded-3xl shadow-card overflow-hidden border border-slate-100">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-primary-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Thông tin nhận hàng</h2>
                            </div>

                            <form className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="fullName" className="text-sm font-semibold text-slate-700 ml-1">Họ và tên *</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Nhập họ tên người nhận"
                                            className={`w-full p-4 rounded-2xl bg-slate-50 border focus:outline-none transition-all duration-200 ${errors.fullName ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-400'
                                                }`}
                                        />
                                        {errors.fullName && <p className="text-xs font-medium text-red-500 mt-1 ml-1">{errors.fullName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-semibold text-slate-700 ml-1">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Số điện thoại liên lạc"
                                            className={`w-full p-4 rounded-2xl bg-slate-50 border focus:outline-none transition-all duration-200 ${errors.phone ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-400'
                                                }`}
                                        />
                                        {errors.phone && <p className="text-xs font-medium text-red-500 mt-1 ml-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="address" className="text-sm font-semibold text-slate-700 ml-1">Địa chỉ giao hàng *</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Nhập địa chỉ chi tiết (Số nhà, đường, phường/xã, quận/huyện...)"
                                        className={`w-full p-4 rounded-2xl bg-slate-50 border focus:outline-none transition-all duration-200 ${errors.address ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-400'
                                            }`}
                                    ></textarea>
                                    {errors.address && <p className="text-xs font-medium text-red-500 mt-1 ml-1">{errors.address}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="notes" className="text-sm font-semibold text-slate-700 ml-1">Ghi chú thêm</label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows="2"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Ghi chú về đơn hàng hoặc thời gian giao hàng mong muốn"
                                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all duration-200"
                                    ></textarea>
                                </div>
                            </form>
                        </div>

                        {/* Section 2: Payment Methods */}
                        <div className="bg-white rounded-3xl shadow-card overflow-hidden border border-slate-100">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Hình thức thanh toán</h2>
                            </div>

                            <div className="p-8 space-y-4">
                                <label
                                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${formData.paymentMethod === 'cod'
                                            ? 'bg-primary-50 border-primary-500 shadow-md ring-4 ring-primary-100/50'
                                            : 'bg-white border-slate-100 hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${formData.paymentMethod === 'cod' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 leading-tight">Thanh toán khi nhận hàng (COD)</p>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">Bạn thanh toán trực tiếp cho shipper khi nhận được hàng.</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
                                        }`}>
                                        {formData.paymentMethod === 'cod' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                </label>

                                <label
                                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${formData.paymentMethod === 'bank'
                                            ? 'bg-indigo-50 border-indigo-500 shadow-md ring-4 ring-indigo-100/50'
                                            : 'bg-white border-slate-100 hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bank"
                                        checked={formData.paymentMethod === 'bank'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${formData.paymentMethod === 'bank' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 leading-tight">Chuyển khoản ngân hàng</p>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">Chúng tôi sẽ cung cấp thông tin tài khoản sau khi đặt hàng.</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'bank' ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                                        }`}>
                                        {formData.paymentMethod === 'bank' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
                        <div className="bg-white rounded-3xl shadow-card overflow-hidden border border-slate-100">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                    <Package className="w-5 h-5 text-amber-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Tóm tắt sản phẩm</h2>
                            </div>

                            <div className="p-8 max-h-[350px] overflow-y-auto space-y-4 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-2 group">
                                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                                            {item.image ? (
                                                <img
                                                    src={item.image.startsWith('http') ? item.image : `${process.env.PUBLIC_URL}${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            ) : <Package className="w-6 h-6 text-slate-400" />}
                                            <span className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-lg font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">{item.name}</p>
                                            <p className="text-xs text-slate-500 mt-1 font-semibold">{item.unit} x {item.quantity}</p>
                                        </div>
                                        <div className="shrink-0 flex items-center">
                                            <p className="font-bold text-slate-800 text-sm">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Tạm tính</span>
                                    <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Phí giao hàng</span>
                                    <span className="font-bold text-green-600">+{formatPrice(shippingFee)}</span>
                                </div>
                                <div className="h-px bg-slate-200 w-full my-2"></div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tổng tiền cần thanh toán</p>
                                        <p className="text-3xl font-black text-primary-600 mt-1">{formatPrice(total)}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform active:scale-[0.98] mt-4 flex items-center justify-center gap-3 cursor-pointer group"
                                >
                                    Xác nhận & Đặt hàng ngay
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed font-medium">
                                    Bằng cách nhấn nút Đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của PharmacyLife
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
