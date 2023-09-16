"use client";
import React, { useState } from 'react';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [newContract, setNewContract] = useState({ blockchain: '', address: '' });

  const addContract = () => {
    const newContracts = [...contracts, newContract];
    setContracts(newContracts);
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Add</button>

      {showModal && (
        <div>
          <h2>Add a Contract</h2>
          <select onChange={(e) => setNewContract({ ...newContract, blockchain: e.target.value })}>
            <option>Ethereum</option>
            <option>Arbitrum</option>
            <option>Polygon</option>
          </select>
          <input
            type="text"
            placeholder="Address"
            onChange={(e) => setNewContract({ ...newContract, address: e.target.value })}
          />
          <button onClick={addContract}>Add</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Blockchain</th>
            <th>Address</th>
            <th>Functions</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <tr key={index}>
              <td>{contract.blockchain}</td>
              <td>{contract.address}</td>
              <td>
                {/* Replace this with fetched ABI functions */}
                <select>
                  <option>function1</option>
                  <option>function2</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;