export const level05 = Object.freeze({
  id: 'level05',
  name: 'Vocabulary 5',
  timeLimit: 45,
  maxWrongAttempts: 0,
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
    'vocab_041', 'vocab_042', 'vocab_043', 'vocab_044', 'vocab_045',
    'vocab_046', 'vocab_047', 'vocab_048', 'vocab_049', 'vocab_050',
  ],
  items: Array.from({ length: 10 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: ['vocab_047', 'vocab_041', 'vocab_050', 'vocab_044', 'vocab_046', 'vocab_043', 'vocab_049', 'vocab_042', 'vocab_048', 'vocab_045'][index],
  })),
});
