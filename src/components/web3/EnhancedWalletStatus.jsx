import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import walletConnection, { SUPPORTED_NETWORKS } from '../../utils/walletConnection';
import './EnhancedWalletStatus.css';

export default function EnhancedWalletStatus() {
  const [walletState, setWalletState] = useState(walletConnection.getWalletState());
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const [error, setError] = useState(null);
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  useEffect(() => {
    // Check for existing connection on mount
    walletConnection.checkConnection();
    
    // Subscribe to wallet state changes
    const unsubscribe = walletConnection.addListener(setWalletState);
    
    return unsubscribe;
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await walletConnection.connect('metamask');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    walletConnection.disconnect();
    setError(null);
  };

  const handleSwitchNetwork = async (chainId) => {
    setIsSwitchingNetwork(true);
    setError(null);
    
    try {
      await walletConnection.switchNetwork(chainId);
      setShowNetworkSelector(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  const handleSendTestTransaction = async () => {
    if (!walletState.isConnected) return;
    
    try {
      const transaction = {
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        value: ethers.utils.parseEther('0.001'),
        gasLimit: 21000
      };
      
      await walletConnection.sendTransaction(transaction);
    } catch (err) {
      setError(err.message);
    }
  };

  const getNetworkColor = (chainId) => {
    return SUPPORTED_NETWORKS[chainId]?.color || '#6b7280';
  };

  const getPendingTransactionsCount = () => {
    return walletState.pendingTransactions.length;
  };

  const getTransactionStatus = (tx) => {
    switch (tx.status) {
      case 'pending':
        return { text: 'Pending', className: 'pending' };
      case 'confirmed':
        return { text: 'Confirmed', className: 'confirmed' };
      case 'failed':
        return { text: 'Failed', className: 'failed' };
      default:
        return { text: 'Unknown', className: 'unknown' };
    }
  };

  if (!walletState.isConnected) {
    return (
      <div className="enhanced-wallet-status">
        <button
          type="button"
          className="wallet-connect-btn"
          onClick={handleConnect}
          disabled={isConnecting}
          title="Connect Wallet"
          aria-label="Connect Wallet"
        >
          {isConnecting ? (
            <>
              <span className="wallet-spinner" role="status" aria-hidden="true" />
              Connecting...
            </>
          ) : (
            <>
              <i className="fas fa-plug" aria-hidden="true" /> 
              <span className="wallet-text">Connect Wallet</span>
            </>
          )}
        </button>
        
        {error && (
          <div className="wallet-error">
            <i className="fas fa-exclamation-triangle" aria-hidden="true" />
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="enhanced-wallet-status">
      {/* Network Status */}
      <div className="network-status">
        <div 
          className="network-indicator"
          style={{ backgroundColor: getNetworkColor(walletState.chainId) }}
          title={walletState.network?.name || 'Unknown Network'}
        >
          <i className="fas fa-circle" aria-hidden="true" />
        </div>
        <span className="network-name">
          {walletState.network?.name || 'Unknown Network'}
        </span>
        <button
          type="button"
          className="network-switch-btn"
          onClick={() => setShowNetworkSelector(!showNetworkSelector)}
          disabled={isSwitchingNetwork}
          title="Switch Network"
          aria-label="Switch Network"
        >
          {isSwitchingNetwork ? (
            <span className="network-spinner" role="status" aria-hidden="true" />
          ) : (
            <i className="fas fa-exchange-alt" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Network Selector */}
      {showNetworkSelector && (
        <div className="network-selector">
          <div className="network-selector-header">
            <h4>Select Network</h4>
            <button
              type="button"
              className="close-btn"
              onClick={() => setShowNetworkSelector(false)}
              aria-label="Close network selector"
            >
              <i className="fas fa-times" aria-hidden="true" />
            </button>
          </div>
          <div className="network-options">
            {Object.values(SUPPORTED_NETWORKS).map((network) => (
              <button
                key={network.chainId}
                type="button"
                className={`network-option ${walletState.chainId === network.chainId ? 'active' : ''}`}
                onClick={() => handleSwitchNetwork(network.chainId)}
                disabled={isSwitchingNetwork}
              >
                <div 
                  className="network-color"
                  style={{ backgroundColor: network.color }}
                />
                <span className="network-name">{network.name}</span>
                {walletState.chainId === network.chainId && (
                  <i className="fas fa-check" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wallet Address */}
      <div className="wallet-address">
        <span className="address-text">
          {walletConnection.formatAddress(walletState.address)}
        </span>
        <button
          type="button"
          className="copy-btn"
          onClick={() => navigator.clipboard.writeText(walletState.address)}
          title="Copy Address"
          aria-label="Copy wallet address"
        >
          <i className="fas fa-copy" aria-hidden="true" />
        </button>
      </div>

      {/* Transaction Status */}
      {getPendingTransactionsCount() > 0 && (
        <div className="transaction-status">
          <div className="pending-indicator">
            <span className="pending-count">{getPendingTransactionsCount()}</span>
            <span className="pending-text">Pending</span>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {walletState.transactionHistory.length > 0 && (
        <div className="transaction-history">
          <h4>Recent Transactions</h4>
          <div className="transaction-list">
            {walletState.transactionHistory.slice(-3).map((tx) => {
              const status = getTransactionStatus(tx);
              return (
                <div key={tx.hash} className={`transaction-item ${status.className}`}>
                  <div className="transaction-info">
                    <span className="transaction-hash">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                    </span>
                    <span className={`transaction-status ${status.className}`}>
                      {status.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Test Transaction Button */}
      <button
        type="button"
        className="test-transaction-btn"
        onClick={handleSendTestTransaction}
        title="Send Test Transaction"
        aria-label="Send test transaction"
      >
        <i className="fas fa-paper-plane" aria-hidden="true" />
        Test Transaction
      </button>

      {/* Disconnect Button */}
      <button
        type="button"
        className="wallet-disconnect-btn"
        onClick={handleDisconnect}
        title="Disconnect"
        aria-label="Disconnect Wallet"
      >
        <i className="fas fa-times" aria-hidden="true" />
      </button>

      {/* Error Display */}
      {error && (
        <div className="wallet-error">
          <i className="fas fa-exclamation-triangle" aria-hidden="true" />
          {error}
        </div>
      )}
    </div>
  );
}
