import { useNavigate } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  return (
    <div className="recipe-card" onClick={() => navigate(`/recipes/${recipe.id}`)}>
      <div className="recipe-card-title">{recipe.title}</div>

      <div className="recipe-card-meta">
        <span className="recipe-badge">
          ⏱ {recipe.prep_time_minutes} min
        </span>
        <span className="recipe-badge">
          🥘 {recipe.ingredients.length} ingredients
        </span>
        {recipe.rating && (
          <span className="recipe-badge accent">
            ⭐ {recipe.rating.toFixed(1)}
          </span>
        )}
      </div>

      <p className="recipe-card-preview">{recipe.instructions}</p>
    </div>
  );
}
