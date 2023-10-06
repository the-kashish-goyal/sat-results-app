import React, { useState } from 'react';

function GetRank() {
  const [name, setName] = useState('');
  const [rank, setRank] = useState('');
  const [message, setMessage] = useState('');

  const handleGetRank = () => {
    const payload = {
      name: name,
    };

    fetch('http://localhost:5000/api/getRank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to get rank');
        }
      })
      .then((data) => {
        setRank(data.rank);
        setMessage(data.message);
      })
      .catch((error) => {
        setMessage('Error getting rank: ' + error.message);
      });
  };

  return (
    <div>
      <h2>Get Rank</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <button onClick={handleGetRank}>Get Rank</button>
      <div>
        <p>Rank: {rank}</p>
      </div>
      <div>{message}</div>
    </div>
  );
}

export default GetRank;
