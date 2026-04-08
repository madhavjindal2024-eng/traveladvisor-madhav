import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { PlannerWizard } from '../components/planner/PlannerWizard.jsx';
import { ItineraryTimeline } from '../components/planner/ItineraryTimeline.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { usePlanner } from '../hooks/usePlanner.js';
import { useAuth } from '../hooks/useAuth.js';
import { generatePackingList } from '../services/openai.js';

/**
 * AI trip planner with export and save.
 */
export function Planner() {
  const { user } = useAuth();
  const { generate, saveItinerary, loading } = usePlanner();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budgetMin: 50,
    budgetMax: 200,
    travelers: 2,
    styles: [],
    interests: [],
  });
  const [result, setResult] = useState(null);
  const [packing, setPacking] = useState([]);

  const onSubmit = async () => {
    const payload = {
      destination: form.destination,
      startDate: form.startDate,
      endDate: form.endDate,
      budgetMin: Number(form.budgetMin),
      budgetMax: Number(form.budgetMax),
      travelers: Number(form.travelers),
      styles: form.styles,
      interests: form.interests,
    };
    const data = await generate(payload);
    setResult(data);
    try {
      const p = await generatePackingList({
        destination: form.destination,
        durationDays: data.days?.length || 3,
        season: 'mild',
      });
      setPacking(p.items || []);
    } catch {
      setPacking(data.packingList || []);
    }
  };

  const exportPdf = () => {
    if (!result?.days) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(result.title || 'Itinerary', 14, 20);
    let y = 30;
    result.days.forEach((day) => {
      doc.setFontSize(12);
      doc.text(`Day ${day.dayNumber}`, 14, y);
      y += 8;
      (day.slots || []).forEach((s) => {
        doc.setFontSize(10);
        doc.text(`${s.period}: ${s.activity} — ${s.location}`, 18, y);
        y += 6;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      y += 6;
    });
    doc.save('itinerary.pdf');
  };

  const save = async () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    if (!result?.days) return;
    await saveItinerary({
      title: result.title,
      destinationName: result.destinationName || form.destination,
      startDate: form.startDate,
      endDate: form.endDate,
      days: result.days,
      packingList: packing,
    });
    alert('Saved to your profile.');
  };

  const regenerate = async () => {
    setResult(null);
    await onSubmit();
  };

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)]">AI Trip Planner</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Structured itinerary generation with export and profile save. Demo mode works without OpenAI keys.
        </p>
        <div className="mt-10">
          <PlannerWizard
            step={step}
            setStep={setStep}
            form={form}
            setForm={setForm}
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>
        {result && (
          <div className="mt-10 space-y-6 page-enter">
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={exportPdf}>
                Export PDF
              </Button>
              <Button type="button" variant="ghost" onClick={save}>
                Save to profile
              </Button>
              <Button type="button" variant="outline" onClick={regenerate} disabled={loading}>
                Regenerate
              </Button>
            </div>
            {result.mock && (
              <p className="text-sm text-[var(--text-muted)]">Showing demo itinerary (no OpenAI key on server).</p>
            )}
            <ItineraryTimeline days={result.days} />
            {packing.length > 0 && (
              <Card>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
                  AI packing list
                </h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
                  {packing.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </main>
      <Footer />
    </PageWrapper>
  );
}
