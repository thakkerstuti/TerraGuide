import { useState, useMemo, useEffect } from 'react';
import { calculateImpact } from './logic/impactCalculator';
import type { LocationData, DailyHabits } from './logic/impactCalculator';
import { getTemperature } from './logic/weatherService';
import type { WeatherData } from './logic/weatherService';
import { LocationPage } from './components/pages/LocationPage';
import { LifestylePage } from './components/pages/LifestylePage';
import { ResultsPage } from './components/pages/ResultsPage';
import { SolutionsPage } from './components/pages/SolutionsPage';

type Step = 1 | 2 | 3 | 4;

function App() {
  const [step, setStep] = useState<Step>(1);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData>({
    country: '',
    city: '',
    profile: 'Urban',
  });
  const [habits, setHabits] = useState<DailyHabits>({
    transportMode: 'car',
    distanceKm: 20,
    energyUsageKwh: 12,
    waterShowerMinutes: 10,
    foodPreference: 'meat',
    wasteRecycledPercent: 20,
  });

  useEffect(() => {
    if (step === 2 && location.city) {
      getTemperature(location.city).then(setWeather);
    }
  }, [step, location.city, location.country]);

  const scores = useMemo(() => calculateImpact(habits, location), [habits, location]);

  const nextStep = () => setStep((prev) => (prev + 1) as Step);
  const prevStep = () => setStep((prev) => (prev - 1) as Step);
  const restart = () => setStep(1);

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="brand" onClick={restart} style={{ cursor: 'pointer' }}>
          <span className="logo">🌿</span>
          <h1>TerraGuide</h1>
        </div>
        <div className="progress-stepper">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`step-dot ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}
            />
          ))}
          <div className="step-line" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        </div>
      </header>

      <main className="main-content">
        {step === 1 && (
          <LocationPage
            location={location}
            onChange={setLocation}
            onNext={nextStep}
          />
        )}
        {step === 2 && (
          <LifestylePage
            habits={habits}
            location={location}
            onChange={setHabits}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 3 && (
          <ResultsPage
            scores={scores}
            location={location}
            weather={weather}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 4 && (
          <SolutionsPage
            scores={scores}
            location={location}
            onRestart={restart}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 TerraGuide • Empowering Local Climate Action</p>
      </footer>

      <style>{`
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 2rem;
        }
        .brand { display: flex; align-items: center; gap: 0.8rem; }
        .logo { font-size: 2rem; }
        .brand h1 { font-size: 1.8rem; color: var(--color-forest); margin: 0; }

        .progress-stepper {
          display: flex;
          gap: 2.5rem;
          position: relative;
          align-items: center;
        }
        .step-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--color-sand);
          z-index: 2;
          transition: var(--transition);
        }
        .step-dot.active { background: var(--color-moss); }
        .step-dot.current { 
          transform: scale(1.5); 
          box-shadow: 0 0 0 6px rgba(145, 203, 171, 0.2);
        }
        .step-line {
          position: absolute;
          height: 3px;
          background: var(--color-moss);
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 1;
          transition: width 0.5s ease-in-out;
        }

        .main-content { flex: 1; }

        .app-footer {
          margin-top: auto;
          text-align: center;
          padding: 2rem 0;
          font-size: 0.85rem;
          color: var(--color-stone);
          opacity: 0.6;
        }

        @media (max-width: 768px) {
          .app-container { padding: 1rem; }
          .main-header { flex-direction: column; gap: 1.5rem; }
          .progress-stepper { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}

export default App;
