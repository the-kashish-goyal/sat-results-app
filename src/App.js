import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Menu';
import InsertData from './InsertData';
import ViewData from './ViewData';
import GetRank from './GetRank';
import UpdateScore from './UpdateScore';
import DeleteRecord from './DeleteRecord';

function App() {
  return (
    <Router>
      <div>
        <Menu />
        <Routes>
          <Route path="/insert" element={<InsertData/>} />
          <Route path="/view" element={<ViewData/>} />
          <Route path="/get-rank" element={<GetRank/>} />
          <Route path="/update-score" element={<UpdateScore/>} />
          <Route path="/delete-record" element={<DeleteRecord/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
