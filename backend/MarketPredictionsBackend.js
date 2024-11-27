import 'dotenv/config';
import fs from 'fs/promises';
import { restClient } from '@polygon.io/client-js';
import express from 'express'; // Use import instead of require
import cors from 'cors';

const rest = restClient(process.env.POLY_API_KEY);
const app = express();
const port = 3000;

let openCloseData = [];
// console.log("API KEY: "+process.env.POLY_API_KEY);

    {/* Middleware setup */}
    app.use(cors({
        origin: [
            'exp://192.168.1.236:8081',
            'http://localhost:8081', 
            'http://localhost:3000',
            'http://192.168.1.236:8081'
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
            
            res.status(200).send({ message: 'Market symbol received and data processed successfully' });
        } catch (error) {
            console.error('Error processing data:', error);
            res.status(500).send({ message: 'An error occurred while processing the data' });
        }
        
        } else {
        console.log('Market symbol is missing');
        res.status(400).send({ message: 'Market symbol is required' });
        }
    });

    app.get('/market-data', (req, res) => {
        const marketData = {
          netIncreasing: "The market is net increasing",
          monthlyPercentChanges: [
            { start: "2024-07-25", end: "2024-08-27", change: 3.33 },
            { start: "2024-08-27", end: "2024-09-26", change: 4.72 },
            { start: "2024-09-26", end: "2024-10-24", change: 4.47 },
            { start: "2024-10-24", end: "2024-11-26", change: -1.36 }
          ],
          standardDeviation: "2.45%",
          riskLevel: "Moderate Risk"
        };
        
        res.json(marketData);
      });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    { /* DEBUGGING / RUNTIME TESTING */ }
    main(); 


    {/* Operations */}
    function getPreviousWeekday(date) {
        const adjustedDate = new Date(date);
        let dayOfWeek = adjustedDate.getDay();

        console.log('Starting Date:', adjustedDate.toISOString().split('T')[0]);

        // if today, move one day back (completed market)
        const isToday = adjustedDate.toDateString() === new Date().toDateString();
        if (isToday) {
            adjustedDate.setDate(adjustedDate.getDate() - 1); // move back one day
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
        const results = []; // arr to store results in json

        for (let i = 0; i < months; i++) {
            let targetDate = new Date(today);
            targetDate.setMonth(targetDate.getMonth() - i); // subtract months

            // adjust if the targetDate exceeds the last day of the previous month
            if (targetDate.getDate() !== today.getDate()) {
                targetDate.setDate(0);
            }

            targetDate = getPreviousWeekday(targetDate);

            const dynamicDate = getDynamicDates(targetDate);
            console.log(`Fetching data for: ${dynamicDate} \n`);


            { /* This stuff still appears to be broken */ }
            try {
                // API call to fetch daily open and close data
                const data = await rest.stocks.dailyOpenClose(symbol, dynamicDate);

                if (data.status === 'ERROR') {
                    console.error(`Too many requests. Please try again later.`);
                    throw new Error('Too many requests');
                } else if (data.status === 'NOT_FOUND') {
                    console.error(`Market symbol "${symbol}" not found.`);
                    throw new Error('Invalid market symbol');
                }

                console.log(data); // log successful response
                results.push(data); // save data to results array

                if (results.length === months) {
                    await saveDataToFile(results); // save data to file after all months data is fetched
                }
            } catch (e) {
                if (e.message === 'Too many requests') {
                    console.error(
                        `Error: ${e.message}. The user is making requests too quickly.`
                    );
                } else if (e.message === 'Invalid market symbol') {
                    console.error(
                        `Error: ${e.message}. Please verify the input market symbol "${symbol}".`
                    );
                } else {
                    console.error(`An unexpected error occurred: ${e.message}`);
                }
            }
        }
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

            // extract file
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
            
            // write to MarketData.json
            await fs.writeFile(outputFilePath, JSON.stringify(openCloseData, null, 2), 'utf8');

            // debug
            console.log(`Processed data has been written to ${outputFilePath}`);

            determineMarketTrend(openCloseData);
            calculateMonthlyPercentChange(openCloseData);

            return openCloseData;
        } catch (err) {
            console.error('Error reading or processing file:', err);
        }
    }


    async function determineMarketTrend(openCloseData) { 

        console.log('Sorted Open-Close Data:', openCloseData);

        if (!openCloseData || openCloseData.length === 0) {
            console.log("No data available to determine market trend.");
            return null;
        }

        const firstOpen = openCloseData[0].open;
        const lastClose = openCloseData[openCloseData.length - 1].close;

        const netChange = lastClose - firstOpen;

        if (netChange > 0) {
            console.log("\nThe market is net increasing.");
        } else if (netChange < 0) {
            console.log("\nThe market is net decreasing.");
        } else {
            console.log("\nThe market is stable (no net change).");
        }

        return {
            firstOpen,
            lastClose,
            netChange,
            trend: netChange > 0 ? "increasing" : netChange < 0 ? "decreasing" : "stable"
        };
    }

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

    // Calculate standard deviation (volatility)
    function calculateStandardDeviation(percentChanges) {
        const n = percentChanges.length;
        const mean = percentChanges.reduce((sum, change) => sum + change, 0) / n;

        const variance = percentChanges.reduce((sum, change) => sum + Math.pow(change - mean, 2), 0) / n;
        return Math.sqrt(variance); // standard deviation (volatility)
    }

    // Calculate risk level based on standard deviation and average percent change
    function calculateRiskLevel(percentChanges, standardDeviation) {
        const mean = percentChanges.reduce((sum, change) => sum + change, 0) / percentChanges.length;

        // Risk level classification
        if (standardDeviation > 5 && mean < 0) {
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

    async function main() {

        // await fetchPrevMonthsOpenClose('NFLX', 5); // first fetch data in order
        // await extractOpenClose(); // then extract data
    }
