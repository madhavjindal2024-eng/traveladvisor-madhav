import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';

const STYLES = ['Adventure', 'Relaxation', 'Cultural', 'Food', 'Nature'];
const INTERESTS = ['Hiking', 'Museums', 'Nightlife', 'Local Markets', 'Photography', 'Spa'];

/**
 * Multi-step planner form.
 * @param {object} props
 */
export function PlannerWizard({ step, setStep, form, setForm, onSubmit, loading }) {
  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const toggle = (field, value) => {
    setForm((prev) => {
      const arr = new Set(prev[field] || []);
      if (arr.has(value)) arr.delete(value);
      else arr.add(value);
      return { ...prev, [field]: [...arr] };
    });
  };

  return (
    <div className="glass-card p-6 sm:p-8">
      <div className="mb-6 flex gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full ${step >= n ? 'bg-[var(--accent-primary)]' : 'bg-white/10'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Destination"
            name="destination"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            placeholder="City or region"
            required
          />
          <Input
            label="Start date"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
          <Input
            label="End date"
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Budget min (USD / day)"
            type="number"
            name="budgetMin"
            value={form.budgetMin}
            onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
          />
          <Input
            label="Budget max (USD / day)"
            type="number"
            name="budgetMax"
            value={form.budgetMax}
            onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
          />
          <Input
            label="Travelers"
            type="number"
            min={1}
            name="travelers"
            value={form.travelers}
            onChange={(e) => setForm({ ...form, travelers: e.target.value })}
          />
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle('styles', s)}
              className={`rounded-full border px-4 py-2 text-sm ${
                (form.styles || []).includes(s)
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15'
                  : 'border-[var(--glass-border)] text-[var(--text-secondary)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle('interests', s)}
              className={`rounded-full border px-4 py-2 text-sm ${
                (form.interests || []).includes(s)
                  ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary)]/15'
                  : 'border-[var(--glass-border)] text-[var(--text-secondary)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button type="button" variant="ghost" onClick={back} disabled={step === 1}>
          Back
        </Button>
        {step < 4 ? (
          <Button type="button" onClick={next}>
            Continue
          </Button>
        ) : (
          <Button type="button" onClick={onSubmit} disabled={loading}>
            {loading ? 'Generating' : 'Generate itinerary'}
          </Button>
        )}
      </div>
    </div>
  );
}
