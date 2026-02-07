const fs = require('fs');

const textRaw = fs.readFileSync('text_dump.txt', 'utf8');
const text = textRaw.replace(/\u0000/g, ''); // Remove null bytes
const lines = text.split(/\r?\n/);

const headers = [
    'ZipCode', 
    'YoY_2025', 'Exposure_2025', 
    'YoY_2024', 'Exposure_2024',
    'YoY_2023', 'Exposure_2023',
    'YoY_2022', 'Exposure_2022',
    'YoY_2021', 'Exposure_2021'
];
// Note: Exposure_2021 seems to be the last column. 
// Based on the "Total" row: 
// 52% (YoY25), 693B (Exp25), 61% (YoY24), 458B (Exp24), 35% (YoY23), 284B (Exp23), 31% (YoY22), 210B (Exp22), 160B (Exp21).
// So for 2021 there is only Exposure, no YoY.
// The columns found in row usually are: Zip, YoY, Exp, $, YoY, Exp, $, YoY, Exp, $, YoY, Exp, $, Exp, $.
// So we expect: Zip + 4 * (YoY + Exp + $) + (Exp + $) = 1 + 12 + 2 = 15 parts?
// Let's filter out '$'.
// Then we have: Zip, YoY25, Exp25, YoY24, Exp24, YoY23, Exp23, YoY22, Exp22, Exp21.
// That is 1 + 2 + 2 + 2 + 2 + 1 = 10 columns.

const csvRows = [];
csvRows.push(headers.join(','));

lines.forEach(line => {
    line = line.trim();
    if (!/^\d{5}/.test(line)) return; // Skip non-zip lines

    const parts = line.split(/\t+/).map(p => p.trim()).filter(p => p !== '' && p !== '$');
    
    // Check if we have enough parts. 
    // Sometimes last column might be empty or missing.
    // Expected parts: 10.
    
    if (parts.length < 10) {
        // Maybe some are missing, log it?
        // console.log('Skipping incomplete line:', line);
        return; 
    }

    // Clean numbers (remove commas) and %
    // We keep % as decimal or string? User asked for CSV. Keeping formatted is okay, or cleaning.
    // Let's clean commas for Exposure to make it numeric-ready.
    
    const zip = parts[0];
    const yoy25 = parts[1];
    const exp25 = parts[2].replace(/,/g, '');
    const yoy24 = parts[3];
    const exp24 = parts[4].replace(/,/g, '');
    const yoy23 = parts[5];
    const exp23 = parts[6].replace(/,/g, '');
    const yoy22 = parts[7];
    const exp22 = parts[8].replace(/,/g, '');
    
    // The last part might be YoY21 or Exp21. 
    // Based on Total row: last is Exp21. 
    // But wait, the header "Year over Year Growth Total Exposure" repeats.
    // If the last block is just Total Exposure, then parts[9] is Exp21.
    // Let's assume there is no YoY21 in the data for now as seen in 94501 example.
    
    const exp21 = parts[9].replace(/,/g, '');
    const yoy21 = ''; // Not present

    const row = [
        zip, 
        yoy25, exp25, 
        yoy24, exp24, 
        yoy23, exp23,
        yoy22, exp22,
        yoy21, exp21
    ];

    csvRows.push(row.join(','));
});

fs.writeFileSync('data.csv', csvRows.join('\n'));
console.log(`Parsed ${csvRows.length - 1} rows.`);
