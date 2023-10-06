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

app.post('/api/getRank', (req, res) => {
  const name = req.body.name;

  // Use the connection pool to execute a SELECT query to retrieve the SAT score
  pool.query('SELECT satScore FROM sat_results WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.error('Error getting SAT score:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if a row was found
    if (results.length === 0) {
      res.status(404).json({ error: 'Candidate not found' });
      return;
    }

    // Calculate the rank based on the SAT score (you need to implement your rank calculation logic here)
    const satScore = results[0].satScore;
    const rank = calculateRank(satScore, (err, rank) => {
      if(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // Respond with the rank
      res.json({ rank: rank, message: 'Rank retrieved successfully' });
    });

  });
});

function calculateRank(satScore, callback) {
  // Query the database to count the number of candidates with higher SAT scores
  const rankQuery = 'SELECT COUNT(*) AS `rank` FROM sat_results WHERE satScore > ?';
  
  // Execute the query
  pool.query(rankQuery, [satScore], (err, results) => {
    if (err) {
      console.error('Error calculating rank:', err);
      callback(err, null); // Handle the error
    } else {
      // Extract the rank from the query results
      const rank = results[0].rank;
      
      if (rank !== undefined) {
        // Add 1 to the rank to get the candidate's rank
        const finalRank = rank + 1;
        callback(null, finalRank); // Pass the calculated rank
      } else {
        console.error('Rank calculation result is undefined');
        callback('Rank calculation failed', null); // Handle unexpected result
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
