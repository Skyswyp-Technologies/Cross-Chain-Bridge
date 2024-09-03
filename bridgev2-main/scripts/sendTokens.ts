import { ethers, getChainId, getUnnamedAccounts } from "hardhat";
import { ENDPONTS } from "../layerzero/endponts";
import { DEPLOYMENTS } from "./deploymets";
import { load } from "ts-dotenv";
import { Options } from "@layerzerolabs/lz-v2-utilities";


async function main() {

  const amount = ethers.parseEther("5"); // 5
 // const tokenAddress = "0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD";


  // const chainId = await getChainId();
  const Bridge = await ethers.getContractFactory("BridgeV2");
  const Token = await ethers.getContractFactory("AlphaToken");
  const destEid = 40161;

  // chainDetails.forEach( async (dets) =>{
  //   if (chainId === dets.chainID.toString()) {


  const bridge = Bridge.attach("0x980B2F387BBECD67d94B2b6Eebd4FD238946466a");

  //   console.log("setting bridge address..");
  //   await bridge.setPeer("0xe6d7058E1D37a55A5352ff329E77240394604822");
  //   console.log("set!");

  console.log("Estimating fee....");
  const payload = await bridge.getMessage(amount, "0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD", "0x5682bce3c6e4831503c4C3a9f0Db81ff61EF72a5");
  const options = await bridge.getLzReceiveOption("500000", "0");
  const fee = await bridge.getFee(destEid, payload, options);
  console.log(`Fee is set: ${fee.nativeFee}`);


  const token = Token.attach("0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD");
  console.log("Approving bridge...");
  await token.approve("0x980B2F387BBECD67d94B2b6Eebd4FD238946466a", amount);
  console.log("Approved!");


  console.log("Sending token deposit to Bridge...");
  const tx = await bridge.deposit(destEid, amount, "0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD", "ETH", "0x5682bce3c6e4831503c4C3a9f0Db81ff61EF72a5", {
    gasLimit:100000,
    value: fee.nativeFee // Send the necessary fee along with the transaction
  });
  console.log(`Fee: ${fee.nativeFee}`)
  console.log(`Your tokens amount: ${amount} is bridged successfully!`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
