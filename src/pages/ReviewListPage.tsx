import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search, Grid, List as ListIcon } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import ReviewCard from '../components/reviews/ReviewCard';
import { useReviews } from '../context/ReviewContext';
import { Review, ReviewCategory, ReviewStatus } from '../types';

const ReviewListPage: React.FC = () => {
  const { reviews, isLoading } = useReviews();
  
  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ReviewCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ReviewStatus[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filtered reviews
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...reviews];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(review => selectedCategories.includes(review.category));
    }
    
    // Apply status filter
    if (selectedStatuses.length > 0) {
      result = result.filter(review => selectedStatuses.includes(review.status));
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        review => 
          review.title.toLowerCase().includes(query) || 
          review.content.toLowerCase().includes(query) ||
          (review.metadata.tags && review.metadata.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredReviews(result);
  }, [reviews, selectedCategories, selectedStatuses, searchQuery]);
  
  // Toggle category selection
  const toggleCategory = (category: ReviewCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Toggle status selection
  const toggleStatus = (status: ReviewStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSearchQuery('');
  };
  
  // Category options with labels
  const categoryOptions: { value: ReviewCategory; label: string }[] = [
    { value: 'expert_testimony', label: 'Expert Testimony' },
    { value: 'case_analysis', label: 'Case Analysis' },
    { value: 'contract_review', label: 'Contract Review' },
    { value: 'legal_opinion', label: 'Legal Opinion' },
    { value: 'compliance_review', label: 'Compliance Review' },
    { value: 'patent_review', label: 'Patent Review' },
    { value: 'other', label: 'Other' },
  ];
  
  // Status options with labels
  const statusOptions: { value: ReviewStatus; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'expired', label: 'Expired' },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews</h1>
            <p className="text-gray-600">Browse and search verified legal reviews</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              variant="primary"
              leftIcon={<Plus className="h-5 w-5" />}
              as={Link}
              to="/reviews/new"
            >
              Create Review
            </Button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="mb-8">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Search input */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              
              {/* Filter dropdown */}
              <div className="relative inline-block text-left">
                <div>
                  <Button
                    variant="outline"
                    leftIcon={<Filter className="h-5 w-5" />}
                    type="button"
                    id="filter-menu"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={() => {
                      const filterMenu = document.getElementById('filter-dropdown');
                      if (filterMenu) {
                        filterMenu.classList.toggle('hidden');
                      }
                    }}
                  >
                    Filter
                    {(selectedCategories.length > 0 || selectedStatuses.length > 0) && (
                      <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {selectedCategories.length + selectedStatuses.length}
                      </span>
                    )}
                  </Button>
                </div>
                
                {/* Dropdown menu */}
                <div
                  id="filter-dropdown"
                  className="hidden origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="filter-menu"
                >
                  {/* Categories */}
                  <div className="py-3 px-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryOptions.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`category-${option.value}`}
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={selectedCategories.includes(option.value)}
                            onChange={() => toggleCategory(option.value)}
                          />
                          <label
                            htmlFor={`category-${option.value}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Statuses */}
                  <div className="py-3 px-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {statusOptions.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`status-${option.value}`}
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={selectedStatuses.includes(option.value)}
                            onChange={() => toggleStatus(option.value)}
                          />
                          <label
                            htmlFor={`status-${option.value}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Clear filters */}
                  <div className="py-2 px-4">
                    <button
                      type="button"
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>
              
              {/* View mode toggle */}
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  type="button"
                  className={`flex items-center justify-center p-2 ${
                    viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-500'
                  }`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center p-2 ${
                    viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-500'
                  }`}
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Active filters display */}
            {(selectedCategories.length > 0 || selectedStatuses.length > 0) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-700">Active filters:</span>
                
                {selectedCategories.map((category) => {
                  const label = categoryOptions.find(opt => opt.value === category)?.label;
                  return (
                    <span
                      key={category}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {label}
                      <button
                        type="button"
                        className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none"
                        onClick={() => toggleCategory(category)}
                      >
                        &times;
                      </button>
                    </span>
                  );
                })}
                
                {selectedStatuses.map((status) => {
                  const label = statusOptions.find(opt => opt.value === status)?.label;
                  return (
                    <span
                      key={status}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {label}
                      <button
                        type="button"
                        className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none"
                        onClick={() => toggleStatus(status)}
                      >
                        &times;
                      </button>
                    </span>
                  );
                })}
                
                <button
                  type="button"
                  className="text-xs font-medium text-primary-600 hover:text-primary-700"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              </div>
            )}
          </Card>
        </div>
        
        {/* Results count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredReviews.length}</span> results
          </p>
        </div>
        
        {/* Review list */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <Button
              variant="primary"
              as={Link}
              to="/reviews/new"
            >
              Create a New Review
            </Button>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} compact />
              ))}
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
};

export default ReviewListPage;