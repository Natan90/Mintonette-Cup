const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mintonette_cup.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Chemin de la DB :', dbPath);


module.exports = db;
