import { test, expect } from '@playwright/test';

test.describe('Bank of Canada Test', () => {
    test('Calculate average forex rate for past 10 weeks', async ({ request }) => {
        const response = await request.get('https://www.bankofcanada.ca/valet/observations/FXCADUSD/json?recent_weeks=10');
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data).toHaveProperty('observations');

        const exchangeRates = data.observations.map(i => parseFloat(i["FXCADUSD"].v));
        let sum = 0;
        for (let j = 0; j < exchangeRates.length; j++) {
            sum += exchangeRates[j];
        }
        const avgRate = sum / exchangeRates.length;
        console.log(`Average CAD to USD rate: ${avgRate}`);
        expect(avgRate).toBeGreaterThan(0);
    });

})
