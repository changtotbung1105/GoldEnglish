export const level02 = Object.freeze({
  id: 'level02',
  name: 'Birds 1',
  timeLimit: 55,
  maxWrongAttempts: 4,
  goalCount: 5,
  totalCount: 7,
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
    'birth_001', 'birth_002', 'birth_003', 'birth_004', 'birth_005', 'birth_006', 'birth_007',
  ],
  items: Array.from({ length: 7 }, (_, index) => ({
    type: 'word',
    spawnIndex: index,
    wordId: ['birth_004', 'birth_001', 'birth_006', 'birth_007', 'birth_003', 'birth_005', 'birth_002'][index],
  })),
});
