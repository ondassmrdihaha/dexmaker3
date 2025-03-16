"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export default function Home() {
  // Wallet and balance functionality
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    if (!publicKey) return;
    try {
      const balanceLamports = await connection.getBalance(new PublicKey(publicKey));
      setBalance(balanceLamports / 1e9);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(null);
    }
  };

  useEffect(() => {
    if (publicKey) fetchBalance();
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) return;
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [publicKey]);

  // Token info functionality
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [tokenError, setTokenError] = useState(null);

  const fetchTokenData = async (address) => {
    setLoadingToken(true);
    setTokenError(null);
    setTokenData(null);
    try {
      const res = await fetch(`/api/tokeninfo?address=${address}`);
      if (!res.ok) {
        throw new Error("Failed to fetch token info");
      }
      const data = await res.json();
      setTokenData(data);
    } catch (err) {
      console.error(err);
      setTokenError(err.message);
    }
    setLoadingToken(false);
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (tokenAddress.trim()) {
      fetchTokenData(tokenAddress.trim());
    }
  };

  return (
    <div style={styles.container}>
      {/* Wallet Connect & Live Balance */}
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
      
      {/* Token Info Window */}
      <div style={styles.tokenInfoContainer}>
        <h2>Paste Your Token Contract Address</h2>
        <form onSubmit={handleTokenSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter token contract address..."
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Get Token Info
          </button>
        </form>
        {loadingToken && <p>Loading token info...</p>}
        {tokenError && <p style={{ color: "red" }}>Error: {tokenError}</p>}
        {tokenData && (
          <div style={styles.tokenBox}>
            <h3>
              {tokenData.name} ({tokenData.ticker})
            </h3>
            {tokenData.image && (
              <img
                src={tokenData.image}
                alt={tokenData.name}
                style={styles.image}
              />
            )}
            <p>Holders: {tokenData.holderInfo?.holders}</p>
            <p>
              Market Cap:{" "}
              {tokenData.marketCap ? `$${tokenData.marketCap.toLocaleString()}` : "N/A"}
            </p>
            {tokenData.socialLinks && (
              <div style={styles.socialLinks}>
                {tokenData.socialLinks.website && (
                  <a
                    href={tokenData.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </a>
                )}
                {tokenData.socialLinks.twitter && (
                  <a
                    href={tokenData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                )}
                {tokenData.socialLinks.telegram && (
                  <a
                    href={tokenData.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Telegram
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
  tokenInfoContainer: {
    marginTop: "2rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  form: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  input: {
    flex: 1,
    padding: "0.5rem",
  },
  button: {
    padding: "0.5rem 1rem",
  },
  tokenBox: {
    marginTop: "1rem",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "50%",
    margin: "0.5rem 0",
  },
  socialLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "0.5rem",
  },
};
