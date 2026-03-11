import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    ingredients: [''],
    instructions: '',
    prep_time_minutes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const updateIngredient = (i, val) => { const next = [...form.ingredients]; next[i] = val; setField('ingredients', next); };
  const addIngredient = () => setField('ingredients', [...form.ingredients, '']);
  const removeIngredient = (i) => { if (form.ingredients.length === 1) return; setField('ingredients', form.ingredients.filter((_, idx) => idx !== i)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = form.ingredients.map((s) => s.trim()).filter(Boolean);
    if (trimmed.length === 0) { setError('Add at least one ingredient.'); return; }
    setLoading(true);
    try {
      await api.createRecipe({ title: form.title.trim(), ingredients: trimmed, instructions: form.instructions.trim(), prep_time_minutes: Number(form.prep_time_minutes) });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='create-recipe container'>
      <Link to='/' className='back-link'>← Back to recipes</Link>
      <div className='create-recipe-card'>
        <div className='create-recipe-header'>
          <h2>🍽 New Recipe</h2>
          <p>Share your culinary creation with your collection</p>
        </div>
        <div className='create-recipe-body'>
          {error && <div className='form-error'>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label>Recipe Title</label>
              <input type='text' placeholder='e.g. Classic Spaghetti Carbonara' value={form.title} onChange={(e) => setField('title', e.target.value)} required maxLength={200} autoFocus />
            </div>
            <div className='form-group'>
              <label>Prep Time (minutes)</label>
              <input type='number' placeholder='e.g. 30' value={form.prep_time_minutes} onChange={(e) => setField('prep_time_minutes', e.target.value)} required min={1} />
            </div>
            <div className='form-group'>
              <label>Ingredients</label>
              <div className='ingredients-editor'>
                {form.ingredients.map((ing, i) => (
                  <div className='ingredient-row' key={i}>
                    <input type='text' placeholder={'Ingredient ' + (i + 1)} value={ing} onChange={(e) => updateIngredient(i, e.target.value)} />
                    <button type='button' className='ingredient-remove' onClick={() => removeIngredient(i)} title='Remove' disabled={form.ingredients.length === 1} style={form.ingredients.length === 1 ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>x</button>
                  </div>
                ))}
                <button type='button' className='add-ingredient-btn' onClick={addIngredient}>+ Add ingredient</button>
              </div>
            </div>
            <div className='form-group'>
              <label>Instructions</label>
              <textarea placeholder='Describe the steps to prepare this recipe...' value={form.instructions} onChange={(e) => setField('instructions', e.target.value)} required minLength={10} rows={6} />
            </div>
            <div className='form-actions'>
              <Link to='/'><button type='button' className='btn-secondary'>Cancel</button></Link>
              <button type='submit' className='btn-primary' disabled={loading}>{loading ? 'Saving...' : '✓ Save Recipe'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
