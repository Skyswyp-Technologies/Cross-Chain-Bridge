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

        const peers: {
          eid: number;
          address: string;
      }[] = deployment.bridge.peers;


      for(let i = 0; i < peers.length; i++) {
        const peer = peers[i];

        const _gas = 1000000;

        const _options = await bridge.getLzReceiveOption(_gas, 0);

        const message = await bridge.getMessage("100000000000000000000", dets.token);

        const fee = await bridge.getFee(peer.eid, message, _options);

        const token = Token.attach(dets.token);

        console.log("Approving tokens");
        await token.approve(deployment.bridge.address, "100000000000000000000");

        console.log("depositing");

        await bridge.deposit(peer.eid, "100000000000000000000", dets.token, get_chain_name(chainId),  _gas, {value: fee[0]});

        console.log("depositing bridge");
      }
        console.log(`depositing on ${dets.chainID} `);
    } 
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
