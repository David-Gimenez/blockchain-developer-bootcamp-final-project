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


    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
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
