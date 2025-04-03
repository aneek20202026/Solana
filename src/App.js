import React, { useState, useEffect } from "react";
import { Connection, PublicKey, clusterApiUrl, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet, WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from "@solana/spl-token";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const payer = Keypair.generate();
const mintAuthority = Keypair.generate();
const freezeAuthority = Keypair.generate();

const App = () => {
  const wallet = useWallet();
  const [balance, setBalance] = useState(0);
  const [tokenMint, setTokenMint] = useState(null);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (wallet.publicKey) {
      connection.getBalance(wallet.publicKey).then((bal) => setBalance(bal / 1e9));
    }
  }, [wallet]);

  const createToken = async () => {
    if (!wallet.publicKey) {
      setMessage("Please connect your wallet first.");
      return;
    }
  
    try {
      setMessage("Creating token...");
      
      // Check wallet balance first
      const balance = await connection.getBalance(wallet.publicKey);
      const minBalance = 0.05 * LAMPORTS_PER_SOL; // Approximately needed for token creation
      
      if (balance < minBalance) {
        setMessage(`Insufficient balance. Need at least 0.05 SOL. Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);
        return;
      }
  
      const mint = await createMint(
        connection,
        payer,
        mintAuthority.publicKey,
        freezeAuthority.publicKey,
        9
      );
  
      setTokenMint(mint.toBase58());
      setMessage("Token created: " + mint.toBase58());
    } catch (error) {
      console.error("Full error:", error);
      
      // Handle SendTransactionError specifically
      if (error.name === "SendTransactionError") {
        try {
          const logs = error.getLogs();
          setMessage(`Transaction failed: ${error.message}. Logs: ${logs.join(', ')}`);
        } catch (e) {
          setMessage(`Transaction failed: ${error.message}. Unable to get logs.`);
        }
      } else {
        setMessage("Error: " + error.message);
      }
    }
  };

  const mintTokens = async () => {
    if (!tokenMint) return alert("Create a token first");
    try {
      setMessage("Minting tokens...");
      const mintPublicKey = new PublicKey(tokenMint);
      const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, wallet.publicKey, mintPublicKey, wallet.publicKey);
      await mintTo(connection, wallet.publicKey, mintPublicKey, tokenAccount.address, wallet.publicKey, 100 * 1e9);
      setMessage("Minted 100 tokens");
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const sendTokens = async () => {
    if (!tokenMint){
      setMessage("Please create a token.");
      return;
    }
    else if (!recipient || !amount) {
      setMessage("Please enter recipient and amount.");
      return;
    }
    try {
      setMessage("Sending tokens...");
      const mintPublicKey = new PublicKey(tokenMint);
      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(connection, wallet.publicKey, mintPublicKey, wallet.publicKey);
      const recipientPublicKey = new PublicKey(recipient);
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(connection, wallet.publicKey, mintPublicKey, recipientPublicKey);
      await transfer(connection, wallet.publicKey, senderTokenAccount.address, recipientTokenAccount.address, wallet.publicKey, parseInt(amount) * 1e9);
      setMessage("Sent " + amount + " tokens to " + recipient);
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Solana Token Creator</h1>
      <WalletMultiButton className="wallet-button" />
      {wallet.publicKey && <p>Wallet Address: {wallet.publicKey.toBase58()}</p>}
      <p className="balance">SOL Balance: {balance} SOL</p>
      <button onClick={createToken} className="action-button create">Create Token</button>
      <button onClick={mintTokens} className="action-button mint">Mint Tokens</button>
      <div className="transfer-section">
        <input type="text" placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={sendTokens} className="action-button send">Send Tokens</button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default function WrappedApp() {
  return (
    <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}