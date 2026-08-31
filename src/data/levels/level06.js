export const level06 = Object.freeze({
  id: 'level06',
  name: 'Sentence 1',
  timeLimit: 60,
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
  targetSequence: ['sent_001', 'sent_002', 'sent_003', 'sent_004'],
  items: [
    { type: 'word', spawnIndex: 0, wordId: 'sent_003' },
    { type: 'word', spawnIndex: 1, wordId: 'sent_001' },
    { type: 'word', spawnIndex: 2, wordId: 'sent_004' },
    { type: 'word', spawnIndex: 3, wordId: 'sent_002' },
  ],
});
