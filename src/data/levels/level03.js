export const level03 = Object.freeze({
  id: 'level03',
  name: 'Vocabulary 3',
  timeLimit: 50,
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
    'vocab_051', 'vocab_052', 'vocab_053', 'vocab_054', 'vocab_055',
    'vocab_056', 'vocab_057', 'vocab_058', 'vocab_059', 'vocab_060',
  ],
  items: Array.from({ length: 20 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: `vocab_${String(index + 41).padStart(3, '0')}`,
  })),
});
