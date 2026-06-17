'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DietTag } from '@/lib/data';

const DIET_OPTIONS: { value: DietTag; label: string; emoji: string; desc: string }[] = [
  { value: 'vegetarian',  emoji: '🥦', label: 'Vegetarian',  desc: 'No meat or fish' },
  { value: 'vegan',       emoji: '🌱', label: 'Vegan',        desc: 'No animal products' },
  { value: 'halal',       emoji: '☪️',  label: 'Halal',        desc: 'Halal-certified meats only' },
  { value: 'gluten-free', emoji: '🌾', label: 'Gluten-Free', desc: 'No wheat, barley, or rye' },
  { value: 'dairy-free',  emoji: '🥛', label: 'Dairy-Free',  desc: 'No milk, cheese, or butter' },
];

export default function Home() {
  const router = useRouter();
  const [budget, setBudget] = useState('');
  const [household, setHousehold] = useState('2');
  const [selectedTags, setSelectedTags] = useState<Set<DietTag>>(new Set());

  function toggleTag(tag: DietTag) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const b = parseFloat(budget);
    if (!b || b <= 0) return;
    const tags = Array.from(selectedTags).join(',');
    const q = new URLSearchParams({ budget: String(b), household, tags });
    router.push(`/plan?${q}`);
  }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="header">
          <div className="header__logo">🥦 MealPlan</div>
          <p className="header__sub">A 7-day meal plan that fits your budget</p>
        </div>

        <div className="card">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="budget">Monthly budget (USD)</label>
                <input
                  id="budget"
                  className="input"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 400"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="household">Household size</label>
                <div className="select-wrap">
                  <select
                    id="household"
                    className="select"
                    value={household}
                    onChange={(e) => setHousehold(e.target.value)}
                  >
                    {[1,2,3,4,5,6,7,8].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label>Dietary needs <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--ink-3)' }}>(select all that apply)</span></label>
              <div className="diet-grid">
                {DIET_OPTIONS.map((o) => {
                  const checked = selectedTags.has(o.value);
                  return (
                    <button
                      key={o.value}
                      type="button"
                      className={`diet-chip ${checked ? 'diet-chip--active' : ''}`}
                      onClick={() => toggleTag(o.value)}
                    >
                      <span>{o.emoji}</span>
                      <span className="diet-chip__label">{o.label}</span>
                      <span className="diet-chip__desc">{o.desc}</span>
                    </button>
                  );
                })}
              </div>
              {selectedTags.size === 0 && (
                <span className="hint">No restrictions selected — plan includes all foods (omnivore).</span>
              )}
            </div>

            <button type="submit" className="btn btn--primary">
              Generate my plan →
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)', marginTop: 20 }}>
          Budget guidance based on USDA Thrifty Food Plan (2024)
        </p>
      </div>
    </main>
  );
}
