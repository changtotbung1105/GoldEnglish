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
    'vocab_011', 'vocab_012', 'vocab_013', 'vocab_014', 'vocab_015',
    'vocab_016', 'vocab_017', 'vocab_018', 'vocab_019', 'vocab_020',
  ],
  items: Array.from({ length: 10 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: ['vocab_017', 'vocab_012', 'vocab_020', 'vocab_014', 'vocab_011', 'vocab_019', 'vocab_015', 'vocab_018', 'vocab_013', 'vocab_016'][index],
  })),
});
