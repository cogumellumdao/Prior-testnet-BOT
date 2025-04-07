require('dotenv').config();
const ethers = require('ethers');
const readline = require('readline');

const PRIOR_ADDRESS = '0xc19Ec2EEBB009b2422514C51F9118026f1cD89ba';
const USDT_ADDRESS = '0x014397DaEa96CaC46DbEdcbce50A42D5e0152B2E';
const USDC_ADDRESS = '0x109694D75363A75317A8136D80f50F871E81044e';
const RPC_URL = 'https://base-sepolia-rpc.publicnode.com/89e4ff0f587fe2a94c7a2c12653f4c55d2bda1186cb6c1c95bd8d8408fbdc014';
const CHAIN_ID = 84532;
const ROUTER_ADDRESS = '0x0f1DADEcc263eB79AE3e4db0d57c49a8b6178B0B';

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Cores ANSI para o painel
const COLORS = {
  CYAN: '\x1b[36m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  RESET: '\x1b[0m'
};

const SYMBOLS = {
  info: '📋',
  success: '✅',
  error: '❌',
  warning: '⚠️',
  pending: '⏳',
  wallet: '💳',
  eth: '💎',
  prior: '🔶',
  usdt: '💵',
  usdc: '💰',
  swap: '🔄',
  approve: '🔑',
  wait: '⌛',
};

// Variáveis para o display
let startTime = Date.now();
let totalSwaps = 0;
let successfulSwaps = 0;
let logMessages = [];
let currentWalletCount = 0;

// Banner no estilo "Cogu Drops" (exatamente como fornecido, sem nenhuma alteração)
const BANNER = [
  `${COLORS.CYAN}╭───────────────────────────────────────────────────────────────────────────────────────╮${COLORS.RESET}`,
  `${COLORS.CYAN}│                                                                                       │${COLORS.RESET}`,
  `${COLORS.GREEN}│      ██████╗ ██████╗  ██████╗ ██╗   ██╗     ██████╗ ██████╗  ██████╗ ██████╗ ███████╗ │${COLORS.RESET}`,
  `${COLORS.GREEN}│     ██╔════╝██╔═══██╗██╔════╝ ██║   ██║    ██╔═══██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝ │${COLORS.RESET}`,
  `${COLORS.GREEN}│     ██║     ██║   ██║██║  ███╗██║   ██║    ██║   ██║██████╔╝██║   ██║██████╔╝███████╗ │${COLORS.RESET}`,
  `${COLORS.GREEN}│     ██║     ██║   ██║██║   ██║██║   ██║    ██║   ██║██╔══██╗██║   ██║██╔═══╝ ╚════██║ │${COLORS.RESET}`,
  `${COLORS.GREEN}│     ╚██████╗╚██████╔╝╚██████╔╝╚██████╔╝    ╚██████╔╝██║  ██║╚██████╔╝██║     ███████║ │${COLORS.RESET}`,
  `${COLORS.GREEN}│      ╚═════╝ ╚═════╝  ╚═════╝  ╚═════╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝ │${COLORS.RESET}`,
  `${COLORS.GREEN}│                 PRIOR TESTNET - CogumellumDROPS                                     │${COLORS.RESET}`,
  `${COLORS.CYAN}│                                                                                       │${COLORS.RESET}`,
  `${COLORS.CYAN}╰───────────────────────────────────────────────────────────────────────────────────────╯${COLORS.RESET}`
];

// Número de linhas fixas (banner + status)
const FIXED_LINES = BANNER.length + 6; // Banner (11 linhas) + Status (6 linhas)

function getUptime() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`;
}

function updateDisplay() {
  console.clear();
  const terminalWidth = Math.min(process.stdout.columns || 80, 80);
  const terminalHeight = process.stdout.rows || 24;

  // Parte fixa: Banner e Status
  console.log(BANNER.join('\n'));
  const statusPanel = [
    `${COLORS.CYAN}=== Bot Status ===${COLORS.RESET}`,
    `${COLORS.RESET}Uptime: ${getUptime()}${' '.repeat(terminalWidth - 18 - getUptime().length)}`,
    `${COLORS.RESET}Wallets Loaded: ${currentWalletCount}${' '.repeat(terminalWidth - 22 - currentWalletCount.toString().length)}`,
    `${COLORS.RESET}Total Swaps: ${totalSwaps}${' '.repeat(terminalWidth - 19 - totalSwaps.toString().length)}`,
    `${COLORS.RESET}Successful: ${successfulSwaps}${' '.repeat(terminalWidth - 18 - successfulSwaps.toString().length)}`,
    `${COLORS.CYAN}${''.padEnd(terminalWidth, '=')}${COLORS.RESET}`
  ].join('\n');
  console.log(statusPanel);

  // Parte rolante: Logs
  console.log(`\n${COLORS.YELLOW}Recent Logs:${COLORS.RESET}`);
  const logSpace = Math.max(5, terminalHeight - FIXED_LINES - 3); // Ajusta o espaço para logs
  const startIndex = Math.max(0, logMessages.length - logSpace);
  logMessages.slice(startIndex).forEach(msg => {
    const truncatedMsg = msg.length > terminalWidth - 4 ? msg.slice(0, terminalWidth - 7) + '...' : msg;
    console.log(`${truncatedMsg}${' '.repeat(terminalWidth - 3 - truncatedMsg.length)}`);
  });
}

function logInfo(msg) {
  logMessages.push(`${SYMBOLS.info} ${msg}`);
  if (logMessages.length > 50) logMessages.shift();
  updateDisplay();
}

function logSuccess(msg) {
  logMessages.push(`${SYMBOLS.success} ${msg}`);
  if (logMessages.length > 50) logMessages.shift();
  updateDisplay();
}

function logError(msg) {
  logMessages.push(`${SYMBOLS.error} ${msg}`);
  if (logMessages.length > 50) logMessages.shift();
  updateDisplay();
}

function logWarning(msg) {
  logMessages.push(`${SYMBOLS.warning} ${msg}`);
  if (logMessages.length > 50) logMessages.shift();
  updateDisplay();
}

function loadWalletsFromEnv() {
  const wallets = [];
  let index = 1;
  
  while (process.env[`PRIVATE_KEY_${index}`]) {
    const privateKey = process.env[`PRIVATE_KEY_${index}`];
    wallets.push({
      privateKey,
      wallet: new ethers.Wallet(privateKey, provider),
      label: `Wallet ${index}`
    });
    index++;
  }
  
  if (wallets.length === 0 && process.env.PRIVATE_KEY) {
    wallets.push({
      privateKey: process.env.PRIVATE_KEY,
      wallet: new ethers.Wallet(process.env.PRIVATE_KEY, provider),
      label: 'Default Wallet'
    });
  }
  
  return wallets;
}

function getRandomAmount() {
  return (Math.random() * 0.001 + 0.001).toFixed(6);
}

function getRandomToken() {
  return Math.random() < 0.5 ? 'USDT' : 'USDC';
}

async function approvePrior(walletObj, amount) {
  const { wallet, label } = walletObj;
  const priorContract = new ethers.Contract(PRIOR_ADDRESS, ERC20_ABI, wallet);
  
  try {
    const amountInWei = ethers.utils.parseUnits(amount, 18);
    const currentAllowance = await priorContract.allowance(wallet.address, ROUTER_ADDRESS);
    
    if (currentAllowance.gte(amountInWei)) {
      logInfo(`${label} | Allowance for PRIOR already sufficient: ${ethers.utils.formatUnits(currentAllowance, 18)}`);
      return true;
    }

    logInfo(`${label} | Approving PRIOR...`);
    const tx = await priorContract.approve(ROUTER_ADDRESS, amountInWei, { gasLimit: 60000 });
    logInfo(`${label} | Approval transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    logSuccess(`${label} | Approval confirmed in block ${receipt.blockNumber}`);
    return true;
  } catch (error) {
    logError(`${label} | Error approving PRIOR: ${error.message}`);
    return false;
  }
}

