export type RegionalProfile = 'Urban' | 'Water Scarce' | 'Coal Heavy' | 'Renewable Strong' | 'Rural';

export interface LocationData {
  country: string;
  city: string;
  profile: RegionalProfile;
}

export interface DailyHabits {
  transportMode: 'car' | 'bus' | 'train' | 'bike' | 'walk';
  distanceKm: number;
  energyUsageKwh: number;
  waterShowerMinutes: number;
  foodPreference: 'meat' | 'vegetarian' | 'vegan';
  wasteRecycledPercent: number;
}

export interface ImpactScores {
  carbon: number; // kg CO2
  energy: number; // kWh
  water: number; // Liters
  waste: number; // kg
  overallScore: number; // 0-100
}

const REGIONAL_FACTORS = {
  Urban: { water: 1, energy: 0.4, transport: 1, waste: 1.2 },
  'Water Scarce': { water: 2.5, energy: 0.4, transport: 1, waste: 1 },
  'Coal Heavy': { water: 1, energy: 0.8, transport: 1.2, waste: 1 },
  'Renewable Strong': { water: 1, energy: 0.1, transport: 0.8, waste: 1 },
  Rural: { water: 0.8, energy: 0.5, transport: 1.5, waste: 0.8 }
};

export const calculateImpact = (habits: DailyHabits, location: LocationData): ImpactScores => {
  const profile = REGIONAL_FACTORS[location.profile];

  let carbon = 0;
  let energy = habits.energyUsageKwh;
  let water = habits.waterShowerMinutes * 9 * profile.water;
  let waste = 2.0 * (1 - habits.wasteRecycledPercent / 100) * profile.waste;

  const transportFactors = {
    car: 0.2 * profile.transport,
    bus: 0.08 * profile.transport,
    train: 0.04 * profile.transport,
    bike: 0,
    walk: 0,
  };
  carbon += habits.distanceKm * transportFactors[habits.transportMode];

  const foodFactors = { meat: 7.0, vegetarian: 3.5, vegan: 2.0 };
  carbon += foodFactors[habits.foodPreference];
  carbon += energy * profile.energy;

  const carbonScore = Math.max(0, 100 - (carbon * 4));
  const waterScore = Math.max(0, 100 - (water / 1.5));
  const wasteScore = Math.max(0, 100 - (waste * 35));
  const energyScore = Math.max(0, 100 - (energy * 8));

  const overallScore = Math.round((carbonScore + waterScore + wasteScore + energyScore) / 4);

  return {
    carbon: parseFloat(carbon.toFixed(2)),
    energy,
    water: Math.round(water),
    waste: parseFloat(waste.toFixed(2)),
    overallScore,
  };
};

export const getCategoryInfo = (type: keyof Omit<ImpactScores, 'overallScore'>, profile: RegionalProfile) => {
  const info = {
    carbon: {
      explanation: "Carbon emissions drive the greenhouse effect, trapping heat in our atmosphere.",
      consequences: profile === 'Urban' ? "Increases local air pollution and urban heat island effects." : "Contributes to erratic weather patterns affecting agriculture."
    },
    energy: {
      explanation: profile === 'Coal Heavy' ? "Your region relies heavily on fossil fuels for electricity." : "Energy production impacts natural resources and air quality.",
      consequences: "High demand leads to localized smog and habitat loss from extraction."
    },
    water: {
      explanation: profile === 'Water Scarce' ? "YOUR REGION IS WATER STRESSED. Every drop saved is critical for survival." : "Clean water is a finite resource requiring energy to treat.",
      consequences: profile === 'Water Scarce' ? "Direct risk of 'Day Zero' events and agricultural collapse." : "Depletion of aquifers affecting future generations."
    },
    waste: {
      explanation: "Landfills release methane, a potent greenhouse gas.",
      consequences: "Pollutes groundwater and contributes to plastic accumulation in local ecosystems."
    }
  };
  return info[type];
};
