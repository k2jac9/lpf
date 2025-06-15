import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit, Trash2, Download, Share2, CheckCircle, AlertTriangle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import VerificationStatus from '../components/verification/VerificationStatus';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import { useBlockchain } from '../context/BlockchainContext';

const ReviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReview, verifyReviewOnBlockchain, deleteReview, isLoading, error: reviewError } = useReviews();
  const { user } = useAuth();
  const { error: blockchainError } = useBlockchain();
  
  const review = id ? getReview(id) : undefined;
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  if (!review) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Review Not Found</h1>
          <p className="mb-8 text-gray-600">The review you're looking for doesn't exist or has been removed.</p>
          <Link to="/reviews" className="text-primary-500 hover:text-primary-700">
            Back to Reviews
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const isAuthor = user?.id === review.authorId;
  const canVerify = isAuthor && (review.verificationStatus === 'unverified' || review.verificationStatus === 'failed');
  const canEdit = isAuthor && (review.status === 'draft' || review.status === 'rejected');
  const canDelete = isAuthor;
  
  const handleVerify = async () => {
    if (!id) return;
    
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationSuccess(false);
    
    try {
      await verifyReviewOnBlockchain(id);
      setVerificationSuccess(true);
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify review on blockchain. Please try again.';
      setVerificationError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      setIsDeleting(true);
      setDeleteError(null);
      
      try {
        await deleteReview(id);
        navigate('/reviews');
      } catch (error) {
        console.error('Delete error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete review. Please try again.';
        setDeleteError(errorMessage);
        setIsDeleting(false);
      }
    }
  };
  
  const categoryLabels: Record<string, string> = {
    'expert_testimony': 'Expert Testimony',
    'case_analysis': 'Case Analysis',
    'contract_review': 'Contract Review',
    'legal_opinion': 'Legal Opinion',
    'compliance_review': 'Compliance Review',
    'patent_review': 'Patent Review',
    'other': 'Other'
  };
  
  const visibilityLabels: Record<string, string> = {
    'public': 'Public',
    'private': 'Private',
    'organization': 'Organization'
  };

  // Determine which errors to display
  const displayErrors = [
    reviewError,
    blockchainError,
    verificationError,
    deleteError
  ].filter(Boolean);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation and actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <Link to="/reviews" className="text-primary-500 hover:text-primary-700 text-sm">
                &larr; Back to Reviews
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{review.title}</h1>
            </div>
            
            <div className="flex mt-4 md:mt-0 space-x-2">
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit className="h-4 w-4" />}
                  as={Link}
                  to={`/reviews/${id}/edit`}
                >
                  Edit
                </Button>
              )}
              
              {canDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
          
          {/* Error display */}
          {displayErrors.length > 0 && (
            <div className="mb-6 space-y-4">
              {displayErrors.map((error, index) => (
                <ErrorDisplay
                  key={index}
                  error={error!}
                  title="Error"
                  onDismiss={() => {
                    if (error === verificationError) setVerificationError(null);
                    if (error === deleteError) setDeleteError(null);
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Review card */}
          <Card padding="lg" className="mb-8">
            {/* Review metadata header */}
            <div className="flex flex-wrap justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <Badge variant="primary">
                    {categoryLabels[review.category] || 'Other'}
                  </Badge>
                  <Badge variant="gray">
                    {visibilityLabels[review.visibility] || 'Private'}
                  </Badge>
                  <Badge variant="info" size="sm">
                    {review.blockchain.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-500">
                  Created {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                  {review.updatedAt > review.createdAt && 
                    ` · Updated ${format(new Date(review.updatedAt), 'MMMM d, yyyy')}`}
                </p>
                
                {review.metadata.jurisdiction && (
                  <p className="text-sm text-gray-500">
                    Jurisdiction: {review.metadata.jurisdiction}
                  </p>
                )}
                
                {review.metadata.caseNumber && (
                  <p className="text-sm text-gray-500">
                    Case Number: {review.metadata.caseNumber}
                  </p>
                )}
              </div>
              
              <div className="mt-4 lg:mt-0">
                <VerificationStatus 
                  status={review.verificationStatus} 
                  transactionHash={review.transactionHash}
                />
              </div>
            </div>
            
            {/* Review content */}
            <div className="prose max-w-none mb-6">
              <div className="whitespace-pre-wrap">{review.content}</div>
            </div>
            
            {/* Tags */}
            {review.metadata.tags && review.metadata.tags.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {review.metadata.tags.map((tag) => (
                    <Badge key={tag} variant="gray" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Share2 className="h-4 w-4" />}
                >
                  Share
                </Button>
              </div>
              
              {canVerify && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                  onClick={handleVerify}
                  isLoading={isVerifying}
                  disabled={isVerifying}
                >
                  Verify on Blockchain
                </Button>
              )}
            </div>
            
            {/* Success message */}
            {verificationSuccess && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                Review successfully verified on the blockchain.
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReviewDetailPage;