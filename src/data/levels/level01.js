export const level01 = Object.freeze({
  id: 'level01',
  name: 'Animals 1',
  timeLimit: 60,
  maxWrongAttempts: 3,
  goalCount: 4,
  totalCount: 6,
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
    'vocab_041', 'vocab_042', 'vocab_043', 'vocab_044', 'vocab_045', 'vocab_046',
  ],
  items: Array.from({ length: 6 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: ['vocab_044', 'vocab_041', 'vocab_045', 'vocab_043', 'vocab_046', 'vocab_042'][index],
  })),
});
