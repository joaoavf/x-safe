import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import Safe from "@safe-global/protocol-kit";
import { ethAdapter } from "../server/safe";
import ethers from 'ethers';




describe('safe-tx', () => {
    it('generate Safe Tx', async () => {
        const safe = await getSafe('0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e');
        const safeTx = await getSafeTx(safe, '0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e', '0x', '10000000000');
        console.log(safeTx);
    });
});