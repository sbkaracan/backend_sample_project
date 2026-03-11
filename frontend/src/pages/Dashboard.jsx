import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import RecipeCard from '../components/RecipeCard';

export default function Dashboard({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getRecipes()
      .then(setRecipes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalTime = recipes.reduce((s, r) => s + (r.prep_time_minutes || 0), 0);

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div className="container">
          <div className="dashboard-hero-inner">
            <div>
              <h2>
                {user ? `Welcome back, ${user.username}` : 'My Recipes'} 👋
              </h2>
              <p>Your personal recipe collection</p>
            </div>
            <div className="dashboard-stats">
              <div className="stat-chip">
                <div className="num">{recipes.length}</div>
                <div className="lbl">Recipes</div>
              </div>
              <div className="stat-chip">
                <div className="num">{totalTime > 0 ? `${Math.round(totalTime / Math.max(recipes.length, 1))}m` : '—'}</div>
                <div className="lbl">Avg. Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="container">
          {error && <div className="form-error">{error}</div>}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--gray-400)' }}>
              {loading ? 'Loading...' : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`}
            </p>
            <Link to="/recipes/new">
              <button className="btn-accent">+ Add Recipe</button>
            </Link>
          </div>

          {loading ? (
            <div className="spinner-wrap">
              <div className="spinner" />
              <span className="spinner-label">Loading your recipes...</span>
            </div>
          ) : (
            <div className="recipe-grid">
              {recipes.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">🥗</div>
                  <h3>No recipes yet</h3>
                  <p>Start building your personal recipe collection.</p>
                  <Link to="/recipes/new">
                    <button className="btn-accent">Add your first recipe</button>
                  </Link>
                </div>
              ) : (
                recipes.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
