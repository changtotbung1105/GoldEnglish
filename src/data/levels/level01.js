export const level01 = Object.freeze({
  id: 'level01',
  name: 'Travel Basics',
  timeLimit: 60,
  targetSequence: ['vocab_001', 'vocab_002', 'vocab_003', 'vocab_004'],
  spawnPoints: [
    { x: 480, y: 430 },
    { x: 680, y: 500 },
    { x: 850, y: 430 },
    { x: 570, y: 580 },
  ],
  items: [
    { type: 'word', spawnIndex: 0, wordId: 'vocab_001' },
    { type: 'word', spawnIndex: 1, wordId: 'vocab_002' },
    { type: 'word', spawnIndex: 2, wordId: 'vocab_003' },
    { type: 'word', spawnIndex: 3, wordId: 'vocab_004' },
  ],
});
