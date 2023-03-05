var express = require("express");
const { exec } = require("child_process");
const { TokenModal, NftModal } = require("../functions/dbconfig");
const { getToken, getNft } = require("../functions/dbfunctions");
const multer = require("multer");
const path = require("path");
const { verifyMessage } = require("ethers/lib/utils");
var router = express.Router();


function verifyMessages(signature, message){
  const account =  verifyMessage(message, signature);
  console.log(account);
  return account;
}


const storage = multer.diskStorage({
  destination:  ( req, file, cb)=>{
    const pathDir = path.join(__dirname, "../uploads");
    cb(null, pathDir);
  },
  filename: (req, file, cb)=>{
    const {signature, contractAddress, chainId} = req.body;
    const account = verifyMessages(signature, "uploadProfile");
    cb(null, `${account}_${contractAddress}_${chainId}.jpg`);
  }
});

const upload = multer({ storage });

function executeChild(command) {
  const child = exec(command);
  child.on("exit", () => {
    executeChild(command);
  });
}

router.post('/updateProfilePicture', upload.single("avatar"), (req, res, next) =>  {
  res.send({code: 1, message: "success"});
})

router.get('/getTokenImage', (req, res, next) => {
  const { account, contractAddress, chainId } = req.query;
  res.sendFile(path.join(__dirname, "../uploads", `${account}_${contractAddress}_${chainId}.jpg`));
})

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

TokenModal.find().then(result=> {
  result.forEach((value) => {
    executeChild(`node ERC20listener.js ${value.address} ${value.network} ${value.chainId}`)
  })
})

router.post("/setToken", async function (req, res, next) {
  const {
    address,
    network,
    name,
    symbol,
    decimals,
    initialSupply,
    initialPrice,
    startTime,
    endTime,
    tokenType,
    description,
    website,
    deployerAddress,
  } = req.body;
  try {
    await TokenModal.insertMany([
      {
        name,
        symbol,
        decimals,
        initialSupply,
        initialPrice,
        startTime,
        endTime,
        address,
        tokenType,
        description,
        website,
        chainId: network.id,
        deployerAddress,
        network: network.network
      },
    ]);
    executeChild(`node ERC20listener.js ${address} ${network.network} ${network.id}`);
    res.send({ code: 1, message: "Success" });
  } catch (err) {
    console.log(err);
    res.send({ code: 0, message: err.message });
  }
});

router.get("/getToken", async function (req, res, next) {
  const { contractAddress, chainId } = req.query;
  const result = await getToken(contractAddress, Number(chainId));
  res.send({ code: 1, data: result });
});

router.get("/getAllERC20", async function (req, res, next) {
  const result = await TokenModal.find();
  res.send({ code: 1, data: result });
});


router.post("/setNft", async function(req, res, next){
  const {
    network,
    address,
    name,
    symbol,
    maxSupply,
    price,
    website,
    description,
    ipfs,
    startTime,
    endTime,
    deployerAddress
  } = req.body;

  try {
    NftModal.insertMany([
      {
        address,
        name,
        symbol,
        maxSupply,
        initialPrice: price,
        website,
        description, 
        ipfs,
        startTime,
        endTime,
        deployerAddress,
        chainId: network.id,
        network: network.network
      }
    ])
    executeChild(`node ERC721listener.js ${address} ${network.network} ${network.id}`);
    res.send({ code: 1, message: "Success" });
  }
  catch (err){
    console.log(err);
    res.send({code: 0, message: err.message});
  }
})

router.get("/getAllERC721", async function (req, res, next) {
  const result = await NftModal.find();
  res.send({ code: 1, data: result });
});

router.get("/getNft", async function (req, res, next) {
  const { contractAddress, chainId } = req.query;
  const result = await getNft(contractAddress, Number(chainId));
  res.send({ code: 1, data: result });
});

module.exports = router;
