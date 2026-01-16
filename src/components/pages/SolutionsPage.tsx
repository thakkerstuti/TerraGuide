import React from 'react';
import type { ImpactScores, LocationData } from '../../logic/impactCalculator';

interface SolutionsPageProps {
    scores: ImpactScores;
    location: LocationData;
    onRestart: () => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ scores, location, onRestart }) => {
    const getLocalActions = () => {
        const actions = [];

        // Water
        if (location.profile === 'Water Scarce' || scores.water > 100) {
            actions.push({
                type: 'Individual',
                title: 'Greywater Recycling',
                desc: `In ${location.city}, water is precious. Reuse shower water for plants or toilets.`,
                gain: 'Saves 30%+ household water'
            });
        }

        // Energy
        if (location.profile === 'Coal Heavy' || scores.energy > 20) {
            actions.push({
                type: 'Long-Term',
                title: 'Community Solar',
                desc: `Switch to renewable providers to bypass ${location.city}'s coal-heavy grid.`,
                gain: 'Up to 90% CO2 reduction'
            });
        } else {
            actions.push({
                type: 'Individual',
                title: 'Smart Energy Habits',
                desc: 'Shift heavy appliance use to off-peak hours to help balance the grid.',
                gain: 'Reduces peak demand stress'
            });
        }

        // Transport
        if (location.profile === 'Urban' && scores.carbon > 10) {
            actions.push({
                type: 'Community',
                title: 'Shared Transport',
                desc: `Utilize ${location.city}'s existing hubs. Carpooling reduces traffic and local smog.`,
                gain: 'Cuts personal travel CO2 by half'
            });
        } else {
            actions.push({
                type: 'Individual',
                title: 'Active Commuting',
                desc: 'Walking or cycling for trips under 3km is the ultimate local carbon solution.',
                gain: 'Zero emissions travel'
            });
        }

        return actions;
    };

    return (
        <div className="solutions-container">
            <header className="page-header">
                <span className="step-indicator">Step 4 of 4</span>
                <h2>Solutions for {location.city}</h2>
                <p className="subtitle">Practical ways to lower your footprint and strengthen your community's resilience.</p>
            </header>

            <div className="action-grid">
                {getLocalActions().map((action, idx) => (
                    <div key={idx} className="card action-card">
                        <span className="action-type">{action.type} Action</span>
                        <h3>{action.title}</h3>
                        <p className="action-desc">{action.desc}</p>
                        <div className="action-gain">
                            <span className="gain-label">Expected Benefit:</span>
                            <span className="gain-value">{action.gain}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="future-scope card glass">
                <h3>🌱 Collective Future for {location.country}</h3>
                <p>We're working on integrating hyper-local data for {location.city}, including city-level benchmarks and government climate initiatives.</p>
            </div>

            <div className="page-footer">
                <button className="primary large" onClick={onRestart}>Start New Evaluation</button>
            </div>

            <style>{`
        .solutions-container { display: flex; flex-direction: column; gap: 2.5rem; animation: fadeIn 0.8s ease-out; }
        .action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .action-card { border-left: 6px solid var(--color-moss); display: flex; flex-direction: column; gap: 0.8rem; }
        .action-type { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--color-moss); letter-spacing: 0.1em; }
        .action-desc { font-size: 0.95rem; line-height: 1.5; color: var(--color-stone); }
        .action-gain { margin-top: auto; background: var(--color-earth); padding: 0.8rem; border-radius: var(--radius-md); font-size: 0.85rem; }
        .gain-label { display: block; font-weight: 700; font-size: 0.75rem; color: var(--color-moss); margin-bottom: 0.2rem; }
        .gain-value { font-weight: 700; color: var(--color-forest); }
        .future-scope { text-align: center; border: 2px dashed var(--color-leaf); padding: 2rem; }
        .page-footer { display: flex; justify-content: center; margin-top: 1rem; }
      `}</style>
        </div>
    );
};
