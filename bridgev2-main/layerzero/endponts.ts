export const ENDPONTS = {
    TESTNET: [
        //sepolia:
        {
            chainID: 11155111,
            endpointId: 40161,
            endpoint: "0x6edce65403992e310a62460808c4b910d972f10f",
            chainName: "ETH",
            token: "0x9953a06D23370dE992D751bDda468b7cdA252109"
        },
        //mumbai
        {
            chainID: 80001,
            endpointId: 40109,
            endpoint: "0x6edce65403992e310a62460808c4b910d972f10f",
            chainName: "MATIC",
            token: "0x0c957613512746B6D9a95b4ae4dA18a9eeE868c1"
        },
        //fuji
        {
            chainID: 43113,
            endpointId: 40106,
            endpoint: "0x6edce65403992e310a62460808c4b910d972f10f",
            chainName: "AVAX",
            token: "0x170858b24d4E796eE74C17d44b5E320081c7cB18"
        }
    ],
    MAINNETS: [
        //eth:
        {
            chainID: 1,
            endpointId: 30101,
            endpoint: "0x1a44076050125825900e736c501f859c50fe728c",
            chainName: "ETH",
            token: "0x9953a06D23370dE992D751bDda468b7cdA252109"
        },
        //arb
        {
            chainID: 42161,
            endpointId: 30110,
            endpoint: "0x1a44076050125825900e736c501f859c50fe728c",
            chainName: "ETH",
            token: "0x0c957613512746B6D9a95b4ae4dA18a9eeE868c1"
        },
        //opt
        {
            chainID: 10,
            endpointId: 30111,
            endpoint: "0x1a44076050125825900e736c501f859c50fe728c",
            chainName: "ETH",
            token: "0x170858b24d4E796eE74C17d44b5E320081c7cB18"
        },
        {
            chainID: 8453,
            endpointId: 30184,
            endpoint: "0x1a44076050125825900e736c501f859c50fe728c",
            chainName: "ETH"
        }
    ],
}