import { ethers, getChainId, getUnnamedAccounts } from "hardhat";
import { ENDPONTS } from "../layerzero/endponts";
import {load} from "ts-dotenv";

async function main() {

  const env = load({
    ENVIRONMENT: String
  });

  //const chainDetails = env.ENVIRONMENT == "dev"? ENDPONTS.TESTNET : ENDPONTS.TESTNET;
//
  //const chainId = await getChainId();

  const [account] = await getUnnamedAccounts();

  
  const Bridge = await ethers.getContractFactory("BridgeV2");

      const bridge = await Bridge.deploy("0x464570adA09869d8741132183721B4f0769a0287", account, "MATIC");
  
      await bridge.waitForDeployment();

      console.log(`Bridge on ${40106} deployed to: ${bridge.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
