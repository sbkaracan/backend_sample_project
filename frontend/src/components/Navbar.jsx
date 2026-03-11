import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const logout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="icon">🍳</span>
          RecipeHub
        </Link>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">👤 {user.username}</span>
              <Link to="/recipes/new">
                <button className="btn-accent navbar-btn">+ New Recipe</button>
              </Link>
              <button className="btn-secondary navbar-btn" onClick={logout} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-secondary navbar-btn" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>Login</button>
              </Link>
              <Link to="/register">
                <button className="btn-accent navbar-btn">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
