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

  const sleep = (delay: number | undefined) => new Promise((resolve) => setTimeout(resolve, delay))


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
        const peer  = await bridge.peers(peers[i].eid);
        console.log(peer);
      }
        console.log(`set peer on ${dets.chainID} `);
    } 
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
