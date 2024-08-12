import { ethers, getChainId, getUnnamedAccounts} from "hardhat";
import { ENDPONTS } from "../layerzero/endponts";
import { DEPLOYMENTS } from "./deploymets";
import {load} from "ts-dotenv";
import {Options} from "@layerzerolabs/lz-v2-utilities";


function get_chain_name(chain_id: string): string {
    switch (chain_id) {
        case "80001":
            
            return "MATIC";

        case "43113":
            return "AVAX";

        case "11155111":
            return "ETH";
    
        default:
            return "ETH";
    }
}


async function main() {

  const env = load({
    ENVIRONMENT: String
  });

  const chainDetails = env.ENVIRONMENT == "dev"? ENDPONTS.TESTNET : ENDPONTS.TESTNET;

  const chainId = await getChainId();
  
  const Bridge = await ethers.getContractFactory("BridgeV2");

  const Token = await ethers.getContractFactory("AlphaToken");

  chainDetails.forEach( async (dets) =>{
    if (chainId === dets.chainID.toString()) {
        const index = chainDetails.indexOf(dets);

        const deployment = DEPLOYMENTS[index];

        const bridge = Bridge.attach(deployment.bridge.address);

        await bridge.setBridgeFeeAddress("0xaC18157FFFdc96C9724eB1CF42eb05F8f70e645B");
    } 
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