async function swapPrior(walletObj, amount, tokenType) {
  const { wallet, label } = walletObj;
  
  try {
    const amountInWei = ethers.utils.parseUnits(amount, 18);
    const approved = await approvePrior(walletObj, amount);
    if (!approved) {
      logWarning(`${label} | Approval failed, aborting swap`);
      return false;
    }

    let txData;
    if (tokenType === 'USDT') {
      txData = '0x03b530a3' + ethers.utils.defaultAbiCoder.encode(['uint256'], [amountInWei]).slice(2);
    } else {
      txData = '0xf3b68002' + ethers.utils.defaultAbiCoder.encode(['uint256'], [amountInWei]).slice(2);
    }

    logInfo(`${label} | Swapping ${amount} PRIOR for ${tokenType}...`);
    const tx = await wallet.sendTransaction({
      to: ROUTER_ADDRESS,
      data: txData,
      gasLimit: ethers.utils.hexlify(500000)
    });
    logInfo(`${label} | Swap transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    logSuccess(`${label} | Swap confirmed in block ${receipt.blockNumber}`);
    successfulSwaps++;
    return true;
  } catch (error) {
    logError(`${label} | Error swapping PRIOR for ${tokenType}: ${error.message}`);
    return false;
  }
}

async function checkBalances(walletObj) {
  const { wallet, label } = walletObj;
  const priorContract = new ethers.Contract(PRIOR_ADDRESS, ERC20_ABI, wallet);
  const usdtContract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, wallet);
  const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
  
  try {
    logInfo(`${label} | Checking balances...`);
    const priorBalance = await priorContract.balanceOf(wallet.address);
    const usdtBalance = await usdtContract.balanceOf(wallet.address);
    const usdcBalance = await usdcContract.balanceOf(wallet.address);
    const ethBalance = await provider.getBalance(wallet.address);
    logInfo(`${label} | ETH: ${ethers.utils.formatEther(ethBalance)} | PRIOR: ${ethers.utils.formatUnits(priorBalance, 18)} | USDT: ${ethers.utils.formatUnits(usdtBalance, 6)} | USDC: ${ethers.utils.formatUnits(usdcBalance, 6)}`);
  } catch (error) {
    logError(`${label} | Error checking balances: ${error.message}`);
  }
}

function delay() {
  logInfo(`Waiting for 10 seconds...`);
  return new Promise(resolve => setTimeout(resolve, 10000));
}

async function runWalletSwaps(walletObj, count) {
  const { label } = walletObj;
  logInfo(`Starting ${count} swap operations for ${label}...`);
  await checkBalances(walletObj);
  
  let successCount = 0;
  
  for (let i = 0; i < count; i++) {
    const amount = getRandomAmount();
    const token = getRandomToken();
    logInfo(`${label} | Swap ${i+1}/${count}: ${amount} PRIOR for ${token}`);
    const success = await swapPrior(walletObj, amount, token);
    if (success) successCount++;
    totalSwaps++;
    if (i < count - 1) await delay();
  }
  
  logInfo(`${label} | Completed ${successCount}/${count} swap operations successfully`);
  await checkBalances(walletObj);
  return successCount;
}

async function runAllWallets(wallets, swapsPerWallet) {
  let totalSuccess = 0;
  
  logInfo(`Found ${wallets.length} wallet(s)`);
  
  for (let i = 0; i < wallets.length; i++) {
    const walletObj = wallets[i];
    logInfo(`Processing wallet ${i+1}/${wallets.length}: ${walletObj.label}`);
    const successes = await runWalletSwaps(walletObj, swapsPerWallet);
    totalSuccess += successes;
    if (i < wallets.length - 1) await delay();
  }
  
  logInfo(`All wallets processed. Total success: ${totalSuccess}/${swapsPerWallet * wallets.length}`);
}

async function main() {
  updateDisplay();
  logInfo(`Bot started on ${new Date().toISOString()}`);
  
  let wallets = loadWalletsFromEnv();
  currentWalletCount = wallets.length;

  if (wallets.length === 0) {
    rl.question(`${COLORS.CYAN}${SYMBOLS.info} No wallets found in .env. Enter a private key manually (or press Enter to exit): ${COLORS.RESET}`, (privateKey) => {
      if (!privateKey) {
        logError(`No private key provided. Exiting.`);
        rl.close();
        process.exit(1);
      }
      try {
        const wallet = new ethers.Wallet(privateKey, provider);
        wallets = [{ privateKey, wallet, label: 'Manual Wallet' }];
        currentWalletCount = 1;
        logSuccess(`Loaded manual wallet: ${wallet.address.substring(0, 6)}...${wallet.address.substring(38)}`);
        proceedWithWallets(wallets);
      } catch (error) {
        logError(`Invalid private key: ${error.message}`);
        rl.close();
        process.exit(1);
      }
    });
  } else {
    logInfo(`Loaded ${wallets.length} wallet(s) from .env:`);
    wallets.forEach((w, i) => {
      logSuccess(`${i+1}. ${w.label} (${w.wallet.address.substring(0, 6)}...${w.wallet.address.substring(38)})`);
    });
    proceedWithWallets(wallets);
  }
}

function proceedWithWallets(wallets) {
  rl.question(`${COLORS.CYAN}${SYMBOLS.info} How many swaps to perform per wallet? ${COLORS.RESET}`, async (answer) => {
    const swapCount = parseInt(answer);
    
    if (isNaN(swapCount) || swapCount <= 0) {
      logError(`Please provide a valid number of swaps`);
      rl.close();
      process.exit(1);
    }
    
    logInfo(`Will perform ${swapCount} swaps for each of ${wallets.length} wallet(s) (total: ${swapCount * wallets.length})`);
    rl.question(`${COLORS.CYAN}${SYMBOLS.info} Proceed? (y/n) ${COLORS.RESET}`, async (confirm) => {
      if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
        await runAllWallets(wallets, swapCount);
        updateDisplay();
      } else {
        logInfo(`Operation canceled`);
      }
      rl.close();
    });
  });
}

if (require.main === module) {
  main().catch(error => {
    logError(`Fatal error: ${error.message}`);
    updateDisplay();
    process.exit(1);
  });
}