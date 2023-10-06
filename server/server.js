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
  
    const sql = 'INSERT INTO sat_results (name, address, city, country, pincode, satScore, passed) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
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
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    connection.query('SELECT * FROM sat_results', (queryErr, results) => {
      connection.release(); 

      if (queryErr) {
        console.error('Error fetching SAT results:', queryErr);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.json(results);
    });
  });
});

app.post('/api/getRank', (req, res) => {
  const name = req.body.name;

  pool.query('SELECT satScore FROM sat_results WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.error('Error getting SAT score:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Candidate not found' });
      return;
    }

    const satScore = results[0].satScore;
    const rank = calculateRank(satScore, (err, rank) => {
      if(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.json({ rank: rank, message: 'Rank retrieved successfully' });
    });

  });
});

function calculateRank(satScore, callback) {
  const rankQuery = 'SELECT COUNT(*) AS `rank` FROM sat_results WHERE satScore > ?';
  
  pool.query(rankQuery, [satScore], (err, results) => {
    if (err) {
      console.error('Error calculating rank:', err);
      callback(err, null); 
    } else {
      const rank = results[0].rank;
      
      if (rank !== undefined) {
        const finalRank = rank + 1;
        callback(null, finalRank); 
      } else {
        console.error('Rank calculation result is undefined');
        callback('Rank calculation failed', null); 
      }
    }
  });
}

  

app.put('/api/update-score', (req, res) => {
  const name = req.body.name;
  const newScore = req.body.satScore;

  // Use the connection pool to execute an UPDATE query
  pool.query('UPDATE sat_results SET satScore = ? WHERE name = ?', [newScore, name], (err, results) => {
    if (err) {
      console.error('Error updating SAT score:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if a row was affected (indicating a successful update)
    if (results.affectedRows === 1) {
      res.json({ message: 'SAT score updated successfully' });
    } else {
      res.status(404).json({ error: 'Candidate not found' });
    }
  });
});

app.delete('/api/deleteRecord', (req, res) => {
  const name = req.body.name;

  const deleteQuery = 'DELETE FROM sat_results WHERE name = ?';

  pool.query(deleteQuery, [name], (err, results) => {
    if (err) {
      console.error('Error deleting record:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.affectedRows === 1) {
      res.json({ message: 'Record deleted successfully' });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
