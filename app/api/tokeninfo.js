import { useState, useEffect } from "react";

export default function TokenInfo() {
  const [address, setAddress] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTokenInfo = async () => {
    if (!address) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/tokeninfo?address=${address}`);
      if (!res.ok) throw new Error("Failed to fetch token data");
      const data = await res.json();
      setTokenData(data);
    } catch (e) {
      setError(e.message);
      setTokenData(null);
    }
    setLoading(false);
  };

  // Optional: Poll for real-time updates every 10 seconds
  useEffect(() => {
    if (!tokenData) return;
    const interval = setInterval(fetchTokenInfo, 10000);
    return () => clearInterval(interval);
  }, [tokenData, address]);

  return (
    <div style={styles.container}>
      <h2>Enter Token Contract Address</h2>
      <form onSubmit={(e) => { e.preventDefault(); fetchTokenInfo(); }} style={styles.form}>
        <input
          type="text"
          placeholder="Token contract address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Fetch Token Info</button>
      </form>
      {loading && <p>Loading token info...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tokenData && (
        <div style={styles.tokenBox}>
          <h3>
            {tokenData.name} ({tokenData.ticker})
          </h3>
          {tokenData.image && (
            <img src={tokenData.image} alt={tokenData.name} style={styles.image} />
          )}
          <p>Holders: {tokenData.holderInfo?.holders || "N/A"}</p>
          <p>Market Cap: ${tokenData.marketCap ? tokenData.marketCap.toLocaleString() : "N/A"}</p>
          {tokenData.socialLinks && (
            <div style={styles.socialLinks}>
              {tokenData.socialLinks.website && (
                <a href={tokenData.socialLinks.website} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              )}
              {tokenData.socialLinks.twitter && (
                <a href={tokenData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              {tokenData.socialLinks.telegram && (
                <a href={tokenData.socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    margin: "2rem auto",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    maxWidth: "500px",
    textAlign: "center",
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
    textAlign: "center",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "50%",
  },
  socialLinks: {
    marginTop: "0.5rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
};
