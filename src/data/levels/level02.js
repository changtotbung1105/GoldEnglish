export const level02 = Object.freeze({
  id: 'level02',
  name: 'Vocabulary 2',
  timeLimit: 55,
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
    'vocab_031', 'vocab_032', 'vocab_033', 'vocab_034', 'vocab_035',
    'vocab_036', 'vocab_037', 'vocab_038', 'vocab_039', 'vocab_040',
  ],
  items: Array.from({ length: 20 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: `vocab_${String(index + 21).padStart(3, '0')}`,
  })),
});
