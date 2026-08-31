export const level03 = Object.freeze({
  id: 'level03',
  name: 'Vocabulary 3',
  timeLimit: 50,
  maxWrongAttempts: 3,
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
    'vocab_021', 'vocab_022', 'vocab_023', 'vocab_024', 'vocab_025',
    'vocab_026', 'vocab_027', 'vocab_028', 'vocab_029', 'vocab_030',
  ],
  items: Array.from({ length: 10 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: ['vocab_025', 'vocab_030', 'vocab_022', 'vocab_027', 'vocab_024', 'vocab_021', 'vocab_029', 'vocab_026', 'vocab_023', 'vocab_028'][index],
  })),
});
