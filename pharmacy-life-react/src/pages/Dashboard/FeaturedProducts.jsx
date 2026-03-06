import React, { useState, useEffect } from "react";
import { getMedicines, getCategories } from "../../services/pharmacyService";
import { useCart } from "../../context/CartContext";

const API_BASE = "http://localhost:3002";

const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`}
                fill="currentColor" viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-card">
        <div className="aspect-square bg-slate-100" />
        <div className="p-4 space-y-3">
            <div className="h-2 bg-slate-100 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-3/4" />
            <div className="h-2 bg-slate-100 rounded w-1/2" />
            <div className="h-8 bg-slate-100 rounded-xl" />
        </div>
    </div>
);

const ProductCard = ({ medicine, categoryName }) => {
    const { addToCart } = useCart();
    const [wishlisted, setWishlisted] = useState(false);
    const inStock = medicine.RemainingQuantity > 0;
    const hasDiscount = medicine.OriginalPrice && medicine.OriginalPrice > medicine.SellingPrice;
    const discount = hasDiscount
        ? Math.round(((medicine.OriginalPrice - medicine.SellingPrice) / medicine.OriginalPrice) * 100)
        : 0;

    // Resolve image URL — ảnh nằm trong public/assets/img/, dùng PUBLIC_URL để truy cập
    const imgSrc = medicine.ImageUrl
        ? medicine.ImageUrl.startsWith("http")
            ? medicine.ImageUrl
            : `${process.env.PUBLIC_URL}${medicine.ImageUrl}`
        : null;

    // Hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = () => {
        const product = {
            id: medicine.MedicineId,
            name: medicine.MedicineName,
            price: medicine.SellingPrice,
            image: medicine.ImageUrl,
            unit: medicine.Unit,
            category: categoryName
        };
        addToCart(product);
    };

    return (
        <div id={`product-card-${medicine.MedicineId}`} className="card overflow-hidden group flex flex-col">
            {/* Image Area */}
            <div className="relative bg-gradient-to-br from-slate-50 to-primary-50 aspect-square flex items-center justify-center overflow-hidden">
                {/* Medicine Code Badge */}
                <span className="badge bg-slate-100 text-slate-500 absolute top-3 left-3 z-10 text-[10px]">
                    {medicine.MedicineCode}
                </span>

                {/* Wishlist */}
                <button
                    id={`wishlist-btn-${medicine.MedicineId}`}
                    onClick={() => setWishlisted(!wishlisted)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200"
                >
                    <svg
                        className={`w-4 h-4 transition-colors duration-200 ${wishlisted ? "text-red-500" : "text-slate-400 group-hover:text-red-400"}`}
                        fill={wishlisted ? "currentColor" : "none"}
                        stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Product Image or Fallback */}
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={medicine.MedicineName}
                        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                    />
                ) : null}
                {/* Fallback Icon */}
                <div
                    className={`w-20 h-20 bg-white rounded-2xl shadow-sm items-center justify-center transition-transform duration-300 group-hover:scale-110 ${imgSrc ? "hidden" : "flex"}`}
                >
                    <svg className="w-10 h-10 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>

                {/* Discount badge */}
                {discount > 0 && (
                    <div className="absolute bottom-3 right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
                        -{discount}%
                    </div>
                )}

                {/* Out of stock */}
                {!inStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                {/* Category */}
                {categoryName && (
                    <div className="text-[10px] text-primary-400 font-semibold uppercase tracking-wider mb-1">
                        {categoryName}
                    </div>
                )}

                {/* Name */}
                <h3 className="text-sm font-semibold text-slate-800 mb-1.5 line-clamp-2 leading-snug">
                    {medicine.MedicineName}
                </h3>

                {/* Brand */}
                {medicine.BrandOrigin && (
                    <div className="text-[11px] text-slate-400 mb-2">
                        Origin: {medicine.BrandOrigin}
                    </div>
                )}

                {/* Unit + Stock */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-slate-100 text-slate-500 text-[10px]">{medicine.Unit}</span>
                    <span className={`badge text-[10px] ${inStock ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                        {inStock ? `${medicine.RemainingQuantity} in stock` : "Out of stock"}
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4 mt-auto">
                    <span className="text-base font-extrabold text-primary-600">
                        {formatPrice(medicine.SellingPrice)}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">
                            {formatPrice(medicine.OriginalPrice)}
                        </span>
                    )}
                </div>

                {/* Add to Cart */}
                <button
                    id={`add-to-cart-btn-${medicine.MedicineId}`}
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
            ${inStock
                            ? "bg-primary-500 hover:bg-primary-600 text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {inStock ? "Add to Cart" : "Unavailable"}
                </button>
            </div>
        </div>
    );
};

const FeaturedProducts = () => {
    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [visibleCount, setVisibleCount] = useState(8);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [meds, cats] = await Promise.all([getMedicines(), getCategories()]);
                setMedicines(meds);
                setCategories(cats);
            } catch (err) {
                setError("Cannot load products. Please ensure json-server is running on port 3001.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Build category map: CategoryId -> CategoryName
    const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.CategoryId] = cat.CategoryName;
        return acc;
    }, {});

    // Build filter tabs từ categories thực tế (lấy top 5)
    const filterTabs = [
        { id: "all", label: "All Products" },
        ...categories.slice(0, 5).map((c) => ({ id: c.CategoryId, label: c.CategoryName.split(" ").slice(0, 3).join(" ") })),
    ];

    // Filter medicines
    const filtered = activeFilter === "all"
        ? medicines
        : medicines.filter((m) => m.CategoryId === activeFilter);

    const displayed = filtered.slice(0, visibleCount);
    const hasMore = filtered.length > visibleCount;

    return (
        <section id="products" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <span className="inline-block text-xs font-semibold text-primary-500 tracking-widest uppercase bg-primary-50 px-4 py-1.5 rounded-full mb-4">
                            Featured Products
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                            Top Picks for You
                        </h2>
                        {!loading && (
                            <p className="text-sm text-slate-400 mt-1">
                                {filtered.length} products found
                            </p>
                        )}
                    </div>
                    <a href="#" className="text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors duration-200 shrink-0">
                        View all products
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>

                {/* Filter Tabs */}
                {!loading && (
                    <div className="flex gap-2 flex-wrap mb-8 overflow-x-auto pb-1">
                        {filterTabs.map((f) => (
                            <button
                                key={f.id}
                                id={`filter-btn-${f.id}`}
                                onClick={() => { setActiveFilter(f.id); setVisibleCount(8); }}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer shrink-0
                  ${activeFilter === f.id
                                        ? "bg-primary-500 text-white shadow-md"
                                        : "bg-slate-100 text-slate-500 hover:bg-primary-50 hover:text-primary-500"
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl border border-red-100">
                        <svg className="w-8 h-8 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                        : displayed.map((medicine) => (
                            <ProductCard
                                key={medicine.MedicineId}
                                medicine={medicine}
                                categoryName={categoryMap[medicine.CategoryId]}
                            />
                        ))}
                </div>

                {/* Empty state */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                        <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p>No products found in this category.</p>
                    </div>
                )}

                {/* Load More */}
                {!loading && hasMore && (
                    <div className="text-center mt-12">
                        <button
                            id="load-more-btn"
                            onClick={() => setVisibleCount((v) => v + 8)}
                            className="btn-outline"
                        >
                            Load More Products ({filtered.length - visibleCount} remaining)
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
