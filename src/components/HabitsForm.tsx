import React from 'react';
import type { DailyHabits } from '../logic/impactCalculator';

interface HabitsFormProps {
  habits: DailyHabits;
  onChange: (habits: DailyHabits) => void;
}

export const HabitsForm: React.FC<HabitsFormProps> = ({ habits, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...habits,
      [name]: name === 'transportMode' || name === 'foodPreference' ? value : Number(value),
    });
  };

  return (
    <div className="card glass habits-form">
      <h2>Daily Lifestyle Choices</h2>
      <p className="subtitle">Enter your habits to see your environmental impact.</p>

      <div className="form-grid">
        <div className="input-group">
          <label>Mode of Transport</label>
          <div className="select-wrapper">
            <select name="transportMode" value={habits.transportMode} onChange={handleChange}>
              <option value="car">Car / Ride-share</option>
              <option value="bus">Public Bus</option>
              <option value="train">Train / Metro</option>
              <option value="bike">Bicycle</option>
              <option value="walk">Walking</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Distance Traveled (km)</label>
          <input
            type="number"
            name="distanceKm"
            value={habits.distanceKm}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="input-group">
          <label>Electricity Usage (kWh/day)</label>
          <input
            type="number"
            name="energyUsageKwh"
            value={habits.energyUsageKwh}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="input-group">
          <label>Shower Time (minutes)</label>
          <input
            type="number"
            name="waterShowerMinutes"
            value={habits.waterShowerMinutes}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="input-group">
          <label>Food Preference</label>
          <div className="select-wrapper">
            <select name="foodPreference" value={habits.foodPreference} onChange={handleChange}>
              <option value="meat">Meat & Dairy Regular</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Plant-based / Vegan</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Recycling Behavior (% waste recycled)</label>
          <input
            type="range"
            name="wasteRecycledPercent"
            value={habits.wasteRecycledPercent}
            onChange={handleChange}
            min="0"
            max="100"
          />
          <span className="value-display">{habits.wasteRecycledPercent}%</span>
        </div>
      </div>

      <style>{`
        .habits-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .subtitle {
          color: var(--color-moss);
          font-size: 0.95rem;
          margin-top: -1rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-stone);
        }
        input[type="number"], select {
          padding: 0.8rem;
          border-radius: var(--radius-md);
          border: 2px solid var(--color-sand);
          background: white;
          font-family: inherit;
          font-size: 1rem;
          transition: var(--transition);
        }
        input:focus, select:focus {
          outline: none;
          border-color: var(--color-leaf);
          box-shadow: 0 0 0 4px rgba(145, 203, 171, 0.2);
        }
        .select-wrapper {
          position: relative;
        }
        input[type="range"] {
          width: 100%;
          accent-color: var(--color-moss);
        }
        .value-display {
          font-size: 0.85rem;
          color: var(--color-moss);
          font-weight: 700;
          text-align: right;
        }
      `}</style>
    </div>
  );
};
