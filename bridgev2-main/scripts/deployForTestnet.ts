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

//testnet sepoila: 0xb00B9847DEa29d71846D549BD22E4a5bd5b75d07
//arb sepolia: 0x3AF7D19aAeCf142C91FF1A8575A316807a0f611A