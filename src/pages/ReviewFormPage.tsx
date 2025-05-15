import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Check, Send, AlertCircle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import Input from '../components/shared/Input';
import { useReviews } from '../context/ReviewContext';
import { ReviewCategory } from '../types';

const ReviewFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { createReview, isLoading } = useReviews();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ReviewCategory>('legal_opinion');
  const [jurisdiction, setJurisdiction] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [clientReference, setClientReference] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'organization'>('private');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, asDraft = true) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const reviewData = {
        title,
        content,
        category,
        metadata: {
          jurisdiction,
          caseNumber,
          clientReference,
          tags,
        },
        visibility,
        status: asDraft ? 'draft' : 'submitted',
      };
      
      const newReview = await createReview(reviewData);
      
      setSuccessMessage(asDraft 
        ? 'Review saved as draft successfully!' 
        : 'Review submitted successfully!'
      );
      
      // Clear form or navigate after short delay
      setTimeout(() => {
        navigate(`/reviews/${newReview.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating review:', error);
      setErrors({
        form: 'An error occurred while creating the review. Please try again.'
      });
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const categoryOptions: { value: ReviewCategory; label: string }[] = [
    { value: 'expert_testimony', label: 'Expert Testimony' },
    { value: 'case_analysis', label: 'Case Analysis' },
    { value: 'contract_review', label: 'Contract Review' },
    { value: 'legal_opinion', label: 'Legal Opinion' },
    { value: 'compliance_review', label: 'Compliance Review' },
    { value: 'patent_review', label: 'Patent Review' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Review</h1>
          
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
              <Check className="h-5 w-5 mr-2" />
              {successMessage}
            </div>
          )}
          
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              {errors.form}
            </div>
          )}
          
          <Card padding="lg">
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <div className="space-y-6">
                {/* Title */}
                <Input
                  id="title"
                  label="Review Title"
                  placeholder="Enter a clear, descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                  required
                />
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ReviewCategory)}
                    className={`
                      mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-primary-500 focus:ring-primary-500
                      ${errors.category ? 'border-red-500' : ''}
                    `}
                    required
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>
                
                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    rows={8}
                    placeholder="Enter your detailed legal review..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`
                      mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-primary-500 focus:ring-primary-500
                      ${errors.content ? 'border-red-500' : ''}
                    `}
                    required
                  />
                  {errors.content ? (
                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Minimum 50 characters. Current: {content.length} characters
                    </p>
                  )}
                </div>
                
                {/* Additional Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="jurisdiction"
                    label="Jurisdiction"
                    placeholder="e.g., California, Federal"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                  />
                  
                  <Input
                    id="caseNumber"
                    label="Case Number/Reference"
                    placeholder="e.g., CV-2023-1234"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                  />
                  
                  <Input
                    id="clientReference"
                    label="Client Reference"
                    placeholder="Internal reference for your client/matter"
                    value={clientReference}
                    onChange={(e) => setClientReference(e.target.value)}
                  />
                  
                  {/* Tags */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add tags and press Enter"
                        className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                      >
                        Add
                      </button>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary-200 text-primary-500 hover:bg-primary-300 focus:outline-none"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Visibility */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visibility
                    </label>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="visibility-private"
                          name="visibility"
                          type="radio"
                          checked={visibility === 'private'}
                          onChange={() => setVisibility('private')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <label htmlFor="visibility-private" className="ml-3">
                          <span className="block text-sm font-medium text-gray-700">Private</span>
                          <span className="block text-sm text-gray-500">Only visible to you</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="visibility-organization"
                          name="visibility"
                          type="radio"
                          checked={visibility === 'organization'}
                          onChange={() => setVisibility('organization')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <label htmlFor="visibility-organization" className="ml-3">
                          <span className="block text-sm font-medium text-gray-700">Organization</span>
                          <span className="block text-sm text-gray-500">Visible to members of your organization</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="visibility-public"
                          name="visibility"
                          type="radio"
                          checked={visibility === 'public'}
                          onChange={() => setVisibility('public')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <label htmlFor="visibility-public" className="ml-3">
                          <span className="block text-sm font-medium text-gray-700">Public</span>
                          <span className="block text-sm text-gray-500">Visible to all registered users</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<Save className="h-4 w-4" />}
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isLoading}
                  >
                    Save as Draft
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<Send className="h-4 w-4" />}
                    isLoading={isLoading}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReviewFormPage;