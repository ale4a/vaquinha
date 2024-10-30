import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Props } from './InfoCards.types';

export default function InfoCard({ address, growth, savedAmount }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="flex flex-col justify-between rounded-lg min-h-44 p-4 bg-bg-200">
      <div className="flex items-center gap-2">
        {address ? (
          <>
            <span>{address}</span>
            <svg
              width="9"
              height="12"
              viewBox="0 0 9 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25 0.75H1.96875C1.91719 0.75 1.875 0.792187 1.875 0.84375V1.5C1.875 1.55156 1.91719 1.59375 1.96875 1.59375H7.78125V9.65625C7.78125 9.70781 7.82344 9.75 7.875 9.75H8.53125C8.58281 9.75 8.625 9.70781 8.625 9.65625V1.125C8.625 0.917578 8.45742 0.75 8.25 0.75ZM6.75 2.25H0.75C0.542578 2.25 0.375 2.41758 0.375 2.625V8.84414C0.375 8.94375 0.414844 9.03867 0.485156 9.10898L2.51602 11.1398C2.5418 11.1656 2.57109 11.1867 2.60273 11.2043V11.2266H2.65195C2.69297 11.2418 2.73633 11.25 2.78086 11.25H6.75C6.95742 11.25 7.125 11.0824 7.125 10.875V2.625C7.125 2.41758 6.95742 2.25 6.75 2.25ZM2.60156 10.0336L1.59258 9.02344H2.60156V10.0336ZM6.28125 10.4062H3.35156V8.74219C3.35156 8.4832 3.1418 8.27344 2.88281 8.27344H1.21875V3.09375H6.28125V10.4062Z"
                className="fill-primary-200"
              />
            </svg>
          </>
        ) : (
          <>Connect a wallet</>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span>Total saved</span>
          <span onClick={toggleVisibility} className="cursor-pointer">
            {isVisible ? (
              <AiFillEye className="text-primary-200" size={15} />
            ) : (
              <AiFillEyeInvisible className="text-primary-200" size={15} />
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-2xl font-medium">
              {isVisible ? savedAmount : '***'}
            </span>{' '}
            <span className="text-sm">USDT</span>
          </div>
          <div className="text-success-green flex flex-col justify-end">
            <span>{growth}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
