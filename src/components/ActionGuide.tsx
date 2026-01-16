import React from 'react';
import type { ImpactScores } from '../logic/impactCalculator';

interface ActionGuideProps {
  scores: ImpactScores;
}

export const ActionGuide: React.FC<ActionGuideProps> = ({ scores }) => {
  const getTopActions = () => {
    const actions = [];
    if (scores.carbon > 15) actions.push({
      level: 'Individual',
      habit: 'Reduce car travel',
      benefit: 'Could save 5kg+ CO2 daily',
      text: 'Switching some trips to cycling or walking dramatically lowers your personal footprint.'
    });
    if (scores.water > 100) actions.push({
      level: 'Individual',
      habit: 'Shorten shower time',
      benefit: 'Saves 20-50 Liters daily',
      text: 'Aiming for a 5-minute shower is one of the easiest ways to reduce water stress.'
    });
    if (scores.waste > 1) actions.push({
      level: 'Community',
      habit: 'Start composting',
      benefit: 'Reduces landfill methane',
      text: 'Work with neighbors to start a local compost pile for organic kitchen waste.'
    });

    // Default actions
    if (actions.length < 3) {
      actions.push({
        level: 'Long-term',
        habit: 'Adopt Clean Energy',
        benefit: 'Systemic decarbonization',
        text: 'Support policies or providers that supply 100% renewable energy to your community.'
      });
      actions.push({
        level: 'Community',
        habit: 'Share Resources',
        benefit: 'Lower collective consumption',
        text: 'Participate in tool libraries or neighborhood sharing groups to buy less stuff.'
      });
    }

    return actions.slice(0, 3);
  };

  return (
    <section className="action-guide">
      <h2>How You Can Combat Climate Change</h2>
      <div className="action-grid">
        {getTopActions().map((action, idx) => (
          <div key={idx} className="card action-card">
            <span className="action-level">{action.level} Action</span>
            <h3>{action.habit}</h3>
            <p className="action-text">{action.text}</p>
            <div className="action-benefit">
              <span className="benefit-badge">{action.benefit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="future-scope card glass">
        <h3>🌱 Collective Future</h3>
        <p>Coming soon: Weekly impact trends, Community challenges, and Smart Meter integration to track your progress automatically.</p>
      </div>

      <style>{`
        .action-guide {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-top: 2rem;
        }
        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .action-card {
          border-left: 6px solid var(--color-leaf);
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .action-level {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-moss);
          letter-spacing: 0.05em;
        }
        .action-benefit {
          margin-top: auto;
          display: flex;
        }
        .benefit-badge {
          background: var(--color-sky);
          color: var(--color-ocean);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .future-scope {
          padding: 1.5rem;
          text-align: center;
          border: 1px dashed var(--color-moss);
        }
        .future-scope h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
        .future-scope p { font-size: 0.9rem; opacity: 0.8; }
      `}</style>
    </section>
  );
};
