export const level01 = Object.freeze({
  id: 'level01',
  name: 'Vocabulary 1',
  timeLimit: 60,
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
    'vocab_011', 'vocab_012', 'vocab_013', 'vocab_014', 'vocab_015',
    'vocab_016', 'vocab_017', 'vocab_018', 'vocab_019', 'vocab_020',
  ],
  items: Array.from({ length: 20 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: `vocab_${String(index + 1).padStart(3, '0')}`,
  })),
});
