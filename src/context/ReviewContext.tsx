import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Review, ReviewCategory, ReviewStatus, VerificationStatus } from '../types';
import { useAuth } from './AuthContext';
import { useBlockchain } from './BlockchainContext';

interface ReviewContextType {
  reviews: Review[];
  userReviews: Review[];
  isLoading: boolean;
  error: Error | null;
  createReview: (review: Partial<Review>) => Promise<Review>;
  updateReview: (id: string, updates: Partial<Review>) => Promise<Review>;
  getReview: (id: string) => Review | undefined;
  deleteReview: (id: string) => Promise<void>;
  verifyReviewOnBlockchain: (id: string) => Promise<Review>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

// Mock data for reviews
const mockReviews: Review[] = [
  {
    id: 'rev_1',
    title: 'Expert Analysis for Smith v. Johnson',
    content: 'This expert testimony provides a comprehensive analysis of the forensic evidence presented in Smith v. Johnson. The methodology employed adheres to industry standards and the conclusions drawn are supported by substantial evidence.',
    category: 'expert_testimony',
    authorId: 'usr_1',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15'),
    status: 'verified',
    transactionHash: '0x8a9b...3c4d',
    verificationStatus: 'verified',
    metadata: {
      jurisdiction: 'California',
      caseNumber: 'CA-2023-1234',
      clientReference: 'SMJ-2023',
      tags: ['forensic', 'expert testimony', 'civil case']
    },
    visibility: 'public',
    blockchain: 'aptos'
  },
  {
    id: 'rev_2',
    title: 'Contractual Analysis for TechCorp Agreement',
    content: 'This review analyzes the SaaS agreement between TechCorp and DataSystems. Several clauses in sections 4.2, 7.1, and 9.3 present potential compliance issues that should be addressed before execution.',
    category: 'contract_review',
    authorId: 'usr_1',
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2023-06-22'),
    status: 'draft',
    verificationStatus: 'unverified',
    metadata: {
      tags: ['contract', 'SaaS', 'compliance']
    },
    visibility: 'private',
    blockchain: 'aptos'
  },
  {
    id: 'rev_3',
    title: 'Legal Opinion on Intellectual Property Rights',
    content: 'Based on the provided documentation and applicable law, it is our opinion that the client has demonstrable ownership rights to the intellectual property in question. The registration meets all statutory requirements under 17 U.S.C. § 410.',
    category: 'legal_opinion',
    authorId: 'usr_1',
    createdAt: new Date('2023-07-10'),
    updatedAt: new Date('2023-07-12'),
    status: 'submitted',
    verificationStatus: 'pending',
    metadata: {
      jurisdiction: 'Federal',
      clientReference: 'IP-2023-071',
      tags: ['intellectual property', 'copyright', 'legal opinion']
    },
    visibility: 'organization',
    blockchain: 'aptos'
  }
];

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();
  const { createRecord, isInitialized } = useBlockchain();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setReviews(mockReviews);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  // Filter reviews that belong to the current user
  const userReviews = user 
    ? reviews.filter(review => review.authorId === user.id)
    : [];

  const getReview = (id: string) => {
    return reviews.find(review => review.id === id);
  };

  const createReview = async (reviewData: Partial<Review>): Promise<Review> => {
    if (!user) throw new Error('User must be logged in to create a review');
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReview: Review = {
        id: 'rev_' + Math.random().toString(36).substr(2, 9),
        title: reviewData.title || 'Untitled Review',
        content: reviewData.content || '',
        category: reviewData.category || 'other',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        verificationStatus: 'unverified',
        metadata: reviewData.metadata || {
          tags: []
        },
        visibility: reviewData.visibility || 'private',
        blockchain: 'aptos',
      };
      
      // Update state
      setReviews(prev => [...prev, newReview]);
      
      return newReview;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (id: string, updates: Partial<Review>): Promise<Review> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find and update the review
      const updatedReviews = reviews.map(review => {
        if (review.id === id) {
          return {
            ...review,
            ...updates,
            updatedAt: new Date()
          };
        }
        return review;
      });
      
      // Update state
      setReviews(updatedReviews);
      
      // Return the updated review
      const updatedReview = updatedReviews.find(r => r.id === id);
      if (!updatedReview) throw new Error('Review not found');
      
      return updatedReview;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove the review
      setReviews(prev => prev.filter(review => review.id !== id));
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyReviewOnBlockchain = async (id: string): Promise<Review> => {
    const review = getReview(id);
    if (!review) throw new Error('Review not found');
    
    if (!isInitialized) {
      throw new Error('Blockchain not initialized. Please wait and try again.');
    }
    
    try {
      // Update status to pending
      await updateReview(id, {
        verificationStatus: 'pending',
        status: 'submitted'
      });
      
      // Call blockchain service
      const transactionHash = await createRecord(review.content, 'review');
      
      // Update with transaction details
      const verifiedReview = await updateReview(id, {
        verificationStatus: 'verified',
        status: 'verified',
        transactionHash: transactionHash
      });
      
      return verifiedReview;
    } catch (err) {
      // Update with failure
      await updateReview(id, {
        verificationStatus: 'failed'
      });
      
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        userReviews,
        isLoading,
        error,
        createReview,
        updateReview,
        getReview,
        deleteReview,
        verifyReviewOnBlockchain,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = (): ReviewContextType => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};