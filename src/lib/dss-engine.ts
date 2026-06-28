// ============================================
// PURE — DSS (Decision Support System) Engine
// ============================================

import { type SensorReading, type ParameterKey, parameterConfigs, getParameterStatus } from '@/data/mock-data';
import { fishDatabase, parameterWeights, type FishSpecies } from '@/data/fish-data';

export interface FishScore {
  fish: FishSpecies;
  score: number;
  status: 'highly-recommended' | 'recommended' | 'conditional' | 'not-recommended';
  statusLabel: string;
  matchedParams: ParameterKey[];
  mismatchedParams: { key: ParameterKey; reason: string; gap: number }[];
  explanation: string;
}

export interface GapAnalysis {
  parameter: ParameterKey;
  parameterName: string;
  currentValue: number;
  idealMin: number;
  idealMax: number;
  unit: string;
  isInRange: boolean;
  gap: number;
  direction: 'low' | 'high' | 'ok';
}

export interface CorrectiveRecommendation {
  parameter: ParameterKey;
  parameterName: string;
  actions: string[];
  priority: 'urgent' | 'important' | 'monitoring';
}

/**
 * Calculate fitness score for a fish species based on current water quality
 */
function calculateFitnessScore(
  fish: FishSpecies,
  sensorData: SensorReading
): { score: number; matched: ParameterKey[]; mismatched: { key: ParameterKey; reason: string; gap: number }[] } {
  let totalScore = 0;
  const matched: ParameterKey[] = [];
  const mismatched: { key: ParameterKey; reason: string; gap: number }[] = [];

  const params: ParameterKey[] = ['temperature', 'ph', 'dissolvedOxygen', 'ammonia', 'turbidity', 'tds'];

  for (const param of params) {
    const idealRange = fish.idealRanges[param];
    const value = sensorData[param];
    const weight = parameterWeights[param] || 0.1;

    const rangeSize = idealRange.max - idealRange.min;
    const midpoint = (idealRange.min + idealRange.max) / 2;

    let paramScore: number;

    if (value >= idealRange.min && value <= idealRange.max) {
      // Within ideal range — score based on proximity to midpoint
      const distFromMid = Math.abs(value - midpoint) / (rangeSize / 2);
      paramScore = 1.0 - distFromMid * 0.15; // 85-100% within range
      matched.push(param);
    } else {
      // Outside ideal range — penalize based on distance
      const dist = value < idealRange.min 
        ? idealRange.min - value 
        : value - idealRange.max;
      const normalizedDist = dist / (rangeSize || 1);
      paramScore = Math.max(0, 0.7 - normalizedDist * 0.5);
      
      const direction = value < idealRange.min ? 'terlalu rendah' : 'terlalu tinggi';
      const config = parameterConfigs.find(p => p.key === param);
      mismatched.push({
        key: param,
        reason: `${config?.name || param} ${direction} (${value} ${config?.unit || ''}, ideal: ${idealRange.min}–${idealRange.max} ${config?.unit || ''})`,
        gap: dist,
      });
    }

    totalScore += paramScore * weight;
  }

  // Normalize to percentage
  const score = Math.round(totalScore * 100);

  return { score: Math.min(100, Math.max(0, score)), matched, mismatched };
}

/**
 * Get fish status based on fitness score
 */
function getFishStatus(score: number): { status: FishScore['status']; label: string } {
  if (score >= 85) return { status: 'highly-recommended', label: 'Highly Recommended' };
  if (score >= 70) return { status: 'recommended', label: 'Recommended' };
  if (score >= 50) return { status: 'conditional', label: 'Conditional' };
  return { status: 'not-recommended', label: 'Not Recommended' };
}

/**
 * Generate explanation for a fish recommendation
 */
function generateExplanation(fish: FishSpecies, matched: ParameterKey[], mismatched: { key: ParameterKey; reason: string }[]): string {
  const matchNames = matched.map(k => parameterConfigs.find(p => p.key === k)?.name || k);
  
  let explanation = `${fish.name} `;
  
  if (mismatched.length === 0) {
    explanation += `sangat direkomendasikan karena seluruh parameter (${matchNames.join(', ')}) berada dalam rentang optimal.`;
  } else if (matched.length > mismatched.length) {
    explanation += `direkomendasikan karena ${matchNames.slice(0, 3).join(', ')} berada dalam rentang optimal.`;
    if (mismatched.length > 0) {
      explanation += ` Namun, ${mismatched.map(m => m.reason).join('. ')}.`;
    }
  } else {
    explanation += `kurang direkomendasikan saat ini karena beberapa parameter belum ideal: ${mismatched.map(m => m.reason).join('. ')}.`;
  }
  
  return explanation;
}

/**
 * Get ranked fish recommendations based on current water quality
 */
