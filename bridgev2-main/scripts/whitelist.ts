import { ethers, getChainId, getUnnamedAccounts} from "hardhat";
import { ENDPONTS } from "../layerzero/endponts";
import { DEPLOYMENTS } from "./deploymets";
import {load} from "ts-dotenv";


async function main() {

  const env = load({
    ENVIRONMENT: String
  });

  const chainDetails = env.ENVIRONMENT == "dev"? ENDPONTS.TESTNET : ENDPONTS.TESTNET;

  const chainId = await getChainId();

  const [account] = await getUnnamedAccounts();

  
  const Bridge = await ethers.getContractFactory("BridgeV2");

  chainDetails.forEach( async (dets) =>{
    if (chainId === dets.chainID.toString()) {

        const index = chainDetails.indexOf(dets);

        const deployment = DEPLOYMENTS[index];

        const bridge = Bridge.attach(deployment.bridge.address);

        const Token = await ethers.getContractFactory("AlphaToken");

        const token = Token.attach(dets.token);

        await bridge.whitelistToken(await token.getAddress(), "ALPHA");
        await token.mint(deployment.bridge.address, ethers.parseEther("10000"));


        console.log(`set peer on ${dets.chainID} `);
    } 
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});