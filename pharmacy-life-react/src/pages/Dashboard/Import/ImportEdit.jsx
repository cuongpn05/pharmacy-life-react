import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import importService from '../../../services/importService';
import MedicineTable from '../../../components/Dashboard/Import/MedicineTable';

const ImportEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [importDate, setImportDate] = useState('');
    const [medicinesInImport, setMedicinesInImport] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppliersData, medicinesData, categoriesData, masterData] = await Promise.all([
                    importService.getAllSuppliers(),
                    importService.getAllMedicines(),
                    importService.getAllCategories(),
                    importService.getImportById(id)
                ]);

                setSuppliers(suppliersData);
                setMedicines(medicinesData);
                setCategories(categoriesData);

                // Pre-fill form
                setSelectedSupplier(masterData.SupplierId.toString());
                setImportDate(masterData.ImportCreateAt.split('T')[0]);

                // Get details
                const details = await importService.getImportDetails(masterData.ImportId);
                const mappedDetails = details.map(d => ({
                    MedicineId: d.MedicineId,
                    MedicineName: d.Medicine?.MedicineName || `Thuốc #${d.MedicineId}`,
                    Unit: d.Medicine?.Unit || 'N/A',
                    Quantity: d.ImportQuantity,
                    UnitPrice: d.UnitPrice
                }));
                setMedicinesInImport(mappedDetails);

                setLoading(false);
            } catch (err) {
                setError("Lỗi khi tải dữ liệu: " + err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

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
        e.target.value = '';
    };

    const updateMedicine = (index, field, value) => {
        const updated = [...medicinesInImport];
        updated[index][field] = value;
        setMedicinesInImport(updated);
    };

    const removeMedicine = (index) => {
        setMedicinesInImport(medicinesInImport.filter((_, i) => i !== index));
    };

    const totalPrice = medicinesInImport.reduce((sum, item) => sum + (item.Quantity * item.UnitPrice), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSupplier || !importDate || medicinesInImport.length === 0) {
            alert("Vui lòng điền đầy đủ thông tin và thêm ít nhất một loại thuốc!");
            return;
        }

        setSaving(true);
        try {
            await importService.updateImport(id, {
                SupplierId: parseInt(selectedSupplier),
                ImportCreateAt: importDate,
                TotalPrice: totalPrice,
                Details: medicinesInImport
            });
            alert("Cập nhật phiếu nhập thành công!");
            navigate('/dashboard/import/list');
        } catch (err) {
            setError("Lỗi khi cập nhật phiếu nhập: " + err.message);
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-50 mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted fw-semibold">Đang tải dữ liệu phiếu nhập...</p>
        </div>
    );

    return (
        <div className="container-fluid py-4 px-lg-5">
            {/* Header section... (keeping similar to create for consistency) */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted">Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to="/dashboard/import/list" className="text-decoration-none text-muted">Nhập hàng</Link></li>
                    <li className="breadcrumb-item active fw-bold text-primary">Chỉnh sửa phiếu</li>
                </ol>
            </nav>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark mb-0">Chỉnh sửa Phiếu Nhập hàng</h2>
                <Link to="/dashboard/import/list" className="btn btn-outline-secondary rounded-pill px-4">
                    <i className="bi bi-arrow-left me-2"></i>Quay lại
                </Link>
            </div>

            {error && <div className="alert alert-danger shadow-sm border-0 rounded-4 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    {/* Left side: Form info */}
                    <div className="col-lg-8">
                        <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
                            <div className="card-header bg-white py-4 border-0">
                                <h5 className="mb-0 fw-bold d-flex align-items-center">
                                    <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>1</span>
                                    Thông tin phiếu nhập
                                </h5>
                            </div>
                            <div className="card-body px-4 pb-4">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <select
                                                className="form-select border-0 bg-light shadow-sm"
                                                id="supplierSelect"
                                                value={selectedSupplier}
                                                onChange={(e) => setSelectedSupplier(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Chọn Nhà Cung Cấp --</option>
                                                {suppliers.map(s => (
                                                    <option key={s.SupplierId} value={s.SupplierId}>{s.SupplierName}</option>
                                                ))}
                                            </select>
                                            <label htmlFor="supplierSelect">Nhà cung cấp</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="date"
                                                className="form-control border-0 bg-light shadow-sm"
                                                id="importDate"
                                                value={importDate}
                                                onChange={(e) => setImportDate(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="importDate">Ngày nhập</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="mb-4 fw-bold d-flex align-items-center">
                                        <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>2</span>
                                        Thêm thuốc vào phiếu
                                    </h5>
                                    <div className="row g-3 bg-light p-3 rounded-4 mx-0 mb-4 shadow-sm border border-secondary border-opacity-10 text-wrap">
                                        <div className="col-md-5">
                                            <label className="form-label small fw-bold text-muted mb-1 ps-2">Lọc theo Danh mục</label>
                                            <select
                                                className="form-select border-0 shadow-sm py-2 rounded-3"
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                            >
                                                <option value="">Tất cả danh mục</option>
                                                {categories.map(c => (
                                                    <option key={c.CategoryId} value={c.CategoryId}>{c.CategoryName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-7">
                                            <label className="form-label small fw-bold text-muted mb-1 ps-2">Sản phẩm thuốc</label>
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
                                                            {m.MedicineName} - Giá nhập: {m.OriginalPrice?.toLocaleString() || 0} đ ({m.Unit})
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="rounded-4 border-0 shadow-sm overflow-hidden bg-white">
                                        <MedicineTable
                                            medicines={medicinesInImport}
                                            onUpdateMedicine={updateMedicine}
                                            onRemoveMedicine={removeMedicine}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Summary & Status */}
                    <div className="col-lg-4">
                        <div className="card shadow-lg border-0 rounded-4 overflow-hidden position-sticky" style={{ top: '2rem' }}>
                            <div className="bg-primary py-4 px-4 text-white">
                                <h5 className="mb-0 fw-bold">Tổng kết Hóa đơn</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between mb-3 text-muted">
                                    <span>Tổng số mặt hàng:</span>
                                    <span className="fw-bold text-dark">{medicinesInImport.length}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 text-muted">
                                    <span>Tổng số lượng nhập:</span>
                                    <span className="fw-bold text-dark">
                                        {medicinesInImport.reduce((sum, item) => sum + parseInt(item.Quantity || 0), 0)}
                                    </span>
                                </div>
                                <hr className="my-4" />
                                <div className="text-center mb-4">
                                    <p className="text-muted small mb-1">TỔNG CỘNG TIỀN THANH TOÁN</p>
                                    <h2 className="fw-bold text-primary mb-0">{totalPrice.toLocaleString()} VNĐ</h2>
                                </div>

                                <div className="d-grid gap-2 mb-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span> Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-save me-2"></i>Lưu Thay Đổi
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-light py-3 rounded-pill text-muted fw-bold border"
                                        onClick={() => navigate('/dashboard/import/list')}
                                    >
                                        Hủy bỏ & Thoát
                                    </button>
                                </div>

                                <div className="alert bg-primary-subtle border-0 rounded-3 small text-primary p-3">
                                    <i className="bi bi-shield-check me-2"></i>
                                    Mọi thay đổi sẽ được cập nhật đồng bộ vào hệ thống kho dược.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ImportEdit;
