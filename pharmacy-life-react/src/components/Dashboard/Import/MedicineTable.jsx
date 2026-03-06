import React from 'react';

const MedicineTable = ({ medicines, onRemoveMedicine, onUpdateMedicine }) => {
    const calculateSubTotal = (quantity, unitPrice) => {
        return (quantity || 0) * (unitPrice || 0);
    };

    const totalAmount = medicines.reduce((sum, item) => sum + calculateSubTotal(item.Quantity, item.UnitPrice), 0);

    return (
        <div className="table-responsive rounded-3 border">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th className="ps-3 border-0 py-3">#</th>
                        <th className="border-0 py-3">Tên thuốc</th>
                        <th className="border-0 py-3">Đơn vị</th>
                        <th className="border-0 py-3" style={{ width: '120px' }}>Số lượng</th>
                        <th className="border-0 py-3" style={{ width: '180px' }}>Giá nhập (VNĐ)</th>
                        <th className="border-0 py-3">Thành tiền</th>
                        <th className="text-center pe-3 border-0 py-3" style={{ width: '80px' }}></th>
                    </tr>
                </thead>
                <tbody className="border-top-0">
                    {medicines.length > 0 ? (
                        medicines.map((item, index) => (
                            <tr key={index}>
                                <td className="ps-3 fw-bold text-muted">{index + 1}</td>
                                <td>
                                    <div className="fw-semibold text-dark">{item.MedicineName}</div>
                                    <div className="text-muted small">Mã: {item.MedicineId}</div>
                                </td>
                                <td>
                                    <span className="badge bg-light text-dark border">{item.Unit}</span>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm border-info-subtle shadow-none"
                                        value={item.Quantity}
                                        onChange={(e) => onUpdateMedicine(index, 'Quantity', parseInt(e.target.value) || 0)}
                                        min="1"
                                        style={{ backgroundColor: '#f8fcff' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm border-info-subtle shadow-none"
                                        value={item.UnitPrice}
                                        onChange={(e) => onUpdateMedicine(index, 'UnitPrice', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        style={{ backgroundColor: '#f8fcff' }}
                                    />
                                </td>
                                <td className="fw-bold text-primary">
                                    {calculateSubTotal(item.Quantity, item.UnitPrice).toLocaleString()}
                                </td>
                                <td className="text-center pe-3">
                                    <button
                                        className="btn btn-sm btn-link text-danger p-0"
                                        title="Xóa khỏi danh sách"
                                        onClick={() => onRemoveMedicine(index)}
                                    >
                                        <i className="bi bi-x-circle-fill"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-5">
                                <div className="text-muted py-2 fst-italic">
                                    <i className="bi bi-search me-2"></i>Chưa có thuốc nào được chọn vào bảng
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
                {medicines.length > 0 && (
                    <tfoot className="table-light">
                        <tr>
                            <td colSpan="5" className="text-end fw-bold py-3 fs-5">TỔNG CỘNG:</td>
                            <td colSpan="2" className="fw-bold py-3 fs-5 text-primary ps-0">
                                {totalAmount.toLocaleString()} VNĐ
                            </td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default MedicineTable;
