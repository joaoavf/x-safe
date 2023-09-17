export const networks = {
    ethereum: 
    {
        chainId: 1,
        blockExplorerUrl: 'https://api.etherscan.io/api',
        apiKey: process.env.ETHERSCAN_API_KEY || '',
    }
}

export type Network = {
    chainId: number;
    blockExplorerUrl: string;
    apiKey: string;
}

const EMPTY = {
    name: '',
    type: '',
    inputs: [],
  }

export async function fetchABI(networkName: string, address: string): Promise<any> {
    const network = networks[networkName];
    const URL = `${network.blockExplorerUrl}?module=contract&action=getabi&address=${address}&apikey=${network.apiKey}`;
    const response = await fetch(URL);
    const ABI = await response.json();
    console.log(JSON.parse(ABI.result))

    if (ABI.status === '0') {
        throw new Error(ABI.result);
    } else {
        const treatedABI = JSON.parse(ABI.result).filter((item: any) => item.type === 'function' && (item.constant == false || item.stateMutability === 'nonpayable' || item.stateMutability === 'payable')).sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });;
        return [EMPTY, ...treatedABI]
    }
}

