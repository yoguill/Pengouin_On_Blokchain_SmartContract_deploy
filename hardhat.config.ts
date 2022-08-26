import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ropsten:{
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli:{
      url: process.env.GOERLI_URL || "https://eth-goerli.g.alchemy.com/v2/dX3qpoFlGDaGmzR_fEfr1yLDfT-Uj3WT",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : ["YOU PRIVATE WALLET KEY"],
    },
    Matictest:{
      url: process.env.MATIC_URL || "https://polygon-mumbai.g.alchemy.com/v2/6IFhHZf8qm-BzXQDhsb3ycLBF7MQ0i9j",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : ["YOU PRIVATE WALLET KEY"],
    },
    MaticProd:{
      url: process.env.MATIC_URL || "https://polygon-mainnet.g.alchemy.com/v2/OB0gJhs5XfqilsKy0CDPy-Kc9D80qkxw",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : ["YOU PRIVATE WALLET KEY"],
    },
  },
};


export default config;