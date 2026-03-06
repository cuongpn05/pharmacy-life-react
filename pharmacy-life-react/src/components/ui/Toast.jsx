import React from 'react';
import { useCart } from '../../context/CartContext';

const Toast = () => {
    const { toast } = useCart();

    if (!toast.show) return null;

    return (
        <div className="fixed top-20 right-4 z-50 animate-fade-up">
            <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">{toast.message}</span>
            </div>
        </div>
    );
};

export default Toast;