// src/components/LoadingSpinner.tsx
import { FaSpinner } from 'react-icons/fa';
import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  title?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 64,
  title = '',
}) => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center  h-full">
      <FaSpinner className="animate-spin text-primary-200" size={size} />
      <p className="text-xl">{title}</p>
    </div>
  );
};

export default LoadingSpinner;
