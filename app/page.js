"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

export default function Home() {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);
  const connection = new Connection(clusterApiUrl("devnet"));

  // Function to fetch wallet balance
  const fetchBalance = async () => {
    if (!publicKey) {
      console.warn("No wallet connected");
      return;
    }

    try {
      console.log("Fetching balance for:", publicKey.toBase58());
      const balanceLamports = await connection.getBalance(new PublicKey(publicKey));
      console.log("Balance in lamports:", balanceLamports);
      setBalance(balanceLamports / 1e9); // Convert lamports to SOL
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(null);
    }
  };

  // Fetch balance when the publicKey changes or on initial load
  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
  }, [publicKey]);

  // Re-fetch balance every 5 seconds when the wallet is connected
  useEffect(() => {
    if (!publicKey) return;
    const interval = setInterval(fetchBalance, 5000); // Updates every 5 seconds
    return () => clearInterval(interval); // Cleanup when the component unmounts
  }, [publicKey]);

  return (
    <div style={styles.container}>
      <div style={styles.topRight}>
        <WalletMultiButton />
        {publicKey && (
          <div style={styles.balanceBox}>
            <span>
              Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
            </span>
          </div>
        )}
      </div>

      <h1>Welcome to My Memecoin Project! 🚀</h1>
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
};
