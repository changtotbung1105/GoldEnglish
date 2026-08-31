export class BackgroundRenderer {
  constructor() {
    this.stars = [
      { x: 0.12, y: 0.16, r: 1.4, a: 0.6 },
      { x: 0.25, y: 0.09, r: 1.1, a: 0.5 },
      { x: 0.42, y: 0.14, r: 1.7, a: 0.7 },
      { x: 0.68, y: 0.12, r: 1.3, a: 0.55 },
      { x: 0.84, y: 0.18, r: 1.0, a: 0.45 },
      { x: 0.91, y: 0.08, r: 1.5, a: 0.65 },
    ];
  }

  render(ctx, width, height, time = 0) {
    this.drawSky(ctx, width, height);
    this.drawGlow(ctx, width, height);
    this.drawStars(ctx, width, height, time);
    this.drawCloudHaze(ctx, width, height, time);
    this.drawHangingRocks(ctx, width, height);
    this.drawGround(ctx, width, height);
    this.drawUnderground(ctx, width, height, time);
    this.drawDust(ctx, width, height, time);
  }

  drawSky(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#13233d');
    gradient.addColorStop(0.35, '#20385f');
    gradient.addColorStop(0.62, '#4b3a2d');
    gradient.addColorStop(1, '#1a120d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  drawGlow(ctx, width, height) {
    const glow = ctx.createRadialGradient(width * 0.5, height * 0.18, 30, width * 0.5, height * 0.18, width * 0.55);
    glow.addColorStop(0, 'rgba(255, 216, 128, 0.22)');
    glow.addColorStop(0.35, 'rgba(255, 216, 128, 0.12)');
    glow.addColorStop(1, 'rgba(255, 216, 128, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  drawStars(ctx, width, height, time) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for (const star of this.stars) {
      const x = star.x * width;
      const y = star.y * height;
      const pulse = 0.75 + Math.sin(time * 1.2 + star.x * 20) * 0.25;
      ctx.globalAlpha = star.a * pulse;
      ctx.beginPath();
      ctx.arc(x, y, star.r * pulse, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawCloudHaze(ctx, width, height, time) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 5; i += 1) {
      const x = ((time * 12 + i * 190) % (width + 200)) - 100;
      const y = height * 0.16 + i * 10;
      ctx.beginPath();
      ctx.ellipse(x, y, 120, 28, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawHangingRocks(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = '#2a1f1a';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.26);
    ctx.lineTo(width * 0.18, height * 0.21);
    ctx.lineTo(width * 0.34, height * 0.25);
    ctx.lineTo(width * 0.52, height * 0.18);
    ctx.lineTo(width * 0.7, height * 0.24);
    ctx.lineTo(width * 0.88, height * 0.19);
    ctx.lineTo(width, height * 0.23);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawGround(ctx, width, height) {
    const top = height * 0.33;
    const gradient = ctx.createLinearGradient(0, top, 0, height);
    gradient.addColorStop(0, '#6d4d2d');
    gradient.addColorStop(0.45, '#483120');
    gradient.addColorStop(1, '#24160f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, top, width, height - top);

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 14; i += 1) {
      const x = (i * 110 + (i % 2) * 40) % width;
      const y = top + 20 + (i % 4) * 42;
      ctx.beginPath();
      ctx.ellipse(x, y, 26, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawUnderground(ctx, width, height, time) {
    const top = height * 0.48;
    const wobble = Math.sin(time * 0.8) * 5;

    ctx.save();
    ctx.fillStyle = '#130c08';
    ctx.globalAlpha = 0.35;
    ctx.fillRect(0, top + 80 + wobble, width, height - top);
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, top + 150 + wobble, width, height - top);
    ctx.restore();
  }

  drawDust(ctx, width, height, time) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 232, 180, 0.12)';
    for (let i = 0; i < 18; i += 1) {
      const x = (time * 40 + i * 73) % width;
      const y = height * 0.36 + ((i * 37) % (height * 0.54));
      const r = 1 + (i % 3) * 0.8;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
