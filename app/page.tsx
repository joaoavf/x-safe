"use client";
import { fetchABI } from "@/server/fetch-abi";
import React, { useState } from "react";
import { Web3Button } from "@web3modal/react";
import { signTransaction } from "@/server/safe";
import { useWalletClient, type WalletClient} from "wagmi";
// import { getSafe, getSafeTx } from "@/server/safe";
import { ethers, providers } from 'ethers'


 function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport as any, network)
  const signer = provider.getSigner(account.address)
  return signer
}
 
function useEthersSigner() {
  const { data: walletClient } = useWalletClient()
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  )
}

const App = () => {
  const [showSafeModal, setShowSafeModal] = useState(false);
  const [safes, setSafes] = useState([]);
  const [newSafe, setNewSafe] = useState({
    blockchain: "ethereum",
    address: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [newContract, setNewContract] = useState({
    blockchain: "ethereum",
    address: "",
    ABI: [],
    selectedFunction: "",
    safe: "",
  });

  const [inputValues, setInputValues] = useState({});

  const signer = useEthersSigner();

  const addContract = async () => {
    const ABI = await fetchABI(newContract.blockchain, newContract.address);
    // Add ABI to contract
    newContract.ABI = ABI;
    if (newContract.safe === ""){
      newContract.safe = safes.filter((safe) => safe.blockchain === newContract.blockchain)[0].address;
    }
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

  function handleInputChange(functionName, index, value){
    const updatedValues = { ...inputValues };
    if (!updatedValues[functionName]) {
      updatedValues[functionName] = [];
    }
    updatedValues[functionName][index] = value;
    setInputValues(updatedValues);;
  }

  const encodeFunctionCall = (ABI, functionName) => {
    const values = inputValues[functionName] || [];
    const contractInterface = new ethers.utils.Interface(ABI.slice(1));

    return contractInterface.encodeFunctionData(functionName, values);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
      {/* Step 1: Adding a Logo */}
      <div className="text-3xl font-bold text-blue-500">
        x-safe
      </div>

      {/* Step 2: Positioning Web3Button */}
      <div className="flex items-center">
        <Web3Button />
      </div>
    </div>

      <h1 className="text-2xl font-bold mb-4">Step 1 - Add Safes</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowSafeModal(true)}
      >
        Add New Safe
      </button>
      {showSafeModal && (
        <div className="mt-4">
          <select
            className="border p-2 rounded mb-2"
            onChange={(e) =>
              setNewSafe({ ...newContract, blockchain: e.target.value })
            }
          >
            <option>ethereum</option>
            <option>arbitrum</option>
            <option>polygon</option>
          </select>
          <input
            className="border p-2 rounded mb-2"
            type="text"
            placeholder="Address"
            onChange={(e) =>
              setNewSafe({ ...newContract, address: e.target.value })
            }
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={addSafe}
          >
            Add Safe
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <table className="min-w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Chain</th>
            <th className="py-2 px-4 border">Safe Address</th>
          </tr>
        </thead>
        <tbody>
          {safes.map((safe, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{safe.blockchain}</td>
              <td className="py-2 px-4 border">{safe.address}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 className="text-2xl font-bold mt-8 mb-4">
        Step 2 - Add Contract Calls
      </h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Add Contract Call
      </button>
      {showModal && (
        <div className="mt-4">
          <div className="z-10 w-full items-left justify-between font-mono text-sm lg:flex"></div>
          <select
            className="border p-2 rounded mb-2"
            onChange={(e) =>
              setNewContract({ ...newContract, blockchain: e.target.value })
            }
          >
            <option>ethereum</option>
            <option>arbitrum</option>
            <option>polygon</option>
          </select>
          <select
            className="border p-2 rounded mb-2"
            onChange={(e) =>
              setNewContract({ ...newContract, safe: e.target.value })
            }
          >
            {safes.filter((safe) => safe.blockchain === newContract.blockchain).map((safe) => (
              <option key={safe.address} value={safe.address}>
                {safe.address} 
              </option>
            ))}
  
          </select>
          <input
            className="border p-2 rounded mb-2"
            type="text"
            placeholder="Contract Address"
            onChange={(e) =>
              setNewContract({ ...newContract, address: e.target.value })
            }
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={addContract}
          >
            Add
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <table className="min-w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Chain</th>
            <th className="py-2 px-4 border">Safe Address</th>
            <th className="py-2 px-4 border">Contract Address</th>
            <th className="py-2 px-4 border">Functions</th>
            <th className="py-2 px-4 border">Inputs</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{contract.blockchain}</td>
              <td className="py-2 px-4 border">{contract.safe}</td>
              <td className="py-2 px-4 border">{contract.address}</td>
              <td className="py-2 px-4 border">
                <select
                  className="border p-1 rounded"
                  onChange={(e) => updateContract(contract, e.target.value)}
                >
                  {contract?.ABI?.length > 0 ? (
                    contract.ABI.map((contract, index) => (
                      <option key={index}>{contract.name}</option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </td>
              <td className="py-2 px-4 border">
                {contract.selectedFunction !== "" &&
                  contract.ABI.map((abiFunction, index) => {
                    if (abiFunction.name === contract.selectedFunction) {
                      return (
                        <div key={index}>
                          {abiFunction.inputs.map((input, inputIndex) => (
                            <div key={inputIndex} className="mb-2">
                              <label className="mr-2">{`${input.name} (${input.type})`}</label>
                              <input
                                className="border p-1 rounded"
                                type="text"
                                onChange={(e) =>
                                  handleInputChange(contract.selectedFunction, inputIndex, e.target.value)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      );
                    }
                  })}
              </td>
              <td className="py-2 px-4 border">
                <button className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => signTransaction(
                    contract.safe, 
                    contract.address, 
                    encodeFunctionCall(contract.ABI, contract.selectedFunction), 
                    "0", 
                    signer)}
                  >
                    Sign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
