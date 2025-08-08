import React, { useState } from 'react';
import './NavbarWalletStatus.css';

export default function NavbarWalletStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="wallet-status-container">
      {!isConnected ? (
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
              Connecting
            </>
          ) : (
            <>
              <i className="fas fa-plug" aria-hidden="true" /> 
              <span className="wallet-text">Connect</span>
            </>
          )}
        </button>
      ) : (
        <div className="wallet-connected">
          <span className="wallet-status-badge" title="Connected">
            <span className="status-indicator" />
            <span className="status-text">Connected</span>
          </span>
          <button
            type="button"
            className="wallet-disconnect-btn"
            onClick={handleDisconnect}
            title="Disconnect"
            aria-label="Disconnect Wallet"
          >
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
} 