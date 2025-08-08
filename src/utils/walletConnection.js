// Enhanced Wallet Connection with MetaMask Integration
import { ethers } from 'ethers';

export const SUPPORTED_NETWORKS = {
  1: { 
    name: 'Ethereum Mainnet', 
    chainId: 1, 
    rpcUrl: 'https://rpc.ankr.com/eth', 
    explorer: 'https://etherscan.io', 
    currency: 'ETH',
    color: '#627EEA'
  },
  137: { 
    name: 'Polygon Mainnet', 
    chainId: 137, 
    rpcUrl: 'https://polygon-rpc.com', 
    explorer: 'https://polygonscan.com', 
    currency: 'MATIC',
    color: '#8247E5'
  },
  80001: { 
    name: 'Mumbai Testnet', 
    chainId: 80001, 
    rpcUrl: 'https://rpc.ankr.com/polygon_mumbai', 
    explorer: 'https://mumbai.polygonscan.com', 
    currency: 'MATIC',
    color: '#8247E5'
  },
  5: { 
    name: 'Goerli Testnet', 
    chainId: 5, 
    rpcUrl: 'https://rpc.ankr.com/eth_goerli', 
    explorer: 'https://goerli.etherscan.io', 
    currency: 'ETH',
    color: '#627EEA'
  }
};

class WalletConnection {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;
    this.isConnected = false;
    this.listeners = new Set();
    this.connector = null;
    this.pendingTransactions = new Map();
    this.transactionHistory = [];
  }

  async connect(connector = 'metamask') {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      // Create provider and signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.address = accounts[0];
      this.connector = connector;

      // Get current network
      const network = await this.provider.getNetwork();
      this.chainId = network.chainId;

      this.isConnected = true;
      this.notifyListeners();

      // Listen for account changes
      window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));

      return { 
        success: true, 
        address: this.address, 
        chainId: this.chainId,
        network: this.getNetworkInfo(this.chainId)
      };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    this.isConnected = false;
    this.address = null;
    this.chainId = null;
    this.provider = null;
    this.signer = null;
    this.connector = null;
    this.pendingTransactions.clear();
    this.notifyListeners();
  }

  async switchNetwork(chainId) {
    if (!this.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      // Try to switch to the requested network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        const network = SUPPORTED_NETWORKS[chainId];
        if (!network) {
          throw new Error('Unsupported network');
        }

        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: network.name,
              nativeCurrency: {
                name: network.currency,
                symbol: network.currency,
                decimals: 18
              },
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.explorer]
            }],
          });
        } catch (addError) {
          throw new Error('Failed to add network to MetaMask');
        }
      } else {
        throw switchError;
      }
    }
  }

  async sendTransaction(transaction) {
    if (!this.isConnected || !this.signer) {
      throw new Error('Wallet not connected');
    }

    const txHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add to pending transactions
    this.pendingTransactions.set(txHash, {
      hash: txHash,
      status: 'pending',
      timestamp: Date.now(),
      ...transaction
    });

    this.notifyListeners();

    try {
      // Simulate transaction for demo purposes
      // In real implementation, you would use: const tx = await this.signer.sendTransaction(transaction);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update transaction status
      this.pendingTransactions.set(txHash, {
        ...this.pendingTransactions.get(txHash),
        status: 'confirmed',
        confirmedAt: Date.now()
      });

      // Move to transaction history
      const tx = this.pendingTransactions.get(txHash);
      this.transactionHistory.push(tx);
      this.pendingTransactions.delete(txHash);

      this.notifyListeners();
      return tx;
    } catch (error) {
      // Update transaction status to failed
      this.pendingTransactions.set(txHash, {
        ...this.pendingTransactions.get(txHash),
        status: 'failed',
        error: error.message
      });

      this.notifyListeners();
      throw error;
    }
  }

  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // User disconnected their wallet
      this.disconnect();
    } else {
      // User switched accounts
      this.address = accounts[0];
      this.notifyListeners();
    }
  }

  async handleChainChanged(chainId) {
    // Reload the page when chain changes
    window.location.reload();
  }

  getWalletState() {
    return {
      isConnected: this.isConnected,
      address: this.address,
      chainId: this.chainId,
      connector: this.connector,
      network: this.getNetworkInfo(this.chainId),
      pendingTransactions: Array.from(this.pendingTransactions.values()),
      transactionHistory: this.transactionHistory
    };
  }

  getNetworkInfo(chainId) {
    return SUPPORTED_NETWORKS[chainId] || null;
  }

  addListener(callback) { 
    this.listeners.add(callback); 
    return () => this.listeners.delete(callback); 
  }

  notifyListeners() { 
    const state = this.getWalletState(); 
    this.listeners.forEach(cb => cb(state)); 
  }

  formatAddress(address) { 
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`; 
  }

  isNetworkSupported(chainId) { 
    return chainId in SUPPORTED_NETWORKS; 
  }

  getNetworkName(chainId) { 
    return SUPPORTED_NETWORKS[chainId]?.name || 'Unknown Network'; 
  }

  // Get transaction status
  getTransactionStatus(txHash) {
    return this.pendingTransactions.get(txHash) || 
           this.transactionHistory.find(tx => tx.hash === txHash);
  }

  // Get pending transactions count
  getPendingTransactionsCount() {
    return this.pendingTransactions.size;
  }

  // Check if wallet is connected
  async checkConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          this.provider = new ethers.providers.Web3Provider(window.ethereum);
          this.signer = this.provider.getSigner();
          this.address = accounts[0];
          const network = await this.provider.getNetwork();
          this.chainId = network.chainId;
          this.isConnected = true;
          this.notifyListeners();
          return true;
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
    return false;
  }
}

const walletConnection = new WalletConnection();
export default walletConnection; 