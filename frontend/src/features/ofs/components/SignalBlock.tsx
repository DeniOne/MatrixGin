import React from 'react';
import { SignalBlock as SignalBlockType } from '../types';

interface SignalBlockProps {
  title: string;
  data: SignalBlockType;
  onClick?: () => void;
}

const LEVEL_COLORS = {
  GREEN: 'bg-green-500',
  YELLOW: 'bg-yellow-500',
  RED: 'bg-red-500',
  GRAY: 'bg-gray-400',
};

const LEVEL_LABELS = {
  GREEN: 'Stable',
  YELLOW: 'Attention',
  RED: 'Critical',
  GRAY: 'No Data',
};

export const SignalBlock: React.FC<SignalBlockProps> = ({ title, data, onClick }) => {
  const colorClass = LEVEL_COLORS[data.level] || LEVEL_COLORS.GRAY;

  return (
    <div
      className="p-6 rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-4"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-[#717182] uppercase tracking-wider">{title}</h3>
        {data.delta && (
          <span className={`text-xs font-medium px-2 py-1 rounded ${data.delta === 'IMPROVED' ? 'bg-green-100 text-green-800' :
              data.delta === 'WORSENED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
            }`}>
            {data.delta}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className={`w-4 h-4 rounded-full ${colorClass} animate-pulse-slow`}></div>
        <div className="flex-1">
          <span className={`text-2xl font-medium ${data.level === 'GRAY' ? 'text-[#717182]' : 'text-gray-800'}`}>
            {LEVEL_LABELS[data.level]}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed min-h-[40px]">
        {data.summary}
      </p>
    </div>
  );
};
