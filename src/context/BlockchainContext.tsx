import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
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
  
  // Aptos wallet adapter hooks
  const { 
    connected: aptosConnected, 
    account: aptosAccount, 
    wallet: aptosWallet,
    connect: aptosConnect, 
    disconnect: aptosDisconnect,
  } = useWallet();
  
  // Blockchain clients
  const [aptosClient, setAptosClient] = useState<Aptos | null>(null);
  const [stellarServer, setStellarServer] = useState<StellarSdk.Server | null>(null);
  
  // Stellar wallet state (for demo purposes)
  const [stellarConnected, setStellarConnected] = useState(false);
  const [stellarAddress, setStellarAddress] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const initializeBlockchainClients = async () => {
      try {
        setError(null);
        console.log('Initializing blockchain clients...');
        
        // Initialize Aptos client
        const config = new AptosConfig({ 
          network: Network.TESTNET,
          fullnode: 'https://fullnode.testnet.aptoslabs.com/v1',
        });
        const aptos = new Aptos(config);
        setAptosClient(aptos);
        
        console.log('Aptos client initialized');
        
        // Initialize Stellar server
        const stellar = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        setStellarServer(stellar);
        
        console.log('Stellar client initialized');
        
        setIsInitialized(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize blockchain clients';
        setError(errorMessage);
        console.error('Error initializing blockchain clients:', err);
        setIsInitialized(true); // Still allow app to function
      }
    };

    initializeBlockchainClients();
  }, []);

  useEffect(() => {
    const checkConnection = () => {
      try {
        const savedNetwork = localStorage.getItem('blockchain_network') as BlockchainNetwork;
        if (savedNetwork && (savedNetwork === 'aptos' || savedNetwork === 'stellar')) {
          setNetwork(savedNetwork);
        }
        
        if (savedNetwork === 'stellar') {
          const stellarConnectedLocal = localStorage.getItem('stellar_connected') === 'true';
          const stellarAddressLocal = localStorage.getItem('stellar_address');
          if (stellarConnectedLocal && stellarAddressLocal) {
            setStellarConnected(stellarConnectedLocal);
            setStellarAddress(stellarAddressLocal);
          }
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };
    
    if (isInitialized) {
      checkConnection();
    }
  }, [isInitialized]);

  // Computed values
  const isConnected = network === 'aptos' ? aptosConnected : stellarConnected;
  const walletAddress = network === 'aptos' 
    ? aptosAccount?.address?.toString() || null
    : stellarAddress;
  const walletName = network === 'aptos' ? aptosWallet?.name || null : 'Stellar Wallet';

  const connectWallet = async (): Promise<string> => {
    if (!isInitialized) {
      throw new Error('Blockchain clients not initialized');
    }

    try {
      setError(null);
      
      if (network === 'aptos') {
        if (!aptosConnected) {
          await aptosConnect();
        }
        
        if (!aptosAccount?.address) {
          throw new Error('Failed to get wallet address');
        }
        
        const address = aptosAccount.address.toString();
        console.log('Connected to Aptos wallet:', address);
        return address;
      } else {
        // Stellar demo implementation
        const keypair = StellarSdk.Keypair.random();
        const address = keypair.publicKey();
        
        setStellarConnected(true);
        setStellarAddress(address);
        
        localStorage.setItem('stellar_connected', 'true');
        localStorage.setItem('stellar_address', address);
        
        console.log('Connected to Stellar wallet:', address);
        return address;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const disconnectWallet = () => {
    try {
      setError(null);
      
      if (network === 'aptos') {
        if (aptosConnected) {
          aptosDisconnect();
        }
      } else {
        setStellarConnected(false);
        setStellarAddress(null);
        localStorage.removeItem('stellar_connected');
        localStorage.removeItem('stellar_address');
      }
      
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
      
      if (isConnected) {
        disconnectWallet();
      }
      
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
      
      // Generate mock transaction hash for demo
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
      console.log('Mock transaction created:', mockTxHash);
      
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