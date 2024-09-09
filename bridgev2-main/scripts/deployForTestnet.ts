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

  const whitelistToken: any = await ethers.getContractFactory("AlphaToken");
  const token = await whitelistToken.deploy("0x25F0105CBca79C300Efe203503AF091c0dfF1FC3");
  await token.waitForDeployment();

  console.log("Bridge deployed: ", token.target);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//bridge testnet ETH sepoila: 0x67e0B3f4069e59812EecC65DF127811A43AF5Eb9 --new
//bridge arb sepolia: 0x74FCAE483Cd97791078B8E6073757e04356C20bd -new
//bridge base sepolia: 0xf762f004a30CB141d139C900f2Aa3631Db7FD2E7
//alpha token sepolia: 0x84cba2A35398B42127B3148744DB3Cd30981fCDf
//alpha arb: 0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD
// alpha token Base: 0x2816a02000B9845C464796b8c36B2D5D199525d5