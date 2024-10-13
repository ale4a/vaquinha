import React from 'react';
import { MdError } from 'react-icons/md';

interface LoadingSpinnerProps {
  size?: number;
  title?: string;
}

const ErrorView: React.FC<LoadingSpinnerProps> = ({
  size = 64,
  title = 'Error, please try again later',
}) => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center flex-1">
      <MdError className="text-primary-200" size={size} />
      <p className="text-xl">{title}</p>
    </div>
  );
};

export default ErrorView;
