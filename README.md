<div align="center">

# SolveSpace

### Design and Development of an Adaptive Multi-Model Interactive Console

*One console that builds itself around any problem.*

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/Status-Academic_Project-blue)

[Live Demo](#) · [Report a Bug](../../issues) · [Request a Feature](../../issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Adaptive Engine](#adaptive-engine)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Future Scope](#future-scope)
- [Contributing](#contributing)

---

## Overview

**SolveSpace** is a web-based adaptive console for managing goals and problems such as exam preparation, budgeting, fitness, job hunting and team projects. Instead of juggling many disconnected apps, the user describes a problem and SolveSpace assembles a workspace from reusable modules. A rule-based adaptive engine then monitors progress and changes the layout, warnings and suggestions automatically.

The name of the project maps directly to its design:

| Term | Meaning in SolveSpace |
|---|---|
| **Console** | A single control dashboard for everything |
| **Multi-Model** | Multiple data modules (tasks, logs, habits, mood, timer) working together |
| **Interactive** | Widgets the user can add, remove, reorder and control |
| **Adaptive** | The interface changes with the user's situation and progress |

## Problem Statement

People manage their studies, money, health and projects across many separate apps. These apps do not talk to each other and do not react when circumstances change. A student in exam week sees the same screen as in a relaxed week, and poor sleep never connects to falling productivity.

SolveSpace addresses this with one console that understands the user's situation and adapts to it.

## Key Features

- **Problem templates:** Exam Preparation, Budget Control, Fitness Goal, Job/Internship Search, Team Project, Daily Routine.
- **Custom workspace builder:** Add, remove, rename and drag-reorder modules to build a workspace for any problem. Create multiple workspaces and switch between them.
- **Reusable modules:** Goal Tracker, Task Planner, Habit Tracker with streaks, Number Logger with charts, Focus Timer (Pomodoro), Mood and Energy Check-in, Notes, Progress Chart.
- **Adaptive engine:** Automatically switches modes and rearranges the dashboard (see below).
- **Explainable decisions:** A "Why am I seeing this?" button shows the rule and data behind every adaptive change.
- **Progress Score (0-100):** Combines task completion, time remaining, streak consistency and mood, with a score breakdown.
- **Smart suggestions:** A "Next best actions" card with rule-based recommendations.
- **What-If Simulator:** Estimate how skipping days or adding study hours changes the finish date and score.
- **Cross-workspace insights:** Patterns such as productivity versus mood.
- **Demo Scenario Switcher:** One-click scenarios for live presentations.
- **Extras:** Dark/light mode, large-text option, keyboard shortcuts, printable weekly report, XP and achievement badges.

## How It Works

```
1. Pick a problem        ->  Choose a template or start a custom workspace
2. Workspace is built    ->  Goal, planner, timer, logger and charts are assembled
3. Engine adapts         ->  Layout, warnings and suggestions change with progress
```

## Adaptive Engine

The engine evaluates each workspace and assigns one of the following modes:

| Mode | Trigger | Dashboard Behavior |
|---|---|---|
| **On Track** | Progress matches the plan | Normal layout |
| **Behind Schedule** | Overdue tasks or low completion rate | Overdue tasks and catch-up plan move to the top, warning banner shown |
| **Crunch Mode** | Deadline within 7 days | Timer and planner enlarged, other widgets minimized |
| **Recovery Mode** | Low mood or energy for 3 days | Lighter tasks, break suggestions, calm theme |
| **Ahead of Plan** | Progress exceeds the plan | Suggests raising the target |

Every transition is explained to the user, for example: *"Exam in 4 days and only 2 hours studied this week, so Crunch Mode is active."*

## Screenshots

> Add your screenshots to a `docs/screenshots/` folder and update the paths below.

| Dashboard | Crunch Mode |
|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Crunch Mode](docs/screenshots/crunch-mode.png) |

| What-If Simulator | Demo Scenario Switcher |
|---|---|
| ![What-If](docs/screenshots/what-if.png) | ![Demo Mode](docs/screenshots/demo-mode.png) |

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React, TypeScript, Tailwind CSS |
| Charts | Recharts |
| Icons | lucide-react |
| Logic | Custom rule-based adaptive engine |
| Storage | Browser `localStorage` (no backend required) |

## Project Structure

> Adjust to match your generated code.

```
solvespace/
├── src/
│   ├── components/      # Reusable modules and UI components
│   ├── engine/          # Adaptive engine rules, score and what-if logic
│   ├── pages/           # Home, Dashboard, Builder, Insights, Simulator, Settings, About
│   ├── data/            # Templates and demo scenarios
│   └── App.tsx
├── docs/
│   └── screenshots/
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm (included with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/solvespace.git

# Move into the project folder
cd solvespace

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview
```

## Usage

1. Open the app and choose a template, or select **Custom workspace**.
2. Set your goal, deadline and target.
3. Add tasks, log progress and run focus sessions.
4. Watch the dashboard adapt as your situation changes.
5. Use the **What-If Simulator** to plan ahead.
6. For presentations, press `D` to open **Demo Mode** and trigger a scenario.

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `N` | New task |
| `/` | Search |
| `D` | Toggle Demo Mode |

## Future Scope

- AI-based problem analysis: type a sentence and get a ready-made workspace
- Progressive Web App with push reminders
- Cloud sync and user authentication
- Shared workspaces for teams and families
- Community-made template library
- Calendar and wearable integration
- Mentor or counsellor view

## Contributing

Contributions, issues and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

<div align="center">

If you find this project useful, please consider giving it a star.

</div>
