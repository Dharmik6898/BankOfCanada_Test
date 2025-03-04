import { test, expect } from '@playwright/test';
import { getForexRates, calculateAverageRate } from '../Utils/forexUtils';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_URL;
const EXCHANGE_CURRENCY = process.env.DEFAULT_CURRENCY || "FXCADUSD";
const RECENT_WEEKS = process.env.RECENT_WEEKS || "10";

test.describe('Bank of Canada Test', () => {

    test('Calculate average forex rate for past 10 weeks', async ({ request }) => {
        const data = await getForexRates(request, BASE_URL!, EXCHANGE_CURRENCY, RECENT_WEEKS);
        expect(data).toHaveProperty('observations');

        const avgRate = await calculateAverageRate(data.observations, EXCHANGE_CURRENCY)
        console.log(`Average CAD to USD rate: ${avgRate}`);
        expect(avgRate).toBeGreaterThan(0);
    });

    test('Validate invalid currency code', async ({ request }) => {
        const response = await getForexRates(request, BASE_URL!, "Invalid", RECENT_WEEKS);
        expect(response).toBe(404);
    });

    test('Validate response structure', async ({ request }) => {
        const data = await getForexRates(request, BASE_URL!, EXCHANGE_CURRENCY, RECENT_WEEKS);
        expect(data).toHaveProperty('seriesDetail');
        expect(data).toHaveProperty('observations');
        expect(Array.isArray(data.observations)).toBeTruthy();
    });

    test('Validate Forex rate for different currency pairs', async ({ request }) => {
        const Currencies = ['FXCADUSD', 'FXUSDCAD', 'FXEURCAD', 'FXAUDCAD'];
        for (const exchange_currency of Currencies) {
            const data = await getForexRates(request, BASE_URL!, exchange_currency, RECENT_WEEKS);
            const avgRate = calculateAverageRate(data.observations, exchange_currency);
            console.log(`Average rate for ${exchange_currency}: ${avgRate}`);
            expect(avgRate).toBeGreaterThan(0);
        }
    });

    test('Validate null recent weeks parameter', async ({ request }) => {
        const response = await getForexRates(request, BASE_URL!, EXCHANGE_CURRENCY, "null");
        expect(response).toBe(400);
    });

    test('Validate negative recent weeks value', async ({ request }) => {
        const response = await getForexRates(request, BASE_URL!, EXCHANGE_CURRENCY, "-5");
        expect(response).toBe(400);
    });

    //BUG: This large number of weeks return an empty array.
    test('Validate large number recent weeks value', async ({ request }) => {
        const data = await getForexRates(request, BASE_URL!, EXCHANGE_CURRENCY, "10000000000000000");
        expect(data.observations).toHaveLength(0);
    });

    //Performance Test

    test('Validate API response time is within 1 seconds', async ({ request }) => {
        const startTime = Date.now();
        const data = await getForexRates(request, BASE_URL!, EXCHANGE_CURRENCY, RECENT_WEEKS);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        console.log(`Response Time: ${responseTime} ms`);
        expect(responseTime).toBeLessThan(1000); // 2 seconds
    });

    //If we have set a limit for number of calls in short time, this test would fail.
    test('Check if API calls has rate limiting', async ({ request }) => {
        const maxRequests = 50;
        let LimitExceeded = false;
        for (let i = 0; i < maxRequests; i++) {
            const response = await request.get(`${BASE_URL}/${EXCHANGE_CURRENCY}/json?recent_weeks=${RECENT_WEEKS}`);
            // 429 Too Many Requests
            if (response.status() === 429) {
                LimitExceeded = true;
                break;
            }
        }
        expect(LimitExceeded).toBe(false); 
    });

})
