export const level02 = Object.freeze({
  id: 'level02',
  name: 'Simple Actions',
  timeLimit: 55,
  targetSequence: ['vocab_002', 'vocab_001', 'vocab_002', 'vocab_001'],
  spawnPoints: [
    { x: 430, y: 360 },
    { x: 630, y: 440 },
    { x: 840, y: 320 },
    { x: 750, y: 500 },
  ],
  items: [
    { type: 'word', spawnIndex: 0, wordId: 'vocab_002' },
    { type: 'gold', spawnIndex: 1 },
    { type: 'bomb', spawnIndex: 2 },
    { type: 'word', spawnIndex: 3, wordId: 'vocab_001' },
  ],
});
