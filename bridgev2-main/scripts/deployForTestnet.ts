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

  const amountInEther = "10";
  
  // Convert to Wei using ethers utility function
  const amountIn = ethers.parseUnits(amountInEther, 18);
  
  const Bridge: any = await ethers.getContractFactory("BridgeV2");
  const AlphaToken: any = await ethers.getContractFactory("AlphaToken");

  const token = AlphaToken.attach("0x84cba2A35398B42127B3148744DB3Cd30981fCDf");

  await token.approve("0x9d3Eef214Dab3E607fa2B1F962c685EB132Ba9Ed", amountIn);

  console.log("Bridge approval....");


  const bridge = await Bridge.attach("0x9d3Eef214Dab3E607fa2B1F962c685EB132Ba9Ed");

  const _gas = 500000;
  const destID = 40231;

        const _options = await bridge.getLzReceiveOption(_gas, 0);

        const message: any = await bridge.getMessage(
          amountIn, 
          "0x84cba2A35398B42127B3148744DB3Cd30981fCDf", 
          "0x5682bce3c6e4831503c4C3a9f0Db81ff61EF72a5");

          const {nativeFee,} = await bridge.getFee(destID, message, _options);
          console.log(`Native fee: ${nativeFee}`);


       await bridge.deposit(
        destID, 
        amountIn,
        "0x84cba2A35398B42127B3148744DB3Cd30981fCDf",
        "ARB",
        "0x5682bce3c6e4831503c4C3a9f0Db81ff61EF72a5",
        { 
        value: nativeFee}
      );
      
      console.log("Token bridged to ARB!");

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//bridge testnet sepoila: 0x9d3Eef214Dab3E607fa2B1F962c685EB132Ba9Ed --new
//bridge arb sepolia: 0x980B2F387BBECD67d94B2b6Eebd4FD238946466a -new
//alpha token sepolia: 0x84cba2A35398B42127B3148744DB3Cd30981fCDf
//alpha arb: <0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD>