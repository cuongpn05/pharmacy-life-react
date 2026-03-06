import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import importService from '../../../services/importService';
import MedicineTable from '../../../components/Dashboard/Import/MedicineTable';

const ImportCreate = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setPossibleMedicines] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [importDate, setImportDate] = useState(new Date().toISOString().split('T')[0]);
    const [medicinesInImport, setMedicinesInImport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppData, medData] = await Promise.all([
                    importService.getAllSuppliers(),
                    importService.getAllMedicines()
                ]);
                setSuppliers(suppData);
                setPossibleMedicines(medData);
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

        try {
            await importService.createImport({
                SupplierId: parseInt(selectedSupplier),
                ImportCreateAt: importDate,
                TotalPrice: totalPrice,
                Details: medicinesInImport
            });
            alert("✅ Lưu phiếu nhập thành công!");
            navigate('/dashboard/import/list');
        } catch (err) {
            alert("❌ Lỗi: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4 px-lg-5">
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
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
                            <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center border-0 px-4">
                                <h4 className="mb-0 fw-bold"><i className="bi bi-file-earmark-plus me-2"></i>Tạo Phiếu Nhập</h4>
                                <Link to="/dashboard/import/list" className="btn btn-outline-light btn-sm px-3 rounded-pill border-white border-2">
                                    <i className="bi bi-x-lg me-1 small"></i> Hủy bỏ
                                </Link>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold text-secondary small text-uppercase">Nhà cung cấp:</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-primary-subtle text-primary"><i className="bi bi-truck"></i></span>
                                            <select
                                                className="form-select border-primary-subtle shadow-none py-2"
                                                value={selectedSupplier}
                                                onChange={(e) => setSelectedSupplier(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Chọn Nhà cung cấp --</option>
                                                {suppliers.map(s => (
                                                    <option key={s.SupplierId} value={s.SupplierId}>{s.SupplierName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold text-secondary small text-uppercase">Ngày nhập:</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-primary-subtle text-primary"><i className="bi bi-calendar-check"></i></span>
                                            <input
                                                type="date"
                                                className="form-control border-primary-subtle shadow-none py-2"
                                                value={importDate}
                                                onChange={(e) => setImportDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4 opacity-10" />

                                <div className="bg-light p-4 rounded-4 mb-4 border border-info-subtle border-start-4 border-start-info shadow-sm">
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-6 col-lg-7">
                                            <label className="form-label mb-2 fw-semibold text-dark">
                                                <i className="bi bi-search me-2 text-info"></i>Tìm kiếm & thêm thuốc:
                                            </label>
                                            <select
                                                className="form-select border-info shadow-none py-2"
                                                onChange={handleAddMedicine}
                                            >
                                                <option value="">-- Chọn Thuốc từ danh mục --</option>
                                                {medicines
                                                    .filter(m => !medicinesInImport.some(mi => mi.MedicineId === m.MedicineId))
                                                    .map(m => (
                                                        <option key={m.MedicineId} value={m.MedicineId}>{m.MedicineName} (Đơn giá MT: {m.OriginalPrice?.toLocaleString()} VNĐ)</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-lg-5 ps-md-4 mt-md-4">
                                            <div className="d-flex align-items-center h-100 mt-2">
                                                <i className="bi bi-lightbulb-fill text-warning me-2 fs-4"></i>
                                                <span className="text-muted small">Mẹo: Chọn thuốc từ danh sách để tự động điền giá gốc.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4 shadow-sm bg-white rounded-3">
                                    <MedicineTable
                                        medicines={medicinesInImport}
                                        onRemoveMedicine={removeMedicine}
                                        onUpdateMedicine={updateMedicine}
                                    />
                                </div>

                                <div className="d-flex justify-content-end gap-3 mt-5">
                                    <button
                                        type="button"
                                        className="btn btn-light px-4 py-2 text-muted fw-semibold rounded-pill border shadow-none"
                                        onClick={() => navigate('/dashboard/import/list')}
                                    >
                                        Hủy thao tác
                                    </button>
                                    <button
                                        type="submit"
                                        className={`btn btn-primary px-5 py-2 fw-bold rounded-pill shadow ${loading ? 'disabled opacity-75' : 'hover-scale'}`}
                                        disabled={loading}
                                        style={{ minWidth: '200px' }}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <i className="bi bi-save2 me-2"></i>
                                        )}
                                        {loading ? 'Đang xử lý...' : 'Lưu Phiếu Nhập'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ImportCreate;
