import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from '@aptos-labs/wallet-adapter-petra-wallet';
import { MartianWallet } from '@aptos-labs/wallet-adapter-martian';
import { PontemWallet } from '@aptos-labs/wallet-adapter-pontem';
import { FewchaWallet } from '@fewcha/aptos-wallet-adapter';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BlockchainProvider } from './context/BlockchainContext';
import { ReviewProvider } from './context/ReviewContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReviewListPage from './pages/ReviewListPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ReviewFormPage from './pages/ReviewFormPage';
import VerificationPage from './pages/VerificationPage';

// Protected route component that uses real authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Configure supported wallets
const wallets = [
  new PetraWallet(),
  new MartianWallet(),
  new PontemWallet(),
  new FewchaWallet(),
];

const App: React.FC = () => {
  return (
    <WalletProvider wallets={wallets} autoConnect={false}>
      <Router>
        <AuthProvider>
          <BlockchainProvider>
            <ReviewProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reviews" 
                  element={
                    <ProtectedRoute>
                      <ReviewListPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reviews/new" 
                  element={
                    <ProtectedRoute>
                      <ReviewFormPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reviews/:id" 
                  element={
                    <ProtectedRoute>
                      <ReviewDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/verification" 
                  element={
                    <ProtectedRoute>
                      <VerificationPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ReviewProvider>
          </BlockchainProvider>
        </AuthProvider>
      </Router>
    </WalletProvider>
  );
};

export default App;