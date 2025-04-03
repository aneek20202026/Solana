# Solana Wallet App

A React.js application that allows users to interact with the Solana blockchain, including functionalities such as creating and minting tokens and sending tokens to other accounts. This app integrates with Solana wallets (such as Phantom or Solflare) and uses the Solana SPL Token program to create and manage custom tokens.

## Features
- **Connect to Solana Wallet:** Users can connect their Solana wallet (Phantom/Solflare).
- **Create Tokens:** Users can create their own custom tokens using the Solana SPL Token Program.
- **Mint Tokens:** Users can mint tokens once a custom token is created.
- **Send Tokens:** Users can send tokens to other Solana wallet addresses.
- **Transaction Feedback:** Real-time feedback on transaction success or failure.

## Live Demo
You can try out the live version of this app here:
> **[Solana App](https://solana-bzg.pages.dev/)**

## Installation

To run this app locally, follow these steps:

### Prerequisites
Ensure you have `Node.js` and `npm` installed on your machine.

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Solana.git
   cd Solana
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the app:**
   ```bash
   npm start
   ```

The app will run on `http://localhost:3000`.

## How It Works
1. Connect your Solana wallet using the built-in wallet connection button.
2. Create a token by clicking on the "Create Token" button.
3. Mint tokens after creating the token by clicking on the "Mint Tokens" button.
4. Send tokens by entering the recipient address and amount, then clicking on the "Send Tokens" button.

## Dependencies
- `@solana/web3.js`: Solana's JavaScript API.
- `@solana/wallet-adapter-react`: React hooks for wallet connection.
- `@solana/spl-token`: Solana Token Program library for token operations.

