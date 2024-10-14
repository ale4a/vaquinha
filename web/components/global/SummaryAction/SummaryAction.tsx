import React from 'react';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

type ISummaryAction = {
  title: string;
  content: string | JSX.Element;
  actionLabel: string;
  onAction?: () => void;
  type: string;
};

const SummaryAction: React.FC<ISummaryAction> = ({
  title,
  content,
  actionLabel,
  onAction,
  type,
}) => {
  return (
    <div className="flex justify-between items-center p-4 rounded-lg shadow-lg border-dashed border border-bg-300">
      <div className="w-2/3">
        <span className="text-white text-xl font-semibold flex justify-between items-center">
          {title}
        </span>
        <div className="mt-1 text-white flex justify-between items-center">
          <div>{content}</div>
        </div>
      </div>
      <div className="w-1/3 flex items-end  h-full">
        <ButtonComponent label={actionLabel} type={type} onClick={onAction} />
      </div>
    </div>
  );
};

export default SummaryAction;
