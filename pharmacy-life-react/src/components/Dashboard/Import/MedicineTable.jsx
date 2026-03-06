import React from 'react';

const MedicineTable = ({ medicines, onRemoveMedicine, onUpdateMedicine }) => {
    const calculateSubTotal = (quantity, unitPrice) => {
        return (quantity || 0) * (unitPrice || 0);
    };

    const totalAmount = medicines.reduce((sum, item) => sum + calculateSubTotal(item.Quantity, item.UnitPrice), 0);

    return (
        <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0">
                <thead className="bg-light text-uppercase tracking-wider">
                    <tr>
                        <th className="ps-4 border-0 py-3 text-secondary small fw-bold">#</th>
                        <th className="border-0 py-3 text-secondary small fw-bold">Thông tin thuốc</th>
                        <th className="border-0 py-3 text-secondary small fw-bold" style={{ width: '120px' }}>Số lượng</th>
                        <th className="border-0 py-3 text-secondary small fw-bold" style={{ width: '200px' }}>Giá nhập (VNĐ)</th>
                        <th className="border-0 py-3 text-secondary small fw-bold">Thành tiền</th>
                        <th className="text-center pe-4 border-0 py-3" style={{ width: '80px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {medicines.length > 0 ? (
                        medicines.map((item, index) => (
                            <tr key={index} className="border-bottom hover-bg-light transition-all">
                                <td className="ps-4 fw-bold text-muted">{index + 1}</td>
                                <td>
                                    <div className="fw-bold text-dark">{item.MedicineName}</div>
                                    <div className="d-flex align-items-center mt-1">
                                        <span className="badge bg-info-subtle text-info me-2 fw-medium border border-info-subtle">
                                            {item.Unit}
                                        </span>
                                        <small className="text-muted">Mã: {item.MedicineId}</small>
                                    </div>
                                </td>
                                <td>
                                    <div className="input-group input-group-sm">
                                        <input
                                            type="number"
                                            className="form-control border-light shadow-none text-center fw-bold"
                                            value={item.Quantity}
                                            onChange={(e) => onUpdateMedicine(index, 'Quantity', parseInt(e.target.value) || 0)}
                                            min="1"
                                            style={{ backgroundColor: '#fcfdfe', borderRadius: '8px' }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="input-group input-group-sm">
                                        <input
                                            type="number"
                                            className="form-control border-light shadow-none text-end fw-bold text-primary"
                                            value={item.UnitPrice}
                                            onChange={(e) => onUpdateMedicine(index, 'UnitPrice', parseFloat(e.target.value) || 0)}
                                            min="0"
                                            style={{ backgroundColor: '#fcfdfe', borderRadius: '8px' }}
                                        />
                                        <span className="input-group-text bg-transparent border-0 text-muted small">đ</span>
                                    </div>
                                </td>
                                <td className="fw-bold text-dark">
                                    {calculateSubTotal(item.Quantity, item.UnitPrice).toLocaleString()}
                                    <span className="ms-1 text-muted small fw-normal">đ</span>
                                </td>
                                <td className="text-center pe-4">
                                    <button
                                        className="btn btn-sm btn-light text-danger border-0 rounded-circle p-2 hover-shadow"
                                        title="Xóa thuốc này"
                                        onClick={() => onRemoveMedicine(index)}
                                        style={{ width: '32px', height: '32px' }}
                                    >
                                        <i className="bi bi-trash3-fill"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-5">
                                <div className="py-4">
                                    <i className="bi bi-box-seam display-4 text-light mb-3 d-block"></i>
                                    <p className="text-muted fst-italic mb-0">Chưa có thuốc nào trong danh sách nhập hàng.</p>
                                    <small className="text-black-50">Vui lòng chọn danh mục và thuốc ở phía trên.</small>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-bg-light:hover { background-color: #fbfcfe; }
                .transition-all { transition: all 0.2s ease; }
                .hover-shadow:hover { box-shadow: 0 2px 5px rgba(0,0,0,0.1); transform: translateY(-1px); }
            ` }} />
        </div>
    );
};

export default MedicineTable;
