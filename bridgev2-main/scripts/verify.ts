import {run} from "hardhat";

async function main() {
    //deployed contract address
    const contractAddress = "0x9bD5bf31c44F7c81F6E6782447e00AE40CFFDcD6";
  
    // constructor arguments
    const constructorArguments = [
      //"0x6EDCE65403992e310A62460808c4b910D972f10f",
      "0x25F0105CBca79C300Efe203503AF091c0dfF1FC3"
      //"BASE"
    ];
  
    try {
      console.log(`Verifying contract at address: ${contractAddress}`);
      
      await run("verify:verify", {
        address: contractAddress
        //constructorArguments: constructorArguments,
      });
  
      console.log("Contract verified successfully!");
    } catch (error:any) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log("Contract is already verified!");
      } else {
        console.error("Verification failed:", error);
      }
    }
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });