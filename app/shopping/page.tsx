'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MEALS, type ShoppingCategory } from '@/lib/data';

const CATEGORY_EMOJI: Record<ShoppingCategory, string> = {
  'Produce':              '🥦',
  'Protein':              '🥩',
  'Grains & Bread':       '🍞',
  'Dairy & Eggs':         '🥚',
  'Canned & Pantry':      '🥫',
  'Spices & Condiments':  '🧂',
  'Frozen':               '🧊',
  'Oils & Fats':          '🫙',
};

const CATEGORY_ORDER: ShoppingCategory[] = [
  'Produce', 'Protein', 'Dairy & Eggs', 'Grains & Bread',
  'Frozen', 'Canned & Pantry', 'Oils & Fats', 'Spices & Condiments',
];

interface ShopItem {
  name: string;
  amounts: string[];
  category: ShoppingCategory;
}

function buildList(mealIds: string[]): Record<ShoppingCategory, ShopItem[]> {
  const idSet = new Set(mealIds);
  const meals = MEALS.filter((m) => idSet.has(m.id));

  // Consolidate ingredients by name
  const map = new Map<string, ShopItem>();
  for (const meal of meals) {
    for (const ing of meal.ingredients) {
      const key = ing.name.toLowerCase();
      if (map.has(key)) {
        map.get(key)!.amounts.push(ing.amount);
      } else {
        map.set(key, { name: ing.name, amounts: [ing.amount], category: ing.category });
      }
    }
  }

  // Group by category
  const grouped: Record<ShoppingCategory, ShopItem[]> = {} as never;
  for (const cat of CATEGORY_ORDER) grouped[cat] = [];
  for (const item of map.values()) {
    grouped[item.category].push(item);
  }
  return grouped;
}

function ShoppingContent() {
  const params = useSearchParams();
  const router = useRouter();
  const idsRaw = params.get('ids') || '';
  const mealIds = idsRaw ? idsRaw.split(',').filter(Boolean) : [];

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [grouped, setGrouped] = useState<Record<ShoppingCategory, ShopItem[]> | null>(null);

  useEffect(() => {
    if (mealIds.length) setGrouped(buildList(mealIds));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsRaw]);

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const totalItems = grouped
    ? CATEGORY_ORDER.reduce((s, c) => s + (grouped[c]?.length ?? 0), 0)
    : 0;

  return (
    <main className="page">
      <div className="container--narrow">
        <button className="back-link" onClick={() => router.back()}>← Back to plan</button>

        <div className="page-header">
          <h1>🛒 Shopping List</h1>
          <p>{totalItems} items · tap to check off as you shop</p>
        </div>

        {!grouped || mealIds.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <p style={{ color: 'var(--brown-3)' }}>No meals selected. Go back and check some meals first.</p>
            <button className="btn btn--primary btn--sm" style={{ marginTop: 16, width: 'auto' }} onClick={() => router.back()}>
              ← Go back
            </button>
          </div>
        ) : (
          CATEGORY_ORDER.map((cat) => {
            const items = grouped[cat];
            if (!items || items.length === 0) return null;
            return (
              <div key={cat} className="shop-section">
                <div className="shop-section__title">
                  <span>{CATEGORY_EMOJI[cat]}</span>
                  {cat}
                  <span style={{ fontWeight: 400, color: 'var(--brown-3)', textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>
                    ({items.length})
                  </span>
                </div>
                <div className="card" style={{ padding: '0 20px' }}>
                  {items.map((item) => {
                    const key = item.name.toLowerCase();
                    const done = checked.has(key);
                    // Deduplicate amounts shown
                    const uniqueAmounts = [...new Set(item.amounts)];
                    return (
                      <div
                        key={key}
                        className="shop-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggle(key)}
                      >
                        <input
                          type="checkbox"
                          className="shop-item__check"
                          checked={done}
                          readOnly
                        />
                        <div
                          className="shop-item__name"
                          style={{ textDecoration: done ? 'line-through' : undefined, color: done ? 'var(--brown-3)' : undefined }}
                        >
                          {item.name}
                        </div>
                        <div className="shop-item__amount">
                          {uniqueAmounts.length === 1
                            ? uniqueAmounts[0]
                            : `×${item.amounts.length} uses`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {totalItems > 0 && (
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--brown-3)', marginTop: 24 }}>
            {checked.size} of {totalItems} items checked off
          </p>
        )}
      </div>
    </main>
  );
}

export default function ShoppingPage() {
  return (
    <Suspense fallback={<main className="page"><div className="container"><p style={{ color: 'var(--brown-3)', textAlign: 'center' }}>Loading…</p></div></main>}>
      <ShoppingContent />
    </Suspense>
  );
}
