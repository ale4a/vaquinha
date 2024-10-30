import React from 'react';

const Divider = ({ className = '' }: { className?: string }) => {
  return (
    <div className="flex justify-center flex-col flex-1 px-4">
      <div className={'border-b-2 min-w-2 ' + className} />
    </div>
  );
};

export default Divider;
