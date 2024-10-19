import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "@openzeppelin/hardhat-upgrades";


import { load } from "ts-dotenv";
import { version } from "hardhat";

const env = load({
  MAINNET: String,
  ETHERSCAN_API_KEY: String,
  PRIVATE_KEY: String,
 // REPORT_GAS: Boolean,
  OPT_MAIN: String,
  ARB_MAIN: String,
  BASE: String
})

const COMPILER_SETTINGS = {
  optimizer: {
      enabled: true,
      runs: 1000000,
  },
  metadata: {
      bytecodeHash: "none",
  },
}

const config: HardhatUserConfig = {
  defaultNetwork: "mainnet",
  networks: {
    mainnet: {
        url: env.MAINNET !== undefined ? env.MAINNET : "",
        accounts: env.PRIVATE_KEY !== undefined ? [env.PRIVATE_KEY] : [],
        saveDeployments: true,
        chainId: 11155111,
    },
    base: {
      url: env.BASE,
      accounts: env.PRIVATE_KEY !== undefined ? [env.PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 84532,
    },
    optimism: {
      url: env.OPT_MAIN,
      accounts: env.PRIVATE_KEY !== undefined ? [env.PRIVATE_KEY] : [],
      chainId: 11155420,
      saveDeployments: true,
    },
    arb: {
      url: env.ARB_MAIN,
      accounts: env.PRIVATE_KEY !== undefined ? [env.PRIVATE_KEY] : [],
      chainId: 421614,
      saveDeployments: true,
    },
  },
  etherscan: {
      // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
      apiKey: {
          // npx hardhat verify --list-networks
         arbitrumSepolia: env.ETHERSCAN_API_KEY,
         // mainnet: env.ETHERSCAN_API_KEY,
         sepolia: env.ETHERSCAN_API_KEY,
          baseSepolia: env.ETHERSCAN_API_KEY,
          optimism: 'your API key',
      },
  },
  gasReporter: {
      enabled: true,//env.REPORT_GAS !== undefined,
      outputFile: "gas-report.txt",
      noColors: false,
      // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
      contractSizer: {
        runOnCompile: false,
        only: [],//specify contracts
    },
  solidity: {
      compilers: [
          {
              version: "0.8.20",
              settings: COMPILER_SETTINGS
          },
      ],
  },
  mocha: {
      timeout: 200000, // 200 seconds max for running tests
  },
  typechain: {
      outDir: "typechain",
      target: "ethers-v5",
  },
}

export default config
