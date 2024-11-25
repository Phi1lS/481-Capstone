import 'dotenv/config';
import fs from 'fs/promises';
import { restClient } from '@polygon.io/client-js';

const rest = restClient(process.env.POLY_API_KEY);
// console.log("API KEY: "+process.env.POLY_API_KEY);

main();

// the way the app is set up, we should probably track the MONTHS iteration on such day.
// The graph indicates that it iterates months.
// now that I have the data, I can now apply it to the graph of market predictions which iterates by months.
// Nov, Oct, Sep, Aug, Jul

// TODO need function to dynamically update Market symbol / if the user wants to check a different market.
// Right now, the only market it checks is options ('O:SPY251219C00650000').

// TODO FIX DELAYED JSON READING. currently does not dynamically update whenever the json is cleared and a new set is called. 
// it uses data from the previous run.


function getPreviousWeekday(date) { // This function returns the previous available weekday (Market open)
    const adjustedDate = new Date(date);
    const dayOfWeek = adjustedDate.getDay();

	console.log('Current Date:', adjustedDate.toISOString().split('T')[0]);

	if (dayOfWeek === 5) { // saturday, return to the prev open day (friday)
		adjustedDate.setDate(adjustedDate.getDate() - 1);
    }  else if (dayOfWeek === 6) { // sunday, return to the prev open day (friday)
        adjustedDate.setDate(adjustedDate.getDate() - 2);
    } else if (dayOfWeek === 0) { // monday, return to the prev open day (friday)
        adjustedDate.setDate(adjustedDate.getDate() - 3);
    }

    return adjustedDate;
}

function getDynamicDates(date) {
    return date.toISOString().split('T')[0]; // format the date as "YYYY-MM-DD"
}

function fetchPrevMonthsOpenClose(symbol, months) {
    const today = new Date(); // Get the current date
    const results = []; // Array to store results in JSON

    for (let i = 0; i < months; i++) {
        let targetDate = new Date(today);
        targetDate.setMonth(targetDate.getMonth() - i); // Subtract months from the current date

        // Handle cases where the day exceeds the last day of the target month
        if (targetDate.getDate() !== today.getDate()) {
            targetDate.setDate(0); // Set to the last day of the previous month
        }

        targetDate = getPreviousWeekday(targetDate); // Adjust to the previous weekday if needed

        const dynamicDate = getDynamicDates(targetDate);
        console.log(`Fetching data for: ${dynamicDate}`);

        const data = rest.options.dailyOpenClose(symbol, dynamicDate).then((data) => {
            console.log(data);
            results.push(data); // Save data to JSON

            if (results.length === months) {
                saveDataToFile(results);
            }
        }).catch(e => {
            console.error('An error happened:', e);
        });
    }
}

function saveDataToFile(data) {
    const filePath = './backend/open_close_data.json';
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log(`Data saved to ${filePath}`);
        }
    });
}

async function extractOpenClose() {
	const filePath = './backend/open_close_data.json';
  
	try {
	  const fileContent = await fs.readFile(filePath, 'utf8');
	  const dataArray = JSON.parse(fileContent); // Parse JSON into an array
  
	  // Initialize an array to store date, open, and close values
	  const openCloseData = [];
  
	  // Extract date, open, and close values
	  dataArray.forEach((data) => {
		if (data.from && data.open !== undefined && data.close !== undefined) {
		  openCloseData.push({
			date: data.from, // Store the date
			open: data.open, // Store the open value
			close: data.close // Store the close value
		  });
		}
	  });
  
	  // Log the array or use it as needed
	  console.log('Open-Close Data:', openCloseData);
	  determineMarketTrend(openCloseData);
  
	  // You can now use openCloseData for further processing
	  return openCloseData;
	} catch (err) {
	  console.error('Error reading or processing file:', err);
	}
  }

  function determineMarketTrend(openCloseData) {

		// Sort the array by date in ascending order
	openCloseData.sort((a, b) => {
		// Compare the date strings directly
		return new Date(a.date) - new Date(b.date);
	});

	console.log('Sorted Open-Close Data:', openCloseData);

    if (!openCloseData || openCloseData.length === 0) {
        console.log("No data available to determine market trend.");
        return null;
    }

    // Extract the first open and last close values
    const firstOpen = openCloseData[0].open;
    const lastClose = openCloseData[openCloseData.length - 1].close;

    // Calculate the net change
    const netChange = lastClose - firstOpen;

    if (netChange > 0) {
        console.log("The market is net increasing.");
    } else if (netChange < 0) {
        console.log("The market is net decreasing.");
    } else {
        console.log("The market is stable (no net change).");
    }

    // return result
    return {
        firstOpen,
        lastClose,
        netChange,
        trend: netChange > 0 ? "increasing" : netChange < 0 ? "decreasing" : "stable"
    };
}


function main() {

  // Call the function

  fetchPrevMonthsOpenClose('O:SPY251219C00650000', 5); // Fetch data for the past 5 months
  extractOpenClose();

}

