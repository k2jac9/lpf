import React from 'react';
import { Wallet, ChevronDown } from 'lucide-react';
import { useBlockchain } from '../../context/BlockchainContext';
import Button from './Button';
import Badge from './Badge';

interface WalletConnectButtonProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'text';
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  className = '',
  size = 'md',
  variant = 'outline',
}) => {
  const {
    isConnected,
    walletAddress,
    walletName,
    network,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    isInitialized,
    error,
  } = useBlockchain();

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connectWallet();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
  };

  const handleSwitchNetwork = (newNetwork: 'aptos' | 'stellar') => {
    switchNetwork(newNetwork);
    setIsDropdownOpen(false);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isInitialized) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={className}
      >
        Initializing...
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        variant="danger"
        size={size}
        className={className}
        title={error}
      >
        Error
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button
        variant={variant}
        size={size}
        leftIcon={<Wallet className="h-4 w-4" />}
        onClick={handleConnect}
        isLoading={isConnecting}
        className={className}
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`${className} flex items-center space-x-2`}
      >
        <div className="flex items-center space-x-2">
          <Wallet className="h-4 w-4" />
          <span>{walletAddress ? formatAddress(walletAddress) : 'Connected'}</span>
          <Badge variant="success" size="sm">
            {network.toUpperCase()}
          </Badge>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Wallet</span>
              <Badge variant="success" size="sm">Connected</Badge>
            </div>
            <p className="text-xs text-gray-500 mb-1">{walletName}</p>
            <p className="text-xs font-mono text-gray-600">{walletAddress}</p>
          </div>

          <div className="p-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-700 mb-2 px-2">Network</p>
            <div className="space-y-1">
              <button
                onClick={() => handleSwitchNetwork('aptos')}
                className={`w-full text-left px-2 py-1 text-sm rounded ${
                  network === 'aptos'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Aptos {network === 'aptos' && '✓'}
              </button>
              <button
                onClick={() => handleSwitchNetwork('stellar')}
                className={`w-full text-left px-2 py-1 text-sm rounded ${
                  network === 'stellar'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Stellar {network === 'stellar' && '✓'}
              </button>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;