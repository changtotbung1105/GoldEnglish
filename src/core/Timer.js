export class Timer {
  constructor() {
    this.lastTime = performance.now();
    this.deltaTime = 0;
    this.elapsedTime = 0;
  }

  tick(now = performance.now()) {
    this.deltaTime = (now - this.lastTime) / 1000;
    this.elapsedTime += this.deltaTime;
    this.lastTime = now;
    return this.deltaTime;
  }
}
