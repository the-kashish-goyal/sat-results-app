import React, { useState, useEffect } from 'react';
function ViewData() {
  const [data, setData] = useState([]);
  const url ="http://localhost:5000/api/sat_results";

  const fetchInfo =  () => {
    return fetch(url) 
        .then((res) => res.json()) 
        .then((d) => setData(d))
  }
  useEffect(() => {
    fetchInfo();
  }, [])


return (
    <div className="App">
      <h1 style={{ color: "green" }}>View Data</h1>
      
        {data.map((dataObj, index) => {
          return (
            <table style={{padding: "10px", borderWidth: "4px", borderColor: "black"}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>address</th>
                        <th>city</th>
                        <th>country</th>
                        <th>pincode</th>
                        <th>satScore</th>
                        <th>passed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{padding: "100px", margin: "100px"}}>
                        <td>{dataObj.name}</td>
                        <td>{dataObj.address}</td>
                        <td>{dataObj.city}</td>
                        <td>{dataObj.country}</td>
                        <td>{dataObj.pincode}</td>
                        <td>{dataObj.satScore}</td>
                        <td>{dataObj.passed}</td>
                    </tr>
                </tbody>
            </table>
          );
        })}
      
    </div>
  );
}

export default ViewData;
