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


## AI Assistance

Claude Code is used throughout this project to assist with documentation, project setup, and development tasks.

## Author

**Nsikak Itama**