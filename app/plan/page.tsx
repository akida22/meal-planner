'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { generatePlan, type WeekPlan, type DayPlan } from '@/lib/planner';
import type { DietTag, Meal } from '@/lib/data';

const TAG_LABELS: Record<DietTag, string> = {
  vegetarian: 'Vegetarian', vegan: 'Vegan', halal: 'Halal',
  'gluten-free': 'Gluten-Free', 'dairy-free': 'Dairy-Free',
};

const MEAL_META: Record<Meal['type'], { emoji: string; label: string }> = {
  breakfast: { emoji: '☀️', label: 'Breakfast' },
  lunch:     { emoji: '🥗', label: 'Lunch' },
  dinner:    { emoji: '🌙', label: 'Dinner' },
};

function fmt(n: number) { return `$${n.toFixed(2)}`; }

function MealRow({
  meal, members, selected, onToggle,
}: {
  meal: Meal; members: number; selected: boolean; onToggle: () => void;
}) {
  const meta = MEAL_META[meal.type];
  const cost = meal.costPerServing * members;
  return (
    <div className="meal-row" style={{ background: selected ? 'var(--rust-light)' : undefined }}>
      <div className="meal-row__type">
        <div className="meal-row__emoji">{meta.emoji}</div>
        <div className="meal-row__type-label">{meta.label}</div>
      </div>
      <div className="meal-row__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={meal.photo} alt={meal.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>
      <div>
        <div className="meal-row__name">{meal.name}</div>
        <div className="meal-row__ingredients">
          {meal.ingredients.map((i) => i.name).join(' · ')}
        </div>
        <div className="meal-row__nutrition">
          <span className="meal-row__nut"><strong>{Math.round(meal.calories * members)}</strong> cal</span>
          <span className="meal-row__nut"><strong>{Math.round(meal.protein * members)}g</strong> protein</span>
          <span className="meal-row__nut"><strong>{Math.round(meal.carbs * members)}g</strong> carbs</span>
          <span className="meal-row__nut"><strong>{Math.round(meal.fat * members)}g</strong> fat</span>
          <span className="meal-row__nut"><strong>{Math.round(meal.fiber * members)}g</strong> fiber</span>
          <span className="meal-row__nut"><strong>{Math.round(meal.sodium * members)}mg</strong> sodium</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <div className="meal-row__cost">{fmt(cost)}</div>
        <input
          type="checkbox"
          className="meal-checkbox"
          checked={selected}
          onChange={onToggle}
          title="Add to shopping list"
        />
      </div>
    </div>
  );
}

