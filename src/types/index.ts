export interface User {
  id: string;
  name: string;
  email: string;
  role: 'attorney' | 'judge' | 'paralegal' | 'notary' | 'admin' | 'cle_provider';
  organization: string;
  licenseNumber?: string;
  avatarUrl?: string;
  walletAddress?: string;
  isVerified: boolean;
  dateJoined: Date;
}

export interface Review {
  id: string;
  title: string;
  content: string;
  category: ReviewCategory;
  authorId: string;
  author?: User;
  createdAt: Date;
  updatedAt: Date;
  status: ReviewStatus;
  transactionHash?: string;
  verificationStatus: VerificationStatus;
  metadata: ReviewMetadata;
  visibility: 'public' | 'private' | 'organization';
  blockchain: BlockchainNetwork;
}

export type BlockchainNetwork = 'aptos' | 'stellar';

export type ReviewCategory = 
  | 'expert_testimony'
  | 'case_analysis'
  | 'contract_review'
  | 'legal_opinion'
  | 'compliance_review'
  | 'patent_review'
  | 'other';

export type ReviewStatus = 
  | 'draft'
  | 'submitted'
  | 'verified'
  | 'rejected'
  | 'expired';

export type VerificationStatus = 
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'failed';

export interface ReviewMetadata {
  jurisdiction?: string;
  caseNumber?: string;
  clientReference?: string;
  tags: string[];
  attachments?: Attachment[];
  relatedReviews?: string[];
  blockchain?: {
    network: BlockchainNetwork;
    contractAddress?: string;
    tokenId?: string;
  };
}

export interface Attachment {
  id: string;
  name: string;
  fileType: string;
  url: string;
  hash: string;
  uploadedAt: Date;
}

export interface AptosTransaction {
  hash: string;
  sender: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'failed';
  blockHeight?: number;
  gasUsed?: number;
  data?: any;
}

export interface CLERecord {
  id: string;
  title: string;
  provider: string;
  hours: number;
  completionDate: Date;
  verificationStatus: VerificationStatus;
  transactionHash?: string;
  blockchain: BlockchainNetwork;
  metadata: {
    category: string;
    jurisdiction: string;
    certificateUrl?: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  link?: string;
}