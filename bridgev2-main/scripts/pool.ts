import { ethers } from "hardhat";
import { formatUnits, parseUnits } from "ethers";


async function main() {

    const MtzPool = await ethers.getContractFactory("Pool");
    const pool = MtzPool.attach("0x8e0Be06D13d8B9c4ed8F866D946e87fFFf469205");


   // gnUSD plume has 18 decimal places like ETH
const amount = parseUnits("1", 6); 
const RateForLending = parseUnits("0.9", 18);
const amountForBorrowing = parseUnits("0.8", 18); // Similarly for borrowing
const interestRateForLending = parseUnits("0.1", 18);
const interestRateForBorrowing = parseUnits("0.09", 18); 
const price = parseUnits("1", 18); 
const duration = parseUnits("5", 18);

// console.log("price set...");
// oracle.setAssetPrice("0x401eCb1D350407f13ba348573E5630B83638E30D", price);
// console.log("token in....");

// // Send the transaction to call the `supply` function
// const pay = await nft.startAuction(1, {
//   gasLimit: 500000, // Set the gas limit
// });

// //gnusd imp: 0x76DFE58b61D0E971809a0aCdd3468A6DfC002B6e

//  console.log("setting pool params...");

// console.log("nft lend...");

//  const tx = await nft.setPoolToken(amount, 0, "0xe311d959075bf885987766ac0960ef20262e8de1");

// const hash = await pool.setPoolParams("0xEa0c23A2411729073Ed52fF94b38FceffE82FDE3", amount, {
//   gasLimit: 500000, // Set the gas limit
// });

//  console.log("pool set...");

// pool.addTokensForLending("USDCC", "0x5d3398142E393bB4BBFF6f67a3778322d3F9D90B", RateForLending, interestRateForLending);
// console.log("token set for lending");

console.log("token for borrowing...");

pool.addTokensForBorrowing("USDCC", "0x5d3398142E393bB4BBFF6f67a3778322d3F9D90B", amountForBorrowing, interestRateForBorrowing);
console.log("token set for borrowing");

// console.log("oracle set...");
// pool.addPriceFeed("0x30d96E0c312098C8a40db596B95326ba8e2726F8");
// console.log("added...");

}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
