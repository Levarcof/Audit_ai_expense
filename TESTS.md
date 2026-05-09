# Automated Tests

## 1. auditEngine.test.js

Tests monthly savings calculations.

## 2. chatgptDowngrade.test.js

Tests ChatGPT Enterprise → Team downgrade logic.

## 3. claudeOptimization.test.js

Tests Claude Team → Pro optimization.

## 4. githubCopilot.test.js

Tests GitHub Copilot Enterprise → Business logic.

## 5. annualSavings.test.js

Tests annual savings calculations.

---

# Run Tests

```bash
npm run test
```

---

# .github/workflows/ci.yml

```yml
name: CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: npm install

      - name: Run Lint
        run: npm run lint

      - name: Run Tests
        run: npm run test
```

---