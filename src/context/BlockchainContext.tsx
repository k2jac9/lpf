import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AptosClient } from 'aptos';
import * as StellarSdk from '@stellar/stellar-sdk';
import { AptosTransaction, BlockchainNetwork } from '../types';

interface BlockchainContextType {
  isConnected: boolean;
  walletAddress: string | null;
  network: BlockchainNetwork;
  connectWallet: () => Promise<string>;
  disconnectWallet: () => void;
  switchNetwork: (network: BlockchainNetwork) => void;
  createRecord: (content: string, type: 'review' | 'cle') => Promise<string>;
  verifyRecord: (recordId: string) => Promise<boolean>;
  getVerificationStatus: (transactionHash: string) => Promise<AptosTransaction>;
  isVerifying: boolean;
  latestTransaction: AptosTransaction | null;
  isInitialized: boolean;
  error: string | null;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<BlockchainNetwork>('aptos');
  const [isVerifying, setIsVerifying] = useState(false);
  const [latestTransaction, setLatestTransaction] = useState<AptosTransaction | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Blockchain clients
  const [aptosClient, setAptosClient] = useState<AptosClient | null>(null);
  const [stellarServer, setStellarServer] = useState<StellarSdk.Server | null>(null);

  useEffect(() => {
    const initializeBlockchainClients = async () => {
      try {
        setError(null);
        
        // Initialize Aptos client
        const aptosUrl = import.meta.env.VITE_APTOS_NODE_URL || 'https://fullnode.mainnet.aptoslabs.com/v1';
        const aptos = new AptosClient(aptosUrl);
        setAptosClient(aptos);
        
        // Initialize Stellar server
        const stellarUrl = import.meta.env.VITE_STELLAR_HORIZON_URL || 'https://horizon.stellar.org';
        const stellar = new StellarSdk.Server(stellarUrl);
        setStellarServer(stellar);
        
        setIsInitialized(true);
        console.log('Blockchain clients initialized successfully');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize blockchain clients';
        setError(errorMessage);
        console.error('Error initializing blockchain clients:', err);
      }
    };

    initializeBlockchainClients();
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = localStorage.getItem('wallet_connected') === 'true';
        const address = localStorage.getItem('wallet_address');
        const savedNetwork = localStorage.getItem('blockchain_network') as BlockchainNetwork;
        
        setIsConnected(connected);
        setWalletAddress(address);
        if (savedNetwork && (savedNetwork === 'aptos' || savedNetwork === 'stellar')) {
          setNetwork(savedNetwork);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };
    
    if (isInitialized) {
      checkConnection();
    }
  }, [isInitialized]);

  const connectWallet = async (): Promise<string> => {
    if (!isInitialized) {
      throw new Error('Blockchain clients not initialized');
    }

    try {
      setError(null);
      let address: string;
      
      if (network === 'aptos') {
        if (!aptosClient) {
          throw new Error('Aptos client not initialized');
        }
        
        // For demo purposes, generate a mock address
        // In a real implementation, you would integrate with Aptos wallet extensions
        address = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        // Verify the client can communicate with the network
        await aptosClient.getAccount('0x1');
      } else {
        if (!stellarServer) {
          throw new Error('Stellar server not initialized');
        }
        
        // For demo purposes, generate a random keypair
        // In a real implementation, you would integrate with Stellar wallet extensions
        const keypair = StellarSdk.Keypair.random();
        address = keypair.publicKey();
        
        // Test the connection
        await stellarServer.loadAccount('GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7');
      }
      
      setWalletAddress(address);
      setIsConnected(true);
      
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_address', address);
      
      return address;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Error connecting wallet:', err);
      throw new Error(errorMessage);
    }
  };

  const disconnectWallet = () => {
    try {
      setWalletAddress(null);
      setIsConnected(false);
      setError(null);
      
      localStorage.removeItem('wallet_connected');
      localStorage.removeItem('wallet_address');
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
    }
  };

