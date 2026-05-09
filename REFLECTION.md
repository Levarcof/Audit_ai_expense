# 1. The hardest bug I hit this week

The hardest bug I faced involved dynamic route handling in Next.js App Router. My `/api/results/[id]` route was consistently returning undefined for params even though the URL structure looked correct.

Initially, I assumed the issue was caused by MongoDB queries or malformed frontend requests. I tested the API manually using Postman and verified the database connection multiple times. Then I added extensive console logging to inspect the request object and route context.

Eventually, I realized the issue came from incorrectly destructuring the route parameters. I had written:

```js
export async function GET(req, { params })
```

but during some builds, the context object behaved inconsistently. I refactored the handler to safely access:

```js
const id = context?.params?.id
```

I also added validation and fallback handling to avoid crashes.

This debugging process taught me the importance of isolating assumptions and testing one layer at a time.

---

# 2. A decision I reversed mid-week

Initially, I planned to build the entire audit engine using AI-generated recommendations. My first idea was to send the user’s tools and spending data directly to an LLM and let it calculate optimization opportunities.

After experimenting with this approach, I realized it produced inconsistent financial recommendations. Sometimes the AI hallucinated pricing numbers or suggested unrealistic downgrades.

I reversed the decision and rebuilt the audit engine using deterministic business rules while keeping AI only for the personalized summary paragraph.

This made the platform:

* more reliable
* easier to debug
* financially defensible
* consistent across all audits

That change significantly improved both the product quality and the trustworthiness of the recommendations.

---

# 3. What I would build in week 2

If I had another week, I would focus on making the product feel production-ready.

The biggest additions would be:

* PDF export support
* Benchmark analytics
* OpenGraph image generation
* Multi-user collaboration
* Referral system
* AI spend forecasting
* Stripe billing integration
* Real SaaS onboarding flow

I would also improve the audit engine by introducing:

* usage-based API calculations
* cost-per-developer metrics
* industry benchmarking
* vendor lock-in analysis

From a technical perspective, I would add Redis caching, queue-based AI summary generation, and stronger analytics instrumentation.

---

# 4. How I used AI tools

I used ChatGPT heavily throughout the project for:

* debugging
* architecture brainstorming
* improving UI polish
* writing better API error handling
* generating documentation structure

However, I intentionally did not trust AI for:

* financial calculations
* pricing logic
* core audit recommendations

One specific example where AI was wrong involved React list keys. The AI-generated code used:

```js
key={`${rec.toolName}-${rec.currentPlan}`}
```

This caused duplicate key warnings when the same tool appeared multiple times.

I manually diagnosed the issue and fixed it by adding indexes and unique identifiers.

This project reinforced my belief that AI is excellent for acceleration but still requires strong human validation.

---

# 5. Self-rating

## Discipline — 8/10

I maintained consistent progress across multiple days and avoided last-minute cramming.

## Code Quality — 7/10

The codebase is modular and readable, although some parts could still benefit from stronger abstraction.

## Design Sense — 8/10

The UI feels modern, responsive, and product-focused.

## Problem Solving — 8/10

I debugged several difficult issues independently and improved the architecture iteratively.

## Entrepreneurial Thinking — 7/10

I focused not just on features but also on virality, lead generation, and business value.

---