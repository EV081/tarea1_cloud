// index.js
const express = require('express');
const cors = require('cors');
const { db, init } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Inicializa DB (crea tabla si no existe)
init();

/** Endpoints:
 * GET    /students
 * POST   /students
 * GET    /students/:id
 * PUT    /students/:id
 * DELETE /students/:id
 */

// GET todos
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students ORDER BY id', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST crear
app.post('/students', (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || typeof age !== 'number') {
    return res.status(400).json({ error: 'name, email, age son requeridos (age numérico).' });
  }
  const sql = 'INSERT INTO students (name, email, age) VALUES (?, ?, ?)';
  db.run(sql, [name, email, age], function (err) {
    if (err){
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Email ya existe' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, email, age });
  });
});

// GET por id
app.get('/students/:id', (req, res) => {
  db.get('SELECT * FROM students WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'No encontrado' });
    res.json(row);
  });
});

// PUT actualizar
app.put('/students/:id', (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || typeof age !== 'number') {
    return res.status(400).json({ error: 'name, email, age son requeridos (age numérico).' });
  }
  const sql = 'UPDATE students SET name = ?, email = ?, age = ? WHERE id = ?';
  db.run(sql, [name, email, age, req.params.id], function (err) {
    if (err){
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Email ya existe' });
      }
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id: Number(req.params.id), name, email, age });
  });
});

// DELETE borrar
app.delete('/students/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API escuchando en http://0.0.0.0:${PORT}`);
});