  const switchNetwork = (newNetwork: BlockchainNetwork) => {
    try {
      setNetwork(newNetwork);
      setError(null);
      localStorage.setItem('blockchain_network', newNetwork);
      
      // Disconnect wallet when switching networks
      if (isConnected) {
        disconnectWallet();
      }
    } catch (err) {
      console.error('Error switching network:', err);
    }
  };

  const createRecord = async (content: string, type: 'review' | 'cle'): Promise<string> => {
    if (!isConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    if (!isInitialized) {
      throw new Error('Blockchain clients not initialized');
    }

    try {
      setError(null);
      
      if (network === 'aptos') {
        if (!aptosClient) {
          throw new Error('Aptos client not initialized');
        }
        
        // For demo purposes, return a mock transaction hash
        // In a real implementation, you would create an actual transaction
        const mockTxHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        // Simulate transaction processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return mockTxHash;
      } else {
        if (!stellarServer) {
          throw new Error('Stellar server not initialized');
        }
        
        // For demo purposes, create a mock transaction
        // In a real implementation, you would create and submit an actual transaction
        const mockAccount = new StellarSdk.Account(walletAddress, '0');
        const transaction = new StellarSdk.TransactionBuilder(mockAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.PUBLIC,
        })
        .addOperation(StellarSdk.Operation.manageData({
          name: `record_${type}_${Date.now()}`,
          value: content.substring(0, 64) // Stellar data values are limited to 64 bytes
        }))
        .setTimeout(30)
        .build();
        
        // Simulate transaction processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return transaction.hash().toString('hex');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create record';
      setError(errorMessage);
      console.error('Error creating record:', err);
      throw new Error(errorMessage);
    }
  };

  const verifyRecord = async (recordId: string): Promise<boolean> => {
    if (!isInitialized) {
      throw new Error('Blockchain clients not initialized');
    }

    try {
      setError(null);
      
      if (network === 'aptos') {
        if (!aptosClient) {
          throw new Error('Aptos client not initialized');
        }
        
        // For demo purposes, simulate verification
        // In a real implementation, you would query the actual transaction
        await new Promise(resolve => setTimeout(resolve, 1000));
        return recordId.startsWith('0x') && recordId.length === 66;
      } else {
        if (!stellarServer) {
          throw new Error('Stellar server not initialized');
        }
        
        // For demo purposes, simulate verification
        // In a real implementation, you would query the actual transaction
        await new Promise(resolve => setTimeout(resolve, 1000));
        return recordId.length === 64;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify record';
      setError(errorMessage);
      console.error('Error verifying record:', err);
      return false;
    }
  };

  const getVerificationStatus = async (transactionHash: string): Promise<AptosTransaction> => {
    if (!isInitialized) {
      throw new Error('Blockchain clients not initialized');
    }

    try {
      setError(null);
      
      if (network === 'aptos') {
        if (!aptosClient) {
          throw new Error('Aptos client not initialized');
        }
        
        // For demo purposes, return mock transaction data
        // In a real implementation, you would query the actual transaction
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTransaction: AptosTransaction = {
          hash: transactionHash,
          sender: walletAddress || '0x1',
          timestamp: new Date(),
          status: 'success',
          blockHeight: Math.floor(Math.random() * 1000000) + 100000,
          gasUsed: Math.floor(Math.random() * 1000) + 100,
        };
        
        setLatestTransaction(mockTransaction);
        return mockTransaction;
      } else {
        if (!stellarServer) {
          throw new Error('Stellar server not initialized');
        }
        
        // For demo purposes, return mock transaction data
        // In a real implementation, you would query the actual transaction
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTransaction: AptosTransaction = {
          hash: transactionHash,
          sender: walletAddress || 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7',
          timestamp: new Date(),
          status: 'success',
          blockHeight: Math.floor(Math.random() * 1000000) + 100000,
          gasUsed: Math.floor(Math.random() * 1000) + 100,
        };
        
        setLatestTransaction(mockTransaction);
        return mockTransaction;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get verification status';
      setError(errorMessage);
      console.error('Error checking transaction:', err);
      throw new Error(errorMessage);
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
        isInitialized,
        error,
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