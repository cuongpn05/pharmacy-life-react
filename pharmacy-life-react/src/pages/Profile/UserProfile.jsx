import React, { useState, useEffect } from "react";
import { getCustomerById } from "../../services/pharmacyService";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo: Sử dụng ID 1 cho đến khi có tính năng login
  const userId = 1;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getCustomerById(userId);
        setUser(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container-fluid py-5 px-md-5">
      <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '24px' }}>
        {/* Header với Background hiện đại và thông tin chính */}
        <div className="position-relative bg-dark p-5 text-white" style={{ 
          background: 'linear-gradient(135deg, #0d6efd 0%, #00398f 100%)',
          minHeight: '200px'
        }}>
          <div className="position-relative z-1">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb breadcrumb-dark mb-2">
                    <li className="breadcrumb-item"><small className="opacity-75 text-white">Tài khoản</small></li>
                    <li className="breadcrumb-item active text-white" aria-current="page"><small>Hồ sơ cá nhân</small></li>
                  </ol>
                </nav>
                <h1 className="fw-bold mb-1 display-4 text-white">{user.FullName}</h1>
                <div className="d-flex align-items-center mt-3">
                  <span className="badge bg-white bg-opacity-25 rounded-pill me-2 py-2 px-3">
                    <i className="bi bi-person-badge me-2"></i> {user.CustomerCode}
                  </span>
                  <span className="badge bg-success rounded-pill px-3 py-2">Đang hoạt động</span>
                </div>
              </div>
              <div className="text-end d-none d-md-block">
                <div className="h3 fw-bold mb-0 text-white">Pharmacy Life</div>
                <div className="opacity-75">Hệ thống quản lý dược phẩm</div>
              </div>
            </div>
          </div>
          {/* Họa tiết trang trí phía sau (Abstract background) */}
          <div className="position-absolute top-0 end-0 p-4 opacity-10">
            <i className="bi bi-capsule-pill" style={{ fontSize: '180px' }}></i>
          </div>
        </div>

        {/* Thân trang Profile */}
        <div className="card-body p-0">
          <div className="row g-0">
            {/* Thanh menu phụ bên trái */}
            <div className="col-md-3 border-end bg-light bg-opacity-50 p-4">
              <div className="list-group list-group-flush rounded-4 shadow-sm border overflow-hidden">
                <button className="list-group-item list-group-item-action active border-0 py-3">
                  <i className="bi bi-person-vcard fs-5 me-3"></i> Thông tin chung
                </button>
                <button className="list-group-item list-group-item-action border-0 py-3">
                  <i className="bi bi-shield-check fs-5 me-3"></i> Bảo mật & Mật khẩu
                </button>
                <button className="list-group-item list-group-item-action border-0 py-3">
                  <i className="bi bi-bag-check fs-5 me-3"></i> Đơn hàng đã mua
                </button>
                <button className="list-group-item list-group-item-action border-0 py-3">
                  <i className="bi bi-geo-alt fs-5 me-3"></i> Danh sách địa chỉ
                </button>
                <button className="list-group-item list-group-item-action border-0 py-3 text-danger">
                  <i className="bi bi-box-arrow-right fs-5 me-3"></i> Đăng xuất
                </button>
              </div>

              <div className="mt-4 p-4 bg-white rounded-4 shadow-sm border text-center">
                 <div className="text-muted small mb-1">Ngày tham gia</div>
                 <div className="fw-bold text-dark">{new Date(user.CreatedAt).toLocaleDateString("vi-VN")}</div>
              </div>
            </div>

            {/* Chi tiết thông tin bên phải */}
            <div className="col-md-9 p-4 p-lg-5 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="fw-bold text-dark m-0">Chi tiết hồ sơ</h4>
                <button className="btn btn-primary rounded-pill px-4 shadow-sm">
                  <i className="bi bi-pencil me-2"></i> Chỉnh sửa
                </button>
              </div>

              <div className="row g-4">
                <div className="col-12">
                   <div className="p-3 border-start border-primary border-4 bg-light rounded-end shadow-sm">
                      <div className="text-muted small fw-bold text-uppercase">Địa chỉ email</div>
                      <div className="h6 fw-bold mb-0">{user.Email}</div>
                   </div>
                </div>

                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase mb-2">Số điện thoại</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><i className="bi bi-phone"></i></span>
                    <input type="text" className="form-control bg-white border-start-0 ps-0 text-dark fw-semibold" value={user.PhoneNumber || "Chưa cập nhật"} readOnly />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase mb-2">Giới tính</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><i className="bi bi-gender-ambiguous"></i></span>
                    <input type="text" className="form-control bg-white border-start-0 ps-0 text-dark fw-semibold" value={user.Gender || "N/A"} readOnly />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase mb-2">Ngày sinh</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><i className="bi bi-calendar3"></i></span>
                    <input type="text" className="form-control bg-white border-start-0 ps-0 text-dark fw-semibold" value={user.Dob ? new Date(user.Dob).toLocaleDateString("vi-VN") : "N/A"} readOnly />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase mb-2">Quốc tịch</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><i className="bi bi-globe"></i></span>
                    <input type="text" className="form-control bg-white border-start-0 ps-0 text-dark fw-semibold" value="Việt Nam" readOnly />
                  </div>
                </div>

                <div className="col-12">
                  <label className="text-muted small fw-bold text-uppercase mb-2">Địa chỉ chính</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><i className="bi bi-geo"></i></span>
                    <textarea className="form-control bg-white border-start-0 ps-0 text-dark fw-semibold" rows="2" readOnly value={user.Address || "Chưa thiết lập địa chỉ mặc định"}></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4 mb-5">
        <p className="text-muted small">
          Mọi thông tin cá nhân đều được bảo mật theo chính sách của <strong>Pharmacy Life</strong>.
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
