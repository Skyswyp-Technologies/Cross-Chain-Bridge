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
  //0x6EDCE65403992e310A62460808c4b910D972f10f", "0x25F0105CBca79C300Efe203503AF091c0dfF1FC3", "ETH"

      const token = await Bridge.deploy("0x6EDCE65403992e310A62460808c4b910D972f10f", "0x25F0105CBca79C300Efe203503AF091c0dfF1FC3", "ETH");
  
      await token.waitForDeployment();

      

      console.log(`bridge address deployed to: ${token.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//bridge testnet sepoila: 0x9d3Eef214Dab3E607fa2B1F962c685EB132Ba9Ed --new
//bridge arb sepolia: 0xcF448d11D45d50A56CA32e17fbdAbF26cd485D68 -replace
//alpha token sepolia: 0x84cba2A35398B42127B3148744DB3Cd30981fCDf
//alpha arb: 0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD