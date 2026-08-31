export const level05 = Object.freeze({
  id: 'level05',
  name: 'Vocabulary 5',
  timeLimit: 45,
  spawnMode: 'arc',
  spawnArea: {
    centerX: 640,
    centerY: 190,
    radiusMin: 230,
    radiusMax: 430,
    angleStart: Math.PI * 0.18,
    angleEnd: Math.PI * 0.82,
  },
  targetSequence: [
    'vocab_081', 'vocab_082', 'vocab_083', 'vocab_084', 'vocab_085',
    'vocab_086', 'vocab_087', 'vocab_088', 'vocab_089', 'vocab_090',
    'vocab_091', 'vocab_092', 'vocab_093', 'vocab_094', 'vocab_095',
    'vocab_096', 'vocab_097', 'vocab_098', 'vocab_099', 'vocab_100',
  ],
  items: Array.from({ length: 20 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: `vocab_${String(index + 81).padStart(3, '0')}`,
  })),
});
