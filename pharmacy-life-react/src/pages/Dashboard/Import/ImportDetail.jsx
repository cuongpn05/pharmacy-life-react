import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import importService from '../../../services/importService';

const ImportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [importData, setImportData] = useState(null);
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const master = await importService.getImportById(id);
                setImportData(master);

                if (master && master.ImportId) {
                    const items = await importService.getImportDetails(master.ImportId);
                    setDetails(items);
                }
                setLoading(false);
            } catch (err) {
                setError("Lỗi khi tải chi tiết phiếu nhập: " + err.message);
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-primary" role="status"></div>
            <span className="ms-3 fw-bold">Đang tải chi tiết...</span>
        </div>
    );

    if (error || !importData) return (
        <div className="container mt-5">
            <div className="alert alert-danger shadow-sm border-0 rounded-4">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error || "Không tìm thấy dữ liệu phiếu nhập."}
            </div>
            <Link to="/dashboard/import/list" className="btn btn-primary rounded-pill px-4">Quay lại danh sách</Link>
        </div>
    );

    return (
        <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted">Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to="/dashboard/import/list" className="text-decoration-none text-muted">Quản lý nhập hàng</Link></li>
                    <li className="breadcrumb-item active fw-bold text-primary" aria-current="page">Chi tiết phiếu #{importData.ImportId}</li>
                </ol>
            </nav>

            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
                        <div className="card-header bg-primary text-white py-4 px-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="mb-0 fw-bold"><i className="bi bi-info-circle-fill me-2"></i>Chi Tiết Phiếu Nhập</h4>
                                <small className="opacity-75">ID Hệ thống: {importData.id}</small>
                            </div>
                            <div className="d-flex gap-2">
                                <Link to={`/dashboard/import/edit/${importData.id}`} className="btn btn-warning btn-sm px-3 rounded-pill fw-bold">
                                    <i className="bi bi-pencil-square me-1"></i> Chỉnh sửa
                                </Link>
                                <Link to="/dashboard/import/list" className="btn btn-outline-light btn-sm px-3 rounded-pill border-2">
                                    <i className="bi bi-arrow-left me-1"></i> Quay lại
                                </Link>
                            </div>
                        </div>
                        <div className="card-body p-lg-5">
                            <div className="row g-4 mb-5 pb-4 border-bottom">
                                <div className="col-md-4">
                                    <div className="d-flex align-items-start h-100 p-3 bg-white rounded-4 border">
                                        <div className="bg-primary-subtle p-3 rounded-3 me-3 text-primary">
                                            <i className="bi bi-building fs-4"></i>
                                        </div>
                                        <div>
                                            <p className="text-muted small fw-bold text-uppercase mb-1">Nhà Cung Cấp</p>
                                            <h5 className="mb-1 fw-bold text-dark">{importData.Supplier?.SupplierName || 'N/A'}</h5>
                                            <p className="text-muted small mb-0">{importData.Supplier?.SupplierAddress}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-start h-100 p-3 bg-white rounded-4 border">
                                        <div className="bg-info-subtle p-3 rounded-3 me-3 text-info">
                                            <i className="bi bi-calendar-event fs-4"></i>
                                        </div>
                                        <div>
                                            <p className="text-muted small fw-bold text-uppercase mb-1">Thời Gian Nhập</p>
                                            <h5 className="mb-1 fw-bold text-dark">
                                                {new Date(importData.ImportCreateAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric'
                                                })}
                                            </h5>
                                            <p className="text-muted small mb-0">Giờ: {new Date(importData.ImportCreateAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-start h-100 p-3 bg-white rounded-4 border border-success-subtle border-start-4 border-start-success">
                                        <div className="bg-success-subtle p-3 rounded-3 me-3 text-success">
                                            <i className="bi bi-check-circle-fill fs-4"></i>
                                        </div>
                                        <div>
                                            <p className="text-muted small fw-bold text-uppercase mb-1">Trạng Thái</p>
                                            <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm">
                                                {importData.Status || 'Hoàn thành'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 className="fw-bold mb-4 d-flex align-items-center">
                                <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px', fontSize: '14px' }}>
                                    <i className="bi bi-list-ul"></i>
                                </span>
                                Danh Mục Sản Phẩm Nhập
                            </h5>

                            <div className="table-responsive rounded-4 border shadow-sm bg-white overflow-hidden mb-5">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light text-uppercase tracking-wider">
                                        <tr>
                                            <th className="ps-4 py-3 border-0 text-secondary small fw-bold">#</th>
                                            <th className="py-3 border-0 text-secondary small fw-bold">Tên Thuốc</th>
                                            <th className="py-3 border-0 text-secondary small fw-bold">Đơn Vị</th>
                                            <th className="py-3 border-0 text-secondary small fw-bold text-center">Số Lượng</th>
                                            <th className="py-3 border-0 text-secondary small fw-bold text-end">Đơn Giá</th>
                                            <th className="pe-4 py-3 border-0 text-secondary small fw-bold text-end">Thành Tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-top-0">
                                        {details.map((item, index) => (
                                            <tr key={index}>
                                                <td className="ps-4 fw-bold text-muted">{index + 1}</td>
                                                <td>
                                                    <div className="fw-bold text-dark">{item.Medicine?.MedicineName || `Thuốc #${item.MedicineId}`}</div>
                                                    <small className="text-muted">Mã thuốc: {item.MedicineId}</small>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border px-2 py-1">{item.Medicine?.Unit || 'N/A'}</span>
                                                </td>
                                                <td className="text-center fw-bold">{item.ImportQuantity}</td>
                                                <td className="text-end text-primary fw-medium">{item.UnitPrice?.toLocaleString()} đ</td>
                                                <td className="pe-4 text-end fw-bold text-dark">{(item.ImportQuantity * item.UnitPrice).toLocaleString()} đ</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="table-light">
                                        <tr className="border-top-2 border-primary">
                                            <td colSpan="5" className="text-end py-4 fw-bold fs-5">TỔNG CỘNG THANH TOÁN:</td>
                                            <td className="pe-4 text-end py-4 fw-bold text-primary fs-4">
                                                {importData.TotalPrice?.toLocaleString()} <small>VNĐ</small>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="bg-light p-4 rounded-4 border mb-4">
                                <div className="row">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <h6 className="fw-bold text-muted small text-uppercase mb-3">Ghi chú & chữ ký</h6>
                                        <div className="bg-white p-3 rounded-3 border" style={{ height: '100px' }}>
                                            <p className="text-muted fst-italic small">Không có ghi chú bổ sung.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3 text-center">
                                        <p className="mb-5 text-muted small fw-bold text-uppercase">Người lập phiếu</p>
                                        <p className="mt-5 mb-0 fw-bold">Admin</p>
                                    </div>
                                    <div className="col-md-3 text-center">
                                        <p className="mb-5 text-muted small fw-bold text-uppercase">Bên giao hàng</p>
                                        <div className="mt-5 border-bottom border-dashed mx-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportDetail;
