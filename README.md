# Seesaw Simulation

An interactive seesaw simulation. Users can click directly on the plank to drop objects with different weights and see in real time how the seesaw tilts based on the torque balance. The app is built entirely with **HTML, CSS and vanilla JavaScript**, and the state is persisted with **LocalStorage** so the progression is not lost on page refresh.

---

## Thought Process & Design Decisions

The main goal of this project was to build a simple but readable simulation where users can **intuitively feel torque balance** on a seesaw. While designing it, I focused on:

- **Simplified physics model**
  - I use the classical formula for each object:  
    `torque = weight × distanceFromPivot`
  - I sum torques on the left and right sides separately, then derive the angle from the net torque:  
    `angle = clamp( (rightTorque - leftTorque) / 10, -30°, 30° )`

- **Single state object and single render pipeline**
  - I keep all data in a single `state` object (`objects`, `angle`, `nextWeight`).
  - I update the UI through a `render()` function, which calls:
    - Physics calculation (`calculatePhysics`)
    - Weight rendering (`renderWeights`)
    - Log rendering (`renderLogs`)
    - Info panel updates (`updateInfo`)
  - This way, click, reset and LocalStorage restore all go through the **same render path**, which reduces inconsistency and makes the logic easier to follow.

- **Clean and focused DOM structure**
  - Single-page HTML: `index.html`
  - All styling lives in `styles.css`, and all JS in `app.js`.
  - Bonus features like the hover preview and distance line are treated as a visual layer, separate from the core physics logic.

---

## Trade-offs & Limitations

- **Pixel-based distance measurement**
  - Distances are measured purely in **pixels** (e.g. 100px = 100 pixels to the right of the pivot).

- **`offsetX` and 1px differences near the edges**
  - Objects are placed using `event.offsetX`.
  - On some browser/zoom combinations, the mouse pointer “hotspot” can cause 1px rounding differences at the very edges (for example seeing 199px instead of a visually expected 200px).
  - Since these tiny differences don’t affect the overall behavior of the simulation in a meaningful way, I kept this as a conscious simplification.

---

## AI Assistance

I used AI tools strictly as **assistants**, and wrote the main application code myself.

- I used AI to improve the **clarity, flow and wording** of the README.
- I discussed some parts (especially:
  - small refactor ideas and “best practice” trade-offs
    ) to see alternative designs and pick cleaner solutions.
- For minor debugging (for example the preview element being removed from the DOM, or regenerating the log list from state etc.) I asked for suggestions, but I integrated any changes myself after understanding them.

In short: **the core algorithms, physics logic, DOM interactions and overall structure were implemented by me**; AI only helped with polishing, simplification and documentation.

---

## Live Version

- **GitHub Pages (Live Demo)**  
  [Click here to see the live version](https://irfansubasi.github.io/Seesaw-Simulation-Irfan-Subasi/)

---

## Tech Stack

- **HTML5**
- **CSS3**
- **Vanilla JavaScript**

---

## Features

- **Real-time torque calculation**
  - For each object, torque is computed as `weight × distance`, and torques are summed separately for the left and right.
  - The tilt angle is clamped between ±30° based on the net torque.

- **Interactive object placement**
  - The user can click anywhere on the plank to drop a weight at that position.
  - While hovering, a preview shows where the next weight will land and a line/label displays the distance from the pivot in pixels.

- **Persistent state**
  - All placed objects, the current angle and the next weight are written to LocalStorage.
  - After a page refresh, the previous configuration is restored.

- **Event log system**
  - Each new object is added to a log panel with “how many kg, which side, and how many px from the pivot”.
  - The log is regenerated from state, so it always stays in sync with LocalStorage.

- **Smooth animations**
  - When a new object is added, it appears with a short “drop” animation onto the plank.
  - The plank rotates smoothly towards the new equilibrium angle thanks to a CSS transition.

---

## Torque & Tilt Logic

The physics model used in the simulation can be summarized as:

- For each object:
  - `distance` = signed horizontal distance from the pivot (in pixels)
  - `torque` = `|distance| × weight`
- Torques for each side are summed separately:
  - Left side: items with `distance < 0`
  - Right side: items with `distance > 0`
- Net torque:
  - `netTorque = rightTorque - leftTorque`
- Tilt angle:
  - `angle = clamp(netTorque / 10, -30, 30)`
  - This angle is applied directly to the `.plank` element via `transform: rotate(angle)`.

---

## Installation & Usage

To run the project locally:

```bash
# Clone the repository
git clone https://github.com/irfansubasi/Seesaw-Simulation-Irfan-Subasi.git
cd Seesaw-Simulation-Irfan-Subasi

# Open the project in your browser
# (Windows)
start index.html
# (macOS)
open index.html
# (Linux)
xdg-open index.html
```

There is no build step; it runs directly in the browser.

---

## Project Structure

```text
Seesaw-Simulation-Irfan-Subasi/
├── index.html    # Main HTML skeleton
├── styles.css    # All styles and animations
└── app.js        # Physics logic, state management, event handlers and render functions
```
