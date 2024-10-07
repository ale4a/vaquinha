// src/components/LoadingSpinner.tsx
import { FaSpinner } from 'react-icons/fa';
import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 64 }) => {
  return (
    <div className="flex justify-center items-center  h-full">
      <FaSpinner className="animate-spin text-primary-200" size={size} />
    </div>
  );
};

export default LoadingSpinner;
