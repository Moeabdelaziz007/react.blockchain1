import React from 'react';
import EnhancedWalletConnection from '../components/web3/EnhancedWalletConnection';
import BackButton from '../components/BackButton';
import './BlockchainDemo.css';

const BlockchainDemo = () => {
  return (
    <div className="blockchain-demo">
      <div className="container">
        <BackButton text="Back to Home" />
      </div>
      <EnhancedWalletConnection />
    </div>
  );
};

export default BlockchainDemo; 