function DayCard({
  day, members, selected, onToggle,
}: {
  day: DayPlan;
  members: number;
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="day-card">
      <div className="day-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="day-card__title">{day.label}</span>
        <div className="day-card__meta">
          <span>{fmt(day.dayCost)}</span>
          <span style={{ fontSize: 12 }}>
            {Math.round(day.dayCalories)} cal · {Math.round(day.dayProtein)}g protein · {Math.round(day.dayFiber)}g fiber
          </span>
          <span className={`nutrition-check ${day.meetsNutrition ? 'nutrition-check--pass' : 'nutrition-check--fail'}`}>
            {day.meetsNutrition ? '✓ Met' : '✗ Low'}
          </span>
          <span className={`chevron ${open ? 'chevron--open' : ''}`}>▾</span>
        </div>
      </div>
      {open && (
        <div>
          {([day.breakfast, day.lunch, day.dinner] as Meal[]).map((meal) => (
            <MealRow
              key={meal.id}
              meal={meal}
              members={members}
              selected={selected.has(meal.id)}
              onToggle={() => onToggle(meal.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PlanContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [plan, setPlan]             = useState<WeekPlan | null>(null);
  const [selected, setSelected]     = useState<Set<string>>(new Set());

  const budget     = parseFloat(params.get('budget')   || '0');
  const adults     = parseInt(params.get('adults')     || '2');
  const childStr   = params.get('children') || '';
  const childAges  = childStr ? childStr.split(',').filter(Boolean).map(Number) : [];
  const tagsRaw    = params.get('tags') || '';
  const selectedTags = tagsRaw ? (tagsRaw.split(',').filter(Boolean) as DietTag[]) : [];
  const members    = adults + childAges.length;

  const build = useCallback(() => {
    if (!budget) return;
    setPlan(generatePlan(budget, adults, childAges, selectedTags));
    setSelected(new Set());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget, adults, childStr, tagsRaw]);

  useEffect(() => { build(); }, [build]);

  function toggleMeal(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (!plan) return;
    const all = new Set<string>();
    plan.days.forEach((d) => { all.add(d.breakfast.id); all.add(d.lunch.id); all.add(d.dinner.id); });
    setSelected(all);
  }

  function goShopping() {
    if (!plan || selected.size === 0) return;
    const ids = Array.from(selected).join(',');
    router.push(`/shopping?ids=${ids}`);
  }

  if (!plan) {
    return (
      <main className="page">
        <div className="container"><p style={{ color: 'var(--brown-3)', textAlign: 'center' }}>Building your plan…</p></div>
      </main>
    );
  }

  const daysMetNutrition = plan.days.filter((d) => d.meetsNutrition).length;
  const avgCalPerPerson  = Math.round(plan.days.reduce((s, d) => s + d.dayCalories, 0) / 7 / members);

  return (
    <main className="page">
      <div className="container">
        <a className="back-link" href="/">← Edit preferences</a>

        {plan.belowUsda && (
          <div className="warning">
            ⚠️ Your monthly budget of <strong>{fmt(budget)}</strong> ({fmt(plan.weeklyBudget)}/week) is below
            the USDA Thrifty Food Plan minimum of <strong>{fmt(plan.usdaMinimum)}/month</strong> for {members}{' '}
            {members === 1 ? 'person' : 'people'}. We've built the most nutritious plan possible within your budget.
          </div>
        )}

        <div className="plan-header">
          <div>
            <h1>Your 7-Day Meal Plan</h1>
            <div style={{ fontSize: 13, color: 'var(--brown-3)', marginTop: 4 }}>
              {adults} adult{adults !== 1 ? 's' : ''}
              {childAges.length > 0 && ` · ${childAges.length} child${childAges.length !== 1 ? 'ren' : ''} (ages ${childAges.join(', ')})`}
            </div>
          </div>
          <div className="plan-meta">
            {selectedTags.length === 0
              ? <span className="badge badge--gray">🍽️ Omnivore</span>
              : selectedTags.map((t) => <span key={t} className="badge badge--rust">{TAG_LABELS[t]}</span>)
            }
            <span className={`badge ${plan.withinBudget ? 'badge--green' : 'badge--red'}`}>
              {plan.withinBudget ? `✓ Within ${fmt(plan.weeklyBudget)}/wk` : `✗ Over by ${fmt(plan.totalCost - plan.weeklyBudget)}`}
            </span>
          </div>
        </div>

        <div className="summary-bar">
          <div className="summary-bar__item">
            <div className="summary-bar__value">{fmt(plan.totalCost)}</div>
            <div className="summary-bar__label">Week total</div>
            <div className="summary-bar__sub">{fmt(plan.weeklyBudget)} budget</div>
          </div>
          <div className="summary-bar__item">
            <div className="summary-bar__value">{avgCalPerPerson}</div>
            <div className="summary-bar__label">Cal / person / day</div>
            <div className="summary-bar__sub">Target: {Math.round(plan.needs.calories / members)}</div>
          </div>
          <div className="summary-bar__item">
            <div className="summary-bar__value" style={{ color: daysMetNutrition === 7 ? 'var(--green)' : 'var(--yellow)' }}>
              {daysMetNutrition}/7
            </div>
            <div className="summary-bar__label">Days meet nutrition</div>
          </div>
          <div className="summary-bar__item">
            <div className="summary-bar__value">{selected.size}</div>
            <div className="summary-bar__label">Meals selected</div>
            <div className="summary-bar__sub" style={{ cursor: 'pointer', color: 'var(--rust)' }} onClick={selectAll}>Select all</div>
          </div>
        </div>

        <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--brown-3)' }}>
          ☑ Check meals to add them to your shopping list. Click a day to expand.
        </div>

        {plan.days.map((day) => (
          <DayCard key={day.day} day={day} members={members} selected={selected} onToggle={toggleMeal} />
        ))}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
          <button className="btn btn--ghost btn--sm" onClick={build}>↻ Regenerate</button>
          <button className="btn btn--ghost btn--sm" onClick={() => router.push('/')}>← Change preferences</button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--brown-3)', marginTop: 20 }}>
          Nutrition targets based on USDA Dietary Reference Intakes by age group
        </p>
      </div>

      {/* Sticky shopping CTA */}
      {selected.size > 0 && (
        <div className="shopping-cta">
          <button className="btn btn--primary" onClick={goShopping}>
            🛒 Build shopping list ({selected.size} meal{selected.size !== 1 ? 's' : ''}) →
          </button>
        </div>
      )}
    </main>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<main className="page"><div className="container"><p style={{ color: 'var(--brown-3)', textAlign: 'center' }}>Loading…</p></div></main>}>
      <PlanContent />
    </Suspense>
  );
}
