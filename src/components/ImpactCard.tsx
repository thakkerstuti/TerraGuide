import React from 'react';

interface ImpactCardProps {
  type: 'carbon' | 'water' | 'energy' | 'waste';
  value: number;
  unit: string;
  explanation: string;
  consequences: string;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({ type, value, unit, explanation, consequences }) => {
  return (
    <div className="card glass impact-card">
      <div className="impact-header" style={{ color: `var(--color-${type})` }}>
        <h3 className="capitalize">{type} Impact</h3>
        <div className="impact-value">
          <span className="number">{value}</span>
          <span className="unit">{unit}</span>
        </div>
      </div>
      <div className="impact-details">
        <p className="explanation"><strong>The Impact:</strong> {explanation}</p>
        <p className="consequences"><strong>Real-world Consequence:</strong> {consequences}</p>
      </div>
      <div className="impact-progress-container">
        <div
          className="impact-progress-bar"
          style={{
            width: `${Math.min(100, (value / (type === 'water' ? 200 : 10)) * 100)}%`,
            backgroundColor: `var(--color-${type})`
          }}
        />
      </div>
      <style>{`
        .impact-card {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: 100%;
        }
        .impact-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .impact-value .number {
          font-size: 2.5rem;
          font-weight: 800;
          margin-right: 0.5rem;
        }
        .impact-value .unit {
          font-size: 0.9rem;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .impact-details {
          font-size: 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .impact-progress-container {
          height: 8px;
          background: rgba(0,0,0,0.05);
          border-radius: 4px;
          overflow: hidden;
          margin-top: auto;
        }
        .impact-progress-bar {
          height: 100%;
          transition: width 0.8s ease-out;
        }
        .capitalize { text-transform: capitalize; }
      `}</style>
    </div>
  );
};
