export const RPCS = {
    MAINNET: {
      ETH: {
        infura: {
          http: `https://eth-mainnet.g.alchemy.com/v2/y7y8_cj2CzI1OfRurBGWDmxawXfe1pRM`,
          ws: "wss://eth-mainnet.g.alchemy.com/v2/y7y8_cj2CzI1OfRurBGWDmxawXfe1pRM",
        },
        chainStack: {
          http: "https://nd-976-521-701.p2pify.com/55cb37876d6ce197ede6b29cf7a366da",
          ws: "wss://eager-goldstine:slimy-hurt-comic-cozy-askew-egging@ws-nd-976-521-701.p2pify.com",
        },
      },
      BSC: {
        moralis: {
          http: `https://speedy-nodes-nyc.moralis.io/040ef474e37e0b8159478d87/bsc/mainnet`,
          ws: "wss://speedy-nodes-nyc.moralis.io/3d4fb74d91f3a5f421ee3f10/bsc/mainnet/ws",
        },
        chainStack: {
          http: "https://nd-567-105-839.p2pify.com/a3a60bcca6e5a7400478afd51e35c04b",
          ws: "wss://stupefied-ritchie:jovial-clean-wispy-rocky-unhook-width@ws-nd-567-105-839.p2pify.com",
        },
        default: "https://bsc-dataseed.bnbchain.org",
      },
      POLY: {
        moralis: {
          http: "https://speedy-nodes-nyc.moralis.io/3d4fb74d91f3a5f421ee3f10/bsc/testnet",
          ws: "wss://speedy-nodes-nyc.moralis.io/3d4fb74d91f3a5f421ee3f10/bsc/testnet/ws",
        },
        chainStack: {
          http: "https://nd-671-873-010.p2pify.com/05ed74c1c065aa00972562949116d803",
          ws: "wss://elegant-beaver:mower-outer-exit-lingo-subway-reward@ws-nd-671-873-010.p2pify.com",
        },
        default: "https://polygon-mainnet.g.alchemy.com/v2/PBhA0EhjcwAlLFvM2J5iwk5vzRx3Tex-",
      },
      AVAX: {
        moralis: {
          http: "https://speedy-nodes-nyc.moralis.io/040ef474e37e0b8159478d87/avalanche/mainnet",
          ws: "wss://speedy-nodes-nyc.moralis.io/3d4fb74d91f3a5f421ee3f10/avalanche/mainnet/ws",
        },
        chainStack: {
          http: "https://nd-549-954-230.p2pify.com/b84bb09ef8973311736d42970c5aff1d/ext/bc/C/rpc",
          ws: "wss://elated-austin:mammal-eskimo-rants-ashes-fool-dodgy@ws-nd-549-954-230.p2pify.com/ext/bc/C/ws",
        },
        default: "https://rpc.ankr.com/avalanche",
      },
      FANTOM: {
        chainStack: {
          http: "https://nd-132-914-224.p2pify.com/5d79b24f9bbe0f65394e902eba3df8ff",
          ws: "wss://ws-nd-132-914-224.p2pify.com/5d79b24f9bbe0f65394e902eba3df8ff",
        },
      },
      HECO: {
        chainStack: {
          http: "https://hecoapi.terminet.io/rpc",
          ws: null,
        },
      },
      KCC: {
        chainStack: {
          http: "https://rpc-mainnet.kcc.network",
          ws: null,
        },
      },
      OPTIMISM: {
        chainStack: {
          http: "https://mainnet.optimism.io",
          ws: null,
        },
      },
      MOVR: {
        chainStack: {
          http: "https://moonriver-mainnet.gateway.pokt.network/v1/lb/630f77884345ea003ad64749",
          ws: null,
        },
      },
      MOONBEAM: {
        chainStack: {
          http: "https://rpc.ankr.com/moonbeam",
          ws: null,
        },
      },
      AURORA: {
        chainStack: {
          http: "https://mainnet.aurora.dev",
          ws: null,
        },
      },
      CHRONOS: {
        chainStack: {
          http: "https://evm.cronos.org",
          ws: null,
        },
      },
      XDAI: {
        chainStack: {
          http: "https://xdai-rpc.gateway.pokt.network",
          ws: null,
        },
      },
      OKC: {
        default: {
          http: "https://exchainrpc.okex.org",
          ws: null,
        },
      },
      ARBI: {
        default: {
        http: "https://arb1.arbitrum.io/rpc",
          ws: null,
        },
      },
      ZK: {
        default: {
        http: "https://zksync-era.blockpi.network/v1/rpc/public",
          ws: null,
        },
      },
      BASE: {
        default: {
        http: "https://base-mainnet.g.alchemy.com/v2/Jp_T4AbrimcPD7Csq3aQ-bCxsMvBpXvv",
          ws: null,
        },
      },
    },
    TESTNET: {
      ETH: {
        chainStack: {
          http: "https://ropsten.infura.io/v3/679e629368664df78fb2bdb6826271b7",
          ws: "wss://ropsten.infura.io/ws/v3/679e629368664df78fb2bdb6826271b7",
        },
      },
      BSC: {
        chainStack: {
          http: "https://nd-825-180-289.p2pify.com/c4c00c6b11b709f5cdd9aaafd7c9b386",
          ws: "wss://ws-nd-825-180-289.p2pify.com/c4c00c6b11b709f5cdd9aaafd7c9b386",
        },
      },
      POLY: {
        chainStack: {
          http: "https://nd-644-740-639.p2pify.com/389d1d18313f68f0fd1e9b5b21afe0a9",
          ws: "wss://ws-nd-644-740-639.p2pify.com/389d1d18313f68f0fd1e9b5b21afe0a9",
        },
      },
      AVAX: {
        chainStack: {
          http: "https://nd-419-053-997.p2pify.com/efb3dd75afd27b5547d34c0b63894961/ext/bc/C/rpc",
          ws: "wss://ws-nd-419-053-997.p2pify.com/efb3dd75afd27b5547d34c0b63894961/ext/bc/C/ws",
        },
      },
      FANTOM: {
        default: {
          http: "https://rpc.testnet.fantom.network	",
          ws: null,
        },
      },
      HECO: {
        default: {
          http: "https://http-testnet.hecochain.com",
          ws: null,
        },
      },
      KCC: {
        default: {
          http: "https://rpc-testnet.kcc.network",
          ws: null,
        },
      },
      //! Doesn't work
      OPTIMISM: {
        default: {
          http: "https://kovan.optimism.io/",
          ws: null,
        },
      },
      MOVR: {
        default: {
          http: "https://rpc.api.moonbase.moonbeam.network",
          ws: null,
        },
      },
      MOONBEAM: {
        default: {
          http: "https://rpc.api.moonbase.moonbeam.network",
          ws: null,
        },
      },
      AURORA: {
        default: {
          http: "https://testnet.aurora.dev/",
          ws: null,
        },
      },
      //! Doesn't work
      CHRONOS: {
        default: {
          http: "https://cronos-testnet-3.crypto.org:8545/",
          ws: null,
        },
      },
      //! Doesn't work
      XDAI: {
        default: {
          http: "https://sokol.poa.network",
          ws: null,
        },
      },
      ARBI: {
        default: {
        http: "https://rinkeby.arbitrum.io/rpc",
          ws: null,
        },
      },
    },
  };
  
  export const BRIDGE_CONFIG = {
    mainnet: {
      owner: "0x1620A07Dde3d9a0E492F97Cb60511C717e61C61d",
      addressIndex: 4,
      networks: {
        eth: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.ETH.chainStack.http,
            websocket: RPCS.MAINNET.ETH.chainStack.ws,
          },
          currency: "ethereum",
        },
        bsc: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          sphri: "0x8ea93d00cc6252e2bd02a34782487eed65738152",
          provider: {
            http: RPCS.MAINNET.BSC.chainStack.http,
            websocket: RPCS.MAINNET.BSC.chainStack.ws,
          },
          currency: "binancecoin",
        },
        poly: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.POLY.chainStack.http,
            websocket: RPCS.MAINNET.POLY.chainStack.ws,
          },
          currency: "matic-network",
        },
        avax: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.AVAX.chainStack.http,
            websocket: RPCS.MAINNET.AVAX.chainStack.ws,
          },
          currency: "avalanche-2",
        },
        fantom: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.FANTOM.chainStack.http,
            websocket: RPCS.MAINNET.FANTOM.chainStack.ws,
          },
          currency: "FTM",
        },
        heco: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.HECO.chainStack.http,
            websocket: RPCS.MAINNET.HECO.chainStack.ws,
          },
          currency: "HT",
        },
        kcc: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.KCC.chainStack.http,
            websocket: RPCS.MAINNET.KCC.chainStack.ws,
          },
          currency: "KCC",
        },
        optimism: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.OPTIMISM.chainStack.http,
            websocket: RPCS.MAINNET.OPTIMISM.chainStack.ws,
          },
          currency: "ETH",
        },
        movr: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.MOVR.chainStack.http,
            websocket: RPCS.MAINNET.MOVR.chainStack.ws,
          },
          currency: "MOVR",
        },
        moonbeam: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.MOONBEAM.chainStack.http,
            websocket: RPCS.MAINNET.MOONBEAM.chainStack.ws,
          },
          currency: "GLMR",
        },
        aoa: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.AURORA.chainStack.http,
            websocket: RPCS.MAINNET.AURORA.chainStack.ws,
          },
          currency: "ETH",
        },
        chronos: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.CHRONOS.chainStack.http,
            websocket: RPCS.MAINNET.CHRONOS.chainStack.ws,
          },
          currency: "CRO",
        },
        xdai: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.XDAI.chainStack.http,
            websocket: RPCS.MAINNET.XDAI.chainStack.ws,
          },
          currency: "xDAI",
        },
        okc: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.OKC.default.http,
            websocket: RPCS.MAINNET.OKC.default.ws,
          },
          currency: "OKC",
        },
        arbi: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.MAINNET.ARBI.default.http,
            websocket: RPCS.MAINNET.ARBI.default.ws,
          },
          currency: "ETH",
        },
        zk: {
          bridge: "0xb4819d167C49e95E80b49FB540F18C6d52AE4295",
          provider: {
            http: RPCS.MAINNET.ZK.default.http,
            websocket: RPCS.MAINNET.ZK.default.ws,
          },
          currency: "ETH",
        },
        base: {
          bridge: "0xe1d5dc6572b663dfb270f51dd48181261ef09f78",
          provider: {
            http: RPCS.MAINNET.BASE.default.http,
            websocket: RPCS.MAINNET.BASE.default.ws,
          },
          currency: "ETH",
        },
      },
    },
    testnet: {
      owner: "0x440641eABcA7F5D9274791F8CBF5D337e42e1091",
      networks: {
        eth: {
          bridge: "0x5c66a622741E66EbE89c2c8aD9170D940eeF0B0F",
          provider: {
            http: RPCS.TESTNET.ETH.chainStack.http,
            websocket: RPCS.TESTNET.ETH.chainStack.ws,
          },
          sphri: "0xc9901A3926ada3c807d851BE9736B402bC66B6D6",
          currency: "ethereum",
        },
        bsc: {
          bridge: "0xa7DD473E20F3FdE96D4218D5023Fe32CAa8E3663",
          sphri: "0x16020fCa8aC813c9ADe8e583465aF903E3621eb6",
          provider: {
            http: RPCS.TESTNET.BSC.chainStack.http,
            websocket: RPCS.TESTNET.BSC.chainStack.ws,
          },
          currency: "binancecoin",
        },
        poly: {
          bridge: "0x56aE79ff42c912A6e0662B7838AA5187d99266fF",
          sphri: "0xe5baCd5f70cEfBDE25212c8eD286b7C0B0aBCC2a",
          provider: {
            http: RPCS.TESTNET.POLY.chainStack.http,
            websocket: RPCS.TESTNET.POLY.chainStack.ws,
          },
          currency: "matic-network",
        },
        avax: {
          bridge: "0xfAdB34101309E5718643F4A604d3516f91F03ad5",
          sphri: "0xe5baCd5f70cEfBDE25212c8eD286b7C0B0aBCC2a",
          provider: {
            http: RPCS.TESTNET.AVAX.chainStack.http,
            websocket: RPCS.TESTNET.AVAX.chainStack.ws,
          },
          currency: "avalanche-2",
        },
        fantom: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.TESTNET.FANTOM.default.http,
            websocket: RPCS.TESTNET.FANTOM.default.ws,
          },
          currency: "fantom",
        },
        heco: {
          bridge: "0x7334F890af2ceCa4f7c9aAcc39343012c9460422",
          owner: "0x440641eABcA7F5D9274791F8CBF5D337e42e1091",
          provider: {
            http: RPCS.TESTNET.HECO.default.http,
            websocket: RPCS.TESTNET.HECO.default.ws,
          },
          currency: "htt",
        },
        kcc: {
          bridge: "0x7334F890af2ceCa4f7c9aAcc39343012c9460422",
          owner: "0x440641eABcA7F5D9274791F8CBF5D337e42e1091",
          provider: {
            http: RPCS.TESTNET.KCC.default.http,
            websocket: RPCS.TESTNET.KCC.default.ws,
          },
          currency: "kcs",
        },
        //! Doesn't work
        optimism: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.TESTNET.OPTIMISM.default.http,
            websocket: RPCS.TESTNET.OPTIMISM.default.ws,
          },
          currency: "ethereum",
        },
        movr: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.TESTNET.MOVR.default.http,
            websocket: RPCS.TESTNET.MOVR.default.ws,
          },
          currency: "dev",
        },
        moonbeam: {
          bridge: "0x7334F890af2ceCa4f7c9aAcc39343012c9460422",
          owner: "0xaC18157FFFdc96C9724eB1CF42eb05F8f70e645B",
          provider: {
            http: RPCS.TESTNET.MOONBEAM.default.http,
            websocket: RPCS.TESTNET.MOONBEAM.default.ws,
          },
          currency: "glmr",
        },
        aoa: {
          bridge: "0x7334F890af2ceCa4f7c9aAcc39343012c9460422",
          owner: "0xaC18157FFFdc96C9724eB1CF42eb05F8f70e645B",
          provider: {
            http: RPCS.TESTNET.AURORA.default.http,
            websocket: RPCS.TESTNET.AURORA.default.ws,
          },
          currency: "ethereum",
        },
        //! Doesn't work
        chronos: {
          bridge: "0x7334F890af2ceCa4f7c9aAcc39343012c9460422",
          owner: "0xaC18157FFFdc96C9724eB1CF42eb05F8f70e645B",
          provider: {
            http: RPCS.TESTNET.CHRONOS.default.http,
            websocket: RPCS.TESTNET.CHRONOS.default.ws,
          },
          currency: "cro",
        },
        //! Doesn't work
        xdai: {
          bridge: "0x7334F890af2ceCa4f7c9aAcc39343012c9460422",
          owner: "0xaC18157FFFdc96C9724eB1CF42eb05F8f70e645B",
          provider: {
            http: RPCS.TESTNET.XDAI.default.http,
            websocket: RPCS.TESTNET.XDAI.default.ws,
          },
          currency: "xdai",
        },
        //! todo: Add testnet addresses
        arbi: {
          bridge: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
          provider: {
            http: RPCS.TESTNET.ARBI.default.http,
            websocket: RPCS.TESTNET.ARBI.default.ws,
          },
          currency: "ETH",
        },
      },
    },
  };
  
  export const networkEnv = process.argv[2];
  export default BRIDGE_CONFIG[networkEnv];
  export const networks = BRIDGE_CONFIG[networkEnv].networks;
  export const owner = BRIDGE_CONFIG[networkEnv].owner;
  export const addressIndex = BRIDGE_CONFIG[networkEnv].addressIndex;
  