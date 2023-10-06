import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <ul>
      <li><Link to="/insert">Insert Data</Link></li>
      <li><Link to="/view">View All Data</Link></li>
      <li><Link to="/get-rank">Get Rank</Link></li>
      <li><Link to="/update-score">Update Score</Link></li>
      <li><Link to="/delete-record">Delete Record</Link></li>
    </ul>
  );
}

export default Menu;
