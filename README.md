# BankOfCanada API Automation Framework

## Overview
This is an API automation framework built using **Playwright** with **TypeScript** to test the Bank of Canada Valet API. It includes functional tests for fetching foreign exchange (Forex) rates and validates response integrity, error handling, and performance.

## Features
- Forex conversion rate, "CAD to USD," for the recent 10 weeks using observations by Series.
- Implements assertions for **positive and negative scenarios**.
- Includes tests for **API Performance** and **error handling**.
- Supports **reusability** for various currencies.
- Generates an **HTML report** for test execution results.

## Prerequisites
- **Node.js** 
- **npm** or **yarn**
- **Playwright** 

## Installation
1. Clone the repository:
   ```sh
   git clone <repo_url>
   cd <repo_folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Running Tests
Run all tests using:
```sh
npx playwright test
```

### Run tests with HTML Report
```sh
npx playwright test --reporter=html
```
This generates an **HTML report** in `playwright-report/`.



## Potential Enhancements
Given more time, I could:
- **Implement retry logic** for intermittent failures.
- Integrate with **CI/CD pipelines**.
- Implement Validation for other API Parameters.
- Add more advance test cases like validate the response date sorting, validate the response date format

## Author
[Dharmik Patel]

---


