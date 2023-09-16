"use client";
import { fetchABI } from '@/server/fetch-abi';
import React, { useState } from 'react';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [newContract, setNewContract] = useState({ blockchain: '', address: '', ABI: [] });

  const addContract = async () => {
    console.log('newContract', newContract);
    const ABI = await fetchABI(newContract.blockchain, newContract.address);
    // Add ABI to contract
    newContract.ABI = ABI;
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
            <option>ethereum</option>
            <option>arbitrum</option>
            <option>polygon</option>
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
              <select>
                {contract.ABI.map((name, index) => (
                  <option key={index}>{name}</option>
                ))}
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