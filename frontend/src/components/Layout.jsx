import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import useOnScrollAnimation from './UseAnimateOnScroll';

export default function Layout() {
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const imageUrl = user?.image
  ? `http://localhost:5000/images/users/${user.image}`
  : '/images/Default.png';
  console.log()
  useOnScrollAnimation();

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active disabled' : 'nav-link';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
  };

  // Fechar a sidebar ao clicar fora dela
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Evitar renderização até que o estado de autenticação seja carregado
  if (loading) {
    return null; 
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <a className="navbar-brand" href="#hero">
            <img src="/images/Logo.png" alt="Reusa Logo" width="60" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleSidebar}
            aria-expanded={isSidebarOpen ? 'true' : 'false'}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Barra lateral */}
          <div
            ref={sidebarRef}
            className={`sidebar ${isSidebarOpen ? 'active' : ''}`}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100%',
              width: '250px',
              background: 'linear-gradient(90deg,rgb(34, 66, 36),rgb(42, 77, 43))',
              zIndex: 1000,
              transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <ul className="navbar-nav p-4">
              <li className="nav-item">
                <Link
                  to="/"
                  className={getNavLinkClass('/')}
                  onClick={closeSidebar}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/Courses"
                  className={getNavLinkClass('/Courses')}
                  onClick={closeSidebar}
                >
                  Cursos
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/Comunity"
                  className={getNavLinkClass('/Comunity')}
                  onClick={closeSidebar}
                >
                  Comunidade
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/Prizes"
                  className={getNavLinkClass('/Prizes')}
                  onClick={closeSidebar}
                >
                  Prêmios
                </Link>
              </li>
              <li className="nav-item">
                {user ? (
                  <div className="d-flex flex-column gap-2">
                    <span className="navbar-text text-white">{user.name}</span>
                    <button
                      className="btn btn-outline-danger"
                      onClick={handleLogout}
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/Login"
                    className="btn btn-outline-light"
                    onClick={closeSidebar}
                  >
                    Cadastre-se
                  </Link>
                )}
              </li>
              <li className="nav-item">
                <button
                  className="close-btn btn btn-link text-white"
                  onClick={closeSidebar}
                >
                  X
                </button>
              </li>
            </ul>
          </div>

          {/* Navbar padrão */}
          <div className={`collapse navbar-collapse ${isSidebarOpen ? 'd-none' : ''}`}>
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link to="/" className={getNavLinkClass('/')}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Courses" className={getNavLinkClass('/Courses')}>
                  Cursos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Comunity" className={getNavLinkClass('/Comunity')}>
                  Comunidade
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Prizes" className={getNavLinkClass('/Prizes')}>
                  Prêmios
                </Link>
              </li>
            </ul>
            <div className="ms-auto">
              {user ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="navbar-text text-white">{user.name}</span>
                  <Link to="/profile">
                    <img
                      src={imageUrl || "/images/Default.png"}
                      alt="Perfil"
                      style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', objectFit: 'cover' }}
                    />
                  </Link>
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link to="/Login" className="btn btn-outline-light">
                  Cadastre-se
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Outlet />

      <footer className="py-3">
        <div className="container">
          <small>© 2025 Reusa. Todos os direitos reservados.</small>
        </div>
      </footer>
    </>
  );
}