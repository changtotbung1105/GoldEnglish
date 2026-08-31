export const level04 = Object.freeze({
  id: 'level04',
  name: 'Vocabulary 4',
  timeLimit: 48,
  maxWrongAttempts: 1,
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
    'vocab_031', 'vocab_032', 'vocab_033', 'vocab_034', 'vocab_035',
    'vocab_036', 'vocab_037', 'vocab_038', 'vocab_039', 'vocab_040',
  ],
  items: Array.from({ length: 10 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: ['vocab_036', 'vocab_031', 'vocab_040', 'vocab_034', 'vocab_037', 'vocab_033', 'vocab_039', 'vocab_035', 'vocab_032', 'vocab_038'][index],
  })),
});
