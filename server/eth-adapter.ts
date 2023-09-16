import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';

const web3Provider = `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`
const provider = new ethers.providers.Web3Provider(web3Provider)
const safeOwner = provider.getSigner(0)

export const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: safeOwner
})