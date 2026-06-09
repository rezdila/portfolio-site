// js/particles.js
// Lightweight canvas particle system for the hero background.

const ACCENT_COLORS = [
  { r: 0,   g: 212, b: 255 },  // cyan  #00d4ff
  { r: 167, g: 139, b: 250 },  // purple #a78bfa
  { r: 52,  g: 211, b: 153 },  // emerald #34d399
];

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.reset(canvasWidth, canvasHeight, true);
  }

  reset(canvasWidth, canvasHeight, randomPosition = false) {
    this.x = randomPosition ? Math.random() * canvasWidth : Math.random() * canvasWidth;
    this.y = randomPosition ? Math.random() * canvasHeight : Math.random() * canvasHeight;

    // Very gentle drift
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.3 + 0.05; // 0.05 – 0.35 px/frame
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.radius = Math.random() * 2 + 1; // 1 – 3 px
    this.baseOpacity = Math.random() * 0.5 + 0.2; // 0.2 – 0.7
    this.opacity = this.baseOpacity;

    // Pick a random accent color
    const color = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;

    // Subtle pulse
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update(canvasWidth, canvasHeight, mouseX, mouseY, mouseRadius, time) {
    // Pulse opacity
    this.opacity =
      this.baseOpacity + Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.15;

    // Mouse repulsion
    if (mouseX !== null && mouseY !== null) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distSq = dx * dx + dy * dy;
      const rSq = mouseRadius * mouseRadius;
      if (distSq < rSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / mouseRadius) * 1.2; // strength factor
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }

    // Damping so mouse pushes fade
    this.vx *= 0.99;
    this.vy *= 0.99;

    // Ensure minimum drift so particles never freeze
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed < 0.05) {
      const angle = Math.random() * Math.PI * 2;
      this.vx += Math.cos(angle) * 0.02;
      this.vy += Math.sin(angle) * 0.02;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < -this.radius) this.x = canvasWidth + this.radius;
    else if (this.x > canvasWidth + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = canvasHeight + this.radius;
    else if (this.y > canvasHeight + this.radius) this.y = -this.radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${this.opacity})`;
    ctx.fill();
  }
}

export default class ParticleSystem {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} [options]
   * @param {number} [options.count=80]              – number of particles
   * @param {number} [options.connectionDistance=120] – max distance for lines
   * @param {number} [options.mouseRadius=150]        – mouse repel radius
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.count = options.count ?? 80;
    this.connectionDistance = options.connectionDistance ?? 120;
    this.mouseRadius = options.mouseRadius ?? 150;

    this.particles = [];
    this.animationId = null;
    this.running = false;
    this.time = 0;

    this.mouse = { x: null, y: null };

    // Bind handlers so they can be removed later
    this._onResize = this._handleResize.bind(this);
    this._onMouseMove = this._handleMouseMove.bind(this);
    this._onMouseLeave = this._handleMouseLeave.bind(this);
    this._onTouchMove = this._handleTouchMove.bind(this);
    this._animate = this._loop.bind(this);
  }

  /* ---------------------------------------------------------------- */
  /*  Public API                                                       */
  /* ---------------------------------------------------------------- */

  start() {
    if (this.running) return;
    this.running = true;

    this._resize();
    this._createParticles();
    this._addListeners();
    this._loop();
  }

  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    this._removeListeners();
    this.particles = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /* ---------------------------------------------------------------- */
  /*  Internal                                                         */
  /* ---------------------------------------------------------------- */

  _resize() {
    const rect = this.canvas.parentElement
      ? this.canvas.parentElement.getBoundingClientRect()
      : { width: window.innerWidth, height: window.innerHeight };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
  }

  _createParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push(new Particle(this.width, this.height));
    }
  }

  _addListeners() {
    window.addEventListener('resize', this._onResize);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);
    this.canvas.addEventListener('touchmove', this._onTouchMove, { passive: true });
  }

  _removeListeners() {
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    this.canvas.removeEventListener('touchmove', this._onTouchMove);
  }

  _handleResize() {
    this._resize();
    // Re-scatter particles that ended up out of bounds
    for (const p of this.particles) {
      if (p.x > this.width || p.y > this.height) {
        p.reset(this.width, this.height, true);
      }
    }
  }

  _handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  _handleMouseLeave() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  _handleTouchMove(e) {
    if (e.touches.length > 0) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.touches[0].clientX - rect.left;
      this.mouse.y = e.touches[0].clientY - rect.top;
    }
  }

  _loop() {
    if (!this.running) return;

    this.time++;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & draw particles
    for (const p of this.particles) {
      p.update(
        this.width,
        this.height,
        this.mouse.x,
        this.mouse.y,
        this.mouseRadius,
        this.time
      );
    }

    // Draw connection lines (check each pair once)
    const maxDistSq = this.connectionDistance * this.connectionDistance;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / this.connectionDistance) * 0.2;

          // Blend colours of both particles
          const r = Math.round((a.r + b.r) / 2);
          const g = Math.round((a.g + b.g) / 2);
          const bCol = Math.round((a.b + b.b) / 2);

          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(${r},${g},${bCol},${opacity})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.stroke();
        }
      }
    }

    // Draw particles on top of lines
    for (const p of this.particles) {
      p.draw(this.ctx);
    }

    this.animationId = requestAnimationFrame(this._animate);
  }
}
