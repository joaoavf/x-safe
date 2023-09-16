import { fetchABI, networks } from '../server/fetch-abi';

describe('fetch-abi', () => {
    it('fetches ABI', async () => {
        const ABI = await fetchABI(networks[0], '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413')
        expect(ABI.length).toBeGreaterThan(0);
    });
});