import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.register(form.email, form.username, form.password);
      // Auto-login after registration
      const tokenData = await api.login(form.username, form.password);
      localStorage.setItem('token', tokenData.access_token);
      const userData = await api.getMe();
      onLogin(userData, tokenData.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="icon">🍳</div>
          <h1>RecipeHub</h1>
          <p>Create your account</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              type="text"
              placeholder="your_username"
              value={form.username}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="at least 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
