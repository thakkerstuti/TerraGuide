import React from 'react';
import type { LocationData, RegionalProfile } from '../../logic/impactCalculator';

interface LocationPageProps {
    location: LocationData;
    onChange: (location: LocationData) => void;
    onNext: () => void;
}

const PROFILES: { label: string; value: RegionalProfile; description: string }[] = [
    { label: 'Urban Center', value: 'Urban', description: 'Metropolitan areas with high density and public transit.' },
    { label: 'Arid / Dry Region', value: 'Water Scarce', description: 'Areas facing significant water scarcity and drought risks.' },
    { label: 'Industrial / Coal Base', value: 'Coal Heavy', description: 'Regions relying heavily on fossil fuels for energy.' },
    { label: 'Green Energy Hub', value: 'Renewable Strong', description: 'Areas with high adoption of solar, wind, or hydro.' },
    { label: 'Rural / Agricultural', value: 'Rural', description: 'Low density areas with longer travel distances.' },
];

export const LocationPage: React.FC<LocationPageProps> = ({ location, onChange, onNext }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange({ ...location, [name]: value });
    };

    return (
        <div className="card glass page-container">
            <div className="page-header">
                <span className="step-indicator">Step 1 of 4</span>
                <h2>Where do you live?</h2>
                <p className="subtitle">Climate priorities vary by location. We tailor your impact evaluation based on regional challenges like water scarcity or energy infrastructure.</p>
            </div>

            <div className="form-content">
                <div className="input-group">
                    <label>Country</label>
                    <input
                        type="text"
                        name="country"
                        value={location.country}
                        onChange={handleChange}
                        placeholder="e.g. United States, India, Australia"
                    />
                </div>

                <div className="input-group">
                    <label>City / Locality</label>
                    <input
                        type="text"
                        name="city"
                        value={location.city}
                        onChange={handleChange}
                        placeholder="e.g. Phoenix, Mumbai, Sydney"
                    />
                </div>

                <div className="input-group">
                    <label>Regional Climate Profile</label>
                    <div className="profile-grid">
                        {PROFILES.map((p) => (
                            <div
                                key={p.value}
                                className={`profile-card ${location.profile === p.value ? 'active' : ''}`}
                                onClick={() => onChange({ ...location, profile: p.value })}
                            >
                                <span className="profile-label">{p.label}</span>
                                <p className="profile-desc">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="page-footer">
                <button
                    className="primary large"
                    onClick={onNext}
                    disabled={!location.country || !location.city}
                >
                    Begin Lifestyle Check →
                </button>
            </div>

            <style>{`
        .page-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-indicator {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-moss);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .subtitle {
          font-size: 1rem;
          color: var(--color-stone);
          opacity: 0.8;
          margin-top: 0.5rem;
        }
        .form-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .profile-card {
          padding: 1.2rem;
          border: 2px solid var(--color-sand);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }
        .profile-card:hover {
          border-color: var(--color-leaf);
          background: rgba(145, 203, 171, 0.05);
        }
        .profile-card.active {
          border-color: var(--color-moss);
          background: rgba(145, 203, 171, 0.1);
          box-shadow: var(--shadow-sm);
        }
        .profile-label {
          font-weight: 700;
          display: block;
          margin-bottom: 0.3rem;
        }
        .profile-desc {
          font-size: 0.85rem;
          opacity: 0.7;
          line-height: 1.4;
        }
        .page-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid var(--color-sand);
        }
        button.large {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};
