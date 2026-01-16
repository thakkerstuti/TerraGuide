import React from 'react';
import type { DailyHabits, LocationData } from '../../logic/impactCalculator';

interface LifestylePageProps {
    habits: DailyHabits;
    location: LocationData;
    onChange: (habits: DailyHabits) => void;
    onNext: () => void;
    onBack: () => void;
}

export const LifestylePage: React.FC<LifestylePageProps> = ({ habits, location, onChange, onNext, onBack }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange({
            ...habits,
            [name]: name === 'transportMode' || name === 'foodPreference' ? value : Number(value),
        });
    };

    return (
        <div className="card glass page-container">
            <div className="page-header">
                <div className="header-top">
                    <span className="step-indicator">Step 2 of 4</span>
                    <span className="location-badge">{location.city}, {location.country}</span>
                </div>
                <h2>Daily Lifestyle Choices</h2>
                <p className="subtitle">Tell us about your regular habits. We'll compare them against sustainable targets for <strong>{location.profile}</strong> settings.</p>
            </div>

            <div className="form-grid">
                <div className="input-group">
                    <label>Mode of Transport</label>
                    <select name="transportMode" value={habits.transportMode} onChange={handleChange}>
                        <option value="car">Car / Ride-share</option>
                        <option value="bus">Public Bus</option>
                        <option value="train">Train / Metro</option>
                        <option value="bike">Bicycle</option>
                        <option value="walk">Walking</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Distance Traveled (km/day)</label>
                    <input type="number" name="distanceKm" value={habits.distanceKm} onChange={handleChange} min="0" />
                </div>

                <div className="input-group">
                    <label>Electricity Usage (kWh/day)</label>
                    <input type="number" name="energyUsageKwh" value={habits.energyUsageKwh} onChange={handleChange} min="0" />
                </div>

                <div className="input-group">
                    <label>Shower Time (minutes)</label>
                    <input type="number" name="waterShowerMinutes" value={habits.waterShowerMinutes} onChange={handleChange} min="0" />
                    {location.profile === 'Water Scarce' && <span className="input-warning">⚠️ High priority in your region</span>}
                </div>

                <div className="input-group">
                    <label>Food Preference</label>
                    <select name="foodPreference" value={habits.foodPreference} onChange={handleChange}>
                        <option value="meat">Meat & Dairy Regular</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Plant-based / Vegan</option>
                    </select>
                </div>

                <div className="input-group full-width">
                    <label>Recycling Behavior (% waste recycled)</label>
                    <div className="range-container">
                        <input type="range" name="wasteRecycledPercent" value={habits.wasteRecycledPercent} onChange={handleChange} min="0" max="100" />
                        <span className="range-value">{habits.wasteRecycledPercent}%</span>
                    </div>
                </div>
            </div>

            <div className="page-footer">
                <button className="secondary" onClick={onBack}>← Back</button>
                <button className="primary large" onClick={onNext}>Calculate My Impact →</button>
            </div>

            <style>{`
        .page-container {
          max-width: 800px;
          margin: 0 auto;
          animation: slideIn 0.5s ease-out;
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .location-badge {
          font-size: 0.8rem;
          background: var(--color-sky);
          color: var(--color-ocean);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-weight: 700;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }
        .full-width { grid-column: 1 / -1; }
        .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-warning { font-size: 0.75rem; color: #d97706; font-weight: 600; }
        .range-container { display: flex; align-items: center; gap: 1rem; }
        input[type="range"] { flex: 1; accent-color: var(--color-moss); }
        .range-value { font-weight: 700; color: var(--color-moss); width: 3rem; }
        .page-footer {
          display: flex;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-sand);
        }
        input[type="number"], select {
          padding: 0.8rem;
          border: 2px solid var(--color-sand);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 1rem;
        }
        input:focus { outline: none; border-color: var(--color-leaf); }
        button.secondary { background: none; border: 2px solid var(--color-sand); color: var(--color-stone); }
        button.secondary:hover { border-color: var(--color-stone); }
      `}</style>
        </div>
    );
};
