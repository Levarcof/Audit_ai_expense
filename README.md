# AI Spend Audit

AI Spend Audit is a full-stack SaaS-style platform that helps startups and engineering teams analyze their AI tooling costs, detect overspending, and receive actionable optimization recommendations instantly.

The platform evaluates AI subscriptions like ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, OpenAI API, and Anthropic API, then generates detailed savings recommendations along with an AI-powered executive summary.

---

# Live Demo

[https://your-vercel-url.vercel.app](https://audit-ai-expense.vercel.app/)

---

# Features

* AI spend audit engine
* Per-tool optimization recommendations
* Savings calculations
* AI-generated executive summary
* Shareable public reports
* Lead capture system
* MongoDB backend
* Responsive UI
* Interactive savings charts
* Spam protection
* API fallback handling

---

# Tech Stack

| Layer        | Technology         |
| ------------ | ------------------ |
| Frontend     | Next.js App Router |
| Styling      | Tailwind CSS       |
| Animation    | Framer Motion      |
| Charts       | Recharts           |
| Database     | MongoDB            |
| ODM          | Mongoose           |
| AI Providers | Groq + OpenRouter  |
| Email        | Resend             |
| Deployment   | Vercel             |

---

# Quick Start

## Clone Repository

```bash
git clone https://github.com/Levarcof/Audit_ai_expense
```

## Install Dependencies

```bash
npm install
```

## Setup Environment Variables

Create `.env.local`

```env
MONGODB_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
RESEND_API_KEY=your_resend_api_key
```

## Run Locally

```bash
npm run dev
```

---

# Decisions

## 1. Deterministic Audit Logic Instead of Pure AI

The audit calculations use hardcoded business rules because financial recommendations should remain explainable and reliable.

## 2. MongoDB Instead of SQL

MongoDB allowed rapid iteration and flexible document storage for audit reports.

## 3. Next.js App Router

App Router simplified API handling, SSR, and deployment.

## 4. AI Used Only for Summary Generation

AI is used only for personalized summaries while the core financial logic remains deterministic.

## 5. Shareable Public URLs

Public reports increase virality and improve the product’s distribution loop.

---

# Deployment

The project is deployed using Vercel.

---