import React from 'react';
import { Award } from 'lucide-react';

interface BadgeProps {
    title: string;
    description: string;
    imageUrl?: string;
    earnedAt?: string;
    isLocked?: boolean;
}

export const BadgeCard: React.FC<BadgeProps> = ({
    title,
    description,
    imageUrl,
    earnedAt,
    isLocked = false,
}) => {
    return (
        <div className={`
            relative flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300
            ${isLocked
                ? 'bg-gray-50 border border-gray-200 opacity-75 grayscale'
                : 'bg-white border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200'
            }
        `}>
            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-3
                ${isLocked ? 'bg-gray-200' : 'bg-gradient-to-br from-blue-100 to-purple-100'}
            `}>
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-10 h-10 object-contain" />
                ) : (
                    <Award className={`w-8 h-8 ${isLocked ? 'text-[#717182]' : 'text-blue-600'}`} />
                )}
            </div>

            <h3 className={`font-medium text-sm mb-1 ${isLocked ? 'text-[#717182]' : 'text-gray-900'}`}>
                {title}
            </h3>

            <p className="text-xs text-[#717182] line-clamp-2 mb-2">
                {description}
            </p>

            {earnedAt && !isLocked && (
                <div className="mt-auto pt-2 border-t border-gray-100 w-full">
                    <span className="text-[10px] text-[#717182] uppercase tracking-wider">
                        Получен {new Date(earnedAt).toLocaleDateString('ru-RU')}
                    </span>
                </div>
            )}

            {isLocked && (
                <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
            )}
        </div>
    );
};
