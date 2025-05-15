import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { Review, VerificationStatus } from '../../types';
import Card from '../shared/Card';
import Badge from '../shared/Badge';

interface ReviewCardProps {
  review: Review;
  compact?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, compact = false }) => {
  // Function to render status badge based on verification status
  const renderStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="success" className="flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="error" className="flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="gray" className="flex items-center">
            Unverified
          </Badge>
        );
    }
  };
  
  // Function to render category badge
  const renderCategoryBadge = (category: string) => {
    const categoryLabels: Record<string, string> = {
      'expert_testimony': 'Expert Testimony',
      'case_analysis': 'Case Analysis',
      'contract_review': 'Contract Review',
      'legal_opinion': 'Legal Opinion',
      'compliance_review': 'Compliance Review',
      'patent_review': 'Patent Review',
      'other': 'Other'
    };
    
    return (
      <Badge variant="primary" size="sm">
        {categoryLabels[category] || 'Other'}
      </Badge>
    );
  };

  return (
    <Card 
      hover 
      className={`transition-all duration-300 animate-fade-in ${compact ? '' : 'h-full'}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          {renderCategoryBadge(review.category)}
          {renderStatusBadge(review.verificationStatus)}
        </div>
        
        <Link to={`/reviews/${review.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            {review.title}
          </h3>
        </Link>
        
        {!compact && (
          <p className="text-gray-600 text-sm mb-4 flex-grow">
            {review.content.length > 150 
              ? `${review.content.substring(0, 150)}...` 
              : review.content}
          </p>
        )}
        
        <div className="flex flex-wrap justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {format(new Date(review.createdAt), 'MMM d, yyyy')}
          </div>
          
          {review.metadata.jurisdiction && (
            <div className="text-xs text-gray-500">
              {review.metadata.jurisdiction}
            </div>
          )}
        </div>
        
        {review.transactionHash && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              TX: <span className="font-mono">{`${review.transactionHash.substring(0, 8)}...${review.transactionHash.substring(review.transactionHash.length - 6)}`}</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReviewCard;