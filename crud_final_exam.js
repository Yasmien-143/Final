const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_management'
};

const db = mysql.createConnection(dbConfig);

function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      course VARCHAR(255) NOT NULL,
      year_level VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Failed to create students table:', err.message);
      process.exit(1);
    }
  });
}

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
  initializeDatabase();
});

app.get('/', (req, res) => {
  const sql = 'SELECT * FROM students ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).render('index', { students: [], error: 'Failed to load student records.' });
    }
    res.render('index', { students: results, error: null });
  });
});

app.get('/add', (req, res) => {
  res.render('add', { error: null, values: {} });
});

app.post('/add', (req, res) => {
  const { student_id, full_name, course, year_level, email } = req.body;

  if (!student_id || !full_name || !course || !year_level || !email) {
    return res.status(400).render('add', { error: 'All fields are required.', values: req.body });
  }

  const sql = 'INSERT INTO students (student_id, full_name, course, year_level, email) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [student_id.trim(), full_name.trim(), course.trim(), year_level.trim(), email.trim()], (err) => {
    if (err) {
      return res.status(500).render('add', { error: 'Unable to save the student record.', values: req.body });
    }
    res.redirect('/');
  });
});

app.get('/edit/:id', (req, res) => {
  const sql = 'SELECT * FROM students WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err || !results.length) {
      return res.status(404).render('edit', { error: 'Student not found.', student: null });
    }
    res.render('edit', { error: null, student: results[0] });
  });
});

app.post('/edit/:id', (req, res) => {
  const { student_id, full_name, course, year_level, email } = req.body;
  const studentId = req.params.id;

  if (!student_id || !full_name || !course || !year_level || !email) {
    return res.status(400).render('edit', { error: 'All fields are required.', student: { id: studentId, ...req.body } });
  }

  const sql = 'UPDATE students SET student_id = ?, full_name = ?, course = ?, year_level = ?, email = ? WHERE id = ?';
  db.query(sql, [student_id.trim(), full_name.trim(), course.trim(), year_level.trim(), email.trim(), studentId], (err) => {
    if (err) {
      return res.status(500).render('edit', { error: 'Unable to update the student record.', student: { id: studentId, ...req.body } });
    }
    res.redirect('/');
  });
});

app.post('/delete/:id', (req, res) => {
  const sql = 'DELETE FROM students WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error('Delete failed:', err.message);
    }
    res.redirect('/');
  });
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
