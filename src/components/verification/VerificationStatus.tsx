import React from 'react';
import { Check, Clock, AlertCircle, Shield } from 'lucide-react';
import { VerificationStatus as VerificationStatusType } from '../../types';

interface VerificationStatusProps {
  status: VerificationStatusType;
  transactionHash?: string;
  blockHeight?: number;
  timestamp?: Date;
  size?: 'sm' | 'md' | 'lg';
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  transactionHash,
  blockHeight,
  timestamp,
  size = 'md',
}) => {
  // Size classes for the component
  const sizeClasses = {
    sm: {
      container: 'p-2',
      icon: 'h-4 w-4',
      title: 'text-sm',
      details: 'text-xs',
    },
    md: {
      container: 'p-3',
      icon: 'h-6 w-6',
      title: 'text-base',
      details: 'text-sm',
    },
    lg: {
      container: 'p-4',
      icon: 'h-8 w-8',
      title: 'text-lg',
      details: 'text-base',
    },
  };

  // Status-specific styling and content
  const statusConfig = {
    verified: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500',
      textColor: 'text-green-700',
      icon: <Check className={sizeClasses[size].icon} />,
      title: 'Verified on Blockchain',
      description: 'This review has been successfully verified and recorded on the Aptos blockchain.',
    },
    pending: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-700',
      icon: <Clock className={sizeClasses[size].icon} />,
      title: 'Verification in Progress',
      description: 'This review is currently being verified on the blockchain. Please check back later.',
    },
    failed: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-700',
      icon: <AlertCircle className={sizeClasses[size].icon} />,
      title: 'Verification Failed',
      description: 'There was an issue verifying this review on the blockchain. Please try again or contact support.',
    },
    unverified: {
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-500',
      textColor: 'text-gray-700',
      icon: <Shield className={sizeClasses[size].icon} />,
      title: 'Not Verified',
      description: 'This review has not yet been verified on the blockchain.',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`
      rounded-md border ${config.borderColor} ${config.bgColor} 
      ${sizeClasses[size].container} animate-fade-in
    `}>
      <div className="flex items-center">
        <div className={`mr-3 ${config.iconColor}`}>
          {config.icon}
        </div>
        <div>
          <h4 className={`font-medium ${config.textColor} ${sizeClasses[size].title}`}>
            {config.title}
          </h4>
          <p className={`mt-1 ${sizeClasses[size].details} text-gray-600`}>
            {config.description}
          </p>
          
          {/* Transaction details for verified status */}
          {status === 'verified' && transactionHash && (
            <div className="mt-2 space-y-1">
              <p className={`${sizeClasses[size].details} text-gray-600`}>
                <span className="font-medium">Transaction Hash:</span>{' '}
                <a 
                  href={`https://explorer.aptoslabs.com/txn/${transactionHash}?network=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-primary-600 hover:text-primary-800"
                >
                  {transactionHash.length > 10 
                    ? `${transactionHash.substring(0, 6)}...${transactionHash.substring(transactionHash.length - 4)}`
                    : transactionHash
                  }
                </a>
              </p>
              
              {blockHeight && (
                <p className={`${sizeClasses[size].details} text-gray-600`}>
                  <span className="font-medium">Block Height:</span> {blockHeight.toLocaleString()}
                </p>
              )}
              
              {timestamp && (
                <p className={`${sizeClasses[size].details} text-gray-600`}>
                  <span className="font-medium">Timestamp:</span> {new Date(timestamp).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;