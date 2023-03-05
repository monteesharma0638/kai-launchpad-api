const { TokenModal, mongoose, NftModal } = require("./dbconfig");

async function getToken(address, chainId) {
  const result = await TokenModal.aggregate([
    {
      $match: {
        address,
        chainId,
      },
    },
    {
      $lookup: {
        from: "tokensales",
        let: {
          address: "$address",
          chainId: "$chainId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$address", "$$address"],
                  },
                  {
                    $eq: ["$chainId", "$$chainId"],
                  },
                ],
              },
            },
          },
        ],
        as: "sales",
      },
    },
  ]);
  return result;
}

async function getNft(address, chainId) {
  const result = await NftModal.aggregate([
    {
      $match: {
        address,
        chainId,
      },
    },
    {
      $lookup: {
        from: "nftsales",
        let: {
          address: "$address",
          chainId: "$chainId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$address", "$$address"],
                  },
                  {
                    $eq: ["$chainId", "$$chainId"],
                  },
                ],
              },
            },
          },
        ],
        as: "sales",
      },
    },
  ]);
  return result;
}



module.exports = {
  getToken,
  getNft
};
