const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function run() {
    const buffer = fs.readFileSync('./CFP-5-yr-TIV-Zip-FY25-All-251114.pdf');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getTable();
    await parser.destroy();
    
    console.log(JSON.stringify(result, null, 2));
}

run();
