import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  walletName: string | null;
  clearError: () => void;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<BlockchainNetwork>('aptos');
  const [isVerifying, setIsVerifying] = useState(false);
  const [latestTransaction, setLatestTransaction] = useState<AptosTransaction | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const initializeBlockchain = async () => {
      try {
        setError(null);
        console.log('Initializing blockchain context...');
        
        // Check for persisted connection
        const savedConnection = localStorage.getItem('wallet_connected');
        const savedAddress = localStorage.getItem('wallet_address');
        const savedNetwork = localStorage.getItem('blockchain_network') as BlockchainNetwork;
        
        if (savedConnection && savedAddress) {
          setIsConnected(true);
          setWalletAddress(savedAddress);
          setWalletName('Demo Wallet');
        }
        
        if (savedNetwork && (savedNetwork === 'aptos' || savedNetwork === 'stellar')) {
          setNetwork(savedNetwork);
        }
        
        setIsInitialized(true);
        console.log('Blockchain context initialized');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize blockchain';
        setError(errorMessage);
        console.error('Error initializing blockchain:', err);
        setIsInitialized(true);
      }
    };

    initializeBlockchain();
  }, []);

  const connectWallet = async (): Promise<string> => {
    if (!isInitialized) {
      throw new Error('Blockchain not initialized');
    }

    try {
      setError(null);
      console.log('Connecting to demo wallet...');
      
      // Generate demo wallet address
      const demoAddress = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      setIsConnected(true);
      setWalletAddress(demoAddress);
      setWalletName('Demo Wallet');
      
      // Persist connection
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_address', demoAddress);
      
      console.log('Connected to demo wallet:', demoAddress);
      return demoAddress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const disconnectWallet = () => {
    try {
      setError(null);
      setIsConnected(false);
      setWalletAddress(null);
      setWalletName(null);
      
      localStorage.removeItem('wallet_connected');
      localStorage.removeItem('wallet_address');
      
      console.log('Wallet disconnected');
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    }
  };

  const switchNetwork = (newNetwork: BlockchainNetwork) => {
    try {
      setNetwork(newNetwork);
      setError(null);
      localStorage.setItem('blockchain_network', newNetwork);
      
      console.log('Switched to network:', newNetwork);
    } catch (err) {
      console.error('Error switching network:', err);
      setError('Failed to switch network');
    }
  };

  const createRecord = async (content: string, type: 'review' | 'cle'): Promise<string> => {
    if (!isConnected || !walletAddress) {
      throw new Error('Please connect your wallet first');
    }

    try {
      setError(null);
      setIsVerifying(true);
      
      console.log('Creating blockchain record...', { content: content.substring(0, 50), type });
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      const transaction: AptosTransaction = {
        hash: mockTxHash,
        sender: walletAddress,
        timestamp: new Date(),
        status: 'success',
        blockHeight: Math.floor(Math.random() * 1000000) + 100000,
        gasUsed: Math.floor(Math.random() * 1000) + 100,
      };
      
      setLatestTransaction(transaction);
      console.log('Blockchain record created:', mockTxHash);
      
      return mockTxHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create record';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyRecord = async (recordId: string): Promise<boolean> => {
    try {
      setError(null);
      console.log('Verifying record:', recordId);
      
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return recordId.startsWith('0x') && recordId.length === 66;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify record';
      setError(errorMessage);
      return false;
    }
  };

  const getVerificationStatus = async (transactionHash: string): Promise<AptosTransaction> => {
    try {
      setError(null);
      console.log('Getting verification status for:', transactionHash);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTransaction: AptosTransaction = {
        hash: transactionHash,
        sender: walletAddress || '0x1',
        timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
        status: Math.random() > 0.1 ? 'success' : 'failed', // 90% success rate
        blockHeight: Math.floor(Math.random() * 1000000) + 100000,
        gasUsed: Math.floor(Math.random() * 1000) + 100,
      };
      
      setLatestTransaction(mockTransaction);
      return mockTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get verification status';
      setError(errorMessage);
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
        walletName,
        clearError,
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