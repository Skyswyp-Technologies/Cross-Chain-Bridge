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
  // const [account] = await getUnnamedAccounts();

  //  const Bridge: any = await ethers.getContractFactory("BridgeV2");
  //  const bridge =  Bridge.attach("0x74FCAE483Cd97791078B8E6073757e04356C20bd");
  //  console.log("whitelist bridge token..");
  //  await bridge.whitelistToken("0x9bD5bf31c44F7c81F6E6782447e00AE40CFFDcD6", "QTM");
  //  console.log("token set..");

  // const bridge = await Bridge.deploy("0x6EDCE65403992e310A62460808c4b910D972f10f","0x25F0105CBca79C300Efe203503AF091c0dfF1FC3", "OPTIMISM");
  // await bridge.waitForDeployment(); 

  // console.log("Bridge deployed: ", bridge.target);

  //  const MtzPool = await ethers.getContractFactory("Pool");
  //  const pool = await upgrades.deployProxy( MtzPool, ["0x25F0105CBca79C300Efe203503AF091c0dfF1FC3"]);
  // // const oracle =  MtzPool.attach("0x688AB7Ce8a1d24093c1f517422c4a3d112E620Aa");
  // // await oracle.setAssetPrice("0xEa0c23A2411729073Ed52fF94b38FceffE82FDE3", parseUnits("1", 18));
  // console.log(" deployed...", pool.target);


  const Nft = await ethers.getContractFactory("Quantum");
  const debtToken = await Nft.deploy();
  await debtToken.waitForDeployment();
  console.log("deployed token..", debtToken.target);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//bridge testnet ETH sepoila: 0x67e0B3f4069e59812EecC65DF127811A43AF5Eb9 --new
//bridge arb sepolia: 0x74FCAE483Cd97791078B8E6073757e04356C20bd -new
//bridge base sepolia: 0xf762f004a30CB141d139C900f2Aa3631Db7FD2E7
//alpha token sepolia: 0x84cba2A35398B42127B3148744DB3Cd30981fCDf
//alpha arb: 0x43535C041AF9d270Bd7aaA9ce5313d960BBEABAD
// alpha base: 0x2816a02000B9845C464796b8c36B2D5D199525d5
//base oracle: 0x30d96E0c312098C8a40db596B95326ba8e2726F8
//base lending: 0x8e0Be06D13d8B9c4ed8F866D946e87fFFf469205
//base USDCC: 0x5d3398142E393bB4BBFF6f67a3778322d3F9D90B
//base USDTC: 0x567319975c42BaFdf80B42222340A9Cc8015693e
//KES base: 0x348490F429cb31A4E45a2323f359880302227fDA
//base QTM token: 0x2898dE208BC827089BD41131F09423E554c51a11
//sep QTM token: 0xeAaeD7BC22672162Cb2114EA0b78A6162354c864
//QTM arb sep: 0x9bD5bf31c44F7c81F6E6782447e00AE40CFFDcD6