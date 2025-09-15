const fs = require('fs');
const path = require('path');

// Path to the input CSV file
const csvFilePath = './filtered_combined.csv';

// Path to the output CSV file for unique rows based on the "Name" column
const outputFilePath = './unique_name_bigbasket_products.csv';

// Function to filter out rows where "Name" appears more than once
function filterUniqueRows(csvData) {
    const rows = csvData.split('\n'); // Split CSV into rows
    const headers = rows[0]; // The first row (headers)
    const dataRows = rows.slice(1); // All rows except the header

    const nameCount = {}; // Object to store the count of each name
    const nameRows = {}; // Object to store the row corresponding to each name

    // Count occurrences of each name
    dataRows.forEach((row) => {
        const columns = row.split(','); // Split the row into columns
        const name = columns[0].trim(); // Assuming "Name" is the first column (A)

        if (name) {
            if (!nameCount[name]) {
                nameCount[name] = 0;
                nameRows[name] = row;
            }
            nameCount[name]++;
        }
    });

    // Filter rows that occur exactly once
    const uniqueRows = Object.keys(nameCount)
        .filter(name => nameCount[name] === 1)
        .map(name => nameRows[name]);

    // Combine the header and unique rows back into CSV format
    return [headers, ...uniqueRows].join('\n');
}

// Read the CSV file
fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
        return console.error('Error reading CSV file:', err);
    }

    // Filter the unique rows based on "Name" column
    const uniqueCsvData = filterUniqueRows(data);

    // Write the filtered CSV data to a new file
    fs.writeFile(outputFilePath, uniqueCsvData, 'utf8', (err) => {
        if (err) {
            return console.error('Error writing CSV file:', err);
        }
        console.log(`Filtered CSV saved to ${outputFilePath}`);
    });
});
