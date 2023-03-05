const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/lauchpad');
}

const TokenSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  decimals: Number,
  initialSupply: Number,
  initialPrice: Number,
  address: String,
  startTime: Date,
  endTime: Date,
  tokenType: {
    type: String,
    enum: [
      "ERC20Mintable", "ERC20MintableBurnable", "ERC20FixedSupply"
    ],
    default: "ERC20Mintable"
  },
  description: {
    type: String,
    default: "No description to show."
  },
  website: {
    type: String,
    default: "No website to show"
  },
  chainId: Number,
  network: String,
  deployerAddress: String
})

const TokenModal = mongoose.model("tokens", TokenSchema);

const TokenSaleSchema = new mongoose.Schema({
  address: String,
  to: String,
  ethAmount: Number,
  tokenAmount: Number,
  timestamp: Number,
  hash: String,
  chainId: Number
})

const TokenSaleModal = mongoose.model("tokensales", TokenSaleSchema);

const NftSchema = new mongoose.Schema({
  address: String,
  name: String,
  symbol: String,
  maxSupply: Number,
  initialPrice: Number,
  website: String,
  description: String,
  ipfs: String,
  tokenType: {
    type: String,
    enum: [
      "ERC721AQueryable"
    ],
    default: "ERC721AQueryable"
  },
  startTime: Date,
  endTime: Date,
  deployerAddress: String,
  chainId: Number,
  network: String
})

const NftModal = mongoose.model("nfts", NftSchema);

const NftSalesSchema = new mongoose.Schema({
  address: String,
  to: String,
  ethAmount: Number,
  tokenAmount: Number,
  timestamp: Number,
  hash: String,
  chainId: Number
})

const NftSalesModal = mongoose.model("nftsales", NftSalesSchema);

module.exports = {
  mongoose,
  TokenModal,
  TokenSaleModal,
  NftModal,
  NftSalesModal
}