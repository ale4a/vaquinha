import React from 'react';

interface IButtonComponent {
  label: string;
  type: string;
  disabled?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const getButtonStyles = (type: string) => {
  switch (type) {
    case 'primary':
      return 'bg-primary-200 text-black hover:bg-primary-100';
    case 'secondary':
      return 'bg-bg-200 text-white hover:bg-bg-300';
    case 'outline':
      return 'border border-accent-200 text-accent-200 hover:bg-accent-100';
    case 'outline-primary':
      return 'border border-primary-100 text-primary-200 hover:bg-primary-100 hover:text-accent-100';
    case 'danger':
      return 'border border-error-red text-error-red hover:bg-error-red hover:text-white';
    case 'disabled':
      return 'bg-accent-200 text-black cursor-not-allowed cursor-not-allowed';
    case 'info':
      return 'border border-primary-200 text-white hover:bg-primary-200 hover:text-white';
    case 'success':
      return 'bg-success-green text-white hover:bg-[#00a87d]';
    case 'muted':
      return 'border border-accent-200 text-accent-200 ';
    default:
      return 'bg-gray-200 text-black border-gray-400 hover:bg-gray-300';
  }
};

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return 'h-8 text-sm';
    case 'large':
      return 'h-12 text-lg';
    default:
      return 'h-10 text-md';
  }
};

const ButtonComponent = ({
  label,
  type,
  disabled = false,
  size = 'medium',
  onClick,
  className,
}: IButtonComponent) => {
  const buttonStyles = getButtonStyles(type);
  const sizeStyles = getSizeStyles(size);
  return (
    <button
      className={
        `w-full h-10 rounded-lg ${buttonStyles} ${sizeStyles} flex items-center justify-center ${
          disabled ? 'opacity-50' : ''
        } ` + className
      }
      disabled={disabled}
      onClick={onClick}
    >
      <span className="text-base px-3">{label}</span>
    </button>
  );
};

export default ButtonComponent;
