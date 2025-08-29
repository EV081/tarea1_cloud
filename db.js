// db.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'students.db');
const db = new sqlite3.Database(DB_PATH);

function init() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error al crear esquema:', err.message);
    } else {
      console.log('Base de datos inicializada.');
    }
  });
}

module.exports = { db, init };
