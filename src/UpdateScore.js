import React, { useState } from 'react';

function UpdateScore() {
  const [name, setName] = useState('');
  const [satScore, setSatScore] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = () => {
    const payload = {
      name: name,
      satScore: satScore,
    };

    fetch('http://localhost:5000/api/update-score', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update score');
        }
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        setMessage('Error updating score: ' + error.message);
      });
  };

  return (
    <div>
      <h2>Update Score</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>SAT Score:</label>
        <input type="number" value={satScore} onChange={(e) => setSatScore(e.target.value)} />
      </div>
      <button onClick={handleUpdate}>Update Score</button>
      <div>{message}</div>
    </div>
  );
}

export default UpdateScore;
