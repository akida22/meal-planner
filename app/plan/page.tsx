'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { generatePlan, type WeekPlan, type DayPlan } from '@/lib/planner';
import type { DietTag, Meal } from '@/lib/data';

const TAG_LABELS: Record<DietTag, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  halal: 'Halal',
  'gluten-free': 'Gluten-Free',
  'dairy-free': 'Dairy-Free',
};

const MEAL_META: Record<Meal['type'], { emoji: string; label: string }> = {
  breakfast: { emoji: '☀️', label: 'Breakfast' },
  lunch:     { emoji: '🥗', label: 'Lunch' },
  dinner:    { emoji: '🌙', label: 'Dinner' },
};

function fmt(n: number) { return `$${n.toFixed(2)}`; }

function MealRow({ meal, householdSize }: { meal: Meal; householdSize: number }) {
  const cost = meal.costPerServing * householdSize;
  const meta = MEAL_META[meal.type];
  return (
    <div className="meal-row">
      <div className="meal-row__type">
        <div style={{ fontSize: 22, marginBottom: 2 }}>{meta.emoji}</div>
        <div>{meta.label}</div>
      </div>
      <div>
        <div className="meal-row__name">{meal.name}</div>
        <div className="meal-row__ingredients">
          {meal.ingredients.map((i) => i.name).join(' · ')}
        </div>
        <div className="meal-row__nutrition">
          <span className="meal-row__nut-item"><strong>{meal.calories}</strong> cal</span>
          <span className="meal-row__nut-item"><strong>{meal.protein}g</strong> protein</span>
          <span className="meal-row__nut-item"><strong>{meal.carbs}g</strong> carbs</span>
          <span className="meal-row__nut-item"><strong>{meal.fat}g</strong> fat</span>
          <span className="meal-row__nut-item"><strong>{meal.fiber}g</strong> fiber</span>
          <span className="meal-row__nut-item"><strong>{meal.sodium}mg</strong> sodium</span>
        </div>
      </div>
      <div className="meal-row__cost">{fmt(cost)}</div>
    </div>
  );
}

function DayCard({ day, householdSize }: { day: DayPlan; householdSize: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="day-card">
      <div className="day-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="day-card__title">{day.label}</span>
        <div className="day-card__meta">
          <span>{fmt(day.dayCost)}</span>
          <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>
            {day.dayCalories} cal · {day.dayProtein}g protein · {day.dayFiber}g fiber
          </span>
          <span className={`nutrition-check ${day.meetsNutrition ? 'nutrition-check--pass' : 'nutrition-check--fail'}`}>
            {day.meetsNutrition ? '✓ Met' : '✗ Low'}
          </span>
          <span className={`chevron ${open ? 'chevron--open' : ''}`}>▾</span>
        </div>
      </div>
      {open && (
        <div className="day-card__body">
          <MealRow meal={day.breakfast} householdSize={householdSize} />
          <MealRow meal={day.lunch}     householdSize={householdSize} />
          <MealRow meal={day.dinner}    householdSize={householdSize} />
        </div>
      )}
    </div>
  );
}

export default function PlanPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [plan, setPlan] = useState<WeekPlan | null>(null);

  const budget    = parseFloat(params.get('budget') || '0'); // monthly
  const household = parseInt(params.get('household') || '2');
  const tagsRaw   = params.get('tags') || '';
  const selectedTags = tagsRaw
    ? (tagsRaw.split(',').filter(Boolean) as DietTag[])
    : [];

  const buildPlan = useCallback(() => {
    if (!budget || !household) return;
    setPlan(generatePlan(budget, household, selectedTags));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget, household, tagsRaw]);

  useEffect(() => { buildPlan(); }, [buildPlan]);

  if (!plan) {
    return (
      <main className="page">
        <div className="container">
          <p style={{ color: 'var(--ink-3)', textAlign: 'center' }}>Building your plan…</p>
        </div>
      </main>
    );
  }

  const avgCalPerPerson = Math.round(
    plan.days.reduce((s, d) => s + d.dayCalories, 0) / 7
  );
  const daysMetNutrition = plan.days.filter((d) => d.meetsNutrition).length;

  return (
    <main className="page">
      <div className="container">
        <a className="back-link" href="/">← Edit preferences</a>

        {plan.belowUsda && (
          <div className="warning" style={{ marginBottom: 24 }}>
            <span className="warning__icon">⚠️</span>
            <span>
              Your monthly budget of <strong>{fmt(budget)}</strong> ({fmt(plan.weeklyBudget)}/week) is
              below the USDA Thrifty Food Plan minimum of <strong>{fmt(plan.usdaMinimum)}/month</strong> for{' '}
              {household} {household === 1 ? 'person' : 'people'}. We&apos;ve built the most
              nutritious plan possible within your budget.
            </span>
          </div>
        )}

        <div className="plan-header">
          <h1>Your 7-Day Meal Plan</h1>
          <div className="plan-meta">
            {selectedTags.length === 0
              ? <span className="badge badge--gray">🍽️ Omnivore</span>
              : selectedTags.map((t) => (
                  <span key={t} className="badge badge--green">{TAG_LABELS[t]}</span>
                ))
            }
            <span className="badge badge--gray">{household} {household === 1 ? 'person' : 'people'}</span>
            <span className={`badge ${plan.withinBudget ? 'badge--green' : 'badge--red'}`}>
              {plan.withinBudget
                ? `✓ Within ${fmt(plan.weeklyBudget)}/wk`
                : `✗ Over by ${fmt(plan.totalCost - plan.weeklyBudget)}`}
            </span>
          </div>
        </div>

        <div className="summary-bar">
          <div className="summary-bar__item">
            <div className="summary-bar__value">{fmt(plan.totalCost)}</div>
            <div className="summary-bar__label">This week's cost</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
              {fmt(plan.weeklyBudget)} / week budget
            </div>
          </div>
          <div className="summary-bar__item">
            <div className="summary-bar__value">{avgCalPerPerson}</div>
            <div className="summary-bar__label">Avg cal / person / day</div>
          </div>
          <div className="summary-bar__item">
            <div
              className="summary-bar__value"
              style={{ color: daysMetNutrition === 7 ? 'var(--green)' : 'var(--orange)' }}
            >
              {daysMetNutrition}/7
            </div>
            <div className="summary-bar__label">Days meet nutrition</div>
          </div>
        </div>

        <div>
          {plan.days.map((day) => (
            <DayCard key={day.day} day={day} householdSize={household} />
          ))}
        </div>

        <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn--ghost btn--sm" onClick={buildPlan}>
            ↻ Regenerate plan
          </button>
          <button
            className="btn btn--primary btn--sm"
            style={{ width: 'auto' }}
            onClick={() => router.push('/')}
          >
            ← Change preferences
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-3)', marginTop: 24 }}>
          Nutrition targets: 2,000 cal · 50g protein per person per day (USDA dietary guidelines)
        </p>
      </div>
    </main>
  );
}
