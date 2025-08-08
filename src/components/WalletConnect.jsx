import React, { useState, useEffect } from 'react';
import walletConnection, { SUPPORTED_NETWORKS } from '../utils/walletConnection';
import toast from 'react-hot-toast';
import './WalletConnect.css';

const WalletConnectComponent = () => {
  const [walletState, setWalletState] = useState({
    isConnected: false,
    address: null,
    chainId: null,
    network: null,
    connector: 'metamask',
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [pendingTx, setPendingTx] = useState(null);
  const [connector, setConnector] = useState('metamask');

  useEffect(() => {
    const unsubscribe = walletConnection.addListener((state) => setWalletState(state));
    setWalletState(walletConnection.getWalletState());
    return unsubscribe;
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await walletConnection.connect(connector);
      if (result.success) toast.success(`${connector} connected`);
      else toast.error(result.error || `Failed to connect ${connector}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    walletConnection.disconnect();
    toast.success('Disconnected');
  };

  const handleSwitchNetwork = async (chainId) => {
    setIsSwitching(true);
    const res = await walletConnection.switchNetwork(chainId);
    if (res.success) toast.success(`Switched to ${SUPPORTED_NETWORKS[chainId].name}`);
    else toast.error(res.error || 'Switch failed');
    setIsSwitching(false);
  };

  const handleTestTransaction = async () => {
    const state = walletConnection.getWalletState();
    if (!state.isConnected) return toast.error('Connect a wallet first');
    setPendingTx({ status: 'pending', message: 'Confirm in wallet…' });
    try {
      const { ethers } = require('ethers');
      const tx = { to: state.address, value: ethers.utils.parseEther('0.0001') };
      const sent = await walletConnection.sendTransaction(tx);
      if (!sent.success) throw new Error(sent.error || 'Tx send failed');
      setPendingTx({ status: 'confirming', message: 'Waiting for confirmation…', hash: sent.hash });
      const conf = await walletConnection.waitForTransaction(sent.hash, 1);
      if (!conf.success) throw new Error(conf.error || 'Tx failed');
      setPendingTx({ status: 'confirmed', message: 'Minted!', hash: sent.hash });
      toast.success('Minted!');
    } catch (e) {
      setPendingTx({ status: 'failed', message: e.message });
      toast.error(e.message);
    } finally {
      setTimeout(() => setPendingTx(null), 5000);
    }
  };

  const connectorButtons = (
    <div className="d-flex gap-2 flex-wrap mb-3">
      <button className={`btn btn-md ${connector==='metamask'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setConnector('metamask')}>
        <i className="fas fa-fox me-2"></i> MetaMask
      </button>
      <button className={`btn btn-md ${connector==='walletconnect'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setConnector('walletconnect')}>
        <i className="fas fa-qrcode me-2"></i> WalletConnect
      </button>
      <button className={`btn btn-md ${connector==='coinbase'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setConnector('coinbase')}>
        <i className="fas fa-coins me-2"></i> Coinbase Wallet
      </button>
    </div>
  );

  return (
    <div className="wallet-connect-container">
      <div className="card mb-3" style={{backgroundColor: '#f8f9fa'}}>
        <div className="card-header"><h5 className="mb-0 text-dark"><i className="fas fa-wallet me-2"></i>Wallet Connection</h5></div>
        <div className="card-body text-dark">
          {!walletState.isConnected ? (
            <div className="text-center">
              <p className="text-muted mb-3">Choose a wallet and connect</p>
              {connectorButtons}
              <button className="btn btn-success btn-lg" onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (<><span className="spinner-border spinner-border-sm me-2"/>Connecting…</>) : (<><i className="fas fa-plug me-2"></i>Connect</>)}
              </button>
            </div>
          ) : (
            <div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <small className="text-muted d-block">Connected</small>
                  <div className="fw-bold">{walletConnection.formatAddress(walletState.address)} <span className="badge bg-light text-dark ms-2">{walletState.connector}</span></div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted d-block">Network</small>
                  <div className="fw-bold">{walletState.network ? walletState.network.name : 'Unsupported'}</div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Switch Network</label>
                <div className="d-flex gap-2 flex-wrap">
                  {Object.entries(SUPPORTED_NETWORKS).map(([id, n]) => (
                    <button key={id} className={`btn btn-md ${walletState.chainId===Number(id)?'btn-primary':'btn-outline-primary'}`} onClick={()=>handleSwitchNetwork(Number(id))} disabled={isSwitching}>
                      {n.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="d-flex gap-2 mb-3">
                <button className="btn btn-success btn-md" onClick={handleTestTransaction} disabled={!!(pendingTx && ['pending','confirming'].includes(pendingTx.status))}>
                  <i className="fas fa-rocket me-2"></i>Test Transaction
                </button>
                <button className="btn btn-outline-danger btn-md" onClick={handleDisconnect}><i className="fas fa-times me-2"></i>Disconnect</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {pendingTx && (
        <div className="card" style={{backgroundColor: '#f8f9fa'}}>
          <div className="card-header"><h6 className="mb-0 text-dark"><i className="fas fa-clock me-2"></i>Transaction Status</h6></div>
          <div className="card-body d-flex align-items-center text-dark">
            {pendingTx.status==='pending' && <span className="spinner-border spinner-border-sm me-2"/>}
            {pendingTx.status==='confirming' && <i className="fas fa-sync fa-spin me-2 text-primary"/>}
            {pendingTx.status==='confirmed' && <i className="fas fa-check-circle me-2 text-success"/>}
            {pendingTx.status==='failed' && <i className="fas fa-times-circle me-2 text-danger"/>}
            <span className="fw-bold">{pendingTx.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnectComponent; 