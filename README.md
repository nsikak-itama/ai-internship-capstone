# AI Internship Capstone

This repository contains the initial setup for my AI Internship capstone project. It demonstrates a professional development environment using Git, GitHub, Node.js, and Claude Code while following Git best practices and Conventional Commits.

## Objectives

- Set up a professional development environment
- Practice Git and GitHub workflows
- Use AI-assisted development with Claude Code
- Maintain clear project documentation

## Tech Stack

- Node.js (LTS)
- Git
- GitHub
- GitHub CLI
- Claude Code

## Repository Structure

```
.
├── README.md
├── LICENSE
├── .gitignore
└── CLAUDE.md
```

## Prerequisites

Before working with this repository, ensure you have the following installed:

- Node.js (LTS)
- Git
- GitHub CLI
- Claude Code

## Getting Started

Clone the repository:

```bash
git clone https://github.com/nsikak-itama/ai-internship-capstone.git
```

Navigate into the project:

```bash
cd ai-internship-capstone
```

Verify your environment:

```bash
node -v
git --version
gh --version
```

## Deployment

The application is deployed using Vercel and is connected to the GitHub repository.

### Live Preview

https://ai-internship-capstone.vercel.app/

### Repository

https://github.com/nsikak-itama/ai-internship-capstone

### Deployment Workflow

The GitHub repository is connected to Vercel so that pushes to the repository can trigger new deployments automatically.

The deployed application includes the following routes:

- `/` — Home page
- `/settings` — Settings form
- `/health` — Health-check page with fetched data
- `/chat` — Streaming AI qualification chat with candidate scoring tool results
- `/buttons` — Week 6 Assignment 1 motion button demo with success and failure triggers

The application has been tested locally and in the Vercel deployment to verify that the routes load correctly and the layout is responsive across desktop and mobile viewport sizes.

## Assignment Submission

### Deliverables

- **Live Preview:** https://ai-internship-capstone.vercel.app/
- **GitHub Repository:** https://github.com/nsikak-itama/ai-internship-capstone

### Completed Requirements

- [x] Next.js application scaffolded
- [x] Routed placeholder pages created
- [x] Shared root layout and navigation implemented
- [x] Tailwind CSS configured
- [x] Health-check page placeholder created
- [x] Vercel deployment configured
- [x] Production build verified successfully
- [x] Responsive layout verified at mobile and desktop sizes
- [x] Environment files and secrets excluded from Git
- [x] Live preview URL available


## Tool Results UI
The `/chat` route includes a server-side scoreCandidate tool that evaluates how complete a candidate's qualification profile is.

## Tool contract

**Tool name:** `scoreCandidate`

**Input schema:**
```ts
{
  skills: string;
  experience: string;
  interests: string;
  goals: string;
}
```

The tool should only be called when the candidate has provided meaningful information for all four areas. The tool does not invent missing candidate information.

**Return shape:**
```ts
{
  score: number; // Integer from 0 to 100
  level: "strong" | "moderate" | "developing";
  strengths: string[];
  recommendation: string;
}
```

The score represents profile completeness:
- Skills provided: 25 points
- Experience provided: 25 points
- Interests provided: 25 points
- Goals provided: 25 points

The UI renders the tool lifecycle as distinct states:
- Input streaming: preparing the candidate score
- Input available: candidate information received
- Output available: qualification score card
- Output error: designed error message when the tool fails or returns an unexpected result

The successful output is rendered as a qualification score card rather than a raw JSON object. It displays the score, profile level, identified strengths, and recommendation.


## Week 6 Motion Button

The `/buttons` page demonstrates the Week 6 Assignment 1 button lifecycle:

`idle → loading → success/error → idle`

The button uses a 200ms `ease-out` transition to keep state changes responsive without feeling abrupt. Opacity and transform are used for the label and icon transitions so the animation avoids unnecessary layout reflow. A small active scale provides immediate press feedback.

The component also includes visible keyboard focus styles and respects `prefers-reduced-motion` by removing the animations while keeping the state changes and feedback accessible.

## Week 7: Sneaker 3D Configurator

### Overview
An interactive 3D sneaker configurator built with Next.js,
React Three Fiber, and Three.js. Users can inspect the sneaker
from different angles and customize its color.

The experience respects the user's reduced-motion preference
by showing a static sneaker preview when reduced motion is enabled.

### Performance Notes
- Original GLB model: 7,833,592 bytes (approximately 7.47 MiB).
- Optimized GLB model: 1,452,392 bytes (approximately 1.39 MiB).
- Model file size reduced by approximately 81.5% by resizing textures
  from 2048 × 2048 to 1024 × 1024.
- The 3D canvas is dynamically imported for the interactive experience.
- Network testing confirmed that the GLB model is not requested when
  the static preview is shown, and is requested in interactive mode.
- The production build completes successfully with `npm run build`.
- Replaced the 2.23 MB PNG fallback with an optimized WebP image,
  preserving its 1536 × 1024 dimensions and reducing image download size.
- Removed the original full-size GLB from the public assets directory;
  retained the optimized 1.39 MB model for the interactive experience.

### Future Improvement
Measure frame rate and loading time on lower-powered mobile devices,
then evaluate further texture compression and rendering optimizations.

## AI Assistance

Claude Code is used throughout this project to assist with documentation, project setup, and development tasks.

## Author

**Nsikak Itama**
