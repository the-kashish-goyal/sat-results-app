import React, { useState } from 'react';
import axios from 'axios';

function UpdateScore() {
  const [formData, setFormData] = useState({
    name: '',
    satScore: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseURL = 'http://localhost:5000';
    const updateScoreEndpoint = `${baseURL}/api/update-score`;

    try {
      const response = await axios.put(updateScoreEndpoint, formData);
      console.log('Update Score Response:', response.data);
      // Optionally, you can display a success message to the user
    } catch (error) {
      console.error('Error updating score:', error);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <div>
      <h2>Update SAT Score</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Candidate Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="satScore">New SAT Score:</label>
          <input
            type="number"
            id="satScore"
            name="satScore"
            value={formData.satScore}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Score</button>
      </form>
    </div>
  );
}

export default UpdateScore;
