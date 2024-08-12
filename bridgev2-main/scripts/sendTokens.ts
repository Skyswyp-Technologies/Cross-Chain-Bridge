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
  const Token = await ethers.getContractFactory("AlphaToken");

  chainDetails.forEach( async (dets) =>{
    if (chainId === dets.chainID.toString()) {


        const token = Token.attach(dets.token);

        console.log("Sending tokens");
        await token.mint("0xc35213Df28D0a78848f8109Ab8eC0b89f2c76541", "1000000000000000000000000");      }
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
