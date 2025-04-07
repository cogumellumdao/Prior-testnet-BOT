# Prior Testnet Auto Bot

This bot automates swapping PRIOR tokens for USDT/USDC on the Base Sepolia testnet to help users participate in the PRIOR airdrop activity.

## Features

- Support for multiple wallets through environment variables
- Automatic approval of PRIOR tokens
- Random amount swapping (between 0.001 and 0.002 PRIOR)
- Random token selection (USDT or USDC)
- Detailed transaction logging with status emojis
- Balance checking for ETH, PRIOR, USDT, and USDC

## Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- Private keys for wallets with Base Sepolia ETH and PRIOR tokens

## Installation

1. Clone the repository:

```bash
git clone https://github.com/cogumellumdao/Prior-testnet-BOT.git
cd Prior-testnet-BOT
```

2. Install dependencies:

```bash
npm install
```

## Usage

Run the bot with:

```bash
node index.js
```

in the TERMINAL add your PRIVATE KEY
select how many INTERACTIONS you want to make


The bot will:
1. Display all loaded wallets
2. Ask how many swaps to perform per wallet
3. Execute random swaps between PRIOR and USDT/USDC
4. Show wallet balances before and after operations

## Smart Contract Addresses

- PRIOR Token: 0xc19Ec2EEBB009b2422514C51F9118026f1cD89ba
- USDT Token: 0x014397DaEa96CaC46DbEdcbce50A42D5e0152B2E
- USDC Token: 0x109694D75363A75317A8136D80f50F871E81044e
- Router: 0x0f1DADEcc263eB79AE3e4db0d57c49a8b6178B0B

## Network

- Base Sepolia Testnet (Chain ID: 84532)
- RPC URL: https://base-sepolia-rpc.publicnode.com/...

## Security Notice

- Keep your private keys safe
- This bot is for testnet only
- Never use your mainnet private keys

## Disclaimer

This project is for educational purposes only. Use at your own risk. The developers are not responsible for any potential loss of funds.

## License

MIT
