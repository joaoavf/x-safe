export const networks = {ethereum: 
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

export async function fetchABI(networkName: string, address: string): Promise<any> {
    const network = networks[networkName];
    const URL = `${network.blockExplorerUrl}?module=contract&action=getabi&address=${address}&apikey=${network.apiKey}`;
    const response = await fetch(URL);
    const ABI = await response.json();

    if (ABI.status === '0') {
        throw new Error(ABI.result);
    } else {
        return JSON.parse(ABI.result);
    }
}

