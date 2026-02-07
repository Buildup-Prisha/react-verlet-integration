import { useRef, useEffect, useState } from "react";

class Particle {
  constructor(x, y) {
    this.pos = { x, y };

    // small initial velocity
    this.prev = {
      x: x - (Math.random() * 4 - 2),
      y: y - (Math.random() * 4 - 2),
    };

    this.acc = { x: 0, y: 0 };
  }

  applyForce(x, y) {
    this.acc.x += x;
    this.acc.y += y;
  }

  update(dt) {
    let vx = this.pos.x - this.prev.x;
    let vy = this.pos.y - this.prev.y;

    // ⭐ air friction (prevents infinite motion)
    vx *= 0.999;
    vy *= 0.999;

    // ⭐ velocity clamp (prevents rocket launch)
    const maxSpeed = 35;
    vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
    vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy));

    this.prev.x = this.pos.x;
    this.prev.y = this.pos.y;

    this.pos.x += vx + this.acc.x * dt * dt;
    this.pos.y += vy + this.acc.y * dt * dt;

    this.acc.x = 0;
    this.acc.y = 0;
  }
}

function Simulation() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gravity, setGravity] = useState(0.35);

  const gravityRef = useRef(gravity);
  useEffect(() => {
    gravityRef.current = gravity;
  }, [gravity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const radius = 7;
    const diameter = radius * 2;

    // ⭐ Ideal particle count for collisions
    for (let i = 0; i < 40; i++) {
      particles.push(
        new Particle(
          Math.random() * canvas.width,
          Math.random() * (canvas.height / 2)
        )
      );
    }

    const dt = 1;

    const handleClick = (e) => {
      particles.push(new Particle(e.clientX, e.clientY));
    };

    canvas.addEventListener("click", handleClick);

    // ⭐ BALL COLLISION SOLVER
    function solveCollisions() {
      for (let k = 0; k < 3; k++) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];

            const dx = p2.pos.x - p1.pos.x;
            const dy = p2.pos.y - p1.pos.y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist === 0) continue;

            if (dist < diameter) {
              const overlap = diameter - dist;

              const nx = dx / dist;
              const ny = dy / dist;

              const push = overlap * 0.5;

              p1.pos.x -= nx * push;
              p1.pos.y -= ny * push;

              p2.pos.x += nx * push;
              p2.pos.y += ny * push;

              // damping removes jitter
              const damping = 0.98;

              p1.prev.x =
                p1.pos.x + (p1.prev.x - p1.pos.x) * damping;
              p1.prev.y =
                p1.pos.y + (p1.prev.y - p1.pos.y) * damping;

              p2.prev.x =
                p2.pos.x + (p2.prev.x - p2.pos.x) * damping;
              p2.prev.y =
                p2.pos.y + (p2.prev.y - p2.pos.y) * damping;
            }
          }
        }
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply physics
      particles.forEach((p) => {
        p.applyForce(0, gravityRef.current);
        p.update(dt);
      });

      // Solve collisions
      solveCollisions();

      // Boundaries + render
      particles.forEach((p) => {
        let vx = p.pos.x - p.prev.x;
        let vy = p.pos.y - p.prev.y;

        // FLOOR
        if (p.pos.y > canvas.height - radius) {
          p.pos.y = canvas.height - radius;

          p.prev.y = p.pos.y - vy * -0.6;
          p.prev.x = p.pos.x - vx * 0.85;

          // stop micro bouncing
          if (Math.abs(vy) < 0.1 && gravityRef.current < 0.05) {
            p.prev.y = p.pos.y;
          }
        }

        // WALLS
        if (p.pos.x > canvas.width - radius) {
          p.pos.x = canvas.width - radius;
          p.prev.x = p.pos.x - vx * -0.7;
        }

        if (p.pos.x < radius) {
          p.pos.x = radius;
          p.prev.x = p.pos.x - vx * -0.7;
        }

        const speed = Math.sqrt(vx * vx + vy * vy);

        ctx.fillStyle = `hsl(200, 100%, ${55 + speed * 4}%)`;

        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div style={{ margin: 0, overflow: "hidden" }}>
      <h2
        style={{
          position: "absolute",
          color: "white",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "sans-serif",
          letterSpacing: "2px",
          top: "10px",
          zIndex: 10,
        }}
      >
        Interactive Verlet Gravity Simulation
      </h2>

      <div
        style={{
          position: "absolute",
          top: "55px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontFamily: "sans-serif",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        Gravity: {gravity.toFixed(2)}
        <br />
        <input
          type="range"
          min="0"
          max="1.2"
          step="0.05"
          value={gravity}
          onChange={(e) => setGravity(Number(e.target.value))}
          style={{ width: "260px" }}
        />
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}

export default Simulation;
