# R2FaucetMultiAccounts
Support multi accounts on discord of R2 community
 - Sepolia, Arbitrum Sepolia, Plume, BSC testnet, Monad Testnet, Base Sepolia
 - 
## How to get discord token 
On Discord webpage, F12 - console - paste below code
```
window.webpackChunkdiscord_app.push([
  [Math.random()],
  {},
  req => {
    for (const m of Object.keys(req.c)
      .map(x => req.c[x].exports)
      .filter(x => x)) 
{
      if (m.default && m.default.getToken !== undefined) {
        return copy(m.default.getToken());
      }
      if (m.getToken !== undefined) {
        return copy(m.getToken());
      }
    }
  },
]);
console.log('%cWorked!', 'font-size: 50px');
console.log(`%cYou now have your token in the clipboard!`, 'font-size: 16px');
```
- After excute this code in Chrome, your discord token will be in your clipboard

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Discord token + Wallet address

## Installation

```bash
# Clone the repository
git clone https://github.com/hutaba-dev/R2FaucetMultiAccounts.git

# Navigate to the project directory
cd R2FaucetMultiAccounts

# Install dependencies
npm install dotenv axios form-data uuid
```

## Configuration
Set up multi-accounts
```bash
nano .env
```

```
ACCOUNT_COUNT = total number of accounts

DISCORD_TOKEN_1 = XXXX
WALLET_ADDRESS_1 = EVM1

DISCORD_TOKEN_2 = XXXX
WALLET_ADDRESS_2 = EVM2
...
...
```

## Run

```bash
node index.js
```

The interactive CLI will guide you through:

1. Bot will request daily faucet of all network 
2. After complete faucets of all wallets, bot will be automatically termineated.

## Contributors
- Forked by Hutaba

## License
MIT License
