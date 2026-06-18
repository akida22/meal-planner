'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DietTag } from '@/lib/data';
import type { Gender } from '@/lib/nutrition';

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

interface Child { age: number; gender: Gender; }

function Counter({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="members-row">
      <label style={{ minWidth: 120 }}>{label}</label>
      <div className="counter">
        <button type="button" className="counter__btn" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
        <span className="counter__val">{value}</span>
        <button type="button" className="counter__btn" onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [budget, setBudget] = useState('');
  const [adultWomen, setAdultWomen] = useState(1);
  const [adultMen, setAdultMen] = useState(1);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<DietTag>>(new Set());

  function addChild() { setChildren((p) => [...p, { age: 8, gender: 'female' }]); }
  function removeChild(i: number) { setChildren((p) => p.filter((_, idx) => idx !== i)); }
  function setChildAge(i: number, age: number) { setChildren((p) => p.map((c, idx) => idx === i ? { ...c, age } : c)); }
  function setChildGender(i: number, gender: Gender) { setChildren((p) => p.map((c, idx) => idx === i ? { ...c, gender } : c)); }
  function toggleTag(tag: DietTag) {
    setSelectedTags((prev) => { const n = new Set(prev); n.has(tag) ? n.delete(tag) : n.add(tag); return n; });
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const b = parseFloat(budget);
    if (!b || b <= 0) return;
    const tags     = Array.from(selectedTags).join(',');
    const childStr = children.map((c) => `${c.age}${c.gender[0]}`).join(',');
    const q = new URLSearchParams({ budget: String(b), women: String(adultWomen), men: String(adultMen), children: childStr, tags });
    router.push(`/plan?${q}`);
  }

  const totalMembers = adultWomen + adultMen + children.length;
  const weeklyBudget = parseFloat(budget) > 0 ? parseFloat(budget) / 4 : null;

  return (
    <div className="landing">
      <div className="container">
        <nav className="nav">
          <div className="nav__logo">🥦 MealPlan</div>
          <div className="nav__cta">
            <a className="btn btn--ghost btn--sm" href="/shopping">🛒 Saved list</a>
            {!showForm && <button className="btn btn--primary btn--sm" onClick={() => setShowForm(true)}>Get started →</button>}
          </div>
        </nav>
      </div>

      {!showForm ? (
        <>
          <div className="container">
            <div className="hero">
              <div className="hero__left">
                <div className="hero__tag">Free weekly meal planner</div>
                <h1>A whole week of meals, on the budget you actually have.</h1>
                <p className="hero__sub">
                  For SNAP, tight weeks, and anyone planning honestly.<br /><br />
                  Tell us your monthly grocery budget, who you're feeding (adults and kids by age and gender),
                  and any dietary needs. We'll build the best plan possible — and tell you the truth when
                  the budget falls short of a fully nutritious week.
                </p>
                <div className="hero__actions">
                  <button className="btn btn--primary btn--lg" onClick={() => setShowForm(true)}>Plan my week →</button>
                  <div className="hero__note">
                    <span>Free forever · No account needed</span>
                    <span>Built for SNAP / EBT budgets</span>
                  </div>
                </div>
              </div>
              <div className="hero__visual">
                <div className="hero__img hero__img--tall">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={FOOD_PHOTOS[0]} alt="Healthy meal bowl" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="hero__budget-card">
                    <div className="hero__budget-week">This week</div>
                    <div className="hero__budget-val">$83.40 <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--brown-3)' }}>/ $90</span></div>
                    <div className="hero__budget-bar"><div className="hero__budget-fill" style={{ width: '93%' }} /></div>
                  </div>
                  <div className="hero__img" style={{ flex: 1 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={FOOD_PHOTOS[1]} alt="Salmon dish" />
                  </div>
                </div>
                <div className="hero__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={FOOD_PHOTOS[2]} alt="Smoothie bowl" />
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--cream-dark)' }}>
            <div className="container">
              <div className="steps">
                <div className="steps__grid">
                  <div className="step">
                    <div className="step__num">01</div>
                    <div className="step__title">Set your budget</div>
                    <div className="step__desc">Enter your monthly food budget and who you're feeding — adults by gender, kids by age and gender.</div>
                  </div>
                  <div className="step">
                    <div className="step__num">02</div>
                    <div className="step__title">Get your week</div>
                    <div className="step__desc">Seven days of meals meeting USDA/WHO nutrition targets for every member, within your weekly budget.</div>
                  </div>
                  <div className="step">
                    <div className="step__num">03</div>
                    <div className="step__title">Save your list</div>
                    <div className="step__desc">Select meals, get a shopping list sorted by category, and save or download it to your phone.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="page">
          <div className="container--narrow">
            <button className="back-link" onClick={() => setShowForm(false)}>← Back</button>
            <div className="page-header">
              <h1>Set up your plan</h1>
              <p>Nutrition targets are calculated individually by age and gender using USDA/WHO guidelines.</p>
            </div>
            <div className="card">
              <form className="form" onSubmit={handleSubmit}>

                {/* Budget */}
                <div className="field">
                  <label>Monthly food budget (USD)</label>
                  <input className="input" type="number" min="1" step="1" placeholder="e.g. 400" value={budget} onChange={(e) => setBudget(e.target.value)} required />
                  {weeklyBudget && totalMembers > 0 && (
                    <span className="hint">≈ <strong>${weeklyBudget.toFixed(0)}/week</strong> · ${(weeklyBudget / totalMembers).toFixed(0)}/person/week for {totalMembers} {totalMembers === 1 ? 'person' : 'people'}</span>
                  )}
                </div>

                {/* Household */}
                <div className="field">
                  <label>Who's eating?</label>
                  <Counter label="Women (adults)" value={adultWomen} onChange={setAdultWomen} />
                  <Counter label="Men (adults)"   value={adultMen}   onChange={setAdultMen}   />

                  <div className="members-row" style={{ marginTop: 8 }}>
                    <label style={{ minWidth: 120 }}>Children</label>
                    <div className="counter">
                      <button type="button" className="counter__btn" onClick={() => children.length > 0 && removeChild(children.length - 1)}>−</button>
                      <span className="counter__val">{children.length}</span>
                      <button type="button" className="counter__btn" onClick={addChild}>+</button>
                    </div>
                  </div>

                  {children.length > 0 && (
                    <div className="children-ages" style={{ marginTop: 10 }}>
                      {children.map((child, i) => (
                        <div key={i} className="child-age-tag">
                          Child {i + 1}
                          <select value={child.gender} onChange={(e) => setChildGender(i, e.target.value as Gender)}>
                            <option value="female">♀ Girl</option>
                            <option value="male">♂ Boy</option>
                          </select>
                          age
                          <select value={child.age} onChange={(e) => setChildAge(i, parseInt(e.target.value))}>
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
                  <label>Dietary needs <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--brown-3)' }}>(select all that apply)</span></label>
                  <div className="diet-grid">
                    <button type="button" className={`diet-chip ${selectedTags.size === 0 ? 'diet-chip--active' : ''}`} onClick={() => setSelectedTags(new Set())}>
                      <span style={{ fontSize: 20 }}>🍽️</span>
                      <span className="diet-chip__label">No restrictions</span>
                      <span className="diet-chip__desc">All foods included</span>
                    </button>
                    {DIET_OPTIONS.map((o) => (
                      <button key={o.value} type="button" className={`diet-chip ${selectedTags.has(o.value) ? 'diet-chip--active' : ''}`} onClick={() => toggleTag(o.value)}>
                        <span style={{ fontSize: 20 }}>{o.emoji}</span>
                        <span className="diet-chip__label">{o.label}</span>
                        <span className="diet-chip__desc">{o.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn--primary btn--full" disabled={totalMembers === 0}>
                  Generate my 7-day plan →
                </button>
              </form>
            </div>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--brown-3)', marginTop: 20 }}>
              Nutrition targets: USDA Dietary Reference Intakes 2020 + WHO Global Nutrition Guidelines
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
