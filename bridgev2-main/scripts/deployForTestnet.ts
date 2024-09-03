import { ethers, getChainId, getUnnamedAccounts, upgrades } from "hardhat";
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

  const Bridge: any = await ethers.getContractFactory("BridgeV2");
  const bridge = await Bridge.deploy("0x6EDCE65403992e310A62460808c4b910D972f10f","0x25F0105CBca79C300Efe203503AF091c0dfF1FC3", "ETH");
  await bridge.waitForDeployment();

  console.log("Bridge deployed: ", bridge.target);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//bridge testnet ETH sepoila: 0x67e0B3f4069e59812EecC65DF127811A43AF5Eb9 --new
//bridge arb sepolia: 0x74FCAE483Cd97791078B8E6073757e04356C20bd -new
//alpha token sepolia: 0x84cba2A35398B42127B3148744DB3Cd30981fCDf
//alpha arb: 0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD