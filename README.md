# Taller Project Playwright Tests

This repository contains Playwright end-to-end test automation for both the AutomationExercise product page and the SauceDemo login UI, with a focus on security, validation, and user-flow coverage.

## What is included

- `package.json` with Playwright dependencies and test scripts
- `playwright.config.js` configured for Chromium
- `tests/product-security.spec.js` with security-focused checks for product pages
- `tests/login-ui.spec.js` covering SauceDemo login scenarios such as happy path, validation, locked-out users, and invalid credentials
- `tests/page-objects/product-pages.js` and `tests/page-objects/login-page.js` implementing a simple Page Object Model
- `docs/test-coverage-product-page.md` and `docs/test-coverage-login-ui.md` defining the covered scenarios

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps
   ```

## Run tests

- Run all tests:
  ```bash
  npm test
  ```
- Run the SauceDemo login suite only:
  ```bash
  npx playwright test tests/login-ui.spec.js
  ```
- Run headed tests:
  ```bash
  npm run test:headed
  ```
- Open HTML report after a run:
  ```bash
  npx playwright show-report
  ```

## Skills

This project includes two reusable automation skills:

- `.claude/skills/automated-tests` for generating and maintaining Playwright tests from the scenario documents.
- `.claude/skills/test-coverage` for reviewing and expanding test coverage based on the markdown definitions in `docs/`.

Use these skills to guide new test implementation, keep scenarios aligned with the docs, and verify the behavior by running the relevant Playwright spec.

## Run skills with prompts

You can trigger the available skills from the prompt command by naming the skill and passing arguments when needed.

Example:
```text
/automated-tests "login UI"
/test-coverage "product page"
```

Arguments are passed as free-form text after the skill name, so you can provide scenario names, page names, or other context to guide the automation.

## Notes

- The project is configured with a default base URL for AutomationExercise, while the SauceDemo login tests navigate directly to `https://www.saucedemo.com/`
- Current coverage includes security-related product page behavior, plus SauceDemo login validation and error handling
- Add more scenarios by extending `tests/` and the relevant documentation files in `docs/`
