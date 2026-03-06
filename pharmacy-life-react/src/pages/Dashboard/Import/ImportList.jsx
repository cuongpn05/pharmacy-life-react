import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import importService from '../../../services/importService';

const ImportList = () => {
    const navigate = useNavigate();
    const [imports, setImports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImports = async () => {
            try {
                const data = await importService.getAllImports();
                setImports(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch imports: " + err.message);
                setLoading(false);
            }
        };
        fetchImports();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phiếu nhập này?")) {
            try {
                await importService.deleteImport(id);
                setImports(imports.filter(i => (i.id || i.ImportId) !== id));
                alert("Xóa thành công!");
            } catch (err) {
                alert("Xóa thất bại: " + err.message);
            }
        }
    };

    if (loading) return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-50 mt-5">
            <div className="spinner-grow text-primary" role="status"></div>
            <p className="mt-3 text-muted fw-semibold">Đang tải danh sách phiếu nhập...</p>
        </div>
    );

    return (
        <div className="container-fluid py-4 px-lg-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted">Dashboard</Link></li>
                    <li className="breadcrumb-item active fw-bold text-primary" aria-current="page">Quản lý nhập hàng</li>
                </ol>
            </nav>

            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-white py-4 d-flex flex-wrap justify-content-between align-items-center border-0 gap-3">
                    <div>
                        <h3 className="mb-1 fw-bold text-dark">Lịch sử Nhập hàng</h3>
                        <p className="text-muted small mb-0">Theo dõi và quản lý các hóa đơn nhập thuốc từ nhà cung cấp</p>
                    </div>
                    <Link to="/dashboard/import/create" className="btn btn-primary d-flex align-items-center shadow-sm px-4 py-2 hover-scale">
                        <i className="bi bi-plus-lg me-2"></i> Tạo Phiếu Nhập
                    </Link>
                </div>

                <div className="card-body p-0">
                    {error && <div className="alert alert-danger m-4 border-0 rounded-3 shadow-sm">{error}</div>}

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small text-uppercase fw-bold border-top border-bottom">
                                <tr>
                                    <th className="ps-4 py-3">ID</th>
                                    <th className="py-3">Nhà cung cấp</th>
                                    <th className="py-3">Ngày nhập</th>
                                    <th className="py-3">Tổng tiền</th>
                                    <th className="py-3">Trạng thái</th>
                                    <th className="text-center py-3 pe-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {imports.length > 0 ? (
                                    imports.map((item) => (
                                        <tr key={item.id || item.ImportId}>
                                            <td className="ps-4 py-3 fw-bold text-secondary">#{item.id || item.ImportId}</td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle bg-primary-subtle p-2 me-3 text-primary">
                                                        <i className="bi bi-building"></i>
                                                    </div>
                                                    <div>
                                                        <span className="fw-semibold d-block text-dark">{item.Supplier?.SupplierName || `NCC #${item.SupplierId}`}</span>
                                                        <span className="text-muted small">{item.Supplier?.Phone || '024-386...'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-secondary">
                                                {new Date(item.ImportCreateAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-3 fw-bold text-dark">
                                                {item.TotalPrice?.toLocaleString()} <span className="text-muted small fw-normal">VNĐ</span>
                                            </td>
                                            <td className="py-3">
                                                <span className={`badge rounded-pill px-3 py-2 ${item.Status === 'Hoàn thành'
                                                        ? 'bg-success-subtle text-success border border-success'
                                                        : 'bg-warning-subtle text-warning-emphasis border border-warning'
                                                    }`}>
                                                    <i className={`bi bi-${item.Status === 'Hoàn thành' ? 'check-circle' : 'hourglass-split'} me-1`}></i>
                                                    {item.Status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="text-center py-3 pe-4">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-info rounded-3"
                                                        title="Xem chi tiết"
                                                        onClick={() => alert("Chi tiết đang được cập nhật!")}
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger rounded-3"
                                                        title="Xóa phiếu"
                                                        onClick={() => handleDelete(item.id || item.ImportId)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="py-4">
                                                <i className="bi bi-inboxes display-4 text-muted opacity-25 mb-3 d-block"></i>
                                                <p className="text-muted">Chưa có phiếu nhập nào được ghi nhận</p>
                                                <Link to="/dashboard/import/create" className="btn btn-outline-primary btn-sm mt-2">
                                                    Nhấp để tạo ngay
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer bg-white py-3 border-0">
                    <div className="d-flex justify-content-between align-items-center px-2">
                        <span className="text-muted small">Hiển thị {imports.length} phiếu nhập</span>
                        <nav aria-label="Page navigation">
                            <ul className="pagination pagination-sm mb-0">
                                <li className="page-item disabled"><a className="page-link" href="#">Trang trước</a></li>
                                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                <li className="page-item disabled"><a className="page-link" href="#">Trang sau</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportList;
