const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Kashish@471',
    database: 'sat_results_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  // Test the MySQL connection
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err);
    } else {
      console.log('Connected to MySQL database');
      connection.release();
    }
  });

app.use(bodyParser.json());

app.post('/insert', (req, res) => {
    const { name, address, city, country, pincode, satScore } = req.body;
    const passed = satScore > 30 ? 1 : 0;
  
    // SQL query to insert data into the 'sat_results' table
    const sql = 'INSERT INTO sat_results (name, address, city, country, pincode, satScore, passed) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
    // Execute the query
    pool.query(sql, [name, address, city, country, pincode, satScore, passed], (err, results) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).json({ error: 'An error occurred while inserting data' });
      } else {
        console.log('Data inserted into MySQL');
        res.json({ message: 'Data inserted successfully' });
      }
    });
  });

  app.get('/api/sat_results', (req, res) => {
    // Use the connection pool to execute a query to retrieve SAT results data
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting database connection:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      connection.query('SELECT * FROM sat_results', (queryErr, results) => {
        connection.release(); // Release the connection back to the pool
  
        if (queryErr) {
          console.error('Error fetching SAT results:', queryErr);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
  
        // Respond with the retrieved data as JSON
        res.json(results);
      });
    });
  });

app.get('/getRank', (req, res) => {
  // Handle getting the rank based on the name.
  const name = req.query.name;
  const found = satResults.find(result => result.name === name);
  if (found) {
    res.json({ rank: satResults.indexOf(found) + 1 });
  } else {
    res.status(404).json({ error: 'Name not found' });
  }
});

app.put('/updateScore', (req, res) => {
  // Handle updating the SAT score by name.
  const name = req.body.name;
  const newScore = req.body.satScore;
  const found = satResults.find(result => result.name === name);
  if (found) {
    found.satScore = newScore;
    found.passed = newScore > 30 ? true : false;
    res.json({ message: 'Score updated successfully' });
  } else {
    res.status(404).json({ error: 'Name not found' });
  }
});

app.delete('/deleteRecord', (req, res) => {
  // Handle deleting a record by name.
  const name = req.query.name;
  const foundIndex = satResults.findIndex(result => result.name === name);
  if (foundIndex !== -1) {
    satResults.splice(foundIndex, 1);
    res.json({ message: 'Record deleted successfully' });
  } else {
    res.status(404).json({ error: 'Name not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
