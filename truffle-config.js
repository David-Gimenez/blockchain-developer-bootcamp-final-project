require('dotenv').config();
const HDWalletProvider      = require("@truffle/hdwallet-provider");
const ganahce_PrivateKeys   = [process.env.GANACHE_MANAGER_PK, process.env.GANACHE_RECTOR_PK, process.env.GANACHE_DEAN_PK, process.env.GANACHE_DIRECTOR_PK, process.env.GANACHE_GRADUATE_PK];
const rinkeby_PrivateKeys   = [process.env.RINKEBY_MANAGER_PK, process.env.RINKEBY_RECTOR_PK, process.env.RINKEBY_DEAN_PK, process.env.RINKEBY_DIRECTOR_PK, process.env.RINKEBY_GRADUATE_PK];

const ganache_provider      = new HDWalletProvider({
                                privateKeys:        ganahce_PrivateKeys,
                                providerOrUrl:      "HTTP://127.0.0.1:8545",
                                numberOfAddresses:  5
                            });
const rinkeby_provider      = new HDWalletProvider({
                                privateKeys:        rinkeby_PrivateKeys,
                                providerOrUrl:      process.env.INFURA_API_KEY,
                                numberOfAddresses:  5
                            });

module.exports = {
  networks: {
      develop: {
        host:       "127.0.0.1",
        port:       9545,
        network_id: 5777,
        gas:        8500000000
      },

      rpc: {
        host: "127.0.0.1",
        port: 9545
      },

      ganache: {
        host:       "127.0.0.1",
        port:       8545,
        network_id: 5777,
        gas:        8500000000,
        from:       process.env.GANACHE_MANAGER_ADDRESS,
        provider:   ganache_provider
      },

      rinkeby: {
        chainId:                4,
        network_id:             4,
        //gas:                    30000000,     // GAS LIMIT
        timeout:                20000,
        url:                    process.env.INFURA_API_KEY,
        from:                   process.env.RINKEBY_MANAGER_ADDRESS,
        provider:               rinkeby_provider,
        networkCheckTimeout:    1000000000,
        timeoutBlocks:          200000,
        skipDryRun:             true
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  // This plugin was used to check the contract size during development.
  plugins: ["truffle-contract-size"],
};
