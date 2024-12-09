import { Button } from '@nextui-org/react';
import { FaShareAlt } from 'react-icons/fa';

interface ShareButtonProps {
  groupName: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ groupName }) => {
  const handleShare = () => {
    const url = window.location.href; // Get the current URL
    const message = `It’s time to save with Vaquita! Join the ${groupName} group. ${url}`;

    // Check if the browser supports the Web Share API
    if (navigator.share) {
      navigator
        .share({
          title: 'Vaquita Group',
          text: message,
          url,
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing: ', error));
    } else {
      // Fallback for unsupported browsers
      const fallbackUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(fallbackUrl, '_blank');
    }
  };

  return (
    <Button
      size="lg"
      className="flex items-center border bg-transparent border-primary-100 text-primary-200 hover:bg-primary-100 hover:text-accent-100 gap-2"
      onClick={handleShare}
    >
      <FaShareAlt size={20} />
      Share Group
    </Button>
  );
};
