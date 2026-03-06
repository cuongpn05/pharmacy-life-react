import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ImportList from './pages/Dashboard/Import/ImportList';
import ImportCreate from './pages/Dashboard/Import/ImportCreate';
import UserProfile from './pages/Profile/UserProfile';
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/Dashboard/HomePage";

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <Router>
      <div className="bg-light min-vh-100 d-flex flex-column">
        {/* Modern Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 px-4">
          <div className="container-fluid">
            <Link to="/dashboard" className="navbar-brand d-flex align-items-center">
              <div className="bg-primary p-2 rounded-3 me-2 text-white d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                <i className="bi bi-capsule"></i>
              </div>
              <span className="fw-bold tracking-tight">Pharmacy<span className="text-secondary opacity-50">Life</span></span>
            </Link>

            <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-lg-4 gap-2">
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link px-3 rounded-pill active">Trang chủ</Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/import/list" className="nav-link px-3 rounded-pill bg-primary-subtle text-primary border-0">
                    <i className="bi bi-box-seam me-2"></i>Nhập hàng
                  </Link>
                </li>
              </ul>
              <div className="ms-auto d-flex align-items-center">
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary rounded-pill border-0 d-flex align-items-center py-2 px-3" id="userMenu">
                    <div className="bg-secondary rounded-circle me-2 d-flex align-items-center justify-content-center text-white small" style={{ width: '24px', height: '24px' }}>A</div>
                    <span className="small fw-semibold text-white">Administrator</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/dashboard/import/list" element={<ImportList />} />
            <Route path="/dashboard/import/create" element={<ImportCreate />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>

        <footer className="py-4 text-center text-muted small bg-white border-top mt-auto">
          &copy; 2026 <strong>Pharmacy Life</strong> - Dashboard Quản lý Chuyên nghiệp
        </footer>
      </div>
    </Router>
  );
}

export default App;
