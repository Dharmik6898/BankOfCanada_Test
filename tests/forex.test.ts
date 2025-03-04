import { test, expect } from '@playwright/test';
import { getForexRates, calculateAverageRate } from '../Utils/forexUtils';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_URL;
const EXCHANGE_CURRENCY = process.env.DEFAULT_CURRENCY || "FXCADUSD";
const RECENT_WEEKS = process.env.RECENT_WEEKS;

test.describe('Bank of Canada Test', () => {
    test('Calculate average forex rate for past 10 weeks', async ({ request }) => {
        const data = await getForexRates(request, BASE_URL!, EXCHANGE_CURRENCY, RECENT_WEEKS!);
        expect(data).toHaveProperty('observations');

        const avgRate = await calculateAverageRate(data.observations, EXCHANGE_CURRENCY)
        console.log(`Average CAD to USD rate: ${avgRate}`);
        expect(avgRate).toBeGreaterThan(0);
    });

})
