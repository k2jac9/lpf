import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, CheckCircle, Clock, AlertCircle, Plus, ChevronRight, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import ReviewCard from '../components/reviews/ReviewCard';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { reviews, userReviews } = useReviews();
  const { user } = useAuth();
  
  // Calculate review statistics
  const totalReviews = userReviews.length;
  const verifiedReviews = userReviews.filter(r => r.verificationStatus === 'verified').length;
  const pendingReviews = userReviews.filter(r => r.verificationStatus === 'pending').length;
  const draftReviews = userReviews.filter(r => r.status === 'draft').length;
  
  // Get recent reviews
  const recentReviews = [...userReviews].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 3);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">
            Your dashboard provides an overview of your reviews and verification status.
          </p>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Reviews */}
          <Card className="flex items-center">
            <div className="p-4 rounded-full bg-primary-50 mr-4">
              <FileCheck className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">{totalReviews}</p>
            </div>
          </Card>
          
          {/* Verified Reviews */}
          <Card className="flex items-center">
            <div className="p-4 rounded-full bg-green-50 mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Verified</p>
              <p className="text-2xl font-semibold text-gray-900">{verifiedReviews}</p>
            </div>
          </Card>
          
          {/* Pending Reviews */}
          <Card className="flex items-center">
            <div className="p-4 rounded-full bg-yellow-50 mr-4">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingReviews}</p>
            </div>
          </Card>
          
          {/* Draft Reviews */}
          <Card className="flex items-center">
            <div className="p-4 rounded-full bg-gray-50 mr-4">
              <AlertCircle className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Drafts</p>
              <p className="text-2xl font-semibold text-gray-900">{draftReviews}</p>
            </div>
          </Card>
        </div>
        
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Recent Reviews</h2>
                <Link to="/reviews" className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              {recentReviews.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You haven't created any reviews yet.</p>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="h-4 w-4" />}
                    as={Link}
                    to="/reviews/new"
                  >
                    Create Your First Review
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReviews.map(review => (
                    <ReviewCard key={review.id} review={review} compact />
                  ))}
                </div>
              )}
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Verification Stats */}
            <Card>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Verification Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-500">Verified Reviews</span>
                    <span className="text-sm font-medium text-gray-900">{verifiedReviews}/{totalReviews}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${totalReviews ? (verifiedReviews / totalReviews) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-500">Verification Rate</span>
                    <span className="inline-flex items-center text-sm font-medium text-green-600">
                      <ArrowUp className="h-3 w-3 mr-1" /> 12% <span className="text-xs text-gray-500 ml-1">vs last month</span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-10 w-10 text-primary-500 mr-3" />
                    <div className="text-2xl font-semibold text-gray-900">
                      {totalReviews ? Math.round((verifiedReviews / totalReviews) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<Plus className="h-4 w-4" />}
                  as={Link}
                  to="/reviews/new"
                >
                  Create New Review
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  as={Link}
                  to="/reviews?status=draft"
                >
                  Edit Drafts
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  as={Link}
                  to="/verification"
                >
                  Check Verification Status
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;