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

  
  const AlphaToken: any = await ethers.getContractFactory("AlphaToken");
  //0x6EDCE65403992e310A62460808c4b910D972f10f", "0x25F0105CBca79C300Efe203503AF091c0dfF1FC3", "ETH"

      const token = await AlphaToken.deploy("0x25F0105CBca79C300Efe203503AF091c0dfF1FC3");
  
      await token.waitForDeployment();

      

      console.log(`token address deployed to: ${token.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//bridge testnet sepoila: 0xeEd454c51994c592bB7CEcd5E6472d461B3d7afb
//bridge arb sepolia: 0xcF448d11D45d50A56CA32e17fbdAbF26cd485D68
//alpha token sepolia: 0x84cba2A35398B42127B3148744DB3Cd30981fCDf
//alpha arb: 0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD