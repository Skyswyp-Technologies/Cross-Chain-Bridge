import { ethers, getChainId, getUnnamedAccounts } from "hardhat";
import { ENDPONTS } from "../layerzero/endponts";
import {load} from "ts-dotenv";

async function main() {

  // const env = load({
  //   ENVIRONMENT: String
  // });

  //const chainDetails = env.ENVIRONMENT == "dev"? ENDPONTS.TESTNET : ENDPONTS.TESTNET;
//
  //const chainId = await getChainId();

  const [account] = await getUnnamedAccounts();

  
  const Bridge = await ethers.getContractFactory("BridgeV2");

      const bridge = await Bridge.deploy("0x6EDCE65403992e310A62460808c4b910D972f10f", "0x25F0105CBca79C300Efe203503AF091c0dfF1FC3", "ETH");
  
      await bridge.waitForDeployment();

      console.log(`Bridge on deployed to: ${bridge.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
