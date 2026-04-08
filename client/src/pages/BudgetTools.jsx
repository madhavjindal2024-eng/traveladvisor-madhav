import { useEffect, useMemo, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useCurrency } from '../hooks/useCurrency.js';

const STYLES = {
  Budget: { accommodation: 0.35, food: 0.25, transport: 0.15, activities: 0.15, misc: 0.1 },
  'Mid-range': { accommodation: 0.4, food: 0.25, transport: 0.12, activities: 0.15, misc: 0.08 },
  Luxury: { accommodation: 0.5, food: 0.2, transport: 0.1, activities: 0.12, misc: 0.08 },
};

const COLORS = ['#4f8ef7', '#7c5cbf', '#2dd4bf', '#e6b84f', '#94a3b8'];

/**
 * Currency converter and trip budget planner with expense tracker.
 */
export function BudgetTools() {
  const { convert, loading } = useCurrency();
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState(100);
  const [conv, setConv] = useState(null);
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [style, setStyle] = useState('Mid-range');
  const [daily, setDaily] = useState(200);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    convert(from, to, amount).then(setConv).catch(() => setConv(null));
  }, [from, to, amount, convert]);

  const breakdown = useMemo(() => {
    const total = daily * days * travelers;
    const weights = STYLES[style];
    return Object.entries(weights).map(([k, v]) => ({
      name: k,
      value: Math.round(total * v),
    }));
  }, [daily, days, travelers, style]);

  const budgetTotal = daily * days * travelers;
  const spent = expenses.reduce((s, e) => s + e.amount, 0);

  const addExpense = () => {
    setExpenses((prev) => [...prev, { id: crypto.randomUUID(), label: 'Item', amount: 25 }]);
  };

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)]">
          Currency and budget
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Card>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">Converter</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Input label="From" value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())} />
              <Input label="To" value={to} onChange={(e) => setTo(e.target.value.toUpperCase())} />
              <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            {loading ? (
              <p className="mt-4 text-sm text-[var(--text-muted)]">Converting</p>
            ) : conv ? (
              <p className="mt-4 text-lg text-[var(--text-primary)]">
                {amount} {from} = {conv.converted?.toFixed(2)} {to}
                <span className="ml-2 text-sm text-[var(--text-muted)]">(rate {conv.rate?.toFixed(4)})</span>
              </p>
            ) : null}
          </Card>
          <Card>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">
              Trip budget planner
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="Days" type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} />
              <Input label="Travelers" type="number" value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} />
              <Input label="Daily budget (USD)" type="number" value={daily} onChange={(e) => setDaily(Number(e.target.value))} />
              <label className="text-sm text-[var(--text-secondary)]">
                Style
                <select
                  className="mt-1 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  {Object.keys(STYLES).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown} dataKey="value" nameKey="name" outerRadius={90} label>
                    {breakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,22,40,0.95)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 12,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Total trip budget (estimate): <strong className="text-[var(--text-primary)]">${budgetTotal}</strong>
            </p>
          </Card>
        </div>
        <Card className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">
              Expense tracker
            </h2>
            <Button type="button" variant="ghost" onClick={addExpense}>
              Add row
            </Button>
          </div>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Running total: ${spent} / ${budgetTotal}
          </p>
          <ul className="mt-4 space-y-2">
            {expenses.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-2">
                <input
                  className="flex-1 rounded-lg border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2 text-sm"
                  value={e.label}
                  onChange={(ev) =>
                    setExpenses((prev) => prev.map((x) => (x.id === e.id ? { ...x, label: ev.target.value } : x)))
                  }
                />
                <input
                  type="number"
                  className="w-28 rounded-lg border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2 text-sm"
                  value={e.amount}
                  onChange={(ev) =>
                    setExpenses((prev) =>
                      prev.map((x) => (x.id === e.id ? { ...x, amount: Number(ev.target.value) } : x))
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </Card>
      </main>
      <Footer />
    </PageWrapper>
  );
}
