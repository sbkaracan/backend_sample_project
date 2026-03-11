import { useNavigate } from 'react-router-dom';

const CARD_COLORS = [
  'linear-gradient(90deg, #22C55E 0%, #4ADE80 100%)',
  'linear-gradient(90deg, #16A34A 0%, #22C55E 100%)',
  'linear-gradient(90deg, #15803D 0%, #4ADE80 100%)',
  'linear-gradient(90deg, #166534 0%, #22C55E 100%)',
  'linear-gradient(90deg, #F59E0B 0%, #4ADE80 100%)',
];

export default function RecipeCard({ recipe, index = 0 }) {
  const navigate = useNavigate();
  const bandGradient = CARD_COLORS[index % CARD_COLORS.length];

  const formatTime = (mins) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div
      className="recipe-card"
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      style={{ animationDelay: `${(index % 6) * 0.06}s` }}
    >
      <div className="recipe-card-band" style={{ background: bandGradient }} />
      <div className="recipe-card-body">
        <div className="recipe-card-title">{recipe.title}</div>
        <div className="recipe-card-meta">
          <span className="recipe-badge time">
            ⏱ {formatTime(recipe.prep_time_minutes)}
          </span>
          <span className="recipe-badge">
            🥘 {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
          </span>
          {recipe.rating && (
            <span className="recipe-badge accent">
              ⭐ {recipe.rating.toFixed(1)}
            </span>
          )}
        </div>
        {recipe.instructions && (
          <p className="recipe-card-preview">{recipe.instructions}</p>
        )}
      </div>
      <div className="recipe-card-footer">
        <span>View recipe</span>
        <span style={{ fontSize: '1rem' }}>→</span>
      </div>
    </div>
  );
}
