import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo CartContext
const CartContext = createContext();

// Custom hook để sử dụng CartContext
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// CartProvider component
export const CartProvider = ({ children }) => {
    // State cho giỏ hàng: mảng các item { id, name, price, quantity, ... }
    const [cartItems, setCartItems] = useState([]);

    // State cho toast notification
    const [toast, setToast] = useState({ show: false, message: '' });

    // Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = (product) => {
        setCartItems(prevItems => {
            // Kiểm tra sản phẩm đã tồn tại chưa
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Nếu đã tồn tại, tăng quantity
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Nếu chưa tồn tại, thêm mới với quantity = 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });

        // Hiển thị toast notification
        showToast(`${product.name} đã được thêm vào giỏ hàng!`);
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Hàm cập nhật số lượng sản phẩm
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Hàm xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
    };

    // Tính tổng số lượng sản phẩm trong giỏ
    const getTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Tính tổng giá tiền
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Hàm hiển thị toast
    const showToast = (message) => {
        setToast({ show: true, message });
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 3000);
    };

    // Load cart từ localStorage khi component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('pharmacy-cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Lưu cart vào localStorage khi cartItems thay đổi
    useEffect(() => {
        localStorage.setItem('pharmacy-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalQuantity,
        getTotalPrice,
        toast
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};