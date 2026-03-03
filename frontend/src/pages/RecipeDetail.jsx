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

  if (loading)
    return (
      <div className="container">
        <div className="spinner-wrap">
          <div className="spinner" />
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
        <div className="recipe-detail-header">
          <h1>{recipe.title}</h1>
          <button
            className="btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : '🗑 Delete'}
          </button>
        </div>

        <div className="recipe-meta-row">
          <span className="recipe-badge">⏱ {recipe.prep_time_minutes} min prep</span>
          <span className="recipe-badge">🥘 {recipe.ingredients.length} ingredients</span>
          {recipe.rating && (
            <span className="recipe-badge accent">⭐ {recipe.rating.toFixed(1)}</span>
          )}
          <span className="recipe-badge">📅 {formatDate(recipe.created_at)}</span>
        </div>

        <hr className="divider" />

        <div className="recipe-section">
          <h3>Ingredients</h3>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>

        <div className="recipe-section">
          <h3>Instructions</h3>
          <div className="instructions-text">{recipe.instructions}</div>
        </div>
      </div>
    </div>
  );
}
