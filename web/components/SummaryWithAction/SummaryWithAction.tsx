import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type ExpandableCardProps = {
  title: string;
  content: string | JSX.Element;
  actionLabel: string;
  onAction: () => void;
};

const SummaryWithAction: React.FC<ExpandableCardProps> = ({
  title,
  content,
  actionLabel,
  onAction,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-4 rounded-lg shadow-lg border-dashed border-2 border-bg-300">
      <span className="text-white text-xl font-semibold flex justify-between items-center">
        {title}
      </span>
      <div className="mt-4 text-white flex justify-between items-center">
        <div>{content}</div>
        <button
          className="bg-primary-200 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default SummaryWithAction;
