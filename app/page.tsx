"use client";
import { fetchABI } from '@/server/fetch-abi';
import React, { useState } from 'react';



const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [newContract, setNewContract] = useState({ blockchain: 'ethereum', address: '', ABI: [], selectedFunction: ''});

  const addContract = async () => {
    const ABI = await fetchABI(newContract.blockchain, newContract.address);
    // Add ABI to contract
    newContract.ABI = ABI;
    const newContracts = [...contracts, newContract];
    setContracts(newContracts);
    setShowModal(false);
  };

  function updateContract(contract, selectedFunction) {
    contract.selectedFunction = selectedFunction;
    const newContracts = [...contracts];
    setContracts(newContracts);
  }

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
              <select onChange={(e) => updateContract(contract, e.target.value )}>
                {contract?.ABI?.length > 0 ? contract.ABI.map((contract, index) => (
                  <option key={index}>{contract.name}</option>
                )) : <></>}
              </select>
              </td>
              <td>
              {contract.selectedFunction !== '' && contract.ABI.map((abiFunction, index) => {
                if (abiFunction.name === contract.selectedFunction) {
                  return (
                    <div key={index}>
                      <h3>{abiFunction.name}</h3>              
                      {/* Generate input fields for each input in abiFunction.inputs */}
                      {abiFunction.inputs.map((input, inputIndex) => (
                        <div key={inputIndex}>
                          <label>{`${input.name} (${input.type})`}</label>
                          <input type="text" />
                        </div>
                      ))}
                    </div>
                  );
                }})
              }
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;