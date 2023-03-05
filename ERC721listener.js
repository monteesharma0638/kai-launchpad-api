const ethers = require("ethers");
const { abi } = require("./contracts/NftQueryable.json");
const { NftSalesModal } = require("./functions/dbconfig");

const address = process.argv[2];
const providerName = process.argv[3];
const chainId = process.argv[4];
console.log(address, providerName);

const provider = new ethers.providers.AlchemyWebSocketProvider(providerName, "2W4_tmlyWMSwuqWZkitRFY454xDSPhTv");

const contract = new ethers.Contract(address, abi, provider);

contract.on("BuyToken", (to, ethAmount, tokenAmount, timestamp, data) => {
  NftSalesModal.insertMany({
    address,
    to,
    ethAmount,
    tokenAmount,
    timestamp,
    hash: data.transactionHash,
    chainId
  })
})