export function getFishRecommendations(sensorData: SensorReading): FishScore[] {
  const results: FishScore[] = fishDatabase.map(fish => {
    const { score, matched, mismatched } = calculateFitnessScore(fish, sensorData);
    const { status, label } = getFishStatus(score);
    const explanation = generateExplanation(fish, matched, mismatched);

    return {
      fish,
      score,
      status,
      statusLabel: label,
      matchedParams: matched,
      mismatchedParams: mismatched,
      explanation,
    };
  });

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Perform gap analysis for a target fish species
 */
export function getGapAnalysis(fish: FishSpecies, sensorData: SensorReading): GapAnalysis[] {
  const params: ParameterKey[] = ['temperature', 'ph', 'dissolvedOxygen', 'ammonia', 'turbidity', 'tds'];
  
  return params.map(param => {
    const idealRange = fish.idealRanges[param];
    const value = sensorData[param];
    const config = parameterConfigs.find(p => p.key === param)!;
    
    const isInRange = value >= idealRange.min && value <= idealRange.max;
    let gap = 0;
    let direction: 'low' | 'high' | 'ok' = 'ok';

    if (value < idealRange.min) {
      gap = idealRange.min - value;
      direction = 'low';
    } else if (value > idealRange.max) {
      gap = value - idealRange.max;
      direction = 'high';
    }

    return {
      parameter: param,
      parameterName: config.name,
      currentValue: value,
      idealMin: idealRange.min,
      idealMax: idealRange.max,
      unit: config.unit,
      isInRange,
      gap: +gap.toFixed(config.decimals),
      direction,
    };
  });
}

/**
 * Get corrective recommendations for a target fish species
 */
export function getCorrectiveRecommendations(
  fish: FishSpecies,
  sensorData: SensorReading
): CorrectiveRecommendation[] {
  const gaps = getGapAnalysis(fish, sensorData);
  const recommendations: CorrectiveRecommendation[] = [];

  for (const gap of gaps) {
    if (gap.isInRange) continue;

    const actions: string[] = [];
    let priority: 'urgent' | 'important' | 'monitoring' = 'monitoring';

    switch (gap.parameter) {
      case 'dissolvedOxygen':
        if (gap.direction === 'low') {
          priority = 'urgent';
          actions.push('Aktifkan aerator segera');
          actions.push('Kurangi kepadatan ikan sementara');
          actions.push('Tunda penebaran benih baru');
          actions.push(`Pantau DO setiap 30 menit hingga mencapai ${gap.idealMin} ${gap.unit}`);
        }
        break;
      case 'ammonia':
        if (gap.direction === 'high') {
          priority = 'urgent';
          actions.push('Lakukan pergantian air parsial (20-30%)');
          actions.push('Evaluasi dan kurangi pemberian pakan');
          actions.push('Cek dan perbaiki biofilter');
          actions.push('Kurangi sisa bahan organik di dasar tambak');
        }
        break;
      case 'ph':
        priority = 'important';
        if (gap.direction === 'low') {
          actions.push('Lakukan stabilisasi pH secara bertahap');
          actions.push('Hindari perubahan pH mendadak');
        } else {
          actions.push('Evaluasi sumber air dan lakukan penyesuaian');
          actions.push('Pantau perubahan pH setiap jam');
        }
        actions.push('Lakukan pengukuran ulang setelah perlakuan');
        break;
      case 'temperature':
        priority = 'important';
        if (gap.direction === 'high') {
          actions.push('Tambahkan aerasi untuk meningkatkan sirkulasi');
          actions.push('Pertimbangkan peneduh tambak');
        } else {
          actions.push('Evaluasi sumber air masuk');
          actions.push('Pertimbangkan penggunaan heater jika diperlukan');
        }
        break;
      case 'turbidity':
        priority = 'monitoring';
        actions.push('Periksa akumulasi bahan organik');
        actions.push('Lakukan sirkulasi air');
        actions.push('Klarifikasi air jika diperlukan');
        break;
      case 'tds':
        priority = 'monitoring';
        actions.push('Evaluasi mineral terlarut dalam air');
        actions.push('Lakukan pergantian air sebagian');
        break;
    }

    if (actions.length > 0) {
      recommendations.push({
        parameter: gap.parameter,
        parameterName: gap.parameterName,
        actions,
        priority,
      });
    }
  }

  // Sort by priority
  const priorityOrder = { urgent: 0, important: 1, monitoring: 2 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Calculate Water Quality Score (0-100)
 */
export function calculateWaterQualityScore(sensorData: SensorReading): {
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  statusLabel: string;
  summary: string;
} {
  const params: ParameterKey[] = ['temperature', 'ph', 'dissolvedOxygen', 'ammonia', 'turbidity', 'tds'];
  let totalScore = 0;

  for (const param of params) {
    const status = getParameterStatus(param, sensorData[param]);
    const weight = parameterWeights[param] || 0.1;
    
    let paramScore: number;
    switch (status) {
      case 'optimal': paramScore = 100; break;
      case 'normal': paramScore = 75; break;
      case 'warning': paramScore = 45; break;
      case 'critical': paramScore = 15; break;
    }
    
    totalScore += paramScore * weight;
  }

  const score = Math.round(totalScore);
  
  let statusResult: 'excellent' | 'good' | 'warning' | 'critical';
  let statusLabel: string;
  let summary: string;

  if (score >= 85) {
    statusResult = 'excellent';
    statusLabel = 'Excellent';
    summary = 'Kondisi air sangat baik dan ideal untuk budidaya. Seluruh parameter berada dalam rentang optimal.';
  } else if (score >= 70) {
    statusResult = 'good';
    statusLabel = 'Good';
    summary = 'Kondisi air baik untuk budidaya. Beberapa parameter perlu dipantau agar tetap stabil.';
  } else if (score >= 50) {
    statusResult = 'warning';
    statusLabel = 'Warning';
    summary = 'Kondisi air perlu perhatian. Beberapa parameter mulai mendekati batas yang kurang ideal.';
  } else {
    statusResult = 'critical';
    statusLabel = 'Critical';
    summary = 'Kondisi air kritis dan membutuhkan tindakan segera untuk menghindari risiko pada ikan.';
  }

  return { score, status: statusResult, statusLabel, summary };
}
