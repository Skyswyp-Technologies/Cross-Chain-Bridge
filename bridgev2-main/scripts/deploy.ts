import { ethers, getChainId, getUnnamedAccounts } from "hardhat";
import { ENDPONTS } from "../layerzero/endponts";
import {load} from "ts-dotenv";

async function main() {

  const env = load({
    ENVIRONMENT: String
  });

  const chainDetails = env.ENVIRONMENT == "dev"? ENDPONTS.TESTNET : ENDPONTS.MAINNETS;

  const chainId = await getChainId();

  const [account] = await getUnnamedAccounts();

  
  const Bridge = await ethers.getContractFactory("BridgeV2");

  //const Token = await ethers.getContractFactory("AlphaToken");


  chainDetails.forEach( async (dets) =>{
    if (chainId === dets.chainID.toString()) {

      const bridge = await Bridge.deploy(dets.endpoint, account, dets.chainName);
  
      await bridge.waitForDeployment();

      //const token = Token.attach(dets.token);
//
      //await token.mint(await bridge.getAddress(), ethers.parseEther("100000"))
//
      //await bridge.whitelistToken(dets.token, "ALPHA");

      console.log(`Bridge on ${dets.chainID} deployed to: ${bridge.target}`);

    } 
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
