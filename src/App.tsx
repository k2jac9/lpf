import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, we would check for authentication
  // For demo, we'll assume user is authenticated
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
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
  );
};

export default App;