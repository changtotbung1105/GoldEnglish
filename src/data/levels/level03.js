export const level03 = Object.freeze({
  id: 'level03',
  name: 'Fruits 1',
  timeLimit: 50,
  maxWrongAttempts: 3,
  goalCount: 7,
  totalCount: 9,
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
    'fruit_001', 'fruit_002', 'fruit_003', 'fruit_004', 'fruit_005',
    'fruit_006', 'fruit_007', 'fruit_008', 'fruit_009',
  ],
  items: Array.from({ length: 9 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: ['fruit_005', 'fruit_001', 'fruit_008', 'fruit_003', 'fruit_007', 'fruit_009', 'fruit_002', 'fruit_006', 'fruit_004'][index],
  })),
});
