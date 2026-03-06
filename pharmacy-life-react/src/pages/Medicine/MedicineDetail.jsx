import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMedicineById, getCategories } from '../../services/pharmacyService';

const MedicineDetail = () => {
    const { medicineId } = useParams();
    // Parse ID from formats like "1" or "medicine=1"
    const id = medicineId?.includes('=') ? medicineId.split('=')[1] : medicineId;

    const [medicine, setMedicine] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [medicineData, categoriesData] = await Promise.all([
                    getMedicineById(id),
                    getCategories()
                ]);
                setMedicine(medicineData);
                setCategories(categoriesData);
                setSelectedUnit(medicineData.Unit);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (error || !medicine) return (
        <div className="container py-5 text-center">
            <div className="alert alert-danger rounded-4 py-5 shadow-sm">
                <i className="bi bi-exclamation-triangle-fill display-4 d-block mb-3"></i>
                <h3 className="fw-bold">Lỗi: {error || 'Không tìm thấy sản phẩm'}</h3>
                <Link to="/" className="btn btn-primary px-4 rounded-pill mt-3">Quay lại trang chủ</Link>
            </div>
        </div>
    );

    const categoryName = categories.find(c => c.CategoryId === medicine.CategoryId)?.CategoryName || 'Đang cập nhật';

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    return (
        <div className="container-fluid py-5 bg-white min-vh-100">
            <div className="container">
                <div className="card border-0 shadow-sm rounded-5 overflow-hidden" style={{ background: '#f8fbff' }}>
                    <div className="row g-0">
                        {/* LEFT COLUMN: IMAGE & REVIEWS */}
                        <div className="col-lg-6 bg-white p-4 p-lg-5">
                            {/* Product Image */}
                            <div className="text-center mb-5">
                                <img
                                    src={medicine.ImageUrl}
                                    className="img-fluid rounded-4"
                                    alt={medicine.MedicineName}
                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                />
                            </div>

                            {/* Reviews Section */}
                            <div className="reviews-section mt-5 border-top pt-4">
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <i className="bi bi-pencil-square text-secondary h4 mb-0"></i>
                                    <h4 className="fw-bold m-0" style={{ fontSize: '1.25rem' }}>
                                        Đánh giá sản phẩm <span className="text-secondary fw-normal opacity-75">(1 đánh giá)</span>
                                    </h4>
                                </div>

                                <div className="row align-items-start mb-5">
                                    <div className="col-auto text-center pe-4 border-end">
                                        <div className="display-3 fw-bold m-0 lh-1">5<span className="h1 ms-1 text-warning">★</span></div>
                                        <button className="btn btn-primary btn-sm rounded-pill px-3 mt-2" style={{ backgroundColor: '#5c8df6', border: 'none' }}>Đánh giá</button>
                                    </div>
                                    <div className="col ps-4">
                                        {[5, 4, 3, 2, 1].map(star => (
                                            <div key={star} className="d-flex align-items-center gap-2 mb-1">
                                                <span className="small text-secondary fw-bold" style={{ width: '12px' }}>{star}</span>
                                                <div className="d-flex gap-1 text-warning" style={{ fontSize: '0.8rem' }}>
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <i key={i} className={`bi bi-star${i <= star ? '-fill' : ''}`}></i>
                                                    ))}
                                                </div>
                                                <span className="small text-secondary opacity-50 ms-1">({star === 5 ? 1 : 0})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Review List */}
                                <div className="review-list">
                                    <div className="d-flex gap-3 mb-4">
                                        <div className="avatar rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center fw-bold text-secondary" style={{ width: '45px', height: '45px', flexShrink: 0 }}>
                                            KT
                                        </div>
                                        <div>
                                            <div className="fw-bold mb-1">Kiên trịnh</div>
                                            <div className="d-flex gap-1 text-warning small mb-2">
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                            </div>

                                            {/* Pharmacist Reply */}
                                            <div className="position-relative ps-4 mt-3 ms-2">
                                                <div className="reply-line"></div>
                                                <div className="d-flex gap-3">
                                                    <div className="avatar rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                                                        CP
                                                    </div>
                                                    <div className="bg-light p-3 rounded-4 shadow-sm">
                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                            <span className="fw-bold">Phan Nhật Cường</span>
                                                            <span className="badge bg-primary rounded-pill small" style={{ fontSize: '0.7rem' }}>Dược sĩ</span>
                                                        </div>
                                                        <p className="small text-muted mb-0 lh-base">
                                                            Chào anh Tín, Dạ rất cảm ơn tình cảm của anh dành cho nhà thuốc PHARMACY LIFE. Bất cứ khi nào anh cần hỗ trợ, vui lòng liên hệ hệ thống đài miễn phí 18006868 để được tử vấn và đặt hàng. Thân mến!
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: DETAILS */}
                        <div className="col-lg-6 p-4 p-lg-5 d-flex flex-column" style={{ background: '#fff' }}>
                            <div className="details-header mb-4">
                                <h1 className="fw-bold text-dark mb-4" style={{ fontSize: '1.8rem', lineHeight: '1.3' }}>
                                    {medicine.MedicineName}
                                </h1>
                            </div>

                            <div className="price-display mb-5">
                                <h2 className="display-6 fw-bold text-primary mb-0" style={{ color: '#447dec' }}>
                                    {formatPrice(medicine.SellingPrice)} <span className="text-primary fw-normal">/ {medicine.Unit}</span>
                                </h2>
                            </div>

                            {/* Selectors */}
                            <div className="mb-4">
                                <div className="row align-items-center mb-4">
                                    <div className="col-4 col-md-3">
                                        <span className="text-secondary fw-medium">Chọn đơn vị tính</span>
                                    </div>
                                    <div className="col">
                                        <button
                                            className={`btn rounded-pill px-4 py-2 border-2 fw-bold transition-all ${selectedUnit === medicine.Unit ? 'btn-white border-primary text-dark shadow-sm' : 'btn-light border-light text-secondary'}`}
                                            onClick={() => setSelectedUnit(medicine.Unit)}
                                            style={{
                                                borderRight: selectedUnit === medicine.Unit ? '10px solid #447dec' : '2px solid transparent',
                                                backgroundColor: '#fff'
                                            }}
                                        >
                                            {medicine.Unit}
                                        </button>
                                    </div>
                                </div>

                                <div className="row align-items-center mb-4">
                                    <div className="col-4 col-md-3">
                                        <span className="text-secondary fw-medium">Chọn số lượng</span>
                                    </div>
                                    <div className="col">
                                        <div className="d-inline-flex border rounded-pill overflow-hidden bg-white shadow-sm p-1">
                                            <button
                                                className="btn btn-link py-1 px-3 border-0 text-secondary"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            >
                                                <i className="bi bi-dash h5 mb-0"></i>
                                            </button>
                                            <input
                                                type="text"
                                                className="form-control border-0 text-center fw-bold p-0"
                                                style={{ width: '50px', boxShadow: 'none' }}
                                                value={quantity}
                                                readOnly
                                            />
                                            <button
                                                className="btn btn-link py-1 px-3 border-0 text-dark"
                                                onClick={() => setQuantity(quantity + 1)}
                                            >
                                                <i className="bi bi-plus h5 mb-0"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Rows */}
                            <div className="mb-5 space-y-3">
                                <div className="d-flex mb-3 align-items-baseline">
                                    <span className="text-secondary fw-medium me-3" style={{ minWidth: '100px' }}>Danh mục :</span>
                                    <Link to={`/category/${medicine.CategoryId}`} className="text-decoration-none fw-bold" style={{ color: '#447dec' }}>{categoryName}</Link>
                                </div>
                                <div className="d-flex align-items-baseline">
                                    <span className="text-secondary fw-medium me-3" style={{ minWidth: '100px' }}>Mô tả ngắn :</span>
                                    <p className="text-secondary mb-0 flex-fill opacity-75 lh-base">
                                        {medicine.ShortDescription}
                                    </p>
                                </div>
                            </div>

                            {/* Build Button */}
                            <div className="mt-auto pt-4">
                                <button
                                    className="btn btn-primary w-100 py-3 rounded-pill fw-bold h4 m-0 shadow-lg"
                                    style={{
                                        backgroundColor: '#5c8df6',
                                        border: 'none',
                                        fontSize: '1.25rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Chọn mua
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .rounded-5 { border-radius: 2rem !important; }
                .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(92, 141, 246, 0.3) !important; }
                .reply-line {
                    position: absolute;
                    left: -20px;
                    top: -15px;
                    bottom: 20px;
                    width: 2px;
                    background: #eee;
                    border-radius: 10px;
                }
                .reply-line::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 20px;
                    height: 2px;
                    background: #eee;
                    border-radius: 10px;
                }
                .btn-white { background: #fff !important; }
                .fw-mono { font-family: monospace; }
                .badge { font-weight: 500; }
            `}</style>
        </div>
    );
};

export default MedicineDetail;
