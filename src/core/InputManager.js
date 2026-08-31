export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keysDown = new Set();
    this.keysPressed = new Set();
    this.pointer = {
      x: 0,
      y: 0,
      down: false,
      pressed: false,
      clicked: false,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('pointermove', this.handlePointerMove);
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('click', this.handleClick);
  }

  detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('click', this.handleClick);
  }

  update() {
    this.keysPressed.clear();
    this.pointer.pressed = false;
    this.pointer.clicked = false;
  }

  isKeyDown(key) {
    return this.keysDown.has(key);
  }

  isKeyPressed(key) {
    return this.keysPressed.has(key);
  }

  handleKeyDown(event) {
    if (!this.keysDown.has(event.key)) {
      this.keysPressed.add(event.key);
    }
    this.keysDown.add(event.key);
  }

  handleKeyUp(event) {
    this.keysDown.delete(event.key);
  }

  handlePointerMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    this.pointer.x = (event.clientX - rect.left) * scaleX;
    this.pointer.y = (event.clientY - rect.top) * scaleY;
  }

  handlePointerDown(event) {
    this.pointer.down = true;
    this.pointer.pressed = true;
    this.handlePointerMove(event);
  }

  handlePointerUp() {
    this.pointer.down = false;
  }

  handleClick(event) {
    this.pointer.clicked = true;
    this.handlePointerMove(event);
  }
}
