module.exports = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "_isW3user",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_w3owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "_w2owner",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_creatorReceives",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_sellerReceives",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_timestamp",
        "type": "uint256"
      }
    ],
    "name": "PurchaseWithETH",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "_buyerId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "_isW3user",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_w3owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "_w2owner",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_timestamp",
        "type": "uint256"
      }
    ],
    "name": "PurchaseWithUSD",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_priceUSD",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_timestamp",
        "type": "uint256"
      }
    ],
    "name": "SetForSale",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "dbiliaToken",
    "outputs": [
      {
        "internalType": "contract DbiliaToken",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentPriceOfETHtoUSD",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getThePrice",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "purchaseWithETHw3user",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_buyerId",
        "type": "string"
      }
    ],
    "name": "purchaseWithUSDw2user",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_buyer",
        "type": "address"
      }
    ],
    "name": "purchaseWithUSDw3user",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "removeSetForSaleETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "removeSetForSaleUSD",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_priceUSD",
        "type": "uint256"
      }
    ],
    "name": "setForSaleWithETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_priceUSD",
        "type": "uint256"
      }
    ],
    "name": "setForSaleWithUSD",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tokenPriceUSD",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
