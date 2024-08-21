import { ethers, getChainId, getUnnamedAccounts } from "hardhat";
import { ENDPONTS } from "../layerzero/endponts";
import { DEPLOYMENTS } from "./deploymets";
import { load } from "ts-dotenv";
import { Options } from "@layerzerolabs/lz-v2-utilities";


async function main() {

  const amount = ethers.parseEther("10"); // 10 tokens
  const tokenAddress = "0x84cba2A35398B42127B3148744DB3Cd30981fCDf";


  // const chainId = await getChainId();
  const Bridge = await ethers.getContractFactory("BridgeV2");
  const Token = await ethers.getContractFactory("AlphaToken");
  const destEid = 40231;

  // chainDetails.forEach( async (dets) =>{
  //   if (chainId === dets.chainID.toString()) {


  const bridge = Bridge.attach("0xeEd454c51994c592bB7CEcd5E6472d461B3d7afb");

  //   console.log("setting bridge address..");
  //   await bridge.setBridgeFeeAddress("0xe6d7058E1D37a55A5352ff329E77240394604822");
  //   console.log("set!");

  console.log("Estimating fee....");
  const payload = await bridge.getMessage(amount, tokenAddress);
  const options = await bridge.getLzReceiveOption("500000", "0");
  const fee = await bridge.getFee(destEid, payload, options);
  console.log("fee is set!")


  const token = Token.attach("0x84cba2A35398B42127B3148744DB3Cd30981fCDf");
  console.log("Approving bridge...");
  await token.approve("0xeEd454c51994c592bB7CEcd5E6472d461B3d7afb", amount);
  console.log("Approved!");


  console.log("Sending token deposit to Bridge...");
  const tx = await bridge.deposit(destEid, amount, tokenAddress, "ETH", {
    value: fee.nativeFee // Send the necessary fee along with the transaction
  });

  console.log(`Your tokens amount: ${amount} is bridged successfully!`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
