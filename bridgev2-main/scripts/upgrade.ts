import { ethers, upgrades } from "hardhat";

async function main() {

    const pool = await ethers.getContractFactory("Pool");

    await upgrades.upgradeProxy("0x8e0Be06D13d8B9c4ed8F866D946e87fFFf469205", pool);

    console.log("contract upgraded with new Impl..");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});