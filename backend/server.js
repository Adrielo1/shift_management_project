// Import required packages
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize Express app
const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON request bodies

// Initialize SQLite database
const db = new sqlite3.Database('./shifts.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Create tables if they don't exist
function initDatabase() {
  // Employees table
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Shifts table
  db.run(`
    CREATE TABLE IF NOT EXISTS shifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      position TEXT NOT NULL,
      employee_id INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `);
}

// ============= EMPLOYEE ROUTES =============

// Get all employees
app.get('/api/employees', (req, res) => {
  db.all('SELECT * FROM employees ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single employee
app.get('/api/employees/:id', (req, res) => {
  db.get('SELECT * FROM employees WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json(row);
  });
});

// Create new employee
app.post('/api/employees', (req, res) => {
  const { name, role, email, phone } = req.body;
  
  if (!name || !role) {
    res.status(400).json({ error: 'Name and role are required' });
    return;
  }

  db.run(
    'INSERT INTO employees (name, role, email, phone) VALUES (?, ?, ?, ?)',
    [name, role, email, phone],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, role, email, phone });
    }
  );
});

// Update employee
app.put('/api/employees/:id', (req, res) => {
  const { name, role, email, phone } = req.body;
  
  db.run(
    'UPDATE employees SET name = ?, role = ?, email = ?, phone = ? WHERE id = ?',
    [name, role, email, phone, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }
      res.json({ id: req.params.id, name, role, email, phone });
    }
  );
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  db.run('DELETE FROM employees WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json({ message: 'Employee deleted', id: req.params.id });
  });
});

// ============= SHIFT ROUTES =============

// Get all shifts
app.get('/api/shifts', (req, res) => {
  const { date, employee_id } = req.query;
  
  let query = `
    SELECT shifts.*, employees.name as employee_name 
    FROM shifts 
    LEFT JOIN employees ON shifts.employee_id = employees.id
  `;
  let params = [];
  
  if (date) {
    query += ' WHERE shifts.date = ?';
    params.push(date);
  } else if (employee_id) {
    query += ' WHERE shifts.employee_id = ?';
    params.push(employee_id);
  }
  
  query += ' ORDER BY shifts.date, shifts.start_time';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single shift
app.get('/api/shifts/:id', (req, res) => {
  db.get(
    `SELECT shifts.*, employees.name as employee_name 
     FROM shifts 
     LEFT JOIN employees ON shifts.employee_id = employees.id 
     WHERE shifts.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Shift not found' });
        return;
      }
      res.json(row);
    }
  );
});

// Create new shift
app.post('/api/shifts', (req, res) => {
  const { date, start_time, end_time, position, employee_id, notes } = req.body;
  
  if (!date || !start_time || !end_time || !position) {
    res.status(400).json({ error: 'Date, start_time, end_time, and position are required' });
    return;
  }

  db.run(
    'INSERT INTO shifts (date, start_time, end_time, position, employee_id, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [date, start_time, end_time, position, employee_id, notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID, 
        date, 
        start_time, 
        end_time, 
        position, 
        employee_id, 
        notes 
      });
    }
  );
});

// Update shift
app.put('/api/shifts/:id', (req, res) => {
  const { date, start_time, end_time, position, employee_id, notes } = req.body;
  
  db.run(
    'UPDATE shifts SET date = ?, start_time = ?, end_time = ?, position = ?, employee_id = ?, notes = ? WHERE id = ?',
    [date, start_time, end_time, position, employee_id, notes, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Shift not found' });
        return;
      }
      res.json({ 
        id: req.params.id, 
        date, 
        start_time, 
        end_time, 
        position, 
        employee_id, 
        notes 
      });
    }
  );
});

// Delete shift
app.delete('/api/shifts/:id', (req, res) => {
  db.run('DELETE FROM shifts WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Shift not found' });
      return;
    }
    res.json({ message: 'Shift deleted', id: req.params.id });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});