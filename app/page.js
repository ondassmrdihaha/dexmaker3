"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

export default function Home() {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const connection = new Connection(clusterApiUrl("mainnet-beta"));

  // Function to fetch balance
  async function fetchBalance() {
    if (publicKey) {
      try {
        const balanceLamports = await connection.getBalance(new PublicKey(publicKey));
        setBalance(balanceLamports / 1e9);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      }
    }
  }

  // Function to fetch token info
  async function fetchTokenInfo(address) {
    try {
      const response = await fetch(`/api/tokeninfo?address=${address}`);
      if (!response.ok) throw new Error('Failed to fetch token info');
      const data = await response.json();
      setTokenInfo(data);
    } catch (error) {
      console.error("Error fetching token info:", error);
      setTokenInfo(null);
    }
  }

  // Handle token address input
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (tokenAddress) {
      fetchTokenInfo(tokenAddress);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) return;
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [publicKey]);

  return (
    <div style={styles.container}>
      <div style={styles.topRight}>
        <WalletMultiButton />
        {publicKey && (
          <div style={styles.balanceBox}>
            <span>Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}</span>
          </div>
        )}
      </div>

      <h1 style={styles.title}>Welcome to My Memecoin Project! 🚀</h1>
      
      <div style={styles.tokenSection}>
        <form onSubmit={handleAddressSubmit} style={styles.form}>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="Enter token contract address"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Search Token
          </button>
        </form>

        {tokenInfo && (
          <div style={styles.tokenInfo}>
            <h2>Token Information</h2>
            <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    textAlign: "center",
  },
  topRight: {
    position: "absolute",
    top: "20px",
    right: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  balanceBox: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px",
    borderRadius: "5px",
    fontSize: "14px",
  },
  title: {
    marginBottom: "2rem",
  },
  tokenSection: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "300px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tokenInfo: {
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "5px",
    overflowX: "auto",
  },
};
