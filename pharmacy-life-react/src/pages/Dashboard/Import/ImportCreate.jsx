import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import importService from '../../../services/importService';
import MedicineTable from '../../../components/Dashboard/Import/MedicineTable';

const ImportCreate = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setPossibleMedicines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [importDate, setImportDate] = useState(new Date().toISOString().split('T')[0]);
    const [medicinesInImport, setMedicinesInImport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppData, medData, catData] = await Promise.all([
                    importService.getAllSuppliers(),
                    importService.getAllMedicines(),
                    importService.getAllCategories()
                ]);
                setSuppliers(suppData);
                setPossibleMedicines(medData);
                setCategories(catData);
            } catch (err) {
                setError("Lỗi khi tải dữ liệu: " + err.message);
            }
        };
        fetchData();
    }, []);

    const handleAddMedicine = (e) => {
        const medicineId = e.target.value;
        if (!medicineId) return;

        const med = medicines.find(m => m.MedicineId === parseInt(medicineId));
        if (med && !medicinesInImport.some(m => m.MedicineId === med.MedicineId)) {
            setMedicinesInImport([
                ...medicinesInImport,
                {
                    MedicineId: med.MedicineId,
                    MedicineName: med.MedicineName,
                    Unit: med.Unit,
                    Quantity: 1,
                    UnitPrice: med.OriginalPrice || 0
                }
            ]);
        }
        e.target.value = ''; // Reset select
    };

    const updateMedicine = (index, field, value) => {
        const updated = [...medicinesInImport];
        updated[index][field] = value;
        setMedicinesInImport(updated);
    };

    const removeMedicine = (index) => {
        setMedicinesInImport(medicinesInImport.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit triggered", { selectedSupplier, importDate, medicinesCount: medicinesInImport.length });

        if (!selectedSupplier) {
            alert("⚠️ Vui lòng chọn nhà cung cấp!");
            return;
        }
        if (medicinesInImport.length === 0) {
            alert("⚠️ Vui lòng thêm ít nhất một loại thuốc!");
            return;
        }

        setLoading(true);
        const totalPrice = medicinesInImport.reduce((sum, item) => sum + (item.Quantity * item.UnitPrice), 0);
        const payload = {
            SupplierId: selectedSupplier,
            ImportCreateAt: importDate,
            TotalPrice: totalPrice,
            Details: medicinesInImport
        };
        console.log("Saving payload:", payload);

        try {
            const result = await importService.createImport(payload);
            console.log("Save successful:", result);
            alert("✅ Lưu phiếu nhập thành công!");
            navigate('/dashboard/import/list');
        } catch (err) {
            console.error("Submit error:", err);
            alert("❌ Lỗi: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted">Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to="/dashboard/import/list" className="text-decoration-none text-muted">Quản lý nhập hàng</Link></li>
                    <li className="breadcrumb-item active fw-bold text-primary" aria-current="page">Tạo phiếu nhập</li>
                </ol>
            </nav>

            <div className="row justify-content-center">
                <div className="col-12 col-xl-11">
                    <form onSubmit={handleSubmit}>
                        <div className="card shadow border-0 rounded-4 overflow-hidden mb-4">
                            <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center border-0 px-4">
                                <h4 className="mb-0 fw-bold"><i className="bi bi-file-earmark-plus-fill me-2"></i>Tạo Phiếu Nhập</h4>
                                <Link to="/dashboard/import/list" className="btn btn-outline-light btn-sm px-3 rounded-pill border-white border-2">
                                    <i className="bi bi-arrow-left me-1 small"></i> Trở về danh sách
                                </Link>
                            </div>
                            <div className="card-body p-lg-5">
                                <div className="row g-4 mb-5">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <select
                                                className="form-select border-primary-subtle shadow-none"
                                                id="supplierSelect"
                                                value={selectedSupplier}
                                                onChange={(e) => setSelectedSupplier(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Chọn Nhà cung cấp --</option>
                                                {suppliers.map(s => (
                                                    <option key={s.SupplierId} value={s.SupplierId}>{s.SupplierName}</option>
                                                ))}
                                            </select>
                                            <label htmlFor="supplierSelect" className="fw-bold text-primary">NHÀ CUNG CẤP</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="date"
                                                className="form-control border-primary-subtle shadow-none"
                                                id="importDate"
                                                value={importDate}
                                                onChange={(e) => setImportDate(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="importDate" className="fw-bold text-primary">NGÀY NHẬP HÀNG</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#f0f7ff', border: '1px solid #cce3ff' }}>
                                    <div className="row g-3 align-items-end">
                                        <div className="col-md-4">
                                            <label className="form-label mb-2 fw-bold text-dark-emphasis small uppercase">
                                                <i className="bi bi-collection-fill me-2 text-primary"></i>1. DANH MỤC THUỐC
                                            </label>
                                            <select
                                                className="form-select border-0 shadow-sm py-2 rounded-3"
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                            >
                                                <option value="">Tất cả danh mục</option>
                                                {categories.map(cat => (
                                                    <option key={cat.CategoryId} value={cat.CategoryId}>{cat.CategoryName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-8">
                                            <label className="form-label mb-2 fw-bold text-dark-emphasis small uppercase">
                                                <i className="bi bi-search me-2 text-primary"></i>2. CHỌN THUỐC CẦN NHẬP
                                            </label>
                                            <select
                                                className="form-select border-0 shadow-sm py-2 rounded-3"
                                                onChange={handleAddMedicine}
                                                value=""
                                            >
                                                <option value="">{selectedCategory ? "-- Chọn Thuốc trong danh mục này --" : "-- Chọn Thuốc (Hoặc chọn danh mục để lọc) --"}</option>
                                                {medicines
                                                    .filter(m => !selectedCategory || m.CategoryId === parseInt(selectedCategory))
                                                    .filter(m => !medicinesInImport.some(mi => mi.MedicineId === m.MedicineId))
                                                    .map(m => (
                                                        <option key={m.MedicineId} value={m.MedicineId}>
                                                            {m.MedicineName} - Giá nhập: {m.OriginalPrice?.toLocaleString() || 0} VNĐ ({m.Unit})
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0 fw-bold border-start border-4 border-primary ps-3">Danh sách thuốc đã chọn</h5>
                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                                            {medicinesInImport.length} loại sản phẩm
                                        </span>
                                    </div>
                                    <div className="shadow-sm bg-white rounded-4 overflow-hidden border">
                                        <MedicineTable
                                            medicines={medicinesInImport}
                                            onRemoveMedicine={removeMedicine}
                                            onUpdateMedicine={updateMedicine}
                                        />
                                    </div>
                                </div>

                                {medicinesInImport.length > 0 && (
                                    <div className="row justify-content-end mb-5">
                                        <div className="col-md-5 col-lg-4">
                                            <div className="card bg-primary text-white border-0 rounded-4 shadow-sm p-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="opacity-75 fw-semibold">Tổng tiền thanh toán:</span>
                                                    <h3 className="mb-0 fw-bold">
                                                        {medicinesInImport.reduce((sum, item) => sum + (item.Quantity * item.UnitPrice), 0).toLocaleString()} <small className="fs-6">VNĐ</small>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="d-flex justify-content-end gap-3 pt-4 border-top">
                                    <button
                                        type="button"
                                        className="btn btn-light px-4 py-2 text-muted fw-bold rounded-pill border"
                                        onClick={() => navigate('/dashboard/import/list')}
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        className={`btn btn-primary px-5 py-2 fw-bold rounded-pill shadow-lg ${loading ? 'disabled opacity-75' : ''}`}
                                        disabled={loading}
                                        style={{ minWidth: '220px', transition: 'all 0.3s ease' }}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <i className="bi bi-check2-circle me-2"></i>
                                        )}
                                        {loading ? 'Đang lưu...' : 'Lưu & Hoàn Tất'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .form-floating > .form-control:focus ~ label,
                .form-floating > .form-control:not(:placeholder-shown) ~ label,
                .form-floating > .form-select ~ label {
                    opacity: .85;
                    transform: scale(.85) translateY(-.5rem) translateX(.15rem);
                }
                .hover-scale:hover {
                    transform: scale(1.02);
                }
            ` }} />
        </div>
    );
};

export default ImportCreate;
