// ============================================
// PURE — Fish Species Database for DSS
// ============================================

export interface FishIdealRange {
  min: number;
  max: number;
}

export interface FishSpecies {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  description: string;
  idealRanges: {
    temperature: FishIdealRange;
    ph: FishIdealRange;
    dissolvedOxygen: FishIdealRange;
    ammonia: FishIdealRange;
    turbidity: FishIdealRange;
    tds: FishIdealRange;
  };
  cultivationNotes: string;
  harvestTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const fishDatabase: FishSpecies[] = [
  {
    id: 'nila',
    name: 'Nila',
    scientificName: 'Oreochromis niloticus',
    image: '/images/fish/nila.png',
    description: 'Ikan nila merupakan salah satu komoditas unggulan akuakultur dengan daya adaptasi tinggi terhadap berbagai kondisi lingkungan.',
    idealRanges: {
      temperature: { min: 25, max: 30 },
      ph: { min: 6.5, max: 8.5 },
      dissolvedOxygen: { min: 4.0, max: 10.0 },
      ammonia: { min: 0, max: 0.02 },
      turbidity: { min: 0, max: 25 },
      tds: { min: 200, max: 600 },
    },
    cultivationNotes: 'Toleran terhadap berbagai kondisi, tumbuh cepat, cocok untuk pemula.',
    harvestTime: '4-6 bulan',
    difficulty: 'Easy',
  },
  {
    id: 'gurame',
    name: 'Gurame',
    scientificName: 'Osphronemus goramy',
    image: '/images/fish/gurame.png',
    description: 'Ikan gurame memiliki nilai ekonomis tinggi dan membutuhkan kualitas air yang lebih terjaga.',
    idealRanges: {
      temperature: { min: 26, max: 30 },
      ph: { min: 6.5, max: 7.5 },
      dissolvedOxygen: { min: 5.0, max: 10.0 },
      ammonia: { min: 0, max: 0.015 },
      turbidity: { min: 0, max: 20 },
      tds: { min: 200, max: 500 },
    },
    cultivationNotes: 'Membutuhkan kualitas air yang stabil, pertumbuhan relatif lambat.',
    harvestTime: '8-12 bulan',
    difficulty: 'Medium',
  },
  {
    id: 'lele',
    name: 'Lele',
    scientificName: 'Clarias gariepinus',
    image: '/images/fish/lele.png',
    description: 'Ikan lele sangat tangguh dan mampu bertahan di berbagai kondisi air, cocok untuk budidaya intensif.',
    idealRanges: {
      temperature: { min: 25, max: 32 },
      ph: { min: 6.0, max: 9.0 },
      dissolvedOxygen: { min: 3.0, max: 10.0 },
      ammonia: { min: 0, max: 0.05 },
      turbidity: { min: 0, max: 40 },
      tds: { min: 150, max: 700 },
    },
    cultivationNotes: 'Sangat toleran, bisa bernapas udara langsung, budidaya padat tebar tinggi.',
    harvestTime: '2-3 bulan',
    difficulty: 'Easy',
  },
  {
    id: 'patin',
    name: 'Patin',
    scientificName: 'Pangasius hypophthalmus',
    image: '/images/fish/patin.png',
    description: 'Ikan patin memiliki pertumbuhan cepat dan cocok untuk budidaya di tambak dengan kedalaman yang cukup.',
    idealRanges: {
      temperature: { min: 26, max: 32 },
      ph: { min: 6.5, max: 7.5 },
      dissolvedOxygen: { min: 4.0, max: 10.0 },
      ammonia: { min: 0, max: 0.03 },
      turbidity: { min: 0, max: 30 },
      tds: { min: 200, max: 550 },
    },
    cultivationNotes: 'Membutuhkan kolam dalam, pertumbuhan cepat, daging putih bernilai tinggi.',
    harvestTime: '5-7 bulan',
    difficulty: 'Medium',
  },
  {
    id: 'bandeng',
    name: 'Bandeng',
    scientificName: 'Chanos chanos',
    image: '/images/fish/bandeng.png',
    description: 'Ikan bandeng merupakan komoditas tradisional tambak dengan adaptasi yang baik terhadap air payau.',
    idealRanges: {
      temperature: { min: 27, max: 33 },
      ph: { min: 7.0, max: 8.5 },
      dissolvedOxygen: { min: 4.5, max: 10.0 },
      ammonia: { min: 0, max: 0.02 },
      turbidity: { min: 0, max: 25 },
      tds: { min: 300, max: 800 },
    },
    cultivationNotes: 'Cocok untuk tambak payau, membutuhkan pH netral-basa, tumbuh baik di perairan hangat.',
    harvestTime: '4-6 bulan',
    difficulty: 'Medium',
  },
];

// Weight factors for DSS scoring (higher = more important)
export const parameterWeights: Record<string, number> = {
  dissolvedOxygen: 0.25,
  ammonia: 0.25,
  ph: 0.20,
  temperature: 0.15,
  turbidity: 0.10,
  tds: 0.05,
};
