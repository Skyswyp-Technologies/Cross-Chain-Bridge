import { ethers, getChainId, getUnnamedAccounts } from "hardhat";
import { ENDPONTS } from "../layerzero/endponts";
import { DEPLOYMENTS } from "./deploymets";
import { load } from "ts-dotenv";
import { Options } from "@layerzerolabs/lz-v2-utilities";


async function main() {

//   const amount = ethers.parseEther("1000000"); // 5
//  const tokenAddress = "0x84cba2A35398B42127B3148744DB3Cd30981fCDf";


//   // const chainId = await getChainId();
//   const Bridge = await ethers.getContractFactory("BridgeV2");
const Token = await ethers.getContractFactory("AlphaToken");
//   const destEid = 40245;   
  
  //40161 --eth testnet Eid

  // chainDetails.forEach( async (dets) =>{
  //   if (chainId === dets.chainID.toString()) {


  // const bridge = Bridge.attach("0x74FCAE483Cd97791078B8E6073757e04356C20bd");

  //   console.log("setting bridge peer..");
  //   await bridge.setPeer(destEid, "0x000000000000000000000000f762f004a30CB141d139C900f2Aa3631Db7FD2E7");
  //   console.log("set!");

    // console.log("Whitelisting bridge token....");
    // await bridge.whitelistToken("0x2816a02000B9845C464796b8c36B2D5D199525d5", "USDT");
    // console.log("whitelisted....");

    // console.log("Setting bridge fee address...");
    // await bridge.setBridgeFeeAddress("0xe6d7058E1D37a55A5352ff329E77240394604822");
    // console.log("fee address set....");

  // console.log("Estimating fee....");
  // const payload = await bridge.getMessage(amount, tokenAddress, "0x5682bce3c6e4831503c4C3a9f0Db81ff61EF72a5");
  // const options = await bridge.getLzReceiveOption("500000", "0");
  // const fee = await bridge.getFee(destEid, payload, options);
  // console.log(`Fee is set: ${fee.nativeFee}`);

  console.log("transfer ownership....");
  const token = Token.attach("0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD");
  await token.transferOwnership("0x8F4916E8Bc834451AAc5377130016EDb1B2df09B");
  console.log("tranferred...");


  // console.log("Sending token deposit to Bridge...");
  // const tx = await bridge.deposit(destEid, amount, tokenAddress, "ARB", "0x5682bce3c6e4831503c4C3a9f0Db81ff61EF72a5", {
  //  gasLimit:500000,
  //   value: fee.nativeFee // Send the necessary fee along with the transaction
  // });
  // console.log(`Fee: ${fee.nativeFee}`);
  // console.log(`Your tokens amount: ${amount} is bridged successfully!`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
