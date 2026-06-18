'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DietTag } from '@/lib/data';

const DIET_OPTIONS: { value: DietTag; emoji: string; label: string; desc: string }[] = [
  { value: 'vegetarian',  emoji: '🥦', label: 'Vegetarian',  desc: 'No meat or fish' },
  { value: 'vegan',       emoji: '🌱', label: 'Vegan',        desc: 'No animal products' },
  { value: 'halal',       emoji: '☪️',  label: 'Halal',        desc: 'Halal-certified meats' },
  { value: 'gluten-free', emoji: '🌾', label: 'Gluten-Free', desc: 'No wheat, barley, rye' },
  { value: 'dairy-free',  emoji: '🥛', label: 'Dairy-Free',  desc: 'No milk or cheese' },
];

const FOOD_PHOTOS = [
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&h=600&q=75',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&h=400&q=75',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&h=400&q=75',
];

export default function Home() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [budget, setBudget] = useState('');
  const [adults, setAdults] = useState(2);
  const [childAges, setChildAges] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<DietTag>>(new Set());

  function addChild() {
    setChildAges((prev) => [...prev, 8]);
  }
  function removeChild(i: number) {
    setChildAges((prev) => prev.filter((_, idx) => idx !== i));
  }
  function setChildAge(i: number, age: number) {
    setChildAges((prev) => prev.map((a, idx) => (idx === i ? age : a)));
  }
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
    const children = childAges.join(',');
    const q = new URLSearchParams({
      budget: String(b),
      adults: String(adults),
      children,
      tags,
    });
    router.push(`/plan?${q}`);
  }

  const totalMembers = adults + childAges.length;
  const weeklyBudget = parseFloat(budget) > 0 ? parseFloat(budget) / 4 : null;

  return (
    <div className="landing">
      {/* ── Nav ── */}
      <div className="container">
        <nav className="nav">
          <div className="nav__logo">🥦 MealPlan</div>
          {!showForm && (
            <button className="btn btn--primary btn--sm" onClick={() => setShowForm(true)}>
              Get started →
            </button>
          )}
        </nav>
      </div>

      {!showForm ? (
        <>
          {/* ── Hero ── */}
          <div className="container">
            <div className="hero">
              <div className="hero__left">
                <div className="hero__tag">Free weekly meal planner</div>
                <h1>A whole week of meals, on the budget you actually have.</h1>
                <p className="hero__sub">
                  For SNAP, tight weeks, and anyone planning honestly.<br /><br />
                  Tell us your monthly grocery budget, who you're feeding, and one dietary need.
                  We'll build the best plan possible — and tell you the truth when the budget
                  falls short of a fully nutritious week.
                </p>
                <div className="hero__actions">
                  <button className="btn btn--primary btn--lg" onClick={() => setShowForm(true)}>
                    Plan my week →
                  </button>
                  <div className="hero__note">
                    <span>Free forever · No account needed</span>
                    <span>Built for SNAP / EBT budgets</span>
                  </div>
                </div>
              </div>

              <div className="hero__visual">
                <div className="hero__img hero__img--tall">
                  <img src={FOOD_PHOTOS[0]} alt="Healthy meal bowl" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="hero__budget-card">
                    <div className="hero__budget-week">This week</div>
                    <div className="hero__budget-val">$83.40 <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--brown-3)' }}>/ $90</span></div>
                    <div className="hero__budget-bar">
                      <div className="hero__budget-fill" style={{ width: '93%' }} />
                    </div>
                  </div>
                  <div className="hero__img" style={{ flex: 1 }}>
                    <img src={FOOD_PHOTOS[1]} alt="Salmon dish" />
                  </div>
                </div>
                <div className="hero__img">
                  <img src={FOOD_PHOTOS[2]} alt="Smoothie bowl" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Steps ── */}
          <div style={{ background: 'var(--cream-dark)' }}>
            <div className="container">
              <div className="steps">
                <div className="steps__grid">
                  <div className="step">
                    <div className="step__num">01</div>
                    <div className="step__title">Set your budget</div>
                    <div className="step__desc">Enter your monthly food budget and who you're feeding — adults and kids by age.</div>
                  </div>
                  <div className="step">
                    <div className="step__num">02</div>
                    <div className="step__title">Get your week</div>
                    <div className="step__desc">Seven days of meals sized to your household, within your weekly budget, and meeting nutritional guidelines for every member.</div>
                  </div>
                  <div className="step">
                    <div className="step__num">03</div>
                    <div className="step__title">Shop once</div>
                    <div className="step__desc">Select the meals you want, and get a consolidated shopping list sorted by category — produce, protein, grains, and more.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ── Form ── */
        <div className="page">
          <div className="container--narrow">
            <button className="back-link" onClick={() => setShowForm(false)}>← Back</button>

            <div className="page-header">
              <h1>Set up your plan</h1>
              <p>We'll build a 7-day plan around your real budget and household.</p>
            </div>

            <div className="card">
              <form className="form" onSubmit={handleSubmit}>

                {/* Budget */}
                <div className="field">
                  <label>Monthly food budget (USD)</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 400"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                  {weeklyBudget && (
                    <span className="hint">
                      ≈ <strong>${weeklyBudget.toFixed(0)}/week</strong> for {totalMembers} {totalMembers === 1 ? 'person' : 'people'} · ${(weeklyBudget / totalMembers).toFixed(0)}/person/week
                    </span>
                  )}
                </div>

                {/* Household */}
                <div className="field">
                  <label>Who's eating?</label>

                  <div className="members-row">
                    <label>Adults</label>
                    <div className="counter">
                      <button type="button" className="counter__btn" onClick={() => setAdults(Math.max(1, adults - 1))}>−</button>
                      <span className="counter__val">{adults}</span>
                      <button type="button" className="counter__btn" onClick={() => setAdults(adults + 1)}>+</button>
                    </div>
                  </div>

                  <div className="members-row" style={{ marginTop: 10 }}>
                    <label>Children</label>
                    <div className="counter">
                      <button type="button" className="counter__btn" onClick={() => childAges.length > 0 && removeChild(childAges.length - 1)}>−</button>
                      <span className="counter__val">{childAges.length}</span>
                      <button type="button" className="counter__btn" onClick={addChild}>+</button>
                    </div>
                  </div>

                  {childAges.length > 0 && (
                    <div className="children-ages">
                      {childAges.map((age, i) => (
                        <div key={i} className="child-age-tag">
                          Child {i + 1}, age
                          <select
                            value={age}
                            onChange={(e) => setChildAge(i, parseInt(e.target.value))}
                          >
                            {Array.from({ length: 18 }, (_, n) => (
                              <option key={n} value={n}>{n === 0 ? 'under 1' : n}</option>
                            ))}
                          </select>
                          <button type="button" className="child-age-tag__remove" onClick={() => removeChild(i)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Diet */}
                <div className="field">
                  <label>
                    Dietary needs{' '}
                    <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--brown-3)' }}>
                      (select all that apply)
                    </span>
                  </label>
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
                          <span style={{ fontSize: 20 }}>{o.emoji}</span>
                          <span className="diet-chip__label">{o.label}</span>
                          <span className="diet-chip__desc">{o.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedTags.size === 0 && (
                    <span className="hint">No restrictions — includes all foods (omnivore).</span>
                  )}
                </div>

                <button type="submit" className="btn btn--primary btn--full">
                  Generate my 7-day plan →
                </button>
              </form>
            </div>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--brown-3)', marginTop: 20 }}>
              Budget guidance based on USDA Thrifty Food Plan (2024)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
