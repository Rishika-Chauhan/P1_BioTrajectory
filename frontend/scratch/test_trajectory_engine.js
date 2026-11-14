import { calculateMedian, calculatePercentile, calculateBaselineCorridor, analyzeTrajectoryDeviations } from '../src/services/trajectoryStorage.js';

console.log('Testing Trajectory Mathematical Engine...');

// 1. Median & IQR test
const sampleValues = [4, 5, 5, 6, 7, 8, 9];
const median = calculateMedian(sampleValues);
console.log('Median (expected 6):', median);
if (median !== 6) throw new Error('Median failed');

const q25 = calculatePercentile(sampleValues, 25);
const q75 = calculatePercentile(sampleValues, 75);
console.log('Q25:', q25, 'Q75:', q75);

// 2. Baseline corridor test
const mockHistory = [
  { day: 1, protein: 5, specificGravity: 1.018 },
  { day: 2, protein: 4, specificGravity: 1.017 },
  { day: 3, protein: 5, specificGravity: 1.019 },
  { day: 4, protein: 6, specificGravity: 1.018 },
  { day: 5, protein: 5, specificGravity: 1.016 },
  { day: 6, protein: 4, specificGravity: 1.018 },
  { day: 7, protein: 5, specificGravity: 1.020 },
  { day: 8, protein: 6, specificGravity: 1.018 },
  { day: 9, protein: 5, specificGravity: 1.017 },
  { day: 10, protein: 5, specificGravity: 1.018 },
];

const corridor = calculateBaselineCorridor(mockHistory, 'protein');
console.log('Corridor output:', corridor);
if (!corridor.isCalibrated || corridor.median !== 5) {
  throw new Error('Baseline corridor test failed');
}

// 3. Transient Spike test
const historyWithSpike = [
  ...mockHistory,
  { day: 11, protein: 32, specificGravity: 1.028, notes: 'Post workout' },
  { day: 12, protein: 8, specificGravity: 1.019, notes: 'Recovery' }
];

const deviationAnalysis = analyzeTrajectoryDeviations(historyWithSpike, 'protein');
console.log('Deviation analysis (transient spike):', deviationAnalysis);
if (!deviationAnalysis.isTransient) {
  throw new Error('Expected transient blip detection');
}

console.log('All Mathematical Engine tests passed successfully!');

