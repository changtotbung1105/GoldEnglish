export const level01 = Object.freeze({
  id: 'level01',
  name: 'Vocabulary 1',
  timeLimit: 60,
  maxWrongAttempts: 5,
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
    'vocab_001', 'vocab_002', 'vocab_003', 'vocab_004', 'vocab_005',
    'vocab_006', 'vocab_007', 'vocab_008', 'vocab_009', 'vocab_010',
  ],
  items: Array.from({ length: 10 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: ['vocab_004', 'vocab_001', 'vocab_009', 'vocab_006', 'vocab_010', 'vocab_003', 'vocab_008', 'vocab_002', 'vocab_007', 'vocab_005'][index],
  })),
});
