import { APIRequestContext } from '@playwright/test';


export async function getForexRates(request: APIRequestContext, baseurl: string, exchange_currency: string, weeks: string) {
    const response = await request.get(`${baseurl}/${exchange_currency}/json?recent_weeks=${weeks}`);
    if (!response.ok()) {
        throw new Error(`Failed to fetch data: ${response.status()}`);
    }
    return await response.json();
}

export function calculateAverageRate(observations: any[], exchange_currency: string) {
    const exchangeRates = observations.map(i => parseFloat(i[exchange_currency].v));
        let sum = 0;
        for (let j = 0; j < exchangeRates.length; j++) {
            sum += exchangeRates[j];
        }
        return sum / exchangeRates.length;
}