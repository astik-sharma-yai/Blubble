import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, User, Plus } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h1>Blubble</h1>
        </Link>
        
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/blogs" 
              className={`nav-link ${isActive('/blogs') ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>Blogs</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/create" 
              className={`nav-link ${isActive('/create') ? 'active' : ''}`}
            >
              <Plus size={20} />
              <span>Write</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              <User size={20} />
              <span>About</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}; 