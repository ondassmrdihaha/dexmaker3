"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export default function Home() {
  // useConnection gives you the same Connection from providers.js
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    if (!publicKey) return;

    try {
      console.log("Fetching balance for:", publicKey.toBase58());
      const balanceLamports = await connection.getBalance(new PublicKey(publicKey));
      setBalance(balanceLamports / 1e9); // lamports -> SOL
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(null);
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
            <span>
              Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
            </span>
          </div>
        )}
      </div>
      <h1>Welcome to My Memecoin Project!1 🚀</h1>
    </div>
  );
}

const styles = {
  container: { padding: "20px", textAlign: "center" },
  topRight: { position: "absolute", top: "20px", right: "20px", display: "flex", gap: "10px" },
  balanceBox: { backgroundColor: "#007bff", color: "white", padding: "8px", borderRadius: "5px" },
};
