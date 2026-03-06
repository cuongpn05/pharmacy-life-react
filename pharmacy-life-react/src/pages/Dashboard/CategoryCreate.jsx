import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryCreate = () => {
  const [categoryCode, setCategoryCode] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryCode.trim() || !categoryName.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setSuccess(false);
      return;
    }
    setError("");
    setSuccess(true);
    setTimeout(() => {
      navigate("/category-list");
    }, 1200);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{background:'#f4f7fb'}}>
      <form className="p-5 bg-white rounded-4 shadow-lg animate__animated animate__fadeIn" style={{ minWidth: 380, maxWidth: 420 }} onSubmit={handleSubmit}>
        <div className="d-flex align-items-center mb-4 gap-2">
          <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
            <i className="bi bi-plus-square fs-4"></i>
          </div>
          <h3 className="mb-0 fw-bold text-primary">Thêm danh mục mới</h3>
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Mã danh mục</label>
          <input
            type="text"
            className="form-control rounded-pill px-3 py-2 fs-5"
            value={categoryCode}
            onChange={e => setCategoryCode(e.target.value)}
            placeholder="VD: CAT001"
            autoFocus
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Tên danh mục</label>
          <input
            type="text"
            className="form-control rounded-pill px-3 py-2 fs-5"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
            placeholder="VD: Thuốc dị ứng"
          />
        </div>
        {error && <div className="alert alert-danger py-2 small mb-2 animate__animated animate__fadeInDown">{error}</div>}
        {success && <div className="alert alert-success py-2 small mb-2 animate__animated animate__fadeInDown">Thêm thành công! Đang chuyển về danh sách...</div>}
        <button type="submit" className="btn btn-primary rounded-pill w-100 py-2 fs-5 animate__animated animate__pulse animate__faster">
          <i className="bi bi-plus-lg me-2"></i> Thêm mới
        </button>
        <button type="button" className="btn btn-link w-100 mt-2" onClick={()=>navigate("/category-list")}>Quay lại danh sách</button>
      </form>
    </div>
  );
};

export default CategoryCreate;
