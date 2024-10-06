import { useState } from 'react';

const useSummary = () => {
  const [number, setNumber] = useState(0);
  return {
    number,
    setNumber,
  };
};

export default useSummary;
