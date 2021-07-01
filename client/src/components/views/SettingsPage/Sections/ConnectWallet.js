import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useWeb3Modal } from "../../../../hooks";

function ConnectWallet(config = {}) {
  const account = useSelector((state) => state.web3.account);
  const balance = useSelector((state) => state.web3.balance);
  const network = useSelector((state) => state.web3.network);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <>
      <div style={{ padding: "2rem 0" }}>
        <h2>Connect to your Ethereum wallet</h2>
       
        {account && (
          <div>
            <p>You are connected to: </p>
            Account:{" "}
            <u>{account.substring(0, 6) + "..." + account.substring(38, 42)}</u>
            &nbsp; network: <u>{network}</u>&nbsp; balance: <u>{balance} ETH</u>
            &nbsp;
          </div>
        )}

        <button
          onClick={() => {
            if (!provider) {
              loadWeb3Modal();
            } else {
              logoutOfWeb3Modal();
            }
          }}
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "1rem",
            minWidth: "15rem",
            cursor: "pointer",
            backgroundColor: "#7ea7f3",
            margin: "1rem 0 2rem",
            color: "#fff",
            padding: "1rem 3rem",
          }}
        >
          {!provider ? "Connect Wallet" : "Disconnect Wallet"}
        </button>
      </div>
    </>
  );
}

export default ConnectWallet;
