import React, { useState, useEffect, useCallback } from 'react';
import './EnhancedWalletConnection.css';

const EnhancedWalletConnection = () => {
  const [walletState, setWalletState] = useState({
    isConnected: false,
    address: null,
    chainId: null,
    network: null,
    balance: null,
    isConnecting: false,
    isDisconnecting: false,
    error: null
  });

  const [transactionState, setTransactionState] = useState({
    isPending: false,
    hash: null,
    confirmations: 0,
    isConfirmed: false,
    error: null
  });

  // Simulated wallet connection
  const connectWallet = useCallback(async () => {
    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      // Simulate MetaMask connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      const mockChainId = 1; // Ethereum Mainnet
      const mockBalance = (Math.random() * 10).toFixed(4);
      
      setWalletState({
        isConnected: true,
        address: mockAddress,
        chainId: mockChainId,
        network: getNetworkName(mockChainId),
        balance: mockBalance,
        isConnecting: false,
        isDisconnecting: false,
        error: null
      });
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to connect wallet'
      }));
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    setWalletState(prev => ({ ...prev, isDisconnecting: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWalletState({
        isConnected: false,
        address: null,
        chainId: null,
        network: null,
        balance: null,
        isConnecting: false,
        isDisconnecting: false,
        error: null
      });
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        isDisconnecting: false,
        error: 'Failed to disconnect wallet'
      }));
    }
  }, []);

  const switchNetwork = useCallback(async (targetChainId) => {
    if (!walletState.isConnected) return;
    
    setWalletState(prev => ({ ...prev, isConnecting: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setWalletState(prev => ({
        ...prev,
        chainId: targetChainId,
        network: getNetworkName(targetChainId),
        isConnecting: false
      }));
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to switch network'
      }));
    }
  }, [walletState.isConnected]);

  const sendTransaction = useCallback(async () => {
    if (!walletState.isConnected) return;
    
    setTransactionState({
      isPending: true,
      hash: null,
      confirmations: 0,
      isConfirmed: false,
      error: null
    });
    
    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockHash = '0x' + Math.random().toString(16).substr(2, 64);
      
      setTransactionState(prev => ({
        ...prev,
        isPending: false,
        hash: mockHash
      }));
      
      // Simulate confirmations
      let confirmations = 0;
      const confirmationInterval = setInterval(() => {
        confirmations++;
        setTransactionState(prev => ({
          ...prev,
          confirmations
        }));
        
        if (confirmations >= 3) {
          clearInterval(confirmationInterval);
          setTransactionState(prev => ({
            ...prev,
            isConfirmed: true
          }));
        }
      }, 2000);
      
    } catch (error) {
      setTransactionState(prev => ({
        ...prev,
        isPending: false,
        error: 'Transaction failed'
      }));
    }
  }, [walletState.isConnected]);

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 5: return 'Goerli';
      case 137: return 'Polygon';
      case 80001: return 'Polygon Mumbai';
      default: return `Chain ${chainId}`;
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkIcon = (chainId) => {
    switch (chainId) {
      case 1: return 'fab fa-ethereum';
      case 5: return 'fas fa-vial';
      case 137: return 'fas fa-polygon';
      default: return 'fas fa-link';
    }
  };

  return (
    <div className="enhanced-wallet-connection">
      <div className="container">
        {/* Header */}
        <div className="wallet-header">
          <h1 className="wallet-title">
            Blockchain <span className="highlight">Wallet Connection</span>
          </h1>
          <p className="wallet-subtitle">
            Test wallet connection, network switching, and transaction lifecycle with UI state management
          </p>
        </div>

        {/* Wallet Status */}
        <div className="wallet-status-section">
          <h2>Wallet Status</h2>
          <div className="wallet-status-card">
            {walletState.isConnected ? (
              <div className="connected-state">
                <div className="status-indicator connected">
                  <i className="fas fa-check-circle" />
                  Connected
                </div>
                
                <div className="wallet-info">
                  <div className="info-row">
                    <span className="label">Address:</span>
                    <span className="value">{formatAddress(walletState.address)}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Network:</span>
                    <span className="value">
                      <i className={getNetworkIcon(walletState.chainId)} />
                      {walletState.network}
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Balance:</span>
                    <span className="value">{walletState.balance} ETH</span>
                  </div>
                </div>
                
                <div className="wallet-actions">
                  <button
                    className="action-btn secondary"
                    onClick={() => switchNetwork(walletState.chainId === 1 ? 137 : 1)}
                    disabled={walletState.isConnecting}
                  >
                    {walletState.isConnecting ? (
                      <>
                        <div className="spinner" />
                        Switching...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-exchange-alt" />
                        Switch to {walletState.chainId === 1 ? 'Polygon' : 'Ethereum'}
                      </>
                    )}
                  </button>
                  
                  <button
                    className="action-btn danger"
                    onClick={disconnectWallet}
                    disabled={walletState.isDisconnecting}
                  >
                    {walletState.isDisconnecting ? (
                      <>
                        <div className="spinner" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times" />
                        Disconnect
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="disconnected-state">
                <div className="status-indicator disconnected">
                  <i className="fas fa-times-circle" />
                  Not Connected
                </div>
                
                <p className="disconnect-message">
                  Connect your wallet to start interacting with the blockchain
                </p>
                
                <button
                  className="action-btn primary"
                  onClick={connectWallet}
                  disabled={walletState.isConnecting}
                >
                  {walletState.isConnecting ? (
                    <>
                      <div className="spinner" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <i className="fab fa-ethereum" />
                      Connect Wallet
                    </>
                  )}
                </button>
              </div>
            )}
            
            {walletState.error && (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle" />
                {walletState.error}
              </div>
            )}
          </div>
        </div>

        {/* Transaction Section */}
        {walletState.isConnected && (
          <div className="transaction-section">
            <h2>Transaction Testing</h2>
            <div className="transaction-card">
              <div className="transaction-info">
                <h3>Send Test Transaction</h3>
                <p>Test the complete transaction lifecycle with UI feedback</p>
              </div>
              
              <button
                className="action-btn primary"
                onClick={sendTransaction}
                disabled={transactionState.isPending}
              >
                {transactionState.isPending ? (
                  <>
                    <div className="spinner" />
                    Sending Transaction...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" />
                    Send Transaction
                  </>
                )}
              </button>
              
              {transactionState.hash && (
                <div className="transaction-status">
                  <div className="status-step">
                    <i className="fas fa-check-circle completed" />
                    <span>Transaction Sent</span>
                  </div>
                  
                  <div className="transaction-hash">
                    <span className="label">Hash:</span>
                    <span className="hash">{transactionState.hash}</span>
                  </div>
                  
                  {transactionState.confirmations > 0 && (
                    <div className="confirmations">
                      <span className="label">Confirmations:</span>
                      <span className="count">{transactionState.confirmations}/3</span>
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{ width: `${(transactionState.confirmations / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {transactionState.isConfirmed && (
                    <div className="confirmed-message">
                      <i className="fas fa-check-circle" />
                      Transaction Confirmed!
                    </div>
                  )}
                </div>
              )}
              
              {transactionState.error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle" />
                  {transactionState.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Network Detection */}
        <div className="network-detection">
          <h2>Network Detection</h2>
          <div className="networks-grid">
            {[
              { id: 1, name: 'Ethereum', icon: 'fab fa-ethereum', color: '#627eea' },
              { id: 5, name: 'Goerli', icon: 'fas fa-vial', color: '#f7fafc' },
              { id: 137, name: 'Polygon', icon: 'fas fa-polygon', color: '#8247e5' },
              { id: 80001, name: 'Mumbai', icon: 'fas fa-polygon', color: '#8247e5' }
            ].map(network => (
              <div 
                key={network.id}
                className={`network-item ${walletState.chainId === network.id ? 'active' : ''}`}
                onClick={() => switchNetwork(network.id)}
              >
                <div className="network-icon" style={{ color: network.color }}>
                  <i className={network.icon} />
                </div>
                <div className="network-info">
                  <h4>{network.name}</h4>
                  <p>Chain ID: {network.id}</p>
                </div>
                {walletState.chainId === network.id && (
                  <div className="active-indicator">
                    <i className="fas fa-check" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWalletConnection;
