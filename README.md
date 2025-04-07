```markdown
# Prior Testnet Auto Bot

This bot automates swapping PRIOR tokens for USDT/USDC on the Base Sepolia testnet to help users participate in the PRIOR airdrop activity.

## Features

- Single wallet support with private key input via terminal
- Automatic approval of PRIOR tokens
- Random amount swapping (between 0.001 and 0.002 PRIOR)
- Random token selection (USDT or USDC)
- Detailed transaction logging with status emojis
- Balance checking for ETH, PRIOR, USDT, and USDC

## Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- A private key for a wallet with Base Sepolia ETH and PRIOR tokens

## Installation

1. Clone the repository (if hosted):

```bash
git clone https://github.com/yourusername/Prior-Testnet-Auto-Bot.git
cd Prior-Testnet-Auto-Bot
```

Alternatively, create a new directory and save the script as `index.js`.

2. Install dependencies:

```bash
npm install ethers@5.7.2 readline
```

## Usage

Run the bot with:

```bash
node index.js
```

The bot will:
1. Prompt you to enter your private key in the terminal
2. Display the loaded wallet address
3. Ask how many swaps to perform
4. Request confirmation to proceed
5. Execute random swaps between PRIOR and USDT/USDC
6. Show wallet balances before and after operations

**Note**: Be cautious when entering your private key in the terminal, as it will be visible. Ensure you are in a secure environment.

## Smart Contract Addresses

- PRIOR Token: `0xc19Ec2EEBB009b2422514C51F9118026f1cD89ba`
- USDT Token: `0x014397DaEa96CaC46DbEdcbce50A42D5e0152B2E`
- USDC Token: `0x109694D75363A75317A8136D80f50F871E81044e`
- Router: `0x0f1DADEcc263eB79AE3e4db0d57c49a8b6178B0B`

## Network

- Base Sepolia Testnet (Chain ID: 84532)
- RPC URL: `https://base-sepolia-rpc.publicnode.com/...`

## Security Notice

- Keep your private key secure and never share it
- This bot is for testnet use only
- Never use your mainnet private key with this bot
- Be aware that the private key will be visible in the terminal while typing

## Disclaimer

This project is for educational purposes only. Use at your own risk. The developers are not responsible for any potential loss of funds.

## License

MIT
```
