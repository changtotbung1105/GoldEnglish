export const level04 = Object.freeze({
  id: 'level04',
  name: 'Sentence Builder',
  timeLimit: 48,
  targetSequence: ['vocab_002', 'vocab_001', 'vocab_002', 'vocab_001', 'vocab_002'],
  spawnPoints: [
    { x: 360, y: 350 },
    { x: 520, y: 450 },
    { x: 700, y: 320 },
    { x: 880, y: 430 },
    { x: 1040, y: 360 },
  ],
  items: [
    { type: 'word', spawnIndex: 0, wordId: 'vocab_002' },
    { type: 'gold', spawnIndex: 1 },
    { type: 'word', spawnIndex: 2, wordId: 'vocab_001' },
    { type: 'bomb', spawnIndex: 3 },
    { type: 'gold', spawnIndex: 4 },
  ],
});
