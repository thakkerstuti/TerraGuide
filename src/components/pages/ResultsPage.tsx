import React from 'react';
import type { ImpactScores, LocationData } from '../../logic/impactCalculator';
import type { WeatherData } from '../../logic/weatherService';
import { getCategoryInfo } from '../../logic/impactCalculator';
import { ImpactCard } from '../ImpactCard';

interface ResultsPageProps {
    scores: ImpactScores;
    location: LocationData;
    weather: WeatherData | null;
    onNext: () => void;
    onBack: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ scores, location, weather, onNext, onBack }) => {
    const cards = [
        { type: 'carbon', value: scores.carbon, unit: 'kg CO2' },
        { type: 'energy', value: scores.energy, unit: 'kWh' },
        { type: 'water', value: scores.water, unit: 'Liters' },
        { type: 'waste', value: scores.waste, unit: 'kg' },
    ] as const;

    return (
        <div className="results-container">
            <header className="results-header">
                <div className="header-main">
                    <span className="step-indicator">Step 3 of 4</span>
                    <h2>Your Climate Impact in {location.city}</h2>
                    <div className="location-context">
                        <p className="location-summary">
                            In <strong>{location.profile}</strong> settings like {location.city}, your primary climate risks are {
                                location.profile === 'Water Scarce' ? 'water shortages and extreme heat' :
                                    location.profile === 'Urban' ? 'air quality and urban heat' :
                                        location.profile === 'Coal Heavy' ? 'smog and grid dependence' :
                                            'ecosystem changes and resource availability'
                            }.
                        </p>
                        {weather && (
                            <div className="weather-widget card glass">
                                <div className="weather-main">
                                    <span className="temp">{weather.temperature}°C</span>
                                    <span className="cond">{weather.condition}</span>
                                </div>
                                <span className="weather-label">Live Local Conditions</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="overall-score-card card glass">
                    <span className="score-label">Climate Action Score</span>
                    <div className="score-display">
                        <span className="score-value">{scores.overallScore}</span>
                        <span className="score-max">/100</span>
                    </div>
                </div>
            </header>

            <div className="impact-grid">
                {cards.map((card) => {
                    const info = getCategoryInfo(card.type, location.profile);
                    return (
                        <ImpactCard
                            key={card.type}
                            type={card.type}
                            value={card.value}
                            unit={card.unit}
                            explanation={info.explanation}
                            consequences={info.consequences}
                        />
                    );
                })}
            </div>

            <div className="page-footer">
                <button className="secondary" onClick={onBack}>← Back to Inputs</button>
                <button className="primary large" onClick={onNext}>See Local Solutions →</button>
            </div>

            <style>{`
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }
        .header-main { flex: 1; }
        .location-context {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-top: 1rem;
        }
        .weather-widget {
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.2rem;
          background: var(--grad-premium);
          color: white;
          border: none;
        }
        .weather-main { display: flex; align-items: baseline; gap: 0.5rem; }
        .weather-widget .temp { font-size: 2rem; font-weight: 900; }
        .weather-widget .cond { font-size: 0.9rem; font-weight: 700; opacity: 0.9; }
        .weather-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8; }
        .location-summary {
          font-size: 1.1rem;
          color: var(--color-stone);
          max-width: 600px;
        }
        .overall-score-card {
          padding: 1.5rem 2.5rem;
          text-align: center;
          border-top: 5px solid var(--color-moss);
        }
        .score-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--color-moss); }
        .score-display { display: flex; align-items: baseline; justify-content: center; gap: 0.2rem; }
        .score-value { font-size: 4rem; font-weight: 900; color: var(--color-forest); }
        .score-max { font-size: 1.2rem; opacity: 0.5; font-weight: 700; }
        .impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .page-footer {
          display: flex;
          justify-content: space-between;
          padding-top: 2rem;
          border-top: 1px solid var(--color-sand);
        }
        @media (max-width: 768px) {
          .results-header { flex-direction: column; }
          .overall-score-card { width: 100%; }
        }
      `}</style>
        </div>
    );
};
