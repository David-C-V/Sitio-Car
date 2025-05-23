const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./db.sqlite');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS catalog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  anio TEXT NOT NULL
)`);

// Obtener todos los registros
app.get('/api/catalog', (req, res) => {
  db.all('SELECT * FROM catalog', [], (err, rows) => {
    if (err) {
      console.error('Error en SELECT:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Agregar un nuevo registro
app.post('/api/catalog', (req, res) => {
  const { marca, modelo, anio } = req.body;
  db.run('INSERT INTO catalog (marca, modelo, anio) VALUES (?, ?, ?)',
    [marca, modelo, anio],
    function (err) {
      if (err) {
        console.error('Error en INSERT:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Actualizar un registro
app.put('/api/catalog/:id', (req, res) => {
  const { id } = req.params;
  const { marca, modelo, anio } = req.body;
  db.run('UPDATE catalog SET marca = ?, modelo = ?, anio = ? WHERE id = ?',
    [marca, modelo, anio, id],
    function (err) {
      if (err) {
        console.error('Error en UPDATE:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    }
  );
});

// Eliminar un registro
app.delete('/api/catalog/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM catalog WHERE id = ?', id, function (err) {
    if (err) {
      console.error('Error en DELETE:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
