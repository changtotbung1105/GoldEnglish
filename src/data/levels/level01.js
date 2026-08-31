export const level01 = Object.freeze({
  id: 'level01',
  name: 'Travel Basics',
  timeLimit: 60,
  spawnPoints: [
    { x: 480, y: 430 },
    { x: 680, y: 500 },
    { x: 850, y: 430 },
    { x: 570, y: 580 },
  ],
  items: [
    { type: 'gold', spawnIndex: 0 },
    { type: 'bomb', spawnIndex: 1 },
    { type: 'word', spawnIndex: 2, wordId: 'vocab_001' },
    { type: 'word', spawnIndex: 3, wordId: 'vocab_002' },
  ],
});
