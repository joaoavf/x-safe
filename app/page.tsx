"use client";
import { fetchABI } from '@/server/fetch-abi';
import React, { useState } from 'react';
import { Web3Button } from '@web3modal/react'
import { useWalletClient } from 'wagmi'
import { getSafe, getSafeTx } from '@/server/safe';

const App = () => {
  const [showSafeModal, setShowSafeModal] = useState(false);
  const [safes, setSafes] = useState([]);
  const [newSafe, setNewSafe] = useState({ blockchain: 'ethereum', address: ''});

  const [showModal, setShowModal] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [newContract, setNewContract] = useState({ blockchain: 'ethereum', address: '', ABI: [], selectedFunction: ''});
  
  const {data: signer} = useWalletClient();
  const safeAddress = '0xEeac56EFC9ff9806214ba1d0bdB9321953ae3e83';
  const safe = getSafe(safeAddress, signer);

  const to = '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F';
  const data = '0x';
  const value = '0';
  
  const safeTx =  getSafeTx(safe, to, data, value);

  console.log('safeTx', safeTx);

  const addContract = async () => {
    const ABI = await fetchABI(newContract.blockchain, newContract.address);
    // Add ABI to contract
    newContract.ABI = ABI;
    const newContracts = [...contracts, newContract];
    setContracts(newContracts);
    setShowModal(false);
  };

  const addSafe = async () => {
    const newSafes = [...safes, newSafe];
    setSafes(newSafes);
    setShowModal(false);
  };

  function updateContract(contract, selectedFunction) {
    contract.selectedFunction = selectedFunction;
    const newContracts = [...contracts];
    setContracts(newContracts);
  }

  return (
    <div>
      <Web3Button />
      <h1>Step 1 - Add Safes</h1>
      <button onClick={() => setShowSafeModal(true)}>Add New Safe</button>
      {showSafeModal && (
        <div>
          <div className="z-10 w-full items-left justify-between font-mono text-sm lg:flex">
          </div>
          <select onChange={(e) => setNewSafe({ ...newContract, blockchain: e.target.value })}>
            <option>ethereum</option>
            <option>arbitrum</option>
            <option>polygon</option>
          </select>
          <input
            type="text"
            placeholder="Address"
            onChange={(e) => setNewSafe({ ...newContract, address: e.target.value })}
          />
          <button onClick={addSafe}>Add Safe</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}

    <table>
        <thead>
          <tr>
            <th>Blockchain</th>
            <th>Safe Address</th>
          </tr>
        </thead>
        <tbody>
          {safes.map((safe, index) => (
            <tr key={index}>
              <td>{safe.blockchain}</td>
              <td>{safe.address}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Step 2 - Add Contract Calls</h1>

      <button onClick={() => setShowModal(true)}>Add</button>
      {showModal && (
        <div>
          <div className="z-10 w-full items-left justify-between font-mono text-sm lg:flex">
          </div>

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
            <th>Inputs</th>
            <th>Status</th>
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
            <td>
              <button>Call</button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;