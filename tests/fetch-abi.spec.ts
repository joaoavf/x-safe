import { fetchABI } from '../server/fetch-abi';

describe('fetch-abi', () => {
    it('fetches ABI', async () => {
        const ABI = await fetchABI('ethereum', '0x7a250d5630b4cf539739df2c5dacb4c659f2488d')
        console.log(ABI)
        expect(ABI.length).toBeGreaterThan(0);
    });
});