import Web3 from "web3";
import {
  web3Loaded,
  web3NetworkLoaded,
  web3AccountLoaded,
  web3BalanceLoaded,
  dbiliaTokenLoaded,
  marketplaceLoaded,
  marketplaceAddress,
} from "../_actions/web3_actions";
import DbiliaTokenABI from "../contracts/abis/DbiliaToken.abi";
import MarketPlaceABI from "../contracts/abis/MarketPlace.abi";

export const loadWeb3 = async (dispatch, provider) => {
  try {
    const web3 = new Web3(provider);
    dispatch(web3Loaded(web3));
    return web3;
  } catch (error) {
    dispatch(web3Loaded(null));
  }
};

export const loadNetwork = async (dispatch, web3) => {
  try {
    let network = await web3.eth.net.getNetworkType();
    network = network.charAt(0).toUpperCase() + network.slice(1);
    dispatch(web3NetworkLoaded(network));
    return network;
  } catch (e) {
    dispatch(web3NetworkLoaded("Wrong network"));
    console.log("Error, load network: ", e);
  }
};

export const loadAccount = async (dispatch, web3) => {
  const accounts = await web3.eth.getAccounts();
  const account = await accounts[0];
  if (typeof account !== "undefined") {
    dispatch(web3AccountLoaded(account));
    return account;
  } else {
    dispatch(web3AccountLoaded(null));
    console.log("logout");
    return null;
  }
};

export const loadBalance = async (dispatch, web3, account) => {
  try {
    // Ether balance in wallet
    const etherBalance = await web3.eth.getBalance(account);
    dispatch(web3BalanceLoaded((etherBalance / 10 ** 18).toFixed(5)));
  } catch (e) {
    console.log("Error, load balance: ", e);
  }
};

export const loadDbiliaToken = async (dispatch, web3, address) => {
  try {
    const contract = new web3.eth.Contract(DbiliaTokenABI, address);
    dispatch(dbiliaTokenLoaded(contract));
    return contract;
  } catch (e) {
    console.log("Error, load contract: ", e);
  }
};

export const loadMarketplace = async (dispatch, web3, address) => {
  try {
    const contract = new web3.eth.Contract(MarketPlaceABI, address);
    dispatch(marketplaceLoaded(contract));
    dispatch(marketplaceAddress(address));
    return contract;
  } catch (e) {
    console.log("Error, load contract: ", e);
  }
};

export const update = async (dispatch, provider) => {
  let web3, account, network;
  web3 = await loadWeb3(dispatch, provider);
  account = await loadAccount(dispatch, web3);
  network = await loadNetwork(dispatch, web3);

  if (network === "Private") {
    await loadDbiliaToken(dispatch, web3, "0x600Da9875dB507b4d840cbeF88428a5ffD894AC2");
    await loadMarketplace(dispatch, web3, "0x8CBe24ADd0F6Aea0F5674696451A468A14b9AA90");
  } else if (network === "Kovan") {
    await loadDbiliaToken(dispatch, web3, "0x26f6Ca8513D606a4Ed71E7d1775C78342aD3467C");
    await loadMarketplace(dispatch, web3, "0x4E66626226d8fE43E6851e978F0eDE4502F90b7E");
  } else if (network === "Main") {
    await loadDbiliaToken(dispatch, web3, "");
    await loadMarketplace(dispatch, web3, "");
  }

  if (account) {
    await loadBalance(dispatch, web3, account);
  }
};
