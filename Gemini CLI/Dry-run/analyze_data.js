const fs = require('fs');

const data = fs.readFileSync('data.csv', 'utf8');
const lines = data.split('\n');
const headers = lines[0].split(',');
const rows = lines.slice(1).map(l => l.split(','));

// Helper to parse float
const parseNum = (str) => parseFloat(str) || 0;
const parsePct = (str) => parseFloat(str.replace('%', '')) || 0;

let totalExp25 = 0, totalExp24 = 0, totalExp23 = 0, totalExp22 = 0, totalExp21 = 0;
let totalYoY25 = 0, countYoY25 = 0;
let totalYoY24 = 0, countYoY24 = 0;
let totalYoY23 = 0, countYoY23 = 0;
let totalYoY22 = 0, countYoY22 = 0;

const exposure25List = [];
const growth25List = [];

rows.forEach(row => {
    if (row.length < 10) return;

    const zip = row[0];
    const yoy25 = parsePct(row[1]);
    const exp25 = parseNum(row[2]);
    const yoy24 = parsePct(row[3]);
    const exp24 = parseNum(row[4]);
    const yoy23 = parsePct(row[5]);
    const exp23 = parseNum(row[6]);
    const yoy22 = parsePct(row[7]);
    const exp22 = parseNum(row[8]);
    const exp21 = parseNum(row[10]); // Index 10 because we inserted empty YoY21 at index 9

    totalExp25 += exp25;
    totalExp24 += exp24;
    totalExp23 += exp23;
    totalExp22 += exp22;
    totalExp21 += exp21;

    if (row[1]) { totalYoY25 += yoy25; countYoY25++; }
    if (row[3]) { totalYoY24 += yoy24; countYoY24++; }
    if (row[5]) { totalYoY23 += yoy23; countYoY23++; }
    if (row[7]) { totalYoY22 += yoy22; countYoY22++; }

    exposure25List.push({ zip, val: exp25 });
    growth25List.push({ zip, val: yoy25 });
});

// Sort for top 5
exposure25List.sort((a, b) => b.val - a.val);
growth25List.sort((a, b) => b.val - a.val);

const stats = {
    total_exposure: {
        2025: totalExp25,
        2024: totalExp24,
        2023: totalExp23,
        2022: totalExp22,
        2021: totalExp21
    },
    avg_growth_rate: {
        2025: countYoY25 ? (totalYoY25 / countYoY25).toFixed(2) + '%' : '0%',
        2024: countYoY24 ? (totalYoY24 / countYoY24).toFixed(2) + '%' : '0%',
        2023: countYoY23 ? (totalYoY23 / countYoY23).toFixed(2) + '%' : '0%',
        2022: countYoY22 ? (totalYoY22 / countYoY22).toFixed(2) + '%' : '0%'
    },
    top_5_exposure_2025: exposure25List.slice(0, 5),
    top_5_growth_2025: growth25List.slice(0, 5)
};

console.log(JSON.stringify(stats, null, 2));
