export const level04 = Object.freeze({
  id: 'level04',
  name: 'Vocabulary 4',
  timeLimit: 48,
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
    'vocab_061', 'vocab_062', 'vocab_063', 'vocab_064', 'vocab_065',
    'vocab_066', 'vocab_067', 'vocab_068', 'vocab_069', 'vocab_070',
    'vocab_071', 'vocab_072', 'vocab_073', 'vocab_074', 'vocab_075',
    'vocab_076', 'vocab_077', 'vocab_078', 'vocab_079', 'vocab_080',
  ],
  items: Array.from({ length: 20 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: `vocab_${String(index + 61).padStart(3, '0')}`,
  })),
});
