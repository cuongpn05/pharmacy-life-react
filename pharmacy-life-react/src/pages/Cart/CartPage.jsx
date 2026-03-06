import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

// Hàm format giá tiền
const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();

    // Phí vận chuyển cố định
    const shippingFee = 30000;
    const subtotal = getTotalPrice();
    const total = subtotal + shippingFee;

    // Xử lý tăng số lượng
    const handleIncrease = (productId) => {
        const item = cartItems.find(item => item.id === productId);
        if (item) {
            updateQuantity(productId, item.quantity + 1);
        }
    };

    // Xử lý giảm số lượng
    const handleDecrease = (productId) => {
        const item = cartItems.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            updateQuantity(productId, item.quantity - 1);
        }
    };

    // Xử lý xóa sản phẩm
    const handleRemove = (productId) => {
        removeFromCart(productId);
    };

    // Nếu giỏ hàng trống
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Giỏ hàng trống</h2>
                    <p className="text-slate-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                    >
                        Tiếp tục mua sắm
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Giỏ hàng của bạn</h1>
                <p className="text-slate-600">{cartItems.length} sản phẩm trong giỏ hàng</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Danh sách sản phẩm */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-card p-6">
                            <div className="flex gap-4">
                                {/* Hình ảnh */}
                                <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image.startsWith('http') ? item.image : `${process.env.PUBLIC_URL}${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <ShoppingBag className="w-8 h-8 text-slate-400" />
                                    )}
                                </div>

                                {/* Thông tin sản phẩm */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-800 mb-1 line-clamp-2">{item.name}</h3>
                                    {item.category && (
                                        <p className="text-sm text-primary-600 mb-2">{item.category}</p>
                                    )}
                                    <p className="text-sm text-slate-500">{item.unit}</p>
                                </div>

                                {/* Điều khiển số lượng và giá */}
                                <div className="flex flex-col items-end gap-4">
                                    {/* Giá */}
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-primary-600">{formatPrice(item.price)}</p>
                                    </div>

                                    {/* Bộ tăng/giảm số lượng */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDecrease(item.id)}
                                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4 text-slate-600" />
                                        </button>
                                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrease(item.id)}
                                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                                        >
                                            <Plus className="w-4 h-4 text-slate-600" />
                                        </button>
                                    </div>

                                    {/* Nút xóa */}
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-card p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Tóm tắt đơn hàng</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Tạm tính</span>
                                <span className="font-semibold">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Phí vận chuyển</span>
                                <span className="font-semibold">{formatPrice(shippingFee)}</span>
                            </div>
                            <hr className="border-slate-200" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Tổng cộng</span>
                                <span className="text-primary-600">{formatPrice(total)}</span>
                            </div>
                        </div>

                        <Link
                            to="/checkout"
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            Tiến hành thanh toán
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;