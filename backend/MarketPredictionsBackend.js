import 'dotenv/config';
import fs from 'fs/promises';
import { restClient } from '@polygon.io/client-js';
import express from 'express'; // Use import instead of require
import cors from 'cors';

const rest = restClient(process.env.POLY_API_KEY);
const app = express();
const port = 3000;

let openCloseData = [];
console.log("API KEY: "+process.env.POLY_API_KEY);

    {/* Middleware setup */}
    app.use(cors({
        origin: [
            'exp://10.0.0.176:8081',
            'http://localhost:8081', 
            'http://localhost:3000',
            'http://10.0.0.176:8081'
        ]  // Add other origins as needed
      }));
    app.use(express.json());


    {/* Requests */}
    app.post('/send-market-symbol', async (req, res) => {
        console.log('Request received:', req.body);
        
        const { marketSymbol } = req.body;
        if (marketSymbol) {
            console.log(`Market Symbol received: ${marketSymbol}`);
    
            try {
                await fetchPrevMonthsOpenClose(marketSymbol, 5); // first fetch data
                await extractOpenClose(); // then extract data
                
                res.status(200).send({ message: 'Market symbol received and data processed successfully.' });
            } catch (error) {
                console.error('Error processing data:', error);
    
                // Handling different types of errors and sending appropriate response
                if (error.message === 'Too many requests') {
                    res.status(429).send({ message: 'Too many requests. Please try again later.' });
                } else if (error.message === 'Invalid market symbol') {
                    res.status(404).send({ message: `Market symbol not found.` });
                } else if (error.message === 'Data not found') {
                    res.status(404).send({ message: `No data found for the symbol.` });
                } else {
                    res.status(500).send({ message: 'An error occurred while processing the data' });
                }
            }
        } else {
            console.log('Market symbol is missing');
            res.status(400).send({ message: 'Market symbol is required' });
        }
    });    

    app.get('/data-algorithms', async (req, res) => {
        try {
            const data = await extractOpenClose();
    
            if (data.error) {
                return res.status(500).json({ error: data.error });
            }
    
            res.json(data); // Send all variables as a structured response
        } catch (err) {
            res.status(500).json({ error: 'Internal server error.' });
        }
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });


    {/* Operations */}
    function getPreviousWeekday(date) {
        const adjustedDate = new Date(date);
        let dayOfWeek = adjustedDate.getDay();

        console.log('Starting Date:', adjustedDate.toISOString().split('T')[0]);

        // if today, move one day back (completed market)
        const isToday = adjustedDate.toDateString() === new Date().toDateString();
        if (isToday) {
            adjustedDate.setDate(adjustedDate.getDate() - 2); // move back one day
            dayOfWeek = adjustedDate.getDay(); 
            console.log('prev date:', adjustedDate.toISOString().split('T')[0]);
        }

        // handle weekend (Friday: 5, Saturday: 6, Sunday: 0) and adjust accordingly
        while (dayOfWeek === 5 || dayOfWeek === 0 || dayOfWeek === 6) {
            adjustedDate.setDate(adjustedDate.getDate() - 1); // move back until it's a weekday
            dayOfWeek = adjustedDate.getDay();
        }

        console.log('Final Adjusted Date:', adjustedDate.toISOString().split('T')[0]);
        return adjustedDate;
    }

    function getDynamicDates(date) {
        return date.toISOString().split('T')[0];
    }

    async function fetchPrevMonthsOpenClose(symbol, months) {
        const today = new Date();
        const results = []; // Array to store results in JSON format
    
        for (let i = 0; i < months; i++) {
            let targetDate = new Date(today);
            targetDate.setMonth(targetDate.getMonth() - i); // Subtract months
    
            // Adjust if the targetDate exceeds the last day of the previous month
            if (targetDate.getDate() !== today.getDate()) {
                targetDate.setDate(0);
            }
    
            targetDate = getPreviousWeekday(targetDate);
    
            const dynamicDate = getDynamicDates(targetDate);
            console.log(`Fetching data for: ${dynamicDate} \n`);
    
            try {
                const data = await rest.stocks.dailyOpenClose(symbol, dynamicDate);
    
                // Handle specific error statuses from the API
                if (data.status === 'ERROR') {
                    console.error(`Too many requests. Retry later for: ${dynamicDate}`);
                    continue; // Skip to the next date
                } else if (data.status === 'NOT_FOUND') {
                    console.error(`Invalid market symbol for: ${symbol}`);
                    throw new Error('Invalid market symbol'); // Stop further processing
                } else if (data.status === 'DATA_NOT_FOUND') {
                    console.warn(`No data found for: ${dynamicDate}`);
                    continue; // Skip to the next date
                }
    
                // Validate and log the fetched data
                if (!data.close || isNaN(data.close)) {
                    console.warn(`Invalid or incomplete data for: ${dynamicDate}`);
                    continue;
                }
    
                console.log(`Data fetched for ${dynamicDate}:`, data);
                results.push(data);
    
                // Save data if we have fetched the required number of months
                if (results.length === months) {
                    await saveDataToFile(results);
                    console.log('Data saved successfully.');
                    break;
                }
            } catch (e) {
                console.error(`Error fetching data for ${dynamicDate}:`, e.message);
            }
        }
    
        if (results.length < months) {
            console.warn(`Could not fetch all data. Fetched ${results.length}/${months} entries.`);
        }
    
        return results;
    }
    

    async function saveDataToFile(data) {
        const filePath = './backend/open_close_data.json';
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2)); // await for async write operation
            console.log(`Data saved to ${filePath}`);
        } catch (err) {
            console.error('Error writing to file:', err);
        }
    }

    async function extractOpenClose() {
        const inputFilePath = './backend/open_close_data.json';
        const outputFilePath = './backend/MarketData.json';
    
        try {
            const fileContent = await fs.readFile(inputFilePath, 'utf8');
            const dataArray = JSON.parse(fileContent);
    
            const openCloseData = [];
    
            // Extract file data
            dataArray.forEach((data) => {
                if (data.from && data.open !== undefined && data.close !== undefined) {
                    openCloseData.push({
                        symbol: data.symbol,
                        date: data.from,
                        open: data.open,
                        close: data.close
                    });
                }
            });
    
            openCloseData.sort((a, b) => new Date(a.date) - new Date(b.date));
            await fs.writeFile(outputFilePath, JSON.stringify(openCloseData, null, 2), 'utf8');
    
            const marketTrend = await determineMarketTrend(openCloseData);
            const { 
                monthlyPercentChanges, 
                standardDeviation, 
                riskLevel 
            } = await calculateMonthlyPercentChange(openCloseData);
    
            return {
                marketTrend,
                monthlyPercentChanges,
                standardDeviation,
                riskLevel
            };
        } catch (err) {
            console.error('Error reading or processing file:', err);
            return { error: 'Failed to process the data.' };
        }
    }


    { /* Algorithms */ }

    { /* DetermineMarketTrend uses linear regression to determine if 
         the market is increasing, decreasing, or stable. */ }
    async function determineMarketTrend(openCloseData) { 
        console.log('Sorted Open-Close Data:', openCloseData);
    
        if (!openCloseData || openCloseData.length === 0) {
            console.log("No data available to determine market trend.");
            return null;
        }
    
        const n = openCloseData.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
        openCloseData.forEach((data, index) => {
            const x = index;
            const y = data.close;
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        });
    
        const numerator = (n * sumXY) - (sumX * sumY);
        const denominator = (n * sumX2) - (sumX * sumX);
        const slope = numerator / denominator;
    
        let trend = 'Stable';
        if (slope > 0) {
            console.log("\nThe market is increasing.");
            trend = 'Increasing';
        } else if (slope < 0) {
            console.log("\nThe market is decreasing.");
            trend = 'Decreasing';
        } else {
            console.log("\nThe market is stable (no significant trend).");
        }
    
        const firstOpen = openCloseData[0].open;
        const lastClose = openCloseData[openCloseData.length - 1].close;
        const netChange = lastClose - firstOpen;
    
        return {
            firstOpen,
            lastClose,
            netChange,
            trend
        };
    }
    
    { /* calculateMonthlyPercentChange uses the close data between two months and determines
         their percent change. */ }
    async function calculateMonthlyPercentChange(openCloseData) {
        if (!openCloseData || openCloseData.length === 0) {
            console.log("No data available to calculate monthly percent change.");
            return null;
        }

        let monthlyPercentChanges = []; // array to store percent changes
        let percentChanges = []; // array to store only the percent change values for further analysis

        // loop sorted data and calculate percent change between each month's close 
        for (let i = 0; i < openCloseData.length - 1; i++) {
            const currentMonth = openCloseData[i];
            const nextMonth = openCloseData[i + 1];

            const currentClose = currentMonth.close;
            const nextClose = nextMonth.close;

            if (currentClose !== undefined && nextClose !== undefined) {
                const percentChange = ((nextClose - currentClose) / currentClose) * 100;
                percentChanges.push(percentChange);

                const formattedPercentChange = percentChange > 0 ? `+${percentChange.toFixed(2)}` : `${percentChange.toFixed(2)}`;
                monthlyPercentChanges.push({
                    from: currentMonth.date,
                    to: nextMonth.date,
                    percentChange: formattedPercentChange
                });
            }
        }

        if (percentChanges.length > 0) {
            console.log("\nMonthly Percent Changes:");
            monthlyPercentChanges.forEach(change => {
                console.log(`From ${change.from} to ${change.to}: ${change.percentChange}%`);
            });

            // call the functions for calculating standard deviation and risk level
            const standardDeviation = calculateStandardDeviation(percentChanges);
            const riskLevel = calculateRiskLevel(percentChanges, standardDeviation);

            console.log(`\nStandard Deviation (Volatility): ${standardDeviation.toFixed(2)}%`);
            console.log(`Risk Level: ${riskLevel}`);

            return {
                monthlyPercentChanges,
                standardDeviation,
                riskLevel
            };
        } else {
            console.log("No valid data to calculate monthly percent changes.");
            return null;
        }
    }

    { /* calculateStandardDeviation tells us the volatility of the market, (how spread the points are). 
         This shows the spread of data. */ } 
    function calculateStandardDeviation(percentChanges) {
        const n = percentChanges.length;
        const mean = percentChanges.reduce((sum, change) => sum + change, 0) / n;

        const variance = percentChanges.reduce((sum, change) => sum + Math.pow(change - mean, 2), 0) / n;
        return Math.sqrt(variance); // standard deviation (volatility)
    }

    { /* If the spread is too wide, it would be considered high risk (unstable investment). */ }
    function calculateRiskLevel(percentChanges, standardDeviation) {
        const mean = percentChanges.reduce((sum, change) => sum + change, 0) / percentChanges.length;

        // Risk level classification
        if (standardDeviation > 10 && mean < 0) {
            return 'High Risk';  // high volatility, negative average trend
        } else if (standardDeviation > 5 || Math.abs(mean) > 5) {
            return 'Moderate Risk';  // moderate or high volatility, or large percent changes
        } else if (mean > 0 && standardDeviation < 2) {
            return 'Low Risk';  // low volatility, positive average trend
        } else {
            return 'Moderate Risk';  // default
        }
    }

    export function getMonthlyCloseData() {
        const closeData = openCloseData.map((data) => data.close);
        return closeData;
    }