import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import Safe from "@safe-global/protocol-kit";
import { ethAdapter } from "../server/eth-adapter";

async function getSafe(safeAddress: string) {
  return await Safe.create({ ethAdapter, safeAddress });
}
// https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md
async function getSafeTx(safe, to, data, value) {
  const safeTransactionData: SafeTransactionDataPartial = {
    to,
    data,
    value,
  };

  return await safe.createTransaction({ safeTransactionData });
}


describe('safe-tx', () => {
    it('generate Safe Tx', async () => {
        const safe = await getSafe('0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e');
        const safeTx = await getSafeTx(safe, '0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e', '0x', '10000000000');
        expect(ABI.length).toBeGreaterThan(0);
    });
});