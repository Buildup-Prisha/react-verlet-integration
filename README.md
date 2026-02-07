# Interactive Verlet Gravity Simulation

##  Project Overview

The **Interactive Verlet Gravity Simulation** is a real-time physics-based web application that demonstrates particle motion using the **Verlet Integration algorithm**. The simulation models realistic gravity, collision detection, stacking behavior, and energy damping to create a stable and visually engaging particle system.

This project highlights strong problem-solving skills, mathematical modeling, and an understanding of physics-based animation in modern web development.
---

## Live Demo
https://Buildup-Prisha.github.io/react-verlet-integration/

---


##  Key Features

* Real-time particle physics simulation
* Verlet integration for stable motion
* Ball-to-ball collision detection
* Natural stacking and pressure behavior
* Gravity control using an interactive slider
* Velocity damping to prevent energy explosion
* Boundary constraints (floor and walls)
* Click anywhere to spawn new particles
* Smooth rendering using HTML5 Canvas

---

##  Technical Concept

This project implements a **constraint-based physics solver**, a technique commonly used in modern physics engines and game development.

Instead of storing velocity directly, Verlet integration calculates motion using the difference between current and previous positions. This approach improves numerical stability and produces more natural movement.

Multiple solver iterations are applied per frame to resolve particle overlaps, allowing realistic stacking and collision response.

---

##  Tech Stack

* **React.js** – Component-based UI
* **JavaScript (ES6)** – Core logic
* **HTML5 Canvas** – Rendering and animation
* **CSS** – Layout and styling
* **Physics Algorithms** – Verlet integration and constraint solving

---

##  Learning Outcomes

Through this project, I gained practical experience in:

* Numerical simulation techniques
* Physics-based animation
* Collision detection algorithms
* Constraint solving
* Performance-aware rendering
* Managing animation loops in React
* Building interactive UI controls

---

##  How to Run Locally
Clone the repository.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application will run on:

```
http://localhost:3000
```

---

##  Future Improvements

* Mouse drag interaction to throw particles
* Obstacles and dynamic surfaces
* Liquid-style particle behavior
* Slow-motion mode
* Mobile responsiveness
* Adjustable particle size

---

##  Author

**Prisha Rai**

