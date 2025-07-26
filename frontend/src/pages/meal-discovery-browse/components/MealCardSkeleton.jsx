import React from 'react';

const MealCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-warm overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-muted" />
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Chef Info Skeleton */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-muted rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-24 mb-1" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
        </div>

        {/* Meal Title Skeleton */}
        <div className="h-5 bg-muted rounded w-3/4 mb-2" />
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex space-x-1 mb-3">
          <div className="h-6 bg-muted rounded-full w-16" />
          <div className="h-6 bg-muted rounded-full w-20" />
          <div className="h-6 bg-muted rounded-full w-14" />
        </div>

        {/* Price and Delivery Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>

        {/* Bottom Section Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-8 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  );
};

export default MealCardSkeleton;