
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3636/Category")
      .then((res) => {
        if (!res.ok) throw new Error("Không lấy được danh mục");
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = categories.filter(
    (cat) =>
      cat.CategoryName.toLowerCase().includes(search.toLowerCase()) ||
      cat.CategoryCode.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm text-center">{error}</div>
      </div>
    );

  return (
    <div className="container py-5" style={{ background: '#f4f7fb', borderRadius: '18px', transition: 'background 0.3s' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-dark text-white rounded-3 d-flex align-items-center justify-content-center animate__animated animate__fadeInLeft" style={{ width: 40, height: 40 }}>
            <i className="bi bi-list-task fs-4"></i>
          </div>
          <h2 className="mb-0 fw-bold animate__animated animate__fadeIn" >Quản lí danh mục</h2>
        </div>
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control rounded-pill px-4 shadow-sm animate__animated animate__fadeInRight"
            style={{ minWidth: 220 }}
            placeholder="Tìm tên thuốc, mã thuốc,..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-light rounded-circle border shadow-sm animate__animated animate__fadeInRight">
            <i className="bi bi-funnel"></i>
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary rounded-pill px-4 animate__animated animate__fadeInUp" onClick={() => navigate("/category-create") }>
          <i className="bi bi-plus-lg me-2"></i> Thêm danh mục mới
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-borderless align-middle mb-0" style={{ borderRadius: '18px', overflow: 'hidden', transition: 'box-shadow 0.3s' }}>
          <thead style={{ background: '#e9eff7' }}>
            <tr>
              <th className="fw-bold text-secondary">Mã mục</th>
              <th className="fw-bold text-secondary">Tên danh mục</th>
              <th className="fw-bold text-secondary text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(cat => (
              <tr key={cat.CategoryId} style={{ background: '#fff', transition: 'background 0.3s'  , fontSize:"18px"}}
                className="category-row" >
                <td className="fw-bold text-dark">{cat.CategoryCode}</td>
                <td>{cat.CategoryName}</td>
                <td className="text-center">
                  <button className="btn btn-sm rounded-circle me-2 action-btn" style={{ background: '#eaf6ff', color: '#0d6efd', transition: 'transform 0.2s' }} title="Xem">
                    <i className="bi bi-eye-fill"></i>
                  </button>
                  <button className="btn btn-sm rounded-circle me-2 action-btn" style={{ background: '#fffbe6', color: '#ffc107', transition: 'transform 0.2s' }} title="Sửa">
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button className="btn btn-sm rounded-circle action-btn" style={{ background: '#ffeaea', color: '#dc3545', transition: 'transform 0.2s' }} title="Xóa">
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Custom CSS for effects */}
      <style>{`
        .category-row:hover { background: #f0f8ff !important; }
        .action-btn:hover { transform: scale(1.15); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      `}</style>
    </div>
  );
};

export default CategoryList;
