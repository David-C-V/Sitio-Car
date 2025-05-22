const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./database/db.sqlite');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS catalog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT
)`);

// Rutas API CRUD
app.get('/api/catalog', (req, res) => {
  db.all('SELECT * FROM catalog', [], (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/catalog', (req, res) => {
  const { title, description, media_url } = req.body;
  db.run('INSERT INTO catalog (title, description, media_url) VALUES (?, ?, ?)',
    [title, description, media_url],
    function (err) {
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/catalog/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, media_url } = req.body;
  db.run('UPDATE catalog SET title = ?, description = ?, media_url = ? WHERE id = ?',
    [title, description, media_url, id],
    function (err) {
      res.json({ changes: this.changes });
    }
  );
});

app.delete('/api/catalog/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM catalog WHERE id = ?', id, function (err) {
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
