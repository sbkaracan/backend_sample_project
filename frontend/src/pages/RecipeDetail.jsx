import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .getRecipe(id)
      .then(setRecipe)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.deleteRecipe(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (mins) => {
    if (!mins) return '—';
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h} hour${h > 1 ? 's' : ''}`;
  };

  if (loading)
    return (
      <div className="container">
        <div className="spinner-wrap">
          <div className="spinner" />
          <span className="spinner-label">Loading recipe...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="form-error">{error}</div>
        <Link to="/" className="back-link">← Back to recipes</Link>
      </div>
    );

  return (
    <div className="recipe-detail container">
      <Link to="/" className="back-link">← Back to recipes</Link>

      <div className="recipe-detail-card">
        <div className="recipe-detail-hero">
          <div className="recipe-detail-header">
            <h1>{recipe.title}</h1>
            <button
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleting}
              style={{ flexShrink: 0, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}
            >
              {deleting ? 'Deleting...' : '🗑 Delete'}
            </button>
          </div>

          <div className="recipe-meta-row">
            <span className="recipe-badge">⏱ {formatTime(recipe.prep_time_minutes)}</span>
            <span className="recipe-badge">🥘 {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}</span>
            {recipe.rating && (
              <span className="recipe-badge accent">⭐ {recipe.rating.toFixed(1)}</span>
            )}
            {recipe.created_at && (
              <span className="recipe-badge">📅 {formatDate(recipe.created_at)}</span>
            )}
          </div>
        </div>

        <div className="recipe-detail-body">
          <div className="recipe-section">
            <div className="recipe-section-header">
              <h3>🧂 Ingredients</h3>
            </div>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-section">
            <div className="recipe-section-header">
              <h3>📋 Instructions</h3>
            </div>
            <div className="instructions-text">{recipe.instructions}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
