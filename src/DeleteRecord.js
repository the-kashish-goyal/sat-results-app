import React, { useState } from 'react';

function DeleteRecord() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleDeleteRecord = () => {
    const payload = {
      name: name,
    };

    fetch('http://localhost:5000/api/deleteRecord', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to delete record');
        }
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        setMessage('Error deleting record: ' + error.message);
      });
  };

  return (
    <div>
      <h2>Delete Record</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <button onClick={handleDeleteRecord}>Delete Record</button>
      <div>{message}</div>
    </div>
  );
}

export default DeleteRecord;
