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

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h2>My Recipes</h2>
            <p>{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} in your collection</p>
          </div>
          <Link to="/recipes/new">
            <button className="btn-accent">+ Add Recipe</button>
          </Link>
        </div>

        {error && <div className="form-error">{error}</div>}

        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
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
              recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
