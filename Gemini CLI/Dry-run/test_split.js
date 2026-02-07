const fs = require('fs');

const text = fs.readFileSync('text_dump.txt', 'utf8');
const lines = text.split('\n');

console.log('First 5 lines:');
lines.slice(0, 5).forEach(l => console.log(JSON.stringify(l)));

const sample = lines.find(l => /^\d{5}/.test(l.trim()));

console.log('Sample line raw:', JSON.stringify(sample));
if (sample) {
    // Split by multiple spaces or tabs
    const parts = sample.trim().split(/\s{2,}|\t/).map(p => p.trim()).filter(p => p !== '' && p !== '$');
    console.log('Parts:', parts);
}

