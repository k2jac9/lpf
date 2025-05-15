import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AptosClient } from 'aptos';
import StellarSdk from '@stellar/stellar-sdk';
import { AptosTransaction, BlockchainNetwork } from '../types';

interface BlockchainContextType {
  isConnected: boolean;
  walletAddress: string | null;
  network: BlockchainNetwork;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (network: BlockchainNetwork) => void;
  createRecord: (content: string, type: 'review' | 'cle') => Promise<string>;
  verifyRecord: (recordId: string) => Promise<boolean>;
  getVerificationStatus: (transactionHash: string) => Promise<AptosTransaction>;
  isVerifying: boolean;
  latestTransaction: AptosTransaction | null;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

// Initialize blockchain clients
const aptosClient = new AptosClient('https://fullnode.mainnet.aptoslabs.com/v1');
const stellarServer = new StellarSdk.Server('https://horizon.stellar.org');

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<BlockchainNetwork>('aptos');
  const [isVerifying, setIsVerifying] = useState(false);
  const [latestTransaction, setLatestTransaction] = useState<AptosTransaction | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = localStorage.getItem('wallet_connected') === 'true';
      const address = localStorage.getItem('wallet_address');
      const savedNetwork = localStorage.getItem('blockchain_network') as BlockchainNetwork;
      
      setIsConnected(connected);
      setWalletAddress(address);
      if (savedNetwork) setNetwork(savedNetwork);
    };
    
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      let address: string;
      
      if (network === 'aptos') {
        // Connect to Aptos wallet using AptosClient
        const account = await aptosClient.getAccount('0x1');
        address = account.address;
      } else {
        // Connect to Stellar wallet
        const keypair = StellarSdk.Keypair.random();
        address = keypair.publicKey();
      }
      
      setWalletAddress(address);
      setIsConnected(true);
      
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_address', address);
      
      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
  };

  const switchNetwork = (newNetwork: BlockchainNetwork) => {
    setNetwork(newNetwork);
    localStorage.setItem('blockchain_network', newNetwork);
  };

  const createRecord = async (content: string, type: 'review' | 'cle'): Promise<string> => {
    if (!isConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      if (network === 'aptos') {
        // Create record on Aptos blockchain using AptosClient
        // For demo, return mock transaction hash
        return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      } else {
        // Create record on Stellar blockchain
        const transaction = new StellarSdk.TransactionBuilder(
          new StellarSdk.Account(walletAddress, '0'),
          {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.PUBLIC,
          }
        )
        .addOperation(StellarSdk.Operation.manageData({
          name: `record_${type}_${Date.now()}`,
          value: content
        }))
        .setTimeout(30)
        .build();
        
        // For demo, return mock transaction hash
        return transaction.hash().toString('hex');
      }
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  };

  const verifyRecord = async (recordId: string): Promise<boolean> => {
    try {
      if (network === 'aptos') {
        // Verify on Aptos using AptosClient
        const transaction = await aptosClient.getTransactionByHash(recordId);
        return transaction.success;
      } else {
        // Verify on Stellar
        const transaction = await stellarServer.transactions().transaction(recordId).call();
        return transaction.successful;
      }
    } catch (error) {
      console.error('Error verifying record:', error);
      return false;
    }
  };

  const getVerificationStatus = async (transactionHash: string): Promise<AptosTransaction> => {
    try {
      if (network === 'aptos') {
        const transaction = await aptosClient.getTransactionByHash(transactionHash);
        return {
          hash: transactionHash,
          sender: transaction.sender,
          timestamp: new Date(transaction.timestamp),
          status: transaction.success ? 'success' : 'failed',
          blockHeight: parseInt(transaction.version),
          gasUsed: parseInt(transaction.gas_used),
        };
      } else {
        const transaction = await stellarServer.transactions().transaction(transactionHash).call();
        return {
          hash: transactionHash,
          sender: transaction.source_account,
          timestamp: new Date(transaction.created_at),
          status: transaction.successful ? 'success' : 'failed',
          blockHeight: parseInt(transaction.ledger),
          gasUsed: parseInt(transaction.fee_charged),
        };
      }
    } catch (error) {
      console.error('Error checking transaction:', error);
      throw error;
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        isConnected,
        walletAddress,
        network,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        createRecord,
        verifyRecord,
        getVerificationStatus,
        isVerifying,
        latestTransaction,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = (): BlockchainContextType => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};