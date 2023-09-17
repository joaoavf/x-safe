import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import Safe from "@safe-global/protocol-kit";


export function getEthAdapter(signer) {
  return new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  })
}

export async function getSafe(safeAddress: string, signer: any) {
  const ethAdapter = getEthAdapter(signer);
  return await Safe.create({ ethAdapter, safeAddress });
}

// https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md
export async function getSafeTx(safe, to, data, value) {
  const safeTransactionData: SafeTransactionDataPartial = {
    to,
    data,
    value,
  };

  return await safe.createTransaction({ safeTransactionData });
}

export async function signTransaction(safeAddress, contractAddress, callData, value, signer) {
  console.log("signing transaction", signer);
  const safe = await getSafe(safeAddress, signer);
  const safeTx = await getSafeTx(safe, contractAddress, callData, value);
  return await safe.signTransaction(safeTx);
}