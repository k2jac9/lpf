import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, ArrowRight } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import VerificationStatus from '../components/verification/VerificationStatus';
import { useBlockchain } from '../context/BlockchainContext';
import { AptosTransaction } from '../types';

const VerificationPage: React.FC = () => {
  const { getVerificationStatus } = useBlockchain();
  
  const [transactionHash, setTransactionHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<AptosTransaction | null>(null);
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionHash.trim()) {
      setError('Please enter a transaction hash');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getVerificationStatus(transactionHash);
      setTransaction(result);
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to retrieve transaction information. Please check the hash and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Verification</h1>
          <p className="text-gray-600 mb-8">
            Verify the authenticity of reviews by checking their blockchain records.
          </p>
          
          {/* Verification Form */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Verify a Transaction</h2>
            
            <form onSubmit={handleVerify}>
              <div className="space-y-4">
                <Input
                  id="transaction-hash"
                  label="Transaction Hash"
                  placeholder="Enter the transaction hash from a verified review"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  leftIcon={<Search className="h-5 w-5" />}
                  error={error || undefined}
                  required
                />
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            </form>
          </Card>
          
          {/* Verification Result */}
          {transaction && (
            <Card className="mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Result</h2>
              
              <VerificationStatus
                status={transaction.status === 'success' ? 'verified' : 'failed'}
                transactionHash={transaction.hash}
                blockHeight={transaction.blockHeight}
                timestamp={transaction.timestamp}
                size="lg"
              />
              
              {transaction.status === 'success' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Transaction Details</h3>
                  
                  <div className="bg-gray-50 rounded-md p-4 font-mono text-sm overflow-x-auto">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 text-gray-500">Hash:</div>
                      <div className="col-span-2 text-gray-900">{transaction.hash}</div>
                      
                      <div className="col-span-1 text-gray-500">Sender:</div>
                      <div className="col-span-2 text-gray-900">{transaction.sender}</div>
                      
                      <div className="col-span-1 text-gray-500">Timestamp:</div>
                      <div className="col-span-2 text-gray-900">{transaction.timestamp.toLocaleString()}</div>
                      
                      <div className="col-span-1 text-gray-500">Block Height:</div>
                      <div className="col-span-2 text-gray-900">{transaction.blockHeight?.toLocaleString()}</div>
                      
                      <div className="col-span-1 text-gray-500">Gas Used:</div>
                      <div className="col-span-2 text-gray-900">{transaction.gasUsed?.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      as="a"
                      href={`https://explorer.aptoslabs.com/txn/${transaction.hash}?network=mainnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      rightIcon={<ExternalLink className="h-4 w-4" />}
                    >
                      View on Aptos Explorer
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
          
          {/* How Verification Works */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">How Verification Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Review Creation</h3>
                <p className="text-gray-600 text-sm">
                  Legal professionals create and finalize their review content in the platform.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Blockchain Registration</h3>
                <p className="text-gray-600 text-sm">
                  The review content is hashed and permanently recorded on the Aptos blockchain.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Verification</h3>
                <p className="text-gray-600 text-sm">
                  Anyone can verify the authenticity of a review by checking its blockchain record.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <Link to="/documentation/verification">
                <Button
                  variant="outline"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Learn More About Verification
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default VerificationPage